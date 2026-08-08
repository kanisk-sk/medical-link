import React from 'react';
import { AssistantMessage, ThemeMode } from '../../types/assistant';
import { VintageSealBadge } from './VintageSealBadge';
import { Volume2, VolumeX, AlertOctagon, User, PhoneCall } from 'lucide-react';

interface AiAssistantMessageListProps {
  messages: AssistantMessage[];
  themeMode: ThemeMode;
  onSpeak: (id: string, text: string) => void;
  currentlySpeakingId: string | null;
  isSpeaking: boolean;
  userLanguage: string;
}

export const AiAssistantMessageList: React.FC<AiAssistantMessageListProps> = ({
  messages,
  themeMode,
  onSpeak,
  currentlySpeakingId,
  isSpeaking,
  userLanguage
}) => {
  const isDark = themeMode === 'vintage-dark';

  // Helper to format text with simple markdown (bold, lists, code, emergency alerts)
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Heading
          if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4 key={idx} className="font-serif font-bold text-sm sm:text-base text-denim dark:text-vintage-gold mt-2 mb-1">
                {headingText}
              </h4>
            );
          }

          // Bullet list item
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listText = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-brick dark:text-vintage-gold">•</span>
                <span>{renderInlineMarkdown(listText)}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineMarkdown(trimmed)}</p>;
        })}
      </div>
    );
  };

  const renderInlineMarkdown = (text: string) => {
    // Parse **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-charcoal-dark dark:text-cream">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
      {messages.map((msg) => {
        const isAssistant = msg.role === 'assistant';
        const isSpeakingThis = currentlySpeakingId === msg.id && isSpeaking;

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} transition-all`}
          >
            {/* Header Badge */}
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {isAssistant ? (
                <>
                  <VintageSealBadge size="sm" />
                  <span className="font-serif text-[11px] font-bold text-denim dark:text-vintage-gold">
                    {userLanguage === 'pa' ? 'ਸਿਹਤ ਸਹਾਇਕ (Sehat Sahayak)' : 'Sehat Sahayak AI'}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-serif text-[11px] font-bold text-olive dark:text-cream-dark">
                    {userLanguage === 'pa' ? 'ਤੁਸੀਂ (You)' : 'You'}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-olive/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-olive" />
                  </div>
                </>
              )}
              <span className="text-[10px] text-charcoal-light/70 dark:text-cream-dark/60 ml-1">
                {msg.timestamp}
              </span>
            </div>

            {/* Message Bubble Container */}
            <div
              className={`max-w-[88%] sm:max-w-[82%] p-3.5 rounded-lg border relative shadow-vintage transition-all ${
                isAssistant
                  ? isDark
                    ? 'bg-charcoal border-vintage-gold/60 text-cream-light'
                    : 'bg-vintage-paper border-denim/40 text-charcoal'
                  : isDark
                  ? 'bg-denim-dark border-vintage-gold text-cream-light'
                  : 'bg-brick text-white border-brick-dark'
              }`}
            >
              {/* Emergency Banner inside message */}
              {msg.emergencyFlag && (
                <div className="mb-2 p-2.5 rounded border border-emergency-red bg-emergency-red/10 flex items-start gap-2">
                  <AlertOctagon className="w-5 h-5 text-emergency-red shrink-0 mt-0.5 animate-bounce" />
                  <div className="flex-1">
                    <p className="text-xs font-bold font-serif text-emergency-red">
                      {userLanguage === 'pa' ? 'ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ!' : 'Critical Emergency Alert!'}
                    </p>
                    <a
                      href="tel:108"
                      className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emergency-red text-white rounded text-xs font-bold hover:bg-red-700 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{userLanguage === 'pa' ? 'Nabha 108 ਕਾਲ ਕਰੋ' : 'Call Nabha 108'}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Message Content */}
              {msg.isStreaming && !msg.content ? (
                <div className="flex items-center gap-2 py-1">
                  <span className="w-2 h-2 rounded-full bg-vintage-gold animate-ping" />
                  <span className="font-serif text-xs italic text-vintage-gold">
                    {userLanguage === 'pa' ? 'ਸੋਚ ਰਿਹਾ ਹੈ...' : 'Analyzing rural healthcare context...'}
                  </span>
                </div>
              ) : (
                renderFormattedContent(msg.content)
              )}

              {/* Audio Read-Aloud Button for Assistant Messages */}
              {isAssistant && msg.content && !msg.isStreaming && (
                <div className="mt-2.5 pt-1.5 border-t border-vintage-gold/20 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onSpeak(msg.id, msg.content)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                      isSpeakingThis
                        ? 'bg-brick text-white border-brick'
                        : isDark
                        ? 'bg-charcoal-dark border-olive/40 text-vintage-gold hover:bg-olive-dark'
                        : 'bg-cream-light border-denim/30 text-denim hover:bg-parchment'
                    }`}
                  >
                    {isSpeakingThis ? (
                      <>
                        <VolumeX className="w-3 h-3 animate-pulse" />
                        <span>{userLanguage === 'pa' ? 'ਰੋਕੋ' : 'Stop'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>{userLanguage === 'pa' ? 'ਸੁਣੋ (Listen)' : 'Read Aloud'}</span>
                      </>
                    )}
                  </button>

                  {msg.model && (
                    <span className="text-[9px] font-mono text-charcoal-light/60 dark:text-cream-dark/40">
                      {msg.model.includes('groq') || msg.model.includes('llama') ? 'Groq Llama-3' : 'Local Fallback'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
