-- ====================================================================
-- MediConnect - Cloud-Based Hospital Appointment Management System
-- Phase 1: Complete MySQL Database Schema & Initial Data Seed Script
-- Compatible with MySQL 8.0+ and AWS RDS (MySQL)
-- ====================================================================

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS mediconnect;
USE mediconnect;

-- Drop child tables first if existing to avoid foreign key conflicts
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS medical_documents;
DROP TABLE IF EXISTS appointment_notes;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS doctor_schedules;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS contact_messages;

-- ====================================================================
-- 2. TABLE DEFINITIONS
-- ====================================================================

-- Users Table: Central identity store for Admin, Doctors, and Patients
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    password_hash CHAR(64) NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments Table: Clinical specialty wings
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    icon_name VARCHAR(50) NOT NULL DEFAULT 'Stethoscope',
    head_doctor VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patients Table: Extended demographics linked to users
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Doctors Table: Clinical credentials, department reference, and OPD fee
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    experience INT NOT NULL DEFAULT 0,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    status ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
    rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
    available_days JSON NOT NULL,
    photo_url TEXT NULL,
    about TEXT NULL,
    bio TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Doctor Schedules Table: Daily OPD time windows and available consultation slots
CREATE TABLE doctor_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    slots JSON NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments Table: Outpatient bookings and slot status
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_code VARCHAR(30) NOT NULL UNIQUE,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    schedule_id INT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    FOREIGN KEY (schedule_id) REFERENCES doctor_schedules(schedule_id) ON DELETE SET NULL,
    INDEX idx_doc_date_time (doctor_id, appointment_date, appointment_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointment Notes: Clinical diagnoses, prescriptions, and follow-up dates
CREATE TABLE appointment_notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE,
    doctor_id INT NOT NULL,
    notes TEXT NOT NULL,
    prescription TEXT NOT NULL,
    follow_up_date DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical Documents: S3 object metadata and patient laboratory records
CREATE TABLE medical_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type ENUM('PDF', 'JPG', 'PNG') NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_url TEXT NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications: Patient & Doctor event alerts
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Messages: Inquiries from public portal
CREATE TABLE contact_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- 3. SEED INITIAL DATA
-- ====================================================================

-- Seed Users
INSERT INTO users (user_id, name, email, phone, role, created_at) VALUES
(1, 'Hospital Administrator', 'admin@mediconnect.com', '+91 98470 11223', 'ADMIN', '2026-01-10 08:00:00'),
(2, 'Dr. Anjali Menon', 'dr.anjali@mediconnect.com', '+91 98471 22334', 'DOCTOR', '2026-01-12 09:00:00'),
(3, 'Dr. Rahul Kumar', 'dr.rahul@mediconnect.com', '+91 98472 33445', 'DOCTOR', '2026-01-15 09:30:00'),
(4, 'Dr. Meera Nair', 'dr.meera@mediconnect.com', '+91 98473 44556', 'DOCTOR', '2026-02-01 10:00:00'),
(5, 'Dr. Arjun Thomas', 'dr.arjun@mediconnect.com', '+91 98474 55667', 'DOCTOR', '2026-02-05 11:00:00'),
(6, 'Dr. Priya Joseph', 'dr.priya@mediconnect.com', '+91 98475 66778', 'DOCTOR', '2026-02-10 11:30:00'),
(7, 'Rahul Kumar (Patient)', 'patient.rahul@gmail.com', '+91 94470 98765', 'PATIENT', '2026-02-15 14:20:00'),
(8, 'Anu Joseph', 'anu.joseph@gmail.com', '+91 94471 87654', 'PATIENT', '2026-02-18 16:00:00'),
(9, 'Lakshmi Devi', 'lakshmi.d@gmail.com', '+91 94472 76543', 'PATIENT', '2026-03-01 10:15:00');

-- Seed Departments
INSERT INTO departments (department_id, department_name, description, status, icon_name, head_doctor) VALUES
(1, 'Cardiology', 'Comprehensive heart care, diagnostic cardiology, echocardiography, and vascular health management.', 'ACTIVE', 'HeartPulse', 'Dr. Anjali Menon'),
(2, 'Neurology', 'Expert diagnostic and therapeutic care for brain, spine, stroke, epilepsy, and neurological disorders.', 'ACTIVE', 'Brain', 'Dr. Rahul Kumar'),
(3, 'Orthopedics', 'Specialized bone, joint replacements, trauma care, sports injuries, and spine rehabilitation.', 'ACTIVE', 'Bone', 'Dr. Arjun Thomas'),
(4, 'Dermatology', 'Advanced clinical dermatology, allergy panels, skin infections, and cosmetic medical treatments.', 'ACTIVE', 'Sparkles', 'Dr. Meera Nair'),
(5, 'Ophthalmology', 'Complete eye care, cataract surgery, glaucoma management, retinopathies, and vision screening.', 'ACTIVE', 'Eye', 'Dr. Priya Joseph'),
(6, 'Dentistry', 'Preventive, restorative, oral surgery, dental implants, root canal therapy, and smile design.', 'ACTIVE', 'Smile', 'Dr. Vivek Sharma');

-- Seed Patients
INSERT INTO patients (patient_id, user_id, date_of_birth, gender, address) VALUES
(1, 7, '1996-05-14', 'Male', 'East Fort Road, Thrissur, Kerala 680005'),
(2, 8, '1998-11-20', 'Female', 'Ayyanthole, Thrissur, Kerala 680003'),
(3, 9, '1975-03-08', 'Female', 'Kuriachira, Thrissur, Kerala 680006');

-- Seed Doctors
INSERT INTO doctors (doctor_id, user_id, department_id, specialization, qualification, experience, consultation_fee, status, rating, available_days, photo_url, about, bio) VALUES
(1, 2, 1, 'Senior Interventional Cardiologist', 'MBBS, MD (Medicine), DM (Cardiology)', 12, 600.00, 'ACTIVE', 4.9, '["Monday", "Wednesday", "Friday"]', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', 'Dr. Anjali Menon is a renowned cardiologist in Central Kerala with over 12 years of clinical excellence in coronary angiography, preventative cardiology, and hypertension therapy.', 'Dr. Anjali Menon is a renowned cardiologist in Central Kerala with over 12 years of clinical excellence in coronary angiography, preventative cardiology, and hypertension therapy.'),
(2, 3, 2, 'Neurologist & Stroke Specialist', 'MBBS, MD, DM (Neurology)', 10, 650.00, 'ACTIVE', 4.8, '["Tuesday", "Thursday", "Saturday"]', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', 'Dr. Rahul Kumar heads the stroke intervention and neuro-electrophysiology unit with extensive experience in migraine, Parkinsonism, and epilepsy disorders.', 'Dr. Rahul Kumar heads the stroke intervention and neuro-electrophysiology unit with extensive experience in migraine, Parkinsonism, and epilepsy disorders.'),
(3, 4, 4, 'Consultant Dermatologist', 'MBBS, MD (Dermatology, Venereology & Leprosy)', 8, 500.00, 'ACTIVE', 4.9, '["Monday", "Tuesday", "Thursday", "Friday"]', 'https://images.unsplash.com/photo-1594824813589-3221a3617300?auto=format&fit=crop&q=80&w=400', 'Dr. Meera Nair specializes in clinical dermatology, autoimmune skin ailments, phototherapy, and non-invasive cosmetic dermatology treatments.', 'Dr. Meera Nair specializes in clinical dermatology, autoimmune skin ailments, phototherapy, and non-invasive cosmetic dermatology treatments.'),
(4, 5, 3, 'Joint Replacement & Orthopedic Surgeon', 'MBBS, MS (Orthopedics), Fellowship in Arthroplasty', 14, 700.00, 'ACTIVE', 4.7, '["Monday", "Wednesday", "Saturday"]', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', 'Dr. Arjun Thomas has performed over 1,800 knee and hip arthroplasties, sports medicine reconstructions, and fracture osteosynthesis surgeries.', 'Dr. Arjun Thomas has performed over 1,800 knee and hip arthroplasties, sports medicine reconstructions, and fracture osteosynthesis surgeries.'),
(5, 6, 5, 'Phaco & Refractive Eye Surgeon', 'MBBS, MS (Ophthalmology), FICO (UK)', 9, 450.00, 'ACTIVE', 4.9, '["Tuesday", "Wednesday", "Friday", "Saturday"]', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400', 'Dr. Priya Joseph provides advanced micro-incision cataract surgery, computerized field analysis, diabetic retinopathy screenings, and pediatric vision therapy.', 'Dr. Priya Joseph provides advanced micro-incision cataract surgery, computerized field analysis, diabetic retinopathy screenings, and pediatric vision therapy.');

-- Seed Schedules
INSERT INTO doctor_schedules (schedule_id, doctor_id, date, start_time, end_time, available, slots) VALUES
(1, 1, '2026-09-25', '09:00', '13:00', TRUE, '["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]'),
(2, 1, '2026-09-28', '09:00', '13:00', TRUE, '["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]'),
(3, 2, '2026-09-26', '10:00', '14:00', TRUE, '["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM"]'),
(4, 3, '2026-09-25', '09:30', '13:30', TRUE, '["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM"]'),
(5, 4, '2026-09-25', '09:00', '13:00', TRUE, '["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]');

-- Seed Appointments
INSERT INTO appointments (appointment_id, appointment_code, patient_id, doctor_id, department_id, schedule_id, appointment_date, appointment_time, reason, status, created_at) VALUES
(101, 'APT-10020', 1, 1, 1, 1, '2026-08-22', '10:00 AM', 'Follow-up for hypertension and mild palpitations', 'COMPLETED', '2026-08-18 09:00:00'),
(102, 'APT-10025', 1, 1, 1, 1, '2026-09-25', '10:30 AM', 'Routine cardiac health review and BP monitoring', 'CONFIRMED', '2026-09-19 10:00:00'),
(103, 'APT-10026', 2, 2, 2, 3, '2026-09-26', '11:00 AM', 'Frequent migraines and sensitivity to bright lights', 'PENDING', '2026-09-20 14:00:00'),
(104, 'APT-10027', 3, 4, 3, 5, '2026-09-25', '11:30 AM', 'Right knee joint pain after morning jogging', 'CONFIRMED', '2026-09-20 15:30:00'),
(105, 'APT-10028', 1, 3, 4, 4, '2026-09-22', '02:00 PM', 'Seasonal skin rashes on hands', 'CANCELLED', '2026-09-18 16:00:00');

-- Seed Appointment Notes
INSERT INTO appointment_notes (note_id, appointment_id, doctor_id, notes, prescription, follow_up_date, created_at) VALUES
(1, 101, 1, 'Patient presented with occasional palpitations and exertional fatigue. ECG shows normal sinus rhythm. Advised lifestyle changes and reduction in caffeine.', 'Tab. Metoprolol 25mg OD for 14 days\nTab. Atorvastatin 10mg HS for 30 days\nDaily 30-minute brisk walk and low sodium diet.', '2026-10-15', '2026-08-22 11:15:00');

-- Seed Medical Documents (S3 records)
INSERT INTO medical_documents (document_id, patient_id, appointment_id, file_name, file_type, file_size, s3_key, s3_url, uploaded_at) VALUES
(1, 1, 101, 'Lipid_Profile_Blood_Report_Aug2026.pdf', 'PDF', '1.8 MB', 'patient-documents/patient-1/Lipid_Profile_Blood_Report_Aug2026.pdf', 'https://mediconnect-medical-documents-2026.s3.ap-south-1.amazonaws.com/patient-documents/patient-1/Lipid_Profile_Blood_Report_Aug2026.pdf?AWSAccessKeyId=ASIAVEX&Signature=xyz&Expires=1790000000', '2026-08-20 10:15:00'),
(2, 1, 102, 'Chest_XRay_PA_View.png', 'PNG', '3.2 MB', 'patient-documents/patient-1/Chest_XRay_PA_View.png', 'https://mediconnect-medical-documents-2026.s3.ap-south-1.amazonaws.com/patient-documents/patient-1/Chest_XRay_PA_View.png?AWSAccessKeyId=ASIAVEX&Signature=abc&Expires=1790000000', '2026-09-15 11:45:00'),
(3, 2, 103, 'Brain_MRI_Screening_Summary.pdf', 'PDF', '4.5 MB', 'patient-documents/patient-2/Brain_MRI_Screening_Summary.pdf', 'https://mediconnect-medical-documents-2026.s3.ap-south-1.amazonaws.com/patient-documents/patient-2/Brain_MRI_Screening_Summary.pdf?AWSAccessKeyId=ASIAVEX&Signature=def&Expires=1790000000', '2026-09-18 14:30:00');

-- Seed Notifications
INSERT INTO notifications (notification_id, user_id, message, type, is_read, created_at) VALUES
(1, 7, 'Your appointment APT-10025 with Dr. Anjali Menon on Sep 25, 2026 has been CONFIRMED.', 'APPOINTMENT_CONFIRMED', FALSE, '2026-09-19 10:05:00'),
(2, 7, 'Your laboratory report Lipid_Profile_Blood_Report_Aug2026.pdf has been stored securely in AWS S3.', 'document', TRUE, '2026-08-20 10:20:00'),
(3, 8, 'Appointment APT-10026 submitted and pending clinical review.', 'appointment', FALSE, '2026-09-20 14:02:00'),
(4, 9, 'Your consultation with Dr. Arjun Thomas on Sep 25, 2026 at 11:30 AM is confirmed.', 'APPOINTMENT_CONFIRMED', FALSE, '2026-09-20 15:35:00');

-- Seed Contact Messages
INSERT INTO contact_messages (message_id, name, email, subject, message, created_at) VALUES
(1, 'Suresh K.', 'suresh.k@gmail.com', 'Emergency Cardiac Ambulance Inquiry', 'What is the direct hotline for immediate cardiac ambulance transport in Thrissur?', '2026-09-19 12:30:00'),
(2, 'Deepa Mohan', 'deepa.m@gmail.com', 'Insurance cashless tie-ups', 'Do you offer cashless admission with Star Health and Care Insurance?', '2026-09-20 09:15:00');
