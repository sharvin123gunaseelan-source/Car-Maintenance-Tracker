-- Create Database
CREATE DATABASE IF NOT EXISTS car_tracker;
USE car_tracker;

-- ==========================
-- USERS TABLE
-- ==========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- VEHICLES TABLE
-- ==========================
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    year INT,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ==========================
-- MAINTENANCE RECORDS
-- ==========================
CREATE TABLE maintenance_records (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    service_date DATE NOT NULL,
    cost DECIMAL(10,2),
    notes TEXT,

    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles(vehicle_id)
    ON DELETE CASCADE
);

-- ==========================
-- SERVICE REMINDERS
-- ==========================
CREATE TABLE service_reminders (
    reminder_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    reminder_date DATE NOT NULL,
    status ENUM('Pending','Completed') DEFAULT 'Pending',

    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles(vehicle_id)
    ON DELETE CASCADE
);

-- ==========================
-- SAMPLE DATA
-- ==========================

INSERT INTO users (name,email,password)
VALUES
('Admin','admin@gmail.com','$2b$10$examplehashedpassword');

INSERT INTO vehicles
(user_id,car_name,plate_number,model,year)
VALUES
(1,'Honda Civic','ABC1234','Civic RS',2022);

INSERT INTO maintenance_records
(vehicle_id,service_type,service_date,cost,notes)
VALUES
(1,'Oil Change','2026-06-25',150.00,'Engine oil replaced');

INSERT INTO service_reminders
(vehicle_id,reminder_date,status)
VALUES
(1,'2026-12-25','Pending');