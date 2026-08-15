-- ============================================================
-- SEHATLINK TELEMEDICINE PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- ============================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'asha', 'doctor', 'pharmacist', 'admin');
CREATE TYPE priority_enum AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- 2. USERS TABLE (LOGIN & AUTH)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    name VARCHAR NOT NULL,
    phone VARCHAR,
    role user_role DEFAULT 'patient',
    language VARCHAR DEFAULT 'en',
    village VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PATIENTS TABLE (PATIENT DETAILS & ABHA HEALTHCARDS)
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    abha_id VARCHAR,
    abha_address VARCHAR,
    age INT,
    gender VARCHAR(10),
    village VARCHAR,
    blood_group VARCHAR(5),
    phone VARCHAR,
    emergency_contact VARCHAR,
    qr_code_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. VITALS RECORDS TABLE (ASHA WORKER INTAKES)
CREATE TABLE IF NOT EXISTS vitals (
    id VARCHAR PRIMARY KEY,
    patient_id VARCHAR REFERENCES patients(id) ON DELETE CASCADE,
    temperature FLOAT,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    pulse_rate INT,
    spo2 INT,
    recorded_by VARCHAR,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CONSULTATIONS TABLE (DOCTOR APPOINTMENTS)
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR PRIMARY KEY,
    patient_id VARCHAR REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    doctor_name VARCHAR,
    priority priority_enum DEFAULT 'LOW',
    status VARCHAR DEFAULT 'scheduled',
    scheduled_time VARCHAR,
    symptoms_summary TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRESCRIPTIONS TABLE (DIGITAL PRESCRIPTIONS)
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR PRIMARY KEY,
    consultation_id VARCHAR REFERENCES consultations(id) ON DELETE SET NULL,
    patient_id VARCHAR REFERENCES patients(id) ON DELETE CASCADE,
    doctor_name VARCHAR NOT NULL,
    doctor_license VARCHAR,
    hospital_name VARCHAR DEFAULT 'Government Civil Hospital, Nabha',
    diagnosis TEXT,
    medications_json TEXT, -- JSON Array of medication items
    qr_code_url VARCHAR,
    digital_signature VARCHAR,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PHARMACY INVENTORY TABLE (JAN AUSHADHI KENDRA STOCK)
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id VARCHAR PRIMARY KEY,
    medicine_name VARCHAR NOT NULL,
    generic_name VARCHAR NOT NULL,
    stock_status VARCHAR DEFAULT 'in_stock',
    quantity INT DEFAULT 0,
    price_in_inr FLOAT DEFAULT 0.0,
    pharmacy_name VARCHAR,
    pharmacy_address VARCHAR,
    distance_km FLOAT DEFAULT 0.0,
    contact_number VARCHAR
);

-- 8. EMERGENCY ALERTS TABLE (108 SOS DISPATCH LOGS)
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id VARCHAR PRIMARY KEY,
    patient_id VARCHAR REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR NOT NULL,
    village VARCHAR,
    lat FLOAT,
    lng FLOAT,
    status VARCHAR DEFAULT 'dispatched',
    ambulance_unit VARCHAR DEFAULT 'Nabha 108 Dispatch Unit #4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Seed Demo Login User (dummy@gmail.com / user12345)
INSERT INTO users (id, email, password_hash, name, phone, role, language, village)
VALUES ('usr_dummy_101', 'dummy@gmail.com', 'user12345_hash', 'Gurpreet Singh', '+91 98765 43210', 'patient', 'ta', 'Alhoran, Nabha')
ON CONFLICT (id) DO NOTHING;

-- Seed Doctor User
INSERT INTO users (id, email, password_hash, name, phone, role, language, village)
VALUES ('usr_doc_201', 'dr.amanpreet@sehatlink.gov.in', 'doc12345_hash', 'Dr. Amanpreet Singh (MD)', '+91 98123 45678', 'doctor', 'en', 'Nabha Sector 1')
ON CONFLICT (id) DO NOTHING;

-- Seed Patient & ABHA Card
INSERT INTO patients (id, user_id, name, abha_id, abha_address, age, gender, village, blood_group, phone, emergency_contact, qr_code_data)
VALUES ('pat_101', 'usr_dummy_101', 'Gurpreet Singh', '91-4820-1928-3741', 'gurpreet.singh@abdm', 60, 'Male', 'Alhoran, Nabha', 'O+', '+91 98765 43210', '+91 98765 00000', 'ABHA:91-4820-1928-3741|NAME:Gurpreet Singh|AGE:60|VILLAGE:Alhoran')
ON CONFLICT (id) DO NOTHING;

-- Seed Doctor Appointment
INSERT INTO consultations (id, patient_id, doctor_id, doctor_name, priority, status, scheduled_time, symptoms_summary)
VALUES ('apt_401', 'pat_101', 'usr_doc_201', 'Dr. Amanpreet Singh', 'HIGH', 'scheduled', 'Today, 11:30 AM', 'Chest discomfort, mild fever (37.8°C), SpO2 88%')
ON CONFLICT (id) DO NOTHING;

-- Seed Digital Prescription
INSERT INTO prescriptions (id, consultation_id, patient_id, doctor_name, doctor_license, hospital_name, diagnosis, medications_json, digital_signature)
VALUES ('rx_501', 'apt_401', 'pat_101', 'Dr. Amanpreet Singh (MD)', 'PMC-2018-84920', 'Government Civil Hospital, Nabha', 'Acute Bronchitis & Mild Hypoxia', '[{"name":"Paracetamol 500mg","dosage":"1 tablet twice daily after food","duration":"5 days"},{"name":"Amoxicillin 500mg","dosage":"1 capsule 3 times daily","duration":"7 days"}]', 'SIG_AMANPREET_VERIFIED_84920')
ON CONFLICT (id) DO NOTHING;
