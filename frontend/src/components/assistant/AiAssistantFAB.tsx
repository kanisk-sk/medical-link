import React from 'react';
import { VintageSealBadge } from './VintageSealBadge';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { ThemeMode } from '../../types/assistant';

interface AiAssistantFABProps {
  isOpen: boolean;
  onClick: () => void;
  isStreaming: boolean;
  themeMode: ThemeMode;
  userLanguage: string;
}

export const AiAssistantFAB: React.FC<AiAssistantFABProps> = ({
  isOpen,
  onClick,
  isStreaming,
  themeMode,
  userLanguage
}) => {
  const isDark = themeMode === 'vintage-dark';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 pointer-events-auto">
      {/* Label Pill on Desktop */}
      {!isOpen && (
        <div
          onClick={onClick}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-serif font-bold tracking-wide border-2 cursor-pointer transition-all duration-300 shadow-vintage hover:scale-105 ${
            isDark
              ? 'bg-charcoal-dark border-vintage-gold text-cream-light'
              : 'bg-cream-light border-denim text-denim-dark'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
          <span>{userLanguage === 'pa' ? 'ਸਿਹਤ ਸਹਾਇਕ AI' : 'Sehat Sahayak AI'}</span>
        </div>
      )}

      {/* Main Floating Action Button */}
      <button
        onClick={onClick}
        aria-label="Toggle Sehat Sahayak AI Assistant"
        className={`relative group flex items-center justify-center p-3 sm:p-3.5 rounded-full border-2 transition-all duration-300 transform active:scale-95 shadow-vintage-lg ${
          isOpen
            ? 'bg-brick border-vintage-gold text-white rotate-90'
            : isDark
            ? 'bg-denim-dark border-vintage-gold text-cream-light hover:border-cream'
            : 'bg-denim border-vintage-gold text-cream hover:bg-denim-dark'
        }`}
      >
        {/* Pulsing Aura Ring when Assistant is active/streaming */}
        {isStreaming && (
          <span className="absolute -inset-1 rounded-full border-2 border-vintage-gold animate-ping opacity-75" />
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-cream" />
        ) : (
          <div className="flex items-center justify-center">
            <VintageSealBadge size="sm" />
            <span className="ml-1.5 font-serif text-sm font-bold text-vintage-gold hidden md:inline">
              AI
            </span>
          </div>
        )}

        {/* Vintage Stamp Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brick text-[10px] text-white font-bold items-center justify-center border border-cream">
              +
            </span>
          </span>
        )}
      </button>
    </div>
  );
};
