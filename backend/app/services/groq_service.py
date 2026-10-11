import time
import json
import logging
import asyncio
from typing import AsyncGenerator, List, Dict, Any, Optional

try:
    from groq import AsyncGroq
    HAS_GROQ_SDK = True
except ImportError:
    HAS_GROQ_SDK = False

import httpx

try:
    from app.config import settings
    from app.schemas.assistant_schemas import ChatMessageSchema, ChatRequestSchema, VitalsContextSchema
    from app.services.prompt_service import build_system_prompt
except ImportError:
    from ..config import settings
    from ..schemas.assistant_schemas import ChatMessageSchema, ChatRequestSchema, VitalsContextSchema
    from ..services.prompt_service import build_system_prompt

logger = logging.getLogger("sehatlink.groq_service")

# Emergency keywords trigger detection
EMERGENCY_KEYWORDS = [
    "chest pain", "heart attack", "difficulty breathing", "cannot breathe", "snake bite",
    "unconscious", "heavy bleeding", "stroke", "seizure", "harkat band", "ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ",
    "ਛਾਤੀ ਵਿੱਚ ਦਰਦ", "ਸੱਪ ਲੜ ਗਿਆ", "ਬੇਹੋਸ਼"
]

def check_emergency(messages: List[ChatMessageSchema]) -> bool:
    """Check if latest user message contains high-risk emergency terms."""
    if not messages:
        return False
    last_user_msg = ""
    for msg in reversed(messages):
        if msg.role == "user":
            last_user_msg = msg.content.lower()
            break

    return any(kw in last_user_msg for kw in EMERGENCY_KEYWORDS)

