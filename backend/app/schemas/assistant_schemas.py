from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatMessageSchema(BaseModel):
    role: str = Field(..., description="Message role: 'user', 'assistant', or 'system'")
    content: str = Field(..., description="Message text content")
    timestamp: Optional[str] = Field(None, description="ISO timestamp string")
    id: Optional[str] = Field(None, description="Unique message id")

class VitalsContextSchema(BaseModel):
    temperature: Optional[float] = None
    blood_pressure: Optional[str] = None
    pulse_rate: Optional[int] = None
    spo2: Optional[int] = None
    symptoms: Optional[List[str]] = None

class ChatRequestSchema(BaseModel):
    messages: List[ChatMessageSchema] = Field(..., description="Conversation history")
    user_role: Optional[str] = Field("patient", description="User role: patient, health_worker, doctor, pharmacist, admin")
    current_page: Optional[str] = Field(None, description="Current router path in SehatLink frontend")
    language: Optional[str] = Field("pa", description="Preferred language code: pa (Punjabi), hi (Hindi), en (English)")
    stream: Optional[bool] = Field(True, description="Enable Server-Sent Events streaming response")
    vitals_context: Optional[VitalsContextSchema] = Field(None, description="Optional vitals or patient triage snapshot")

class UsageStats(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    execution_time_ms: float = 0.0

class ChatSyncResponseSchema(BaseModel):
    message: ChatMessageSchema
    language: str = "pa"
    emergency_detected: bool = False
    disclaimer: str = "ਇਹ ਇੱਕ AI ਸਹਾਇਕ ਹੈ। ਐਮਰਜੈਂਸੀ ਲਈ 108 ਜਾਂ ਨੇੜਲੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਵਿੱਚ ਸੰਪਰਕ ਕਰੋ। (This is an AI assistant. For emergencies, contact 108 or nearest Govt Hospital.)"
    usage: Optional[UsageStats] = None

class QuickPromptItem(BaseModel):
    id: str
    label: str
    prompt: str
    category: str  # general, symptoms, dosage, asha_intake, emergency
    language: str

class TokenRequestSchema(BaseModel):
    user_id: str
    role: str = "patient"
    language: str = "pa"
    name: Optional[str] = "Rural Citizen"
    village: Optional[str] = "Rural Village"

class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: str
    role: str

class AssistantHealthSchema(BaseModel):
    status: str
    groq_api_configured: bool
    model: str
    app_name: str
    environment: str
