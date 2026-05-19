const { getDb } = require("../config/database");

const DAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getReports(req, res) {
  try {
    const db = getDb();
    const userId = req.query.userId;
    const days = Number(req.query.days) || 30;

    if (!userId) {
      return res.status(400).json({ error: "userId zorunludur." });
    }

    const reminders = db
      .prepare(
        `SELECT r.reminder_id, r.frequency, m.medication_id, m.name, m.dosage
         FROM Reminders r
         JOIN Medications m ON m.medication_id = r.medication_id
         WHERE m.user_id = ?`
      )
      .all(userId);

    const totalSlots = reminders.length * days;
    let takenCount = 0;

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceKey = dateKey(since);

    const logs = db
      .prepare(
        `SELECT l.status, l.reminder_id
         FROM MedicationLogs l
         JOIN Reminders r ON r.reminder_id = l.reminder_id
         JOIN Medications m ON m.medication_id = r.medication_id
         WHERE m.user_id = ? AND date(l.taken_time) >= ?`
      )
      .all(userId, sinceKey);

    takenCount = logs.filter((l) => l.status === "Alındı").length;
    const missedCount = logs.filter(
      (l) => l.status === "Atlandı" || l.status === "Gecikti"
    ).length;

    const overallPct =
      totalSlots > 0
        ? Math.min(100, Math.round((takenCount / totalSlots) * 100))
        : logs.length > 0
        ? Math.round((takenCount / logs.length) * 100)
        : 0;

    const weeklyBars = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const total = reminders.length;
      const dayTaken = db
        .prepare(
          `SELECT COUNT(*) as c FROM MedicationLogs
           WHERE date(taken_time) = ? AND status = 'Alındı'
           AND reminder_id IN (
             SELECT r.reminder_id FROM Reminders r
             JOIN Medications m ON m.medication_id = r.medication_id
             WHERE m.user_id = ?)`
        )
        .get(key, userId);
      const pct = total > 0 ? Math.round(((dayTaken?.c || 0) / total) * 100) : 0;
      weeklyBars.push({
        day: DAY_EN[d.getDay()],
        pct,
        low: pct < 50 && pct > 0,
      });
    }

    const medDetails = reminders.map((r) => {
      const medLogs = logs.filter((l) => l.reminder_id === r.reminder_id);
      const taken = medLogs.filter((l) => l.status === "Alındı").length;
      const pct =
        medLogs.length > 0
          ? Math.round((taken / medLogs.length) * 100)
          : overallPct;
      return {
        name: r.name,
        icon: "medication",
        dose: r.dosage || "",
        freq: r.frequency || "Günlük",
        pct,
        error: pct < 70,
      };
    });

    const uniqueMeds = [];
    const seen = new Set();
    for (const m of medDetails) {
      if (!seen.has(m.name)) {
        seen.add(m.name);
        uniqueMeds.push(m);
      }
    }

    res.json({
      overallPct,
      taken: takenCount,
      missed: missedCount,
      weeklyBars,
      medications: uniqueMeds.length ? uniqueMeds : medDetails,
    });
  } catch (error) {
    console.error("getReports:", error);
    res.status(500).json({ error: "Raporlar getirilemedi." });
  }
}

module.exports = { getReports };
