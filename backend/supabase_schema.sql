-- ============================================================
-- SEHATLINK TELEMEDICINE PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- ============================================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'asha', 'doctor', 'pharmacist', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('HIGH', 'MEDIUM', 'LOW');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. HEALTHCARE FACILITIES (PUBLIC DIRECTORY)
CREATE TABLE IF NOT EXISTS healthcare_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hospital', 'clinic', 'pharmacy', 'laboratory', 'emergency')),
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    address TEXT NOT NULL,
    phone TEXT,
    operating_hours TEXT,
    description TEXT,
    website TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS healthcare_facilities_category_idx
    ON healthcare_facilities (category);

CREATE INDEX IF NOT EXISTS healthcare_facilities_coordinates_idx
    ON healthcare_facilities (latitude, longitude);

ALTER TABLE healthcare_facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Healthcare facilities are publicly readable" ON healthcare_facilities;
CREATE POLICY "Healthcare facilities are publicly readable"
    ON healthcare_facilities FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. PROFILES TABLE
-- The application currently uses Clerk for authentication. id stores the
-- external Clerk subject; auth_user_id supports a future Supabase Auth link.
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_auth_user_id_idx ON profiles (auth_user_id);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile and chat writes are made by the backend using the server-only secret key.
-- No public policies are granted because Clerk tokens are not Supabase JWTs.

-- 3. CHAT CONVERSATIONS
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New conversation',
    preferred_language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_conversations_user_updated_idx
    ON chat_conversations (user_id, updated_at DESC);
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- 4. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_conversation_created_idx
    ON chat_messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS chat_messages_user_created_idx
    ON chat_messages (user_id, created_at DESC);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION update_chat_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS chat_messages_update_conversation_timestamp ON chat_messages;
CREATE TRIGGER chat_messages_update_conversation_timestamp
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_chat_conversation_timestamp();

CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profile_timestamp();

-- 5. USERS TABLE (LOGIN & AUTH LEGACY DOMAIN DATA)
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

-- 6. PATIENTS TABLE (PATIENT DETAILS & ABHA HEALTHCARDS)
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

-- 7. VITALS RECORDS TABLE (ASHA WORKER INTAKES)
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

-- 8. CONSULTATIONS TABLE (DOCTOR APPOINTMENTS)
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

-- 9. PRESCRIPTIONS TABLE (DIGITAL PRESCRIPTIONS)
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR PRIMARY KEY,
    consultation_id VARCHAR REFERENCES consultations(id) ON DELETE SET NULL,
    patient_id VARCHAR REFERENCES patients(id) ON DELETE CASCADE,
    doctor_name VARCHAR NOT NULL,
    doctor_license VARCHAR,
    hospital_name VARCHAR DEFAULT 'Government Civil Hospital',
    diagnosis TEXT,
    medications_json TEXT, -- JSON Array of medication items
    qr_code_url VARCHAR,
    digital_signature VARCHAR,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. PHARMACY INVENTORY TABLE (JAN AUSHADHI KENDRA STOCK)
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

-- 11. EMERGENCY ALERTS TABLE (108 SOS DISPATCH LOGS)
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id VARCHAR PRIMARY KEY,
    patient_id VARCHAR REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR NOT NULL,
    village VARCHAR,
    lat FLOAT,
    lng FLOAT,
    status VARCHAR DEFAULT 'dispatched',
    ambulance_unit VARCHAR DEFAULT '108 Dispatch Unit #4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Seed Demo Login User (dummy@gmail.com / user12345)
INSERT INTO users (id, email, password_hash, name, phone, role, language, village)
VALUES ('usr_dummy_101', 'dummy@gmail.com', 'user12345_hash', 'Gurpreet Singh', '+91 98765 43210', 'patient', 'ta', 'Alhoran')
ON CONFLICT (id) DO NOTHING;

-- Seed Doctor User
INSERT INTO users (id, email, password_hash, name, phone, role, language, village)
VALUES ('usr_doc_201', 'dr.amanpreet@sehatlink.gov.in', 'doc12345_hash', 'Dr. Amanpreet Singh (MD)', '+91 98123 45678', 'doctor', 'en', 'Sector 1')
ON CONFLICT (id) DO NOTHING;

-- Seed Patient & ABHA Card
INSERT INTO patients (id, user_id, name, abha_id, abha_address, age, gender, village, blood_group, phone, emergency_contact, qr_code_data)
VALUES ('pat_101', 'usr_dummy_101', 'Gurpreet Singh', '91-4820-1928-3741', 'gurpreet.singh@abdm', 60, 'Male', 'Alhoran', 'O+', '+91 98765 43210', '+91 98765 00000', 'ABHA:91-4820-1928-3741|NAME:Gurpreet Singh|AGE:60|VILLAGE:Alhoran')
ON CONFLICT (id) DO NOTHING;

-- Seed Doctor Appointment
INSERT INTO consultations (id, patient_id, doctor_id, doctor_name, priority, status, scheduled_time, symptoms_summary)
VALUES ('apt_401', 'pat_101', 'usr_doc_201', 'Dr. Amanpreet Singh', 'HIGH', 'scheduled', 'Today, 11:30 AM', 'Chest discomfort, mild fever (37.8°C), SpO2 88%')
ON CONFLICT (id) DO NOTHING;

-- Seed Digital Prescription
INSERT INTO prescriptions (id, consultation_id, patient_id, doctor_name, doctor_license, hospital_name, diagnosis, medications_json, digital_signature)
VALUES ('rx_501', 'apt_401', 'pat_101', 'Dr. Amanpreet Singh (MD)', 'PMC-2018-84920', 'Government Civil Hospital', 'Acute Bronchitis & Mild Hypoxia', '[{"name":"Paracetamol 500mg","dosage":"1 tablet twice daily after food","duration":"5 days"},{"name":"Amoxicillin 500mg","dosage":"1 capsule 3 times daily","duration":"7 days"}]', 'SIG_AMANPREET_VERIFIED_84920')
ON CONFLICT (id) DO NOTHING;
