import React from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { ThemeMode } from '../../types/assistant';

interface AiAssistantInputProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  themeMode: ThemeMode;
  userLanguage: string;
}

export const AiAssistantInput: React.FC<AiAssistantInputProps> = ({
  inputText,
  setInputText,
  onSend,
  isStreaming,
  isListening,
  onToggleListening,
  themeMode,
  userLanguage
}) => {
  const isDark = themeMode === 'vintage-dark';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`p-3 border-t border-vintage-gold/30 ${isDark ? 'bg-charcoal-dark' : 'bg-cream-light'}`}>
      <div className="flex items-end gap-2">
        {/* Microphone / Dictation Button */}
        <button
          type="button"
          onClick={onToggleListening}
          disabled={isStreaming}
          title={userLanguage === 'pa' ? 'ਬੋਲ ਕੇ ਲਿਖੋ (Voice Input)' : 'Voice Input'}
          className={`p-2.5 rounded-lg border transition-all shrink-0 active:scale-95 ${
            isListening
              ? 'bg-brick border-vintage-gold text-white animate-pulse'
              : isDark
              ? 'bg-charcoal border-olive/50 text-vintage-gold hover:bg-olive-dark'
              : 'bg-parchment border-denim/40 text-denim hover:bg-cream-dark'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? userLanguage === 'pa'
                  ? 'ਸੁਣ ਰਿਹਾ ਹੈ... (Listening...)'
                  : 'Listening to speech...'
                : userLanguage === 'pa'
                ? 'ਆਪਣੇ ਸਿਹਤ ਸਵਾਲ ਪੁੱਛੋ...'
                : 'Ask your health question...'
            }
            disabled={isStreaming}
            className={`w-full p-2.5 pr-10 text-xs sm:text-sm font-sans rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-vintage-gold transition-all ${
              isDark
                ? 'bg-charcoal border-olive/50 text-cream placeholder-cream-dark/50'
                : 'bg-warm-white border-denim/40 text-charcoal placeholder-charcoal-light/60'
            }`}
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={isStreaming || !inputText.trim()}
          className={`p-2.5 rounded-lg border transition-all shrink-0 font-serif font-bold text-xs flex items-center justify-center min-w-[42px] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-vintage-gold border-vintage-gold text-charcoal-dark hover:bg-yellow-600'
              : 'bg-denim border-denim text-cream hover:bg-denim-dark'
          }`}
        >
          {isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
