import React, { useRef, useEffect } from 'react';
import { VintageSealBadge } from './VintageSealBadge';
import { AiAssistantMessageList } from './AiAssistantMessageList';
import { AiAssistantQuickPrompts } from './AiAssistantQuickPrompts';
import { AiAssistantInput } from './AiAssistantInput';
import { AssistantMessage, QuickPrompt, ThemeMode } from '../../types/assistant';
import { X, Sun, Moon, Trash2, WifiOff, AlertCircle } from 'lucide-react';
import { SehatLinkRole } from '../../types';

interface AiAssistantChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AssistantMessage[];
  quickPrompts: QuickPrompt[];
  inputText: string;
  setInputText: (val: string) => void;
  onSend: (text?: string) => void;
  isStreaming: boolean;
  isOffline: boolean;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  isListening: boolean;
  onToggleListening: () => void;
  onSpeak: (id: string, text: string) => void;
  currentlySpeakingId: string | null;
  isSpeaking: boolean;
  onClearChat: () => void;
  userRole: SehatLinkRole;
  userLanguage: string;
  groqConfigured: boolean;
}

export const AiAssistantChatWindow: React.FC<AiAssistantChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  quickPrompts,
  inputText,
  setInputText,
  onSend,
  isStreaming,
  isOffline,
  themeMode,
  onToggleTheme,
  isListening,
  onToggleListening,
  onSpeak,
  currentlySpeakingId,
  isSpeaking,
  onClearChat,
  userRole,
  userLanguage,
  groqConfigured
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const isDark = themeMode === 'vintage-dark';

  const getRoleTitle = (role: SehatLinkRole) => {
    switch (role) {
      case 'health_worker':
        return 'ਆਸ਼ਾ / ASHA Worker';
      case 'doctor':
        return 'Medical Doctor';
      case 'pharmacist':
        return 'Pharmacist';
      case 'admin':
        return 'Admin';
      default:
        return 'Patient Mode';
    }
  };

  return (
    <div
      className={`fixed bottom-[90px] md:bottom-24 right-2 sm:right-6 z-50 w-[96vw] max-w-[440px] h-[580px] max-h-[78vh] flex flex-col rounded-xl border-2 shadow-vintage-lg transition-all duration-300 overflow-hidden ${
        isDark
          ? 'bg-charcoal-dark border-vintage-gold text-cream-light'
          : 'bg-vintage-paper border-denim text-charcoal'
      }`}
    >
      {/* Header Bar */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between shrink-0 shadow-sm ${
          isDark
            ? 'bg-charcoal border-vintage-gold/40 text-cream-light'
            : 'bg-denim text-cream border-vintage-gold/50'
        }`}
      >
        {/* Brand Title */}
        <div className="flex items-center gap-2.5">
          <VintageSealBadge size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-sm tracking-wide text-vintage-gold">
                {userLanguage === 'pa' ? 'ਸਿਹਤ ਸਹਾਇਕ' : 'Sehat Sahayak'}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-vintage-gold/20 text-vintage-gold border border-vintage-gold/40">
                AI 1.0
              </span>
            </div>
            <p className="text-[11px] text-cream-light/80 font-sans">
              {getRoleTitle(userRole)} • Rural Health
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title="Toggle Vintage Theme Mode"
            className="p-1.5 rounded hover:bg-white/10 text-cream transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-vintage-gold" /> : <Moon className="w-4 h-4 text-cream" />}
          </button>

          {/* Clear Conversation */}
          <button
            onClick={onClearChat}
            title="Clear Chat History"
            className="p-1.5 rounded hover:bg-white/10 text-cream/80 hover:text-brick transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close Window */}
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 rounded hover:bg-white/10 text-cream transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Offline Status Banner */}
      {isOffline && (
        <div className="bg-warning-amber/20 border-b border-warning-amber px-3 py-1.5 text-xs flex items-center gap-2 text-warning-amber font-serif shrink-0">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>
            {userLanguage === 'pa'
              ? 'ਔਫਲਾਈਨ ਮੋਡ: ਸਥਾਨਕ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਮਦਦ ਦਿੱਤੀ ਜਾ ਰਹੀ ਹੈ।'
              : 'Offline Mode: Utilizing local rural medical rules.'}
          </span>
        </div>
      )}

      {/* Groq Fallback Mode Notice if Key is missing */}
      {!groqConfigured && !isOffline && (
        <div className="bg-olive/20 border-b border-olive px-3 py-1 text-[11px] flex items-center gap-1.5 text-olive dark:text-cream-light shrink-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Backend running with domain-tailored rural assistant fallback.</span>
        </div>
      )}

      {/* Scrollable Message List */}
      <AiAssistantMessageList
        messages={messages}
        themeMode={themeMode}
        onSpeak={onSpeak}
        currentlySpeakingId={currentlySpeakingId}
        isSpeaking={isSpeaking}
        userLanguage={userLanguage}
      />
      <div ref={messagesEndRef} />

      {/* Quick Prompts Bar */}
      <AiAssistantQuickPrompts
        prompts={quickPrompts}
        onSelectPrompt={(promptText) => onSend(promptText)}
        themeMode={themeMode}
        disabled={isStreaming}
      />

      {/* Input Bar */}
      <AiAssistantInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={() => onSend()}
        isStreaming={isStreaming}
        isListening={isListening}
        onToggleListening={onToggleListening}
        themeMode={themeMode}
        userLanguage={userLanguage}
      />
    </div>
  );
};
