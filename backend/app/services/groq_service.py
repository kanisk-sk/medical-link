import asyncio
import json
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Optional

import httpx

try:
    from groq import AsyncGroq
    HAS_GROQ_SDK = True
except ImportError:
    AsyncGroq = None
    HAS_GROQ_SDK = False

try:
    from app.config import settings
    from app.schemas.assistant_schemas import ChatMessageSchema, ChatRequestSchema
    from app.services.prompt_service import build_system_prompt
except ImportError:
    from ..config import settings
    from ..schemas.assistant_schemas import ChatMessageSchema, ChatRequestSchema
    from ..services.prompt_service import build_system_prompt

logger = logging.getLogger("sehatlink.groq_service")

EMERGENCY_KEYWORDS = [
    "chest pain", "heart attack", "difficulty breathing", "cannot breathe",
    "snake bite", "unconscious", "heavy bleeding", "stroke", "seizure",
    "harkat band", "ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ", "ਛਾਤੀ ਵਿੱਚ ਦਰਦ", "ਸੱਪ ਲੜ ਗਿਆ", "ਬੇਹੋਸ਼",
]

GREETING_PATTERNS = (
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
    "namaste", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "வணக்கம்", "नमस्ते",
)


class GroqProviderError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


def check_emergency(messages: List[ChatMessageSchema]) -> bool:
    for message in reversed(messages):
        if message.role == "user":
            query = message.content.lower()
            return any(keyword in query for keyword in EMERGENCY_KEYWORDS)
    return False


def is_simple_greeting(messages: List[ChatMessageSchema]) -> bool:
    for message in reversed(messages):
        if message.role != "user":
            continue
        text = " ".join(message.content.lower().strip().split())
        return len(text.split()) <= 5 and any(
            text == greeting or text.startswith(f"{greeting} ")
            for greeting in GREETING_PATTERNS
        )
    return False


def get_greeting_response(language: str) -> str:
    return {
        "ta": "வணக்கம்! நான் செஹத் சஹாயக். உங்கள் உடல்நலம், அறிகுறிகள் அல்லது அவசர உதவி குறித்து என்னிடம் கேட்கலாம்.",
        "hi": "नमस्ते! मैं सेहत सहायक हूँ। आप अपने स्वास्थ्य, लक्षणों या आपात स्थिति के बारे में पूछ सकते हैं।",
        "pa": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਆਪਣੀ ਸਿਹਤ, ਲੱਛਣਾਂ ਜਾਂ ਐਮਰਜੈਂਸੀ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
        "te": "నమస్కారం! నేను సెహత్ సహాయక్‌ను. మీ ఆరోగ్యం, లక్షణాలు లేదా అత్యవసర పరిస్థితి గురించి అడగండి.",
        "ml": "നമസ്കാരം! ഞാൻ സെഹത് സഹായക് ആണ്. ആരോഗ്യത്തെക്കുറിച്ചോ ലക്ഷണങ്ങളെക്കുറിച്ചോ ചോദിക്കാം.",
        "kn": "ನಮಸ್ಕಾರ! ನಾನು ಸೆಹತ್ ಸಹಾಯಕ್. ನಿಮ್ಮ ಆರೋಗ್ಯ, ಲಕ್ಷಣಗಳು ಅಥವಾ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
        "bn": "নমস্কার! আমি সেহত সহায়ক। আপনার স্বাস্থ্য, উপসর্গ বা জরুরি অবস্থা সম্পর্কে জিজ্ঞাসা করুন।",
        "mr": "नमस्कार! मी सेहत सहायक आहे. तुमच्या आरोग्याबद्दल, लक्षणांबद्दल किंवा आपत्कालीन स्थितीबद्दल विचारा.",
    }.get(language, "Hello! I am Sehat Sahayak. Ask me about your health, symptoms, or urgent care.")


