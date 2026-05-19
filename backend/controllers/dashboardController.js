const { getDb } = require("../config/database");
const { reminderAppliesOnDate } = require("../utils/reminderDays");
const { ensureUserMedicationReminders } = require("../utils/ensureReminders");

function pad(n) {
  return String(n).padStart(2, "0");
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const DAY_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

function getDashboard(req, res) {
  try {
    const db = getDb();
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId zorunludur." });
    }

    const user = db
      .prepare("SELECT user_id, name, email FROM Users WHERE user_id = ?")
      .get(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const today = dateKey(new Date());
    ensureUserMedicationReminders(db, userId);

    const reminders = db
      .prepare(
        `SELECT r.reminder_id, r.time, r.frequency, r.days,
                m.medication_id, m.name, m.dosage, m.stock_quantity
         FROM Reminders r
         JOIN Medications m ON m.medication_id = r.medication_id
         WHERE m.user_id = ?`
      )
      .all(userId);

    const logToday = db.prepare(
      `SELECT reminder_id, status FROM MedicationLogs WHERE date(taken_time) = ?`
    );
    const todayLogs = logToday.all(today);
    const logMap = Object.fromEntries(
      todayLogs.map((l) => [l.reminder_id, l.status])
    );

    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const todayDate = new Date();
    const todaySchedule = reminders
      .filter((r) => reminderAppliesOnDate(r.days, todayDate))
      .map((r) => {
      const logStatus = logMap[r.reminder_id];
      let status = "later";
      let icon = "nightlight";

      if (logStatus === "Alındı") {
        status = "taken";
        icon = "check_circle";
      } else if (logStatus === "Atlandı" || logStatus === "Gecikti") {
        status = "skipped";
        icon = "cancel";
      } else {
        const [h, m] = String(r.time).split(":").map(Number);
        const slotMins = h * 60 + (m || 0);
        if (slotMins <= nowMins + 30 && slotMins >= nowMins - 60) {
          status = "upcoming";
          icon = "schedule";
        }
      }

      return {
        id: r.reminder_id,
        reminderId: r.reminder_id,
        name: r.name,
        dose: r.dosage || "",
        note: r.frequency || null,
        time: String(r.time).slice(0, 5),
        status,
        icon,
      };
    });

    todaySchedule.sort((a, b) => a.time.localeCompare(b.time));

    const lowStock = db
      .prepare(
        `SELECT medication_id, name, stock_quantity FROM Medications
         WHERE user_id = ? AND stock_quantity > 0 AND stock_quantity <= 3`
      )
      .all(userId);

    const weekBars = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const total = reminders.length;
      let taken = 0;
      if (total > 0) {
        const dayLogs = db
          .prepare(
            `SELECT COUNT(*) as c FROM MedicationLogs
             WHERE date(taken_time) = ? AND status = 'Alındı'
             AND reminder_id IN (SELECT reminder_id FROM Reminders r
               JOIN Medications m ON m.medication_id = r.medication_id WHERE m.user_id = ?)`
          )
          .get(key, userId);
        taken = dayLogs?.c || 0;
      }
      const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
      weekBars.push({
        day: DAY_TR[d.getDay()],
        pct: Math.max(pct, i === 0 && total === 0 ? 0 : pct || 10),
        today: key === today,
        empty: total === 0,
      });
    }

    const totalReminders = reminders.length;
    const takenToday = todaySchedule.filter((s) => s.status === "taken").length;
    const adherence =
      totalReminders > 0 ? Math.round((takenToday / totalReminders) * 100) : 0;

    res.json({
      user: { id: user.user_id, name: user.name, email: user.email },
      todaySchedule,
      adherence,
      weekBars,
      lowStock,
    });
  } catch (error) {
    console.error("getDashboard:", error);
    res.status(500).json({ error: "Dashboard verisi getirilemedi." });
  }
}

module.exports = { getDashboard };
