DROP DATABASE IF EXISTS AkilliIlacTakipSistemi;
CREATE DATABASE AkilliIlacTakipSistemi;
USE AkilliIlacTakipSistemi;

-- 2. Kullanıcılar Tablosu (Giriş Bilgileri)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Uygulama tarafında hash'lenmiş şifre gelmeli
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doktorlar Tablosu
CREATE TABLE Doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100)
);

-- 4. İlaçlar Tablosu (Stok Takibi Dahil)
CREATE TABLE Medications (
    medication_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    form ENUM('Tablet', 'Kapsül', 'Şurup', 'İğne', 'Damla') DEFAULT 'Tablet',
    start_date DATE,
    end_date DATE,
    stock_quantity INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Reçeteler Tablosu
CREATE TABLE Prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Hatırlatıcılar Tablosu (Saatlik Planlama)
CREATE TABLE Reminders (
    reminder_id INT AUTO_INCREMENT PRIMARY KEY,
    medication_id INT NOT NULL,
    time TIME NOT NULL,
    frequency VARCHAR(50), -- Örn: "Günde 2 kez"
    days VARCHAR(100),    -- Örn: "Pazartesi, Salı"
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (medication_id) REFERENCES Medications(medication_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. İlaç Kullanım Logları (İçildi mi?)
CREATE TABLE MedicationLogs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    reminder_id INT NOT NULL,
    taken_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Alındı', 'Atlandı', 'Gecikti') DEFAULT 'Alındı',
    note VARCHAR(255),
    FOREIGN KEY (reminder_id) REFERENCES Reminders(reminder_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. Bildirimler Tablosu
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255),
    sent_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Beklemede',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ========================================================
-- TEST VERİLERİ (Sistemi Denemek İçin)
-- ========================================================

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

-- ========================================================
-- GÖRÜNTÜLEME SORGULARI
-- ========================================================

SELECT * FROM Users;
SELECT * FROM Medications;
SELECT * FROM Reminders;