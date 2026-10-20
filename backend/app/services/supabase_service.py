import logging
from typing import Any, Dict, List, Optional

from supabase import Client, create_client

try:
    from app.config import settings
except ImportError:
    from ..config import settings

logger = logging.getLogger("sehatlink.supabase")


class SupabaseConfigurationError(RuntimeError):
    pass


class SupabaseService:
    def __init__(self) -> None:
        self._client: Optional[Client] = None

    @property
    def client(self) -> Client:
        if self._client is None:
            secret_key = (
                settings.SUPABASE_SECRET_KEY
                or settings.SUPABASE_SERVICE_ROLE_KEY
                or settings.SUPABASE_KEY
            )
            if not settings.SUPABASE_URL or not secret_key:
                raise SupabaseConfigurationError(
                    "SUPABASE_URL and SUPABASE_SECRET_KEY must be configured for chat persistence."
                )
            self._client = create_client(settings.SUPABASE_URL, secret_key)
        return self._client

    def upsert_profile(self, user_id: str, display_name: str, preferred_language: str) -> Dict[str, Any]:
        response = self.client.table("profiles").upsert(
            {
                "id": user_id,
                "display_name": display_name[:200],
                "preferred_language": preferred_language,
            },
            on_conflict="id",
        ).execute()
        if not response.data:
            raise RuntimeError("Supabase did not return the saved profile.")
        return response.data[0]

    def list_conversations(self, user_id: str) -> List[Dict[str, Any]]:
        response = self.client.table("chat_conversations").select(
            "id,title,preferred_language,created_at,updated_at"
        ).eq("user_id", user_id).order("updated_at", desc=True).execute()
        return response.data or []

    def create_conversation(self, user_id: str, title: str, language: str) -> Dict[str, Any]:
        response = self.client.table("chat_conversations").insert(
            {
                "user_id": user_id,
                "title": title[:200] or "New conversation",
                "preferred_language": language,
            }
        ).execute()
        if not response.data:
            raise RuntimeError("Supabase did not return the created conversation.")
        return response.data[0]

    def get_messages(self, user_id: str, conversation_id: str) -> List[Dict[str, Any]]:
        response = self.client.table("chat_messages").select(
            "id,conversation_id,user_id,role,content,language,created_at"
        ).eq("user_id", user_id).eq("conversation_id", conversation_id).order(
            "created_at"
        ).execute()
        return response.data or []

    def get_conversation(self, user_id: str, conversation_id: str) -> Optional[Dict[str, Any]]:
        response = self.client.table("chat_conversations").select(
            "id,title,preferred_language,created_at,updated_at"
        ).eq("id", conversation_id).eq("user_id", user_id).maybe_single().execute()
        return response.data

    def add_message(
        self,
        user_id: str,
        conversation_id: str,
        role: str,
        content: str,
        language: str,
    ) -> Dict[str, Any]:
        if role not in {"user", "assistant"}:
            raise ValueError("Chat messages must have a user or assistant role.")
        response = self.client.table("chat_messages").insert(
            {
                "conversation_id": conversation_id,
                "user_id": user_id,
                "role": role,
                "content": content,
                "language": language,
            }
        ).execute()
        if not response.data:
            raise RuntimeError("Supabase did not return the saved message.")
        return response.data[0]


supabase_service = SupabaseService()