def get_fallback_response(
    last_user_query: str,
    language: str = "pa",
    role: str = "patient",
    is_emergency: bool = False,
) -> str:
    del last_user_query, role
    if is_emergency:
        if language == "ta":
            return "⚠️ அவசர அறிகுறிகள் இருக்கலாம். உடனடியாக 108-ஐ அழைக்கவும் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும்."
        if language == "hi":
            return "⚠️ ये गंभीर लक्षण हो सकते हैं। तुरंत 108 पर कॉल करें या नजदीकी अस्पताल जाएं।"
        if language == "pa":
            return "⚠️ ਇਹ ਗੰਭੀਰ ਲੱਛਣ ਹੋ ਸਕਦੇ ਹਨ। ਤੁਰੰਤ 108 ਨੂੰ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ।"
        return "⚠️ These symptoms may be serious. Call 108 immediately or go to the nearest hospital."
    return {
        "ta": "AI ਸੇਵਾ ਇਸ ਵੇਲੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        "hi": "AI सेवा अभी उपलब्ध नहीं है। कृपया बाद में फिर प्रयास करें।",
        "pa": "AI ਸੇਵਾ ਇਸ ਵੇਲੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    }.get(language, "The AI service is currently unavailable. Please try again later.")


class GroqService:
    def __init__(self) -> None:
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self._async_client: Optional[Any] = None

    @property
    def api_key(self) -> str:
        return (settings.GROQ_API_KEY or "").strip()

    def require_api_key(self) -> None:
        if not self.api_key:
            raise GroqProviderError(
                "GROQ_API_KEY is missing. Set it in backend/.env and restart the backend.",
                status_code=503,
            )

    def get_client(self) -> Optional[Any]:
        self.require_api_key()
        if HAS_GROQ_SDK and self._async_client is None:
            self._async_client = AsyncGroq(api_key=self.api_key)
        return self._async_client

    def prepare_messages(self, request: ChatRequestSchema) -> List[Dict[str, str]]:
        system_prompt = build_system_prompt(
            role=request.user_role or "patient",
            language=request.language or "pa",
            current_page=request.current_page,
            vitals_context=request.vitals_context,
        )
        return [
            {"role": "system", "content": system_prompt},
            *[
                {"role": message.role, "content": message.content}
                for message in request.messages
                if message.role in {"user", "assistant"}
            ],
        ]

    @staticmethod
    def _provider_error(error: Exception) -> GroqProviderError:
        status_code = getattr(error, "status_code", None)
        if status_code == 401:
            return GroqProviderError("Groq rejected the API key. Check GROQ_API_KEY in backend/.env.", 502)
        if status_code == 429:
            return GroqProviderError("Groq rate limit reached. Please try again shortly.", 429)
        if status_code == 404:
            return GroqProviderError(
                "The configured GROQ_MODEL is unavailable. Set GROQ_MODEL to a model enabled for your Groq account.",
                502,
            )
        if isinstance(error, (httpx.TimeoutException, asyncio.TimeoutError)):
            return GroqProviderError("The AI provider timed out. Please try again.", 504)
        if isinstance(error, httpx.RequestError):
            return GroqProviderError("The AI provider could not be reached. Check backend network access.", 502)
        return GroqProviderError("The AI provider returned an unexpected error. Please try again.", 502)

    async def _create_completion(self, messages: List[Dict[str, str]], stream: bool) -> Any:
        client = self.get_client()
        try:
            if client is not None and HAS_GROQ_SDK:
                return await client.chat.completions.create(
                    messages=messages,
                    model=self.model,
                    temperature=0.3,
                    max_tokens=1024,
                    stream=stream,
                )

            async with httpx.AsyncClient(timeout=30.0) as http_client:
                response = await http_client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json={"model": self.model, "messages": messages, "temperature": 0.3, "max_tokens": 1024, "stream": False},
                )
                if response.status_code != 200:
                    error = GroqProviderError(
                        f"Groq request failed with HTTP {response.status_code}.",
                        429 if response.status_code == 429 else 502,
                    )
                    raise error
                return response.json()
        except GroqProviderError:
            raise
        except Exception as error:
            raise self._provider_error(error) from error

    async def sync_chat_response(self, request: ChatRequestSchema) -> Dict[str, Any]:
        start_time = time.time()
        is_emergency = check_emergency(request.messages)
        if is_simple_greeting(request.messages) and not is_emergency:
            return {
                "content": get_greeting_response(request.language or "pa"),
                "emergency_detected": False,
                "model": "sehatlink-local-greeting",
                "execution_time_ms": round((time.time() - start_time) * 1000, 2),
            }
        messages = self.prepare_messages(request)
        completion = await self._create_completion(messages, stream=False)
        try:
            if isinstance(completion, dict):
                content = completion["choices"][0]["message"]["content"]
            else:
                content = completion.choices[0].message.content
            if not content:
                raise GroqProviderError("The AI provider returned an empty response.", 502)
        except (AttributeError, IndexError, KeyError, TypeError) as error:
            raise GroqProviderError("The AI provider returned a malformed response.", 502) from error
        return {
            "content": content,
            "emergency_detected": is_emergency,
            "model": self.model,
            "execution_time_ms": round((time.time() - start_time) * 1000, 2),
        }

    async def stream_chat_response(self, request: ChatRequestSchema) -> AsyncGenerator[str, None]:
        start_time = time.time()
        is_emergency = check_emergency(request.messages)
        if is_emergency:
            yield f"data: {json.dumps({'type': 'emergency_flag', 'emergency_detected': True, 'notice': 'High-risk symptoms detected. Call 108 or seek urgent medical care.'})}\n\n"

        try:
            if is_simple_greeting(request.messages) and not is_emergency:
                yield f"data: {json.dumps({'content': get_greeting_response(request.language or 'pa'), 'done': False})}\n\n"
                yield f"data: {json.dumps({'content': '', 'done': True, 'model': 'sehatlink-local-greeting', 'execution_time_ms': round((time.time() - start_time) * 1000, 2)})}\n\n"
                return
            completion = await self._create_completion(self.prepare_messages(request), stream=True)
            if isinstance(completion, dict):
                content = completion["choices"][0]["message"]["content"]
                if not content:
                    raise GroqProviderError("The AI provider returned an empty response.", 502)
                yield f"data: {json.dumps({'content': content, 'done': False})}\n\n"
            else:
                async for chunk in completion:
                    delta = chunk.choices[0].delta.content if chunk.choices and chunk.choices[0].delta else None
                    if delta:
                        yield f"data: {json.dumps({'content': delta, 'done': False})}\n\n"
            yield f"data: {json.dumps({'content': '', 'done': True, 'model': self.model, 'execution_time_ms': round((time.time() - start_time) * 1000, 2)})}\n\n"
        except GroqProviderError as error:
            logger.error("AI provider failure: %s", error)
            yield f"data: {json.dumps({'error': True, 'done': True, 'error_message': str(error)})}\n\n"


groq_service = GroqService()
