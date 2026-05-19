const { getDb } = require("../config/database");
const {
  ensureUserMedicationReminders,
  ensureMedicationHasReminder,
} = require("../utils/ensureReminders");
const { insertMedicationReminders } = require("../utils/insertReminders");

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

    if (userId) {
      ensureUserMedicationReminders(db, userId);
    }

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
      stockQuantity = 30,
      time,
      times,
      schedules,
      frequency,
      days,
      note,
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

    try {
      insertMedicationReminders(db, medicationId, {
        schedules,
        times,
        time,
        frequency,
        days: days || "Her Gün",
        note,
      });
    } catch (reminderErr) {
      console.error("insertMedicationReminders failed:", reminderErr);
    }

    // Garanti: ilaç asla hatırlatıcısız kalmasın.
    ensureMedicationHasReminder(db, medicationId, {
      time: "08:00",
      days: days || "Her Gün",
      frequency: frequency || "Günde 1 kez",
    });

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

function updateMedicineStock(req, res) {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const { stockQuantity, addStock } = req.body;

    const med = db
      .prepare("SELECT medication_id, stock_quantity FROM Medications WHERE medication_id = ?")
      .get(id);

    if (!med) {
      return res.status(404).json({ error: "İlaç bulunamadı." });
    }

    let newStock;
    if (addStock) {
      newStock = med.stock_quantity + Number(addStock);
    } else {
      newStock = Number(stockQuantity);
    }

    db.prepare("UPDATE Medications SET stock_quantity = ? WHERE medication_id = ?").run(
      newStock,
      id
    );

    res.json({ id, stockQuantity: newStock });
  } catch (error) {
    console.error("updateMedicineStock:", error);
    res.status(500).json({ error: "Stok güncellenemedi." });
  }
}

function getMedicineDetail(rows, medicationId) {
  const medRows = rows.filter((r) => r.medication_id === medicationId);
  if (!medRows.length) return null;

  const first = medRows[0];
  const schedules = medRows
    .filter((r) => r.reminder_id)
    .map((r) => {
      const freq = r.frequency || "";
      const parts = freq.split(" · ");
      const label = parts.length > 1 ? parts.slice(1).join(" · ") : "";
      const baseFreq = parts[0] || freq;
      return {
        reminderId: r.reminder_id,
        time: String(r.time).slice(0, 5),
        days: r.days || "Her Gün",
        label,
        frequency: baseFreq,
      };
    });

  return {
    id: first.medication_id,
    userId: first.user_id,
    name: first.name,
    dosage: first.dosage,
    form: first.form,
    startDate: first.start_date,
    endDate: first.end_date,
    stockQuantity: first.stock_quantity,
    days: schedules[0]?.days || "Her Gün",
    frequency: frequencyLabelFromSchedules(schedules),
    schedules,
  };
}

function frequencyLabelFromSchedules(schedules) {
  const count = schedules.length;
  if (count >= 3) return "Günde 3 kez";
  if (count === 2) return "Günde 2 kez";
  return schedules[0]?.frequency || "Günde 1 kez";
}

function getMedicine(req, res) {
  try {
    const db = getDb();
    const id = Number(req.params.id);

    const rows = db
      .prepare(
        `SELECT m.medication_id, m.user_id, m.name, m.dosage, m.form,
                m.start_date, m.end_date, m.stock_quantity,
                r.reminder_id, r.time, r.frequency, r.days
         FROM Medications m
         LEFT JOIN Reminders r ON r.medication_id = m.medication_id
         WHERE m.medication_id = ?`
      )
      .all(id);

    const detail = getMedicineDetail(rows, id);
    if (!detail) {
      return res.status(404).json({ error: "İlaç bulunamadı." });
    }

    if (detail.schedules.length === 0) {
      const { ensureMedicationHasReminder } = require("../utils/ensureReminders");
      ensureMedicationHasReminder(db, id);
      const refreshed = db
        .prepare(
          `SELECT m.medication_id, m.user_id, m.name, m.dosage, m.form,
                  m.start_date, m.end_date, m.stock_quantity,
                  r.reminder_id, r.time, r.frequency, r.days
           FROM Medications m
           LEFT JOIN Reminders r ON r.medication_id = m.medication_id
           WHERE m.medication_id = ?`
        )
        .all(id);
      const fixed = getMedicineDetail(refreshed, id);
      return res.json(fixed);
    }

    res.json(detail);
  } catch (error) {
    console.error("getMedicine:", error);
    res.status(500).json({ error: "İlaç getirilemedi." });
  }
}

function updateMedicine(req, res) {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const {
      name,
      dosage,
      form = "Tablet",
      startDate,
      endDate,
      stockQuantity,
      time,
      times,
      schedules,
      frequency,
      days,
      note,
    } = req.body;

    const existing = db
      .prepare("SELECT medication_id FROM Medications WHERE medication_id = ?")
      .get(id);

    if (!existing) {
      return res.status(404).json({ error: "İlaç bulunamadı." });
    }

    if (!name) {
      return res.status(400).json({ error: "İlaç adı zorunludur." });
    }

    db.prepare(
      `UPDATE Medications
       SET name = ?, dosage = ?, form = ?, start_date = ?, end_date = ?, stock_quantity = ?
       WHERE medication_id = ?`
    ).run(
      name,
      dosage || null,
      form,
      startDate || null,
      endDate || null,
      stockQuantity ?? 30,
      id
    );

    try {
      insertMedicationReminders(db, id, {
        schedules,
        times,
        time,
        frequency,
        days: days || "Her Gün",
        note,
      });
    } catch (reminderErr) {
      console.error("insertMedicationReminders (update) failed:", reminderErr);
    }

    ensureMedicationHasReminder(db, id, {
      time: "08:00",
      days: days || "Her Gün",
      frequency: frequency || "Günde 1 kez",
    });

    const rows = db
      .prepare(
        `SELECT m.medication_id, m.user_id, m.name, m.dosage, m.form,
                m.start_date, m.end_date, m.stock_quantity,
                r.reminder_id, r.time, r.frequency, r.days
         FROM Medications m
         LEFT JOIN Reminders r ON r.medication_id = m.medication_id
         WHERE m.medication_id = ?`
      )
      .all(id);

    const detail = getMedicineDetail(rows, id);
    res.json(detail);
  } catch (error) {
    console.error("updateMedicine:", error);
    res.status(500).json({ error: "İlaç güncellenemedi." });
  }
}

module.exports = {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStock,
};