def get_fallback_response(
    last_user_query: str,
    language: str = "pa",
    role: str = "patient",
    is_emergency: bool = False
) -> str:
    """
    Provides a helpful, domain-specific rural telemedicine response when Groq API key is missing or offline.
    """
    if is_emergency:
        if language == "ta":
            return (
                "⚠️ **அவசர எச்சரிக்கை (EMERGENCY ALERT)**\n\n"
                "உங்கள் அறிகுறிகள் தீவிரமானதாக இருக்கலாம். தயவுசெய்து உடனடியாக **108 ஆம்புலன்ஸ்** சேவையை அழைக்கவும் "
                "அல்லது SehatLink செயலியின் சிவப்பு நிற அவசர பொத்தானை அழுத்தவும். அருகில் உள்ள அரசு மருத்துவமனையைத் தொடர்பு கொள்ளவும்.\n\n"
                "(Emergency Alert: Symptoms appear critical. Call 108 Ambulance immediately.)"
            )
        elif language == "pa":
            return (
                "⚠️ **ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ (EMERGENCY ALERT)**\n\n"
                "ਤੁਹਾਡੇ ਲੱਛਣ ਗੰਭੀਰ ਹੋ ਸਕਦੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ **108 ਐਂਬੂਲੈਂਸ** ਨੂੰ ਕਾਲ ਕਰੋ "
                "ਜਾਂ ਸਿਹਤ ਲਿੰਕ ਐਪ ਦੇ ਲਾਲ ਐਮਰਜੈਂਸੀ ਬਟਨ ਨੂੰ ਦਬਾਓ। ਨੇੜਲੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਨਾਭਾ ਵਿਖੇ ਸੰਪਰਕ ਕਰੋ।\n\n"
                "(Emergency Alert: Symptoms appear critical. Call 108 Ambulance immediately.)"
            )
        return (
            "⚠️ **EMERGENCY ALERT**\n\n"
            "Your reported symptoms require urgent medical evaluation. Please contact **108 Emergency Ambulance Service** "
            "immediately or visit the nearest Government Civil Hospital / PHC."
        )

    if language == "ta":
        return (
            "வணக்கம்! நான் உங்கள் செஹத் உதவியாளர் (SehatLink AI Assistant).\n\n"
            "• **அறிகுறி பரிசோதனை**: காய்ச்சல், வலி அல்லது இருமல் பற்றிய கேள்விகளைக் கேட்கலாம்.\n"
            "• **மருந்துத் தகவல்**: மக்கள் மருந்தகத்தில் (Jan Aushadhi Kendra) கிடைக்கும் குறைந்த விலை மருந்துகள் பற்றிய விவரங்கள்.\n"
            "• **அவசர உதவி**: அவசர காலத்தில் 108 ஆம்புலன்ஸை உடனடியாகத் தொடர்பு கொள்ளவும்.\n\n"
            "தயவுசெய்து உங்கள் கேள்வியைப் பதிவு செய்யவும்."
        )
    elif language == "pa":
        return (
            "ਜੀ ਆਇਆਂ ਨੂੰ! ਮੈਂ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ (SehatLink Rural Health Assistant)।\n\n"
            "• **ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ**: ਤੁਸੀਂ ਆਪਣੀ ਬਿਮਾਰੀ ਜਾਂ ਬੁਖਾਰ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।\n"
            "• **ਦਵਾਈਆਂ ਦੀ ਜਾਣਕਾਰੀ**: ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ (Jan Aushadhi Kendra) ਤੋਂ ਮਿਲਣ ਵਾਲੀਆਂ ਜੈਨਰਿਕ ਦਵਾਈਆਂ ਬਾਰੇ ਸੁਝਾਅ।\n"
            "• **ਆਸ਼ਾ ਵਰਕਰ ਮਦਦ**: ਪਿੰਡ ਵਿੱਚ ਹੋਮ ਵਿਜ਼ਿਟ ਅਤੇ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ/SpO2 ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਦਿਸ਼ਾ ਨਿਰਦੇਸ਼।\n\n"
            "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ, ਅਸੀਂ ਤੁਹਾਡੀ ਪੂਰੀ ਮਦਦ ਕਰਾਂਗੇ।"
        )
    elif language == "hi":
        return (
            "नमस्ते! मैं सेहत सहायक हूँ (SehatLink AI Assistant)।\n\n"
            "• **लक्षण जांच**: आप बुखार, दर्द या खांसी के बारे में सवाल पूछ सकते हैं।\n"
            "• **दवा जानकारी**: जन औषधि केंद्र नाभा में उपलब्ध जेनेरिक दवाओं की जानकारी।\n"
            "• **आपातकालीन सेवा**: आपात स्थिति में नाभा 108 एम्बुलेंस से तुरंत संपर्क करें।\n\n"
            "कृपया अपना सवाल दर्ज करें।"
        )
    else:
        return (
            "Welcome! I am **Sehat Sahayak**, your AI Healthcare Assistant for SehatLink Rural Telemedicine.\n\n"
            "• **Symptom Triage**: Ask about common health concerns, vitals interpretation, or home care.\n"
            "• **Generic Medicines**: Guidance on essential medications available at Jan Aushadhi Kendra.\n"
            "• **ASHA Support**: Guidance on recording vitals and prioritizing consultations.\n\n"
            "How can I assist you today?"
        )

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self._async_client = None

    def get_client(self) -> Optional[Any]:
        if not self.api_key:
            return None

        if HAS_GROQ_SDK:
            if not self._async_client:
                self._async_client = AsyncGroq(api_key=self.api_key)
            return self._async_client
        return None

    def prepare_messages(self, request: ChatRequestSchema) -> List[Dict[str, str]]:
        system_prompt = build_system_prompt(
            role=request.user_role or "patient",
            language=request.language or "pa",
            current_page=request.current_page,
            vitals_context=request.vitals_context
        )

        formatted_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            if msg.role in ["user", "assistant"]:
                formatted_messages.append({"role": msg.role, "content": msg.content})

        return formatted_messages

    async def stream_chat_response(
        self,
        request: ChatRequestSchema
    ) -> AsyncGenerator[str, None]:
        """
        Yields Server-Sent Events (SSE) formatted data chunks.
        format: data: {"content": "...", "done": false}\n\n
        """
        start_time = time.time()
        is_emergency = check_emergency(request.messages)
        formatted_msgs = self.prepare_messages(request)
        last_user_text = request.messages[-1].content if request.messages else ""

        # Yield emergency flag notification first if needed
        if is_emergency:
            emergency_evt = json.dumps({
                "type": "emergency_flag",
                "emergency_detected": True,
                "notice": "⚠️ High-risk symptoms detected. Ensure patient safety."
            })
            yield f"data: {emergency_evt}\n\n"

        # Check if Groq API key is missing
        if not self.api_key:
            logger.warning("GROQ_API_KEY is not set in backend environment. Delivering offline fallback response.")
            fallback_text = get_fallback_response(
                last_user_query=last_user_text,
                language=request.language or "pa",
                role=request.user_role or "patient",
                is_emergency=is_emergency
            )

            # Stream fallback word by word to emulate fluid AI streaming experience
            words = fallback_text.split(" ")
            for i, word in enumerate(words):
                chunk_str = word + (" " if i < len(words) - 1 else "")
                evt = json.dumps({"content": chunk_str, "done": False})
                yield f"data: {evt}\n\n"
                await asyncio.sleep(0.02)

            final_evt = json.dumps({
                "content": "",
                "done": True,
                "execution_time_ms": round((time.time() - start_time) * 1000, 2),
                "model": "sehatlink-fallback-offline"
            })
            yield f"data: {final_evt}\n\n"
            return

        client = self.get_client()

        try:
            if client and HAS_GROQ_SDK:
                logger.info(f"Initiating Groq stream with model '{self.model}' for role '{request.user_role}'")
                stream = await client.chat.completions.create(
                    messages=formatted_msgs,
                    model=self.model,
                    temperature=0.3,
                    max_tokens=1024,
                    stream=True,
                )

                async for chunk in stream:
                    delta = chunk.choices[0].delta.content if chunk.choices and chunk.choices[0].delta else None
                    if delta:
                        evt = json.dumps({"content": delta, "done": False})
                        yield f"data: {evt}\n\n"

                exec_time = round((time.time() - start_time) * 1000, 2)
                logger.info(f"Groq stream completed successfully in {exec_time} ms")
                final_evt = json.dumps({
                    "content": "",
                    "done": True,
                    "execution_time_ms": exec_time,
                    "model": self.model
                })
                yield f"data: {final_evt}\n\n"

            else:
                # Direct HTTP streaming using httpx if Groq SDK is not present
                async with httpx.AsyncClient(timeout=30.0) as http_client:
                    headers = {
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    }
                    payload = {
                        "model": self.model,
                        "messages": formatted_msgs,
                        "temperature": 0.3,
                        "max_tokens": 1024,
                        "stream": True,
                    }
                    async with http_client.stream(
                        "POST",
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers=headers,
                        json=payload
                    ) as response:
                        if response.status_code != 200:
                            error_body = await response.aread()
                            logger.error(f"Groq API Error Status {response.status_code}: {error_body.decode('utf-8')}")
                            fallback_text = get_fallback_response(
                                last_user_query=last_user_text,
                                language=request.language or "pa",
                                role=request.user_role or "patient",
                                is_emergency=is_emergency
                            )
                            evt = json.dumps({"content": fallback_text, "done": False})
                            yield f"data: {evt}\n\n"
                            done_evt = json.dumps({"content": "", "done": True, "error": True})
                            yield f"data: {done_evt}\n\n"
                            return

                        async for line in response.aiter_lines():
                            if line.startswith("data: "):
                                data_str = line[6:].strip()
                                if data_str == "[DONE]":
                                    break
                                try:
                                    parsed = json.loads(data_str)
                                    delta = parsed["choices"][0]["delta"].get("content", "")
                                    if delta:
                                        evt = json.dumps({"content": delta, "done": False})
                                        yield f"data: {evt}\n\n"
                                except Exception:
                                    continue

                exec_time = round((time.time() - start_time) * 1000, 2)
                final_evt = json.dumps({
                    "content": "",
                    "done": True,
                    "execution_time_ms": exec_time,
                    "model": self.model
                })
                yield f"data: {final_evt}\n\n"

        except Exception as err:
            logger.error(f"Error during Groq API execution: {str(err)}", exc_info=True)
            fallback_text = f"\n\n[ਮਾਫ਼ ਕਰਨਾ, ਨੈੱਟਵਰਕ ਸੰਚਾਰ ਵਿੱਚ ਅਸਥਾਈ ਵਿਘਨ ਆਇਆ ਹੈ।/ Network temporary interruption: {str(err)}]\n\n" + get_fallback_response(
                last_user_query=last_user_text,
                language=request.language or "pa",
                role=request.user_role or "patient",
                is_emergency=is_emergency
            )
            evt = json.dumps({"content": fallback_text, "done": False})
            yield f"data: {evt}\n\n"
            done_evt = json.dumps({"content": "", "done": True, "error": True})
            yield f"data: {done_evt}\n\n"

    async def sync_chat_response(
        self,
        request: ChatRequestSchema
    ) -> Dict[str, Any]:
        """Synchronous chat completion helper."""
        start_time = time.time()
        is_emergency = check_emergency(request.messages)
        formatted_msgs = self.prepare_messages(request)
        last_user_text = request.messages[-1].content if request.messages else ""

        if not self.api_key:
            fallback = get_fallback_response(
                last_user_query=last_user_text,
                language=request.language or "pa",
                role=request.user_role or "patient",
                is_emergency=is_emergency
            )
            return {
                "content": fallback,
                "emergency_detected": is_emergency,
                "model": "sehatlink-fallback-offline",
                "execution_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        client = self.get_client()
        try:
            if client and HAS_GROQ_SDK:
                completion = await client.chat.completions.create(
                    messages=formatted_msgs,
                    model=self.model,
                    temperature=0.3,
                    max_tokens=1024,
                )
                answer = completion.choices[0].message.content or ""
                return {
                    "content": answer,
                    "emergency_detected": is_emergency,
                    "model": self.model,
                    "execution_time_ms": round((time.time() - start_time) * 1000, 2)
                }
            else:
                async with httpx.AsyncClient(timeout=30.0) as http_client:
                    res = await http_client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                        json={"model": self.model, "messages": formatted_msgs, "temperature": 0.3, "max_tokens": 1024}
                    )
                    if res.status_code == 200:
                        data = res.json()
                        answer = data["choices"][0]["message"]["content"]
                        return {
                            "content": answer,
                            "emergency_detected": is_emergency,
                            "model": self.model,
                            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
                        }
                    else:
                        raise Exception(f"HTTP {res.status_code}: {res.text}")
        except Exception as err:
            logger.error(f"Error in sync_chat_response: {err}")
            return {
                "content": get_fallback_response(last_user_text, request.language or "pa", request.user_role or "patient", is_emergency),
                "emergency_detected": is_emergency,
                "model": "fallback",
                "execution_time_ms": round((time.time() - start_time) * 1000, 2)
            }

groq_service = GroqService()
