const { getDb } = require("../config/database");

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function normalizeDate(dateStr) {
  if (!dateStr) return todayKey();
  return String(dateStr).slice(0, 10);
}

function createLog(req, res) {
  try {
    const db = getDb();
    const { reminderId, status = "Alındı", note, date } = req.body;

    if (!reminderId) {
      return res.status(400).json({ error: "reminderId zorunludur." });
    }

    const rid = Number(reminderId);
    const logDate = normalizeDate(date);

    const reminder = db
      .prepare(
        `SELECT r.reminder_id, m.medication_id, m.stock_quantity
         FROM Reminders r
         JOIN Medications m ON m.medication_id = r.medication_id
         WHERE r.reminder_id = ?`
      )
      .get(rid);

    if (!reminder) {
      return res.status(404).json({ error: "Hatırlatıcı bulunamadı." });
    }

    const validStatus = ["Alındı", "Atlandı", "Gecikti"];
    const logStatus = validStatus.includes(status) ? status : "Alındı";

    const existing = db
      .prepare(
        `SELECT log_id, status FROM MedicationLogs
         WHERE reminder_id = ? AND date(taken_time) = ?`
      )
      .get(rid, logDate);

    if (existing) {
      return res.json({
        logId: existing.log_id,
        reminderId: rid,
        status: existing.status,
        uiStatus: existing.status === "Alındı" ? "taken" : "skipped",
        alreadyLogged: true,
      });
    }

    const takenTime =
      logDate === todayKey()
        ? new Date().toISOString().replace("T", " ").slice(0, 19)
        : `${logDate} 12:00:00`;

    const result = db
      .prepare(
        `INSERT INTO MedicationLogs (reminder_id, status, note, taken_time)
         VALUES (?, ?, ?, ?)`
      )
      .run(rid, logStatus, note || null, takenTime);

    if (logStatus === "Alındı" && reminder.stock_quantity > 0) {
      db.prepare(
        `UPDATE Medications SET stock_quantity = stock_quantity - 1
         WHERE medication_id = ? AND stock_quantity > 0`
      ).run(reminder.medication_id);
    }

    res.status(201).json({
      logId: result.lastInsertRowid,
      reminderId: rid,
      status: logStatus,
      uiStatus: logStatus === "Alındı" ? "taken" : "skipped",
    });
  } catch (error) {
    console.error("createLog:", error);
    res.status(500).json({ error: "Kayıt oluşturulamadı." });
  }
}

function deleteTodayLog(req, res) {
  try {
    const db = getDb();
    const { reminderId, date } = req.body;

    if (!reminderId) {
      return res.status(400).json({ error: "reminderId zorunludur." });
    }

    const rid = Number(reminderId);
    const logDate = normalizeDate(date);

    const existing = db
      .prepare(
        `SELECT l.log_id, l.status, r.medication_id, m.stock_quantity
         FROM MedicationLogs l
         JOIN Reminders r ON r.reminder_id = l.reminder_id
         JOIN Medications m ON m.medication_id = r.medication_id
         WHERE l.reminder_id = ? AND date(l.taken_time) = ?`
      )
      .get(rid, logDate);

    if (!existing) {
      return res.json({ message: "Kayıt yok.", reminderId: rid });
    }

    db.prepare("DELETE FROM MedicationLogs WHERE log_id = ?").run(existing.log_id);

    if (existing.status === "Alındı" && existing.stock_quantity >= 0) {
      db.prepare(
        `UPDATE Medications SET stock_quantity = stock_quantity + 1 WHERE medication_id = ?`
      ).run(existing.medication_id);
    }

    res.json({ message: "Kayıt silindi.", reminderId: rid });
  } catch (error) {
    console.error("deleteTodayLog:", error);
    res.status(500).json({ error: "Kayıt silinemedi." });
  }
}

module.exports = { createLog, deleteTodayLog };
