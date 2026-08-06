from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone: str
    role: str = "patient"
    language: str = "pa"
    village: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str

    model_config = ConfigDict(from_attributes=True)

class VitalsBase(BaseModel):
    temperature: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    pulse_rate: Optional[int] = None
    spo2: Optional[int] = None
    recorded_by: Optional[str] = None

class VitalsCreate(VitalsBase):
    patient_id: str

class TriageRequest(BaseModel):
    raw_speech: str
    vitals: Optional[VitalsBase] = None

class TriageResponse(BaseModel):
    priority: str
    is_red_flag: bool
    alerts: List[str]
    extracted_symptoms: List[dict]

class PrescriptionCreate(BaseModel):
    consultation_id: str
    patient_id: str
    diagnosis: str
    medications: List[dict]

class EmergencyRequest(BaseModel):
    patient_name: str
    village: str
    lat: float = 30.3752
    lng: float = 76.1528
