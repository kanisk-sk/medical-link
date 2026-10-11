import { AssistantMessage, AssistantHealthStatus, QuickPrompt, VitalsContext } from '../types/assistant';
import { Language, SehatLinkRole } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchAssistantHealth(): Promise<AssistantHealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/api/assistant/health`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return {
      status: 'fallback_mode',
      groq_api_configured: false,
      model: 'offline-local-mode',
      app_name: 'SehatLink Telemedicine',
      environment: 'offline'
    };
  }
}

export async function fetchQuickPrompts(
  role: SehatLinkRole = 'patient',
  language: Language = 'pa',
  page?: string
): Promise<QuickPrompt[]> {
  try {
    const url = new URL(`${API_BASE}/api/assistant/prompts`);
    url.searchParams.append('role', role);
    url.searchParams.append('language', language);
    if (page) {
      url.searchParams.append('page', page);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    // Local fallback prompts if backend is unreachable
    if (language === 'ta') {
      return [
        {
          id: 'fb1_ta',
          label: 'காய்ச்சல் & அறிகுறி உதவி',
          prompt: 'எனக்கு 2 நாட்களாக காய்ச்சல் உள்ளது. நான் என்ன செய்ய வேண்டும்?',
          category: 'symptoms',
          language: 'ta'
        },
        {
          id: 'fb2_ta',
          label: 'மக்கள் மருந்தகம் (Jan Aushadhi)',
          prompt: 'மக்கள் மருந்தகத்தில் கிடைக்கும் குறைந்த விலை மருந்துகள் பற்றி கூறுக.',
          category: 'dosage',
          language: 'ta'
        },
        {
          id: 'fb3_ta',
          label: '108 அவசர ஆம்புலன்ஸ்',
          prompt: 'அவசர நிலையில் 108 ஆம்புலன்ஸை எவ்வாறு அழைப்பது?',
          category: 'emergency',
          language: 'ta'
        }
      ];
    }
    if (language === 'pa') {
      return [
        {
          id: 'fb1',
          label: 'ਬੁਖਾਰ ਅਤੇ ਲੱਛਣ ਮਦਦ',
          prompt: 'ਮੈਨੂੰ 2 ਦਿਨਾਂ ਤੋਂ ਬੁਖਾਰ ਹੈ। ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
          category: 'symptoms',
          language: 'pa'
        },
        {
          id: 'fb2',
          label: 'ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਨਾਭਾ',
          prompt: 'ਨਾਭਾ ਵਿੱਚ ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਤੋਂ ਜੈਨਰਿਕ ਦਵਾਈਆਂ ਦੀ ਜਾਣਕਾਰੀ ਦਿਓ।',
          category: 'dosage',
          language: 'pa'
        },
        {
          id: 'fb3',
          label: 'ਐਮਰਜੈਂਸੀ 108 ਐਂਬੂਲੈਂਸ',
          prompt: 'ਐਮਰਜੈਂਸੀ ਵਿੱਚ 108 ਐਂਬੂਲੈਂਸ ਕਿਵੇਂ ਬੁਲਾਈਏ?',
          category: 'emergency',
          language: 'pa'
        }
      ];
    }
    return [
      {
        id: 'fb1_en',
        label: 'Fever & Symptom Care',
        prompt: 'I have fever for 2 days. What home precautions should I take?',
        category: 'symptoms',
        language: 'en'
      },
      {
        id: 'fb2_en',
        label: 'Jan Aushadhi Generic Meds',
        prompt: 'What essential medicines are in stock at Jan Aushadhi Kendra?',
        category: 'dosage',
        language: 'en'
      },
      {
        id: 'fb3_en',
        label: '108 Emergency',
        prompt: 'How to request urgent 108 ambulance dispatch?',
        category: 'emergency',
        language: 'en'
      }
    ];
  }
}

export interface StreamChatParams {
  messages: AssistantMessage[];
  role: SehatLinkRole;
  language: Language;
  currentPage?: string;
  vitalsContext?: VitalsContext;
  authToken?: string | null;
  onChunk: (textChunk: string) => void;
  onEmergencyDetected?: (notice?: string) => void;
  onDone?: (info: { model?: string; executionTimeMs?: number }) => void;
  onError?: (errMessage: string) => void;
}

export async function streamAssistantChat(params: StreamChatParams): Promise<void> {
  const {
    messages,
    role,
    language,
    currentPage,
    vitalsContext,
    authToken,
    onChunk,
    onEmergencyDetected,
    onDone,
    onError
  } = params;

  const payload = {
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
      id: m.id
    })),
    user_role: role,
    language: language,
    current_page: currentPage,
    stream: true,
    vitals_context: vitalsContext
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}/api/assistant/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned HTTP ${response.status}: ${errText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported or empty body received');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // keep remaining partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.substring(6);
          try {
            const data = JSON.parse(jsonStr);

            if (data.type === 'emergency_flag' && data.emergency_detected) {
              onEmergencyDetected?.(data.notice);
            }

            if (data.content) {
              onChunk(data.content);
            }

            if (data.done) {
              onDone?.({
                model: data.model,
                executionTimeMs: data.execution_time_ms
              });
            }
          } catch (e) {
            console.warn('Error parsing SSE json chunk:', e, jsonStr);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Stream Assistant Chat Error:', error);
    onError?.(error.message || 'Failed to communicate with AI Assistant backend.');
  }
}
