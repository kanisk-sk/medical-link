import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/react';
import { useAuthStore } from '../store/authStore';
import { AssistantMessage, QuickPrompt, ThemeMode, VitalsContext } from '../types/assistant';
import { Language, SehatLinkRole } from '../types';
import { streamAssistantChat, fetchQuickPrompts, fetchAssistantHealth } from '../services/assistantService';

const LOCAL_STORAGE_KEY = 'sehatlink_ai_assistant_history_v1';
const THEME_STORAGE_KEY = 'sehatlink_ai_assistant_theme';

export function useAiAssistant() {
  const location = useLocation();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const userRole = (useAuthStore((state) => state.getSelectedRole(user?.id ?? null)) || 'patient') as SehatLinkRole;
  const userLanguage = (useAuthStore((state) => state.language) || 'pa') as Language;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [quickPrompts, setQuickPrompts] = useState<QuickPrompt[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [themeMode, setThemeMode] = useState<ThemeMode>('vintage-light');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [groqConfigured, setGroqConfigured] = useState<boolean>(true);

  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load backend health check
  useEffect(() => {
    fetchAssistantHealth().then((health) => {
      setGroqConfigured(health.groq_api_configured);
    });
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  // Load saved message history or set initial welcome message
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved chat history', e);
      }
    }

    // Default welcome message if no history exists
    const welcomeMsg: AssistantMessage = {
      id: 'welcome-0',
      role: 'assistant',
      content: userLanguage === 'pa'
        ? "ਜੀ ਆਇਆਂ ਨੂੰ! ਮੈਂ **ਸਿਹਤ ਸਹਾਇਕ** (SehatLink Rural Health AI) ਹਾਂ। ਮੈਂ ਬੁਖਾਰ, ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ, ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਦਵਾਈਆਂ ਅਤੇ ਐਮਰਜੈਂਸੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦੇ ਹੋ?"
        : userLanguage === 'hi'
        ? "नमस्ते! मैं **सेहत सहायक** (SehatLink AI) हूँ। मैं लक्षण जांच, जन औषधि दवाओं और नाभा स्वास्थ्य सेवाओं में आपकी सहायता के लिए तैयार हूँ।"
        : "Welcome! I am **Sehat Sahayak** (SehatLink Rural Health AI Assistant). How can I assist you with symptoms, generic medicine lookup, or rural healthcare today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
  }, [userLanguage]);

  // Persist messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  // Load context-aware quick prompts
  useEffect(() => {
    fetchQuickPrompts(userRole, userLanguage, location.pathname).then((prompts) => {
      setQuickPrompts(prompts);
    });
  }, [userRole, userLanguage, location.pathname]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const next = prev === 'vintage-light' ? 'vintage-dark' : 'vintage-light';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Speech Recognition (Voice Input)
  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(userLanguage === 'pa' ? 'ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਰਿਕਾਰਡਿੰਗ ਸਪੋਰਟ ਨਹੀਂ ਹੈ।' : 'Voice recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = userLanguage === 'pa' ? 'pa-IN' : userLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  }, [isListening, userLanguage]);

  // Speech Synthesis (Read Aloud)
  const speakMessage = useCallback((messageId: string, text: string) => {
    if (!speechSynthRef.current) return;

    if (currentlySpeakingId === messageId && isSpeaking) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      return;
    }

    speechSynthRef.current.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = text.replace(/[*#_`~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = userLanguage === 'pa' ? 'pa-IN' : userLanguage === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95; // Slightly slower pace for rural accessibility

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    };

    setIsSpeaking(true);
    setCurrentlySpeakingId(messageId);
    speechSynthRef.current.speak(utterance);
  }, [currentlySpeakingId, isSpeaking, userLanguage]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
    setIsSpeaking(false);
    setCurrentlySpeakingId(null);
  }, []);

  // Send message and stream AI response
  const sendMessage = useCallback(async (contentToSend?: string, vitalsContext?: VitalsContext) => {
    const text = (contentToSend || inputText).trim();
    if (!text || isStreaming) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = `asst-${Date.now()}`;
    const initialAssistantMsg: AssistantMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, initialAssistantMsg]);
    setInputText('');
    setIsStreaming(true);

    let token: string | null = null;
    try {
      token = await getToken();
    } catch (e) {
      console.warn('Could not retrieve Clerk token, continuing with guest dev token:', e);
    }

    await streamAssistantChat({
      messages: nextMessages,
      role: userRole,
      language: userLanguage,
      currentPage: location.pathname,
      vitalsContext,
      authToken: token,
      onChunk: (chunk) => {
        setMessages((prev) => {
          return prev.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                content: m.content + chunk
              };
            }
            return m;
          });
        });
      },
      onEmergencyDetected: (notice) => {
        setMessages((prev) => {
          return prev.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                emergencyFlag: true
              };
            }
            return m;
          });
        });
      },
      onDone: (info) => {
        setIsStreaming(false);
        setMessages((prev) => {
          return prev.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                isStreaming: false,
                model: info.model
              };
            }
            return m;
          });
        });
      },
      onError: (errMessage) => {
        setIsStreaming(false);
        setMessages((prev) => {
          return prev.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                content: m.content || `⚠️ [ਨੈੱਟਵਰਕ ਸੁਨੇਹਾ / Network Notice]: ${errMessage}`,
                isStreaming: false,
                error: true
              };
            }
            return m;
          });
        });
      }
    });
  }, [inputText, isStreaming, messages, userRole, userLanguage, location.pathname, getToken]);

  const clearChat = useCallback(() => {
    stopSpeaking();
    const defaultWelcome: AssistantMessage = {
      id: 'welcome-reset',
      role: 'assistant',
      content: userLanguage === 'pa'
        ? "ਗੱਲਬਾਤ ਰੀਸੈੱਟ ਹੋ ਗਈ ਹੈ। ਨਵਾਂ ਸਵਾਲ ਪੁੱਛੋ।"
        : "Conversation history cleared. How can I help you?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([defaultWelcome]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [userLanguage, stopSpeaking]);

  return {
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
    isStreaming,
    messages,
    quickPrompts,
    inputText,
    setInputText,
    isOffline,
    themeMode,
    toggleTheme,
    isSpeaking,
    isListening,
    currentlySpeakingId,
    toggleListening,
    speakMessage,
    stopSpeaking,
    sendMessage,
    clearChat,
    userRole,
    userLanguage,
    groqConfigured
  };
}
