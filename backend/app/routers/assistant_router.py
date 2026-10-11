import logging
import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse

try:
    from app.config import settings
    from app.security.jwt_auth import get_current_user, UserTokenData, create_access_token
    from app.schemas.assistant_schemas import (
        ChatRequestSchema,
        ChatSyncResponseSchema,
        ChatMessageSchema,
        QuickPromptItem,
        TokenRequestSchema,
        TokenResponseSchema,
        AssistantHealthSchema
    )
    from app.services.groq_service import groq_service, check_emergency
except ImportError:
    from ..config import settings
    from ..security.jwt_auth import get_current_user, UserTokenData, create_access_token
    from ..schemas.assistant_schemas import (
        ChatRequestSchema,
        ChatSyncResponseSchema,
        ChatMessageSchema,
        QuickPromptItem,
        TokenRequestSchema,
        TokenResponseSchema,
        AssistantHealthSchema
    )
    from ..services.groq_service import groq_service, check_emergency

logger = logging.getLogger("sehatlink.assistant_router")

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])

@router.get("/health", response_model=AssistantHealthSchema)
def check_assistant_health():
    """Returns AI Assistant status, Groq API key configuration state, and current LLM model."""
    is_configured = bool(settings.GROQ_API_KEY and len(settings.GROQ_API_KEY.strip()) > 5)
    return AssistantHealthSchema(
        status="active" if is_configured else "fallback_mode",
        groq_api_configured=is_configured,
        model=settings.GROQ_MODEL,
        app_name=settings.APP_NAME,
        environment=settings.ENVIRONMENT
    )

@router.post("/token", response_model=TokenResponseSchema)
def generate_user_token(req: TokenRequestSchema):
    """
    Generates a secure JWT token for SehatLink user sessions.
    Used by frontend to authenticate AI Assistant API streams.
    """
    expires_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    token = create_access_token(
        user_id=req.user_id,
        role=req.role,
        language=req.language,
        name=req.name or "Rural Citizen",
        village=req.village or "Punjab",
        expires_minutes=expires_minutes
    )
    return TokenResponseSchema(
        access_token=token,
        token_type="bearer",
        expires_in=expires_minutes * 60,
        user_id=req.user_id,
        role=req.role
    )

