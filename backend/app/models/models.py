import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

try:
    from app.database import Base
except ImportError:
    from ..database import Base

class UserRole(str, enum.Enum):
    PATIENT = "patient"
    ASHA = "asha"
    DOCTOR = "doctor"
    PHARMACIST = "pharmacist"
    ADMIN = "admin"

class PriorityEnum(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.PATIENT)
    language = Column(String, default="pa")
    village = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PatientProfile(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    abha_id = Column(String, index=True, nullable=True)
    age = Column(Integer)
    gender = Column(String)
    village = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class VitalsRecord(Base):
    __tablename__ = "vitals"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    temperature = Column(Float, nullable=True)
    blood_pressure_systolic = Column(Integer, nullable=True)
    blood_pressure_diastolic = Column(Integer, nullable=True)
    pulse_rate = Column(Integer, nullable=True)
    spo2 = Column(Integer, nullable=True)
    recorded_by = Column(String, nullable=True)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_id = Column(String, ForeignKey("users.id"), nullable=True)
    priority = Column(SQLEnum(PriorityEnum), default=PriorityEnum.LOW)
    status = Column(String, default="waiting")
    doctor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, index=True)
    consultation_id = Column(String, ForeignKey("consultations.id"))
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_name = Column(String)
    doctor_license = Column(String)
    diagnosis = Column(Text)
    medications_json = Column(Text)
    qr_code_url = Column(String)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)

class PharmacyItem(Base):
    __tablename__ = "pharmacy_inventory"

    id = Column(String, primary_key=True, index=True)
    medicine_name = Column(String, index=True)
    generic_name = Column(String, index=True)
    stock_status = Column(String, default="in_stock")
    quantity = Column(Integer, default=0)
    price_in_inr = Column(Float, default=0.0)
    pharmacy_name = Column(String)
    pharmacy_address = Column(String)
    distance_km = Column(Float, default=0.0)
    contact_number = Column(String)

class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    patient_name = Column(String)
    village = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String, default="dispatched")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
