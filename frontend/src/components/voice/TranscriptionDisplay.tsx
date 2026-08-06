import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcript: string;
  interimTranscript: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcript,
  interimTranscript,
}) => {
  const { t } = useTranslation();

  const fullText = (transcript + ' ' + interimTranscript).trim();

  if (!fullText) return null;

  return (
    <div className="w-full bg-warm-white p-4 rounded-xl border-2 border-parchment-dark shadow-inner my-4">
      <div className="flex items-center justify-between border-b border-parchment-dark pb-2 mb-2">
        <span className="text-xs font-serif font-bold text-olive uppercase tracking-wider flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-brick animate-pulse" />
          {t('symptoms.extracted')}
        </span>
        <span className="text-[10px] font-mono text-charcoal-light bg-parchment px-2 py-0.5 rounded">
          Speech Transcribed
        </span>
      </div>

      <p className="text-base text-charcoal font-medium leading-relaxed">
        {transcript}
        {interimTranscript && (
          <span className="text-charcoal-light italic font-normal bg-yellow-100/60 px-1 rounded">
            {interimTranscript}
          </span>
        )}
      </p>
    </div>
  );
};
