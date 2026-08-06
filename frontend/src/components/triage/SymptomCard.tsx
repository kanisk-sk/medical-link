import React from 'react';
import { SymptomEntry } from '../../types';
import { AlertTriangle, Check, X } from 'lucide-react';

interface SymptomCardProps {
  symptom: SymptomEntry;
  onRemove?: (id: string) => void;
}

export const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, onRemove }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        symptom.isRedFlag
          ? 'bg-brick/10 border-brick text-brick'
          : 'bg-warm-white border-parchment-dark text-charcoal'
      }`}
    >
      <div className="flex items-center space-x-2.5">
        {symptom.isRedFlag ? (
          <AlertTriangle className="w-5 h-5 text-brick flex-shrink-0 animate-bounce" />
        ) : (
          <Check className="w-4 h-4 text-olive flex-shrink-0" />
        )}
        <div>
          <span className="font-serif font-semibold text-sm capitalize">{symptom.text}</span>
          {symptom.category && (
            <span className="ml-2 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-parchment text-charcoal-light">
              {symptom.category}
            </span>
          )}
        </div>
      </div>

      {onRemove && (
        <button
          onClick={() => onRemove(symptom.id)}
          className="p-1 rounded hover:bg-parchment text-charcoal-light hover:text-brick transition-colors"
          aria-label="Remove symptom"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