@router.post("/chat")
async def chat_stream_endpoint(
    request: ChatRequestSchema,
    current_user: UserTokenData = Depends(get_current_user)
):
    """
    Server-Sent Events (SSE) streaming endpoint for AI Assistant.
    Requires JWT authentication (or guest dev token).
    """
    logger.info(f"Stream request received from user='{current_user.sub}', role='{request.user_role or current_user.role}', page='{request.current_page}'")
    
    # Overwrite language/role if not set in request
    if not request.user_role:
        request.user_role = current_user.role
    if not request.language:
        request.language = current_user.language

    return StreamingResponse(
        groq_service.stream_chat_response(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/chat/sync", response_model=ChatSyncResponseSchema)
async def chat_sync_endpoint(
    request: ChatRequestSchema,
    current_user: UserTokenData = Depends(get_current_user)
):
    """
    Synchronous non-streaming endpoint for AI Assistant.
    """
    logger.info(f"Sync chat request from user='{current_user.sub}'")
    if not request.user_role:
        request.user_role = current_user.role
    if not request.language:
        request.language = current_user.language

    res = await groq_service.sync_chat_response(request)
    
    assistant_msg = ChatMessageSchema(
        id=f"msg-{uuid.uuid4().hex[:8]}",
        role="assistant",
        content=res["content"],
        timestamp=datetime.datetime.utcnow().isoformat()
    )

    return ChatSyncResponseSchema(
        message=assistant_msg,
        language=request.language,
        emergency_detected=res["emergency_detected"]
    )

@router.get("/prompts", response_model=List[QuickPromptItem])
def get_quick_prompts(
    role: str = Query("patient", description="User role"),
    language: str = Query("pa", description="Language code (pa, hi, en)"),
    page: Optional[str] = Query(None, description="Current page path")
):
    """
    Returns role-specific and page-specific quick prompt suggestions for the AI Assistant.
    """
    prompts: List[QuickPromptItem] = []

    if role in ["patient"]:
        if language == "ta":
            prompts.extend([
                QuickPromptItem(
                    id="p1_ta",
                    label="காய்ச்சல் & அறிகுறி உதவி",
                    prompt="எனக்கு 2 நாட்களாக லேசான காய்ச்சல் மற்றும் இருமல் உள்ளது. நான் என்ன செய்ய வேண்டும்?",
                    category="symptoms",
                    language="ta"
                ),
                QuickPromptItem(
                    id="p2_ta",
                    label="மக்கள் மருந்தகம் (Jan Aushadhi)",
                    prompt="மக்கள் மருந்தகத்தில் கிடைக்கும் குறைந்த விலை மருந்துகள் பற்றிய தகவல்களை வழங்கவும்.",
                    category="dosage",
                    language="ta"
                ),
                QuickPromptItem(
                    id="p3_ta",
                    label="108 அவசர ஆம்புலன்ஸ்",
                    prompt="அவசர நிலையில் 108 ஆம்புலன்ஸை எவ்வாறு அழைப்பது?",
                    category="emergency",
                    language="ta"
                ),
                QuickPromptItem(
                    id="p4_ta",
                    label="இரத்த அழுத்த அளவீடு (BP)",
                    prompt="எனது இரத்த அழுத்தம் 140/90 என வந்துள்ளது. இதன் பொருள் என்ன?",
                    category="general",
                    language="ta"
                )
            ])
        elif language == "pa":
            prompts.extend([
                QuickPromptItem(
                    id="p1",
                    label="ਮੇਰਾ ਬੁਖਾਰ ਅਤੇ ਖੰਘ ਹੈ",
                    prompt="ਮੈਨੂੰ 2 ਦਿਨਾਂ ਤੋਂ ਹਲਕਾ ਬੁਖਾਰ ਅਤੇ ਖੰਘ ਹੈ। ਮੈਨੂੰ ਕੀ ਘਰੇਲੂ ਇਲਾਜ ਜਾਂ ਸਾਵਧਾਨੀਆਂ ਵਰਤਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?",
                    category="symptoms",
                    language="pa"
                ),
                QuickPromptItem(
                    id="p2",
                    label="ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਦਵਾਈਆਂ",
                    prompt="ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਨਾਭਾ ਵਿੱਚ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਅਤੇ ਸ਼ੂਗਰ ਦੀਆਂ ਕਿਹੜੀਆਂ ਜੈਨਰਿਕ ਦਵਾਈਆਂ ਉਪਲਬਧ ਹਨ?",
                    category="dosage",
                    language="pa"
                ),
                QuickPromptItem(
                    id="p3",
                    label="ਐਮਰਜੈਂਸੀ 108 ਸੇਵਾ",
                    prompt="ਨਾਭਾ ਵਿੱਚ 108 ਐਂਬੂਲੈਂਸ ਅਤੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਦੀਆਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਬਾਰੇ ਦੱਸੋ।",
                    category="emergency",
                    language="pa"
                ),
                QuickPromptItem(
                    id="p4",
                    label="ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਰੀਡਿੰਗ ਸਮਝੋ",
                    prompt="ਮੇਰਾ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ 140/90 ਆਇਆ ਹੈ। ਕੀ ਇਹ ਆਮ ਹੈ?",
                    category="general",
                    language="pa"
                )
            ])
        else:
            prompts.extend([
                QuickPromptItem(
                    id="p1_en",
                    label="Check Fever & Cough",
                    prompt="I have mild fever and cough for 2 days. What basic precautions should I follow?",
                    category="symptoms",
                    language="en"
                ),
                QuickPromptItem(
                    id="p2_en",
                    label="Jan Aushadhi Generic Meds",
                    prompt="What generic medicines for hypertension and diabetes are available at Jan Aushadhi Kendra?",
                    category="dosage",
                    language="en"
                ),
                QuickPromptItem(
                    id="p3_en",
                    label="108 Ambulance",
                    prompt="How can I dispatch 108 Ambulance for emergency hospital transfer?",
                    category="emergency",
                    language="en"
                ),
                QuickPromptItem(
                    id="p4_en",
                    label="Interpret BP 140/90",
                    prompt="My recorded blood pressure is 140/90 mmHg. What does this mean?",
                    category="general",
                    language="en"
                )
            ])
    elif role in ["health_worker", "asha"]:
        if language == "pa":
            prompts.extend([
                QuickPromptItem(
                    id="w1",
                    label="ਆਸ਼ਾ ਹੋਮ ਵਿਜ਼ਿਟ ਚੈੱਕਲਿਸਟ",
                    prompt="ਪਿੰਡ ਵਿੱਚ ਗਰਭਵਤੀ ਔਰਤ ਦੇ ਹੋਮ ਵਿਜ਼ਿਟ ਲਈ ਜ਼ਰੂਰੀ ਵਾਇਟਲਜ਼ ਅਤੇ ਸਵਾਲਾਂ ਦੀ ਚੈੱਕਲਿਸਟ ਦੱਸੋ।",
                    category="asha_intake",
                    language="pa"
                ),
                QuickPromptItem(
                    id="w2",
                    label="SpO2 < 94% ਟ੍ਰਾਈਏਜ ਨਿਯਮ",
                    prompt="ਜੇ ਮਰੀਜ਼ ਦਾ SpO2 92% ਆਉਂਦਾ ਹੈ, ਤਾਂ ਮੈਨੂੰ ਕਿਹੜੀ ਟ੍ਰਾਈਏਜ ਪ੍ਰਾਇਓਰਿਟੀ (High Priority) ਸੈੱਟ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
                    category="symptoms",
                    language="pa"
                ),
                QuickPromptItem(
                    id="w3",
                    label="ਔਫਲਾਈਨ ਸਿੰਕਿੰਗ ਮਦਦ",
                    prompt="ਸਿਹਤ ਲਿੰਕ ਐਪ ਵਿੱਚ ਔਫਲਾਈਨ ਮੋਡ ਵਿੱਚ ਰਿਕਾਰਡ ਕੀਤੇ ਮਰੀਜ਼ਾਂ ਦਾ ਡਾਟਾ ਕਿਵੇਂ ਸਿੰਕ ਹੁੰਦਾ ਹੈ?",
                    category="general",
                    language="pa"
                )
            ])
        else:
            prompts.extend([
                QuickPromptItem(
                    id="w1_en",
                    label="ASHA Home Visit Checklist",
                    prompt="What vitals and symptoms should I capture during home visit intake?",
                    category="asha_intake",
                    language="en"
                ),
                QuickPromptItem(
                    id="w2_en",
                    label="SpO2 Triage Guidance",
                    prompt="If a patient has SpO2 of 92%, how should I categorize priority for doctor review?",
                    category="symptoms",
                    language="en"
                )
            ])
    elif role in ["doctor"]:
        prompts.extend([
            QuickPromptItem(
                id="d1",
                label="Hypertension STG Rural",
                prompt="Provide standard treatment guidelines for Essential Hypertension in rural primary health centers.",
                category="general",
                language="en"
            ),
            QuickPromptItem(
                id="d2",
                label="Check Drug Interactions",
                prompt="Are there any major interactions between Sorbitrate 5mg and Aspirin 150mg?",
                category="dosage",
                language="en"
            )
        ])
    elif role in ["pharmacist"]:
        prompts.extend([
            QuickPromptItem(
                id="ph1",
                label="Sorbitrate Generic Alternative",
                prompt="What generic equivalents are available for Isosorbide Dinitrate 5mg at Jan Aushadhi?",
                category="dosage",
                language="en"
            )
        ])

    return prompts
