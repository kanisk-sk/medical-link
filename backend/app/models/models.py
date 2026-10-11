import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum, JSON
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
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True, index=True)
    role = Column(SQLEnum(UserRole), default=UserRole.PATIENT)
    language = Column(String, default="en")
    village = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)

class PatientProfile(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    abha_id = Column(String, index=True, nullable=True)
    abha_address = Column(String, nullable=True)
    age = Column(Integer)
    gender = Column(String)
    village = Column(String)
    blood_group = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    qr_code_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="patient_profile")
    vitals = relationship("VitalsRecord", back_populates="patient")
    consultations = relationship("Consultation", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")

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

    patient = relationship("PatientProfile", back_populates="vitals")

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_id = Column(String, ForeignKey("users.id"), nullable=True)
    doctor_name = Column(String, nullable=True)
    priority = Column(SQLEnum(PriorityEnum), default=PriorityEnum.LOW)
    status = Column(String, default="scheduled")
    scheduled_time = Column(String, nullable=True)
    symptoms_summary = Column(Text, nullable=True)
    doctor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("PatientProfile", back_populates="consultations")
    prescription = relationship("Prescription", back_populates="consultation", uselist=False)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, index=True)
    consultation_id = Column(String, ForeignKey("consultations.id"), nullable=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_name = Column(String)
    doctor_license = Column(String)
    hospital_name = Column(String, default="Government Civil Hospital")
    diagnosis = Column(Text)
    medications_json = Column(Text)  # Stores JSON array of medications
    qr_code_url = Column(String, nullable=True)
    digital_signature = Column(String, nullable=True)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("PatientProfile", back_populates="prescriptions")
    consultation = relationship("Consultation", back_populates="prescription")

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
    patient_id = Column(String, ForeignKey("patients.id"), nullable=True)
    patient_name = Column(String)
    village = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String, default="dispatched")
    ambulance_unit = Column(String, default="108 Dispatch #4")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
