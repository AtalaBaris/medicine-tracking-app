const { getDb } = require("../config/database");

function mapMedicationRow(row) {
  return {
    id: row.medication_id,
    userId: row.user_id,
    name: row.name,
    dosage: row.dosage,
    form: row.form,
    startDate: row.start_date,
    endDate: row.end_date,
    stockQuantity: row.stock_quantity,
    time: row.time || null,
    frequency: row.frequency || null,
    days: row.days || null,
    reminderId: row.reminder_id || null,
  };
}

function getMedicines(req, res) {
  try {
    const db = getDb();
    const userId = req.query.userId;

    let rows;
    if (userId) {
      rows = db
        .prepare(
          `SELECT m.medication_id, m.user_id, m.name, m.dosage, m.form,
                  m.start_date, m.end_date, m.stock_quantity,
                  r.reminder_id, r.time, r.frequency, r.days
           FROM Medications m
           LEFT JOIN Reminders r ON r.medication_id = m.medication_id
           WHERE m.user_id = ?
           ORDER BY m.medication_id`
        )
        .all(userId);
    } else {
      rows = db
        .prepare(
          `SELECT m.medication_id, m.user_id, m.name, m.dosage, m.form,
                  m.start_date, m.end_date, m.stock_quantity,
                  r.reminder_id, r.time, r.frequency, r.days
           FROM Medications m
           LEFT JOIN Reminders r ON r.medication_id = m.medication_id
           ORDER BY m.medication_id`
        )
        .all();
    }

    res.json(rows.map(mapMedicationRow));
  } catch (error) {
    console.error("getMedicines:", error);
    res.status(500).json({ error: "İlaçlar getirilemedi." });
  }
}

function addMedicine(req, res) {
  try {
    const db = getDb();
    const {
      userId,
      name,
      dosage,
      form = "Tablet",
      startDate,
      endDate,
      stockQuantity = 0,
      time,
      frequency,
      days,
    } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "userId ve name zorunludur." });
    }

    const user = db
      .prepare("SELECT user_id FROM Users WHERE user_id = ?")
      .get(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const insertMed = db.prepare(
      `INSERT INTO Medications (user_id, name, dosage, form, start_date, end_date, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const result = insertMed.run(
      userId,
      name,
      dosage || null,
      form,
      startDate || null,
      endDate || null,
      stockQuantity
    );

    const medicationId = result.lastInsertRowid;

    if (time) {
      db.prepare(
        `INSERT INTO Reminders (medication_id, time, frequency, days)
         VALUES (?, ?, ?, ?)`
      ).run(medicationId, time, frequency || null, days || null);
    }

    const row = db
      .prepare(
        `SELECT m.medication_id, m.user_id, m.name, m.dosage, m.form,
                m.start_date, m.end_date, m.stock_quantity,
                r.reminder_id, r.time, r.frequency, r.days
         FROM Medications m
         LEFT JOIN Reminders r ON r.medication_id = m.medication_id
         WHERE m.medication_id = ?`
      )
      .get(medicationId);

    res.status(201).json(mapMedicationRow(row));
  } catch (error) {
    console.error("addMedicine:", error);
    res.status(500).json({ error: "İlaç eklenemedi." });
  }
}

function deleteMedicine(req, res) {
  try {
    const db = getDb();
    const id = Number(req.params.id);

    const existing = db
      .prepare("SELECT medication_id FROM Medications WHERE medication_id = ?")
      .get(id);

    if (!existing) {
      return res.status(404).json({ error: "İlaç bulunamadı." });
    }

    db.prepare("DELETE FROM Medications WHERE medication_id = ?").run(id);
    res.json({ message: "İlaç silindi.", id });
  } catch (error) {
    console.error("deleteMedicine:", error);
    res.status(500).json({ error: "İlaç silinemedi." });
  }
}

module.exports = { getMedicines, addMedicine, deleteMedicine };
