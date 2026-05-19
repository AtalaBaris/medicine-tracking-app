const { getDb } = require("../config/database");
const { reminderAppliesOnDate } = require("../utils/reminderDays");
const { ensureUserMedicationReminders } = require("../utils/ensureReminders");

function pad(n) {
  return String(n).padStart(2, "0");
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseTime(timeStr) {
  const parts = String(timeStr).split(":");
  return { h: Number(parts[0]) || 0, m: Number(parts[1]) || 0 };
}

function compareTime(timeStr, dateStr) {
  const now = new Date();
  const today = dateKey(now);
  if (dateStr > today) return "later";
  if (dateStr < today) return "past";
  const { h, m } = parseTime(timeStr);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const slotMins = h * 60 + m;
  if (slotMins < nowMins - 30) return "past";
  if (slotMins <= nowMins + 30) return "now";
  return "later";
}

function logStatusToUi(status) {
  if (status === "Alındı") return "taken";
  if (status === "Atlandı") return "skipped";
  if (status === "Gecikti") return "skipped";
  return null;
}

function getSchedule(req, res) {
  try {
    const db = getDb();
    const userId = req.query.userId;
    const from = req.query.from || dateKey(new Date());
    const to = req.query.to || from;

    if (!userId) {
      return res.status(400).json({ error: "userId zorunludur." });
    }

    ensureUserMedicationReminders(db, userId);

    const reminders = db
      .prepare(
        `SELECT r.reminder_id, r.time, r.frequency, r.days,
                m.medication_id, m.name, m.dosage, m.form
         FROM Reminders r
         JOIN Medications m ON m.medication_id = r.medication_id
         WHERE m.user_id = ?
         ORDER BY r.time`
      )
      .all(userId);

    const logStmt = db.prepare(
      `SELECT status FROM MedicationLogs
       WHERE reminder_id = ? AND date(taken_time) = ?`
    );

    const schedule = {};
    const start = new Date(from + "T12:00:00");
    const end = new Date(to + "T12:00:00");

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = dateKey(d);
      schedule[key] = [];

      const today = dateKey(new Date());

      for (const r of reminders) {
        if (!reminderAppliesOnDate(r.days, new Date(d))) continue;

        const log = logStmt.get(r.reminder_id, key);
        let status;

        if (log) {
          status = logStatusToUi(log.status) || "taken";
        } else if (key > today) {
          status = "later";
        } else if (key < today) {
          status = "skipped";
        } else {
          const cmp = compareTime(r.time, key);
          status = cmp === "now" ? "upcoming" : "later";
        }

        schedule[key].push({
          id: r.reminder_id,
          reminderId: r.reminder_id,
          medicationId: r.medication_id,
          med: r.name,
          dose: r.dosage || "",
          time: String(r.time).slice(0, 5),
          icon: "medication",
          status,
          note: r.frequency || r.days || null,
        });
      }
    }

    res.json({ schedule, from, to });
  } catch (error) {
    console.error("getSchedule:", error);
    res.status(500).json({ error: "Program getirilemedi." });
  }
}

module.exports = { getSchedule };
