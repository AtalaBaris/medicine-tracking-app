const { expandSchedules } = require("./frequencyTimes");
const { ensureMedicationHasReminder } = require("./ensureReminders");

function insertMedicationReminders(db, medicationId, { schedules, times, time, frequency, days, note }) {
  const defaultDays = days || "Her Gün";

  db.prepare("DELETE FROM Reminders WHERE medication_id = ?").run(medicationId);

  let expanded = [];

  if (Array.isArray(schedules) && schedules.length > 0) {
    expanded = expandSchedules(schedules, frequency, defaultDays);
  } else {
    const reminderTimes =
      Array.isArray(times) && times.length ? times : time ? [time] : [];
    expanded = expandSchedules(
      reminderTimes.map((t) => ({ time: t, days: defaultDays })),
      frequency,
      defaultDays
    );
  }

  const insertReminder = db.prepare(
    `INSERT INTO Reminders (medication_id, time, frequency, days)
     VALUES (?, ?, ?, ?)`
  );

  for (const s of expanded) {
    const freqLabel = s.label
      ? `${frequency || ""}${frequency ? " · " : ""}${s.label}`.trim()
      : frequency || null;
    insertReminder.run(medicationId, s.time, freqLabel || null, s.days || defaultDays);
  }

  if (expanded.length === 0) {
    ensureMedicationHasReminder(db, medicationId, {
      time: "08:00",
      days: defaultDays,
      frequency: frequency || "Günde 1 kez",
    });
  }

  return expanded.length;
}

module.exports = { insertMedicationReminders };
