function countReminders(db, medicationId) {
  return db
    .prepare("SELECT COUNT(*) AS c FROM Reminders WHERE medication_id = ?")
    .get(medicationId).c;
}

function createDefaultReminder(db, medicationId, { time = "08:00", days = "Her Gün", frequency = "Günde 1 kez" } = {}) {
  db.prepare(
    `INSERT INTO Reminders (medication_id, time, frequency, days)
     VALUES (?, ?, ?, ?)`
  ).run(medicationId, time, frequency, days);
}

/** İlaç kaydı var ama Reminders yoksa varsayılan hatırlatıcı oluşturur. */
function ensureMedicationHasReminder(db, medicationId, options) {
  if (countReminders(db, medicationId) === 0) {
    createDefaultReminder(db, medicationId, options);
    return true;
  }
  return false;
}

/** Kullanıcının hatırlatıcısız tüm ilaçları için varsayılan plan ekler. */
function ensureUserMedicationReminders(db, userId) {
  const orphaned = db
    .prepare(
      `SELECT m.medication_id
       FROM Medications m
       LEFT JOIN Reminders r ON r.medication_id = m.medication_id
       WHERE m.user_id = ? AND r.reminder_id IS NULL`
    )
    .all(userId);

  let fixed = 0;
  for (const row of orphaned) {
    if (ensureMedicationHasReminder(db, row.medication_id)) fixed += 1;
  }
  return fixed;
}

module.exports = {
  ensureMedicationHasReminder,
  ensureUserMedicationReminders,
  createDefaultReminder,
};
