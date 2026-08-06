import React from 'react';
import { Mic, MicOff, Square, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface VoiceInputProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  onStart,
  onStop,
  onReset,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6">
      {/* Animated Pulsing Mic Button */}
      <div className="relative">
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-4 rounded-full bg-brick/30 pointer-events-none"
          />
        )}

        <button
          onClick={isListening ? onStop : onStart}
          disabled={disabled}
          className={`relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-vintage-lg ${
            isListening
              ? 'bg-brick text-white scale-105 border-4 border-brick-dark'
              : 'bg-cream-light text-brick hover:bg-parchment border-4 border-denim hover:scale-102'
          }`}
          aria-label={isListening ? t('symptoms.stop') : t('symptoms.tapToSpeak')}
        >
          {isListening ? (
            <>
              <Square className="w-10 h-10 md:w-12 md:h-12 fill-current mb-1" />
              <span className="text-xs font-bold font-serif uppercase tracking-wider">
                {t('symptoms.stop')}
              </span>
            </>
          ) : (
            <>
              <Mic className="w-12 h-12 md:w-14 md:h-14 stroke-[2.2] mb-1 animate-pulse-slow" />
              <span className="text-xs font-bold font-serif uppercase tracking-wider text-center px-2">
                {t('symptoms.tapToSpeak')}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Voice Status Feedback */}
      <div className="text-center">
        {isListening ? (
          <div className="flex items-center justify-center space-x-2 text-brick font-serif font-bold text-lg animate-pulse">
            <span className="w-3 h-3 rounded-full bg-brick inline-block" />
            <span>{t('symptoms.listening')}</span>
          </div>
        ) : (
          <p className="text-sm font-serif text-charcoal-light max-w-sm">
            {t('symptoms.instruction')}
          </p>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onReset}
          className="text-xs flex items-center space-x-1 px-3 py-1.5 rounded-md bg-parchment/80 hover:bg-parchment text-charcoal border border-parchment-dark transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Voice Input</span>
        </button>
      </div>
    </div>
  );
};
