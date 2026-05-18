DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS MedicationLogs;
DROP TABLE IF EXISTS Reminders;
DROP TABLE IF EXISTS Prescriptions;
DROP TABLE IF EXISTS Medications;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Doctors (
    doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialization TEXT
);

CREATE TABLE Medications (
    medication_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    form TEXT CHECK(form IN ('Tablet', 'Kapsül', 'Şurup', 'İğne', 'Damla')) DEFAULT 'Tablet',
    start_date DATE,
    end_date DATE,
    stock_quantity INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Prescriptions (
    prescription_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Reminders (
    reminder_id INTEGER PRIMARY KEY AUTOINCREMENT,
    medication_id INTEGER NOT NULL,
    time TEXT NOT NULL,
    frequency TEXT,
    days TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (medication_id) REFERENCES Medications(medication_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MedicationLogs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    reminder_id INTEGER NOT NULL,
    taken_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Alındı', 'Atlandı', 'Gecikti')) DEFAULT 'Alındı',
    note TEXT,
    FOREIGN KEY (reminder_id) REFERENCES Reminders(reminder_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT,
    sent_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Beklemede',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Users (name, email, password, phone)
VALUES
('Arda Uçar', 'arda@gmail.com', '12345', '05555555555'),
('Barış Atala', 'baris@gmail.com', '12345', '05444444444');

INSERT INTO Doctors (name, specialization)
VALUES
('Ahmet Yılmaz', 'Kardiyoloji'),
('Ayşe Demir', 'Dahiliye');

INSERT INTO Medications (user_id, name, dosage, form, start_date, end_date, stock_quantity)
VALUES
(1, 'Parol', '500mg', 'Tablet', '2026-05-12', '2026-05-20', 20),
(2, 'Augmentin', '1000mg', 'Tablet', '2026-05-12', '2026-05-25', 14);

INSERT INTO Reminders (medication_id, time, frequency, days)
VALUES
(1, '08:00:00', 'Günde 2 kez', 'Hafta İçi'),
(2, '21:00:00', 'Günde 1 kez', 'Her Gün');

INSERT INTO MedicationLogs (reminder_id, status, note)
VALUES (1, 'Alındı', 'Zamanında içildi');
