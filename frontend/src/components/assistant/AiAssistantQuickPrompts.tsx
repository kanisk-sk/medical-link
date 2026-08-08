import React from 'react';
import { QuickPrompt, ThemeMode } from '../../types/assistant';
import { Stethoscope, Pill, AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';

interface AiAssistantQuickPromptsProps {
  prompts: QuickPrompt[];
  onSelectPrompt: (promptText: string) => void;
  themeMode: ThemeMode;
  disabled?: boolean;
}

export const AiAssistantQuickPrompts: React.FC<AiAssistantQuickPromptsProps> = ({
  prompts,
  onSelectPrompt,
  themeMode,
  disabled = false
}) => {
  if (!prompts || prompts.length === 0) return null;

  const isDark = themeMode === 'vintage-dark';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'symptoms':
        return <Stethoscope className="w-3.5 h-3.5 text-brick shrink-0" />;
      case 'dosage':
        return <Pill className="w-3.5 h-3.5 text-olive shrink-0" />;
      case 'emergency':
        return <AlertTriangle className="w-3.5 h-3.5 text-emergency-red shrink-0" />;
      case 'asha_intake':
        return <ShieldAlert className="w-3.5 h-3.5 text-denim shrink-0" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-vintage-gold shrink-0" />;
    }
  };

  return (
    <div className="px-3 py-2 border-t border-vintage-gold/20 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 whitespace-nowrap">
        {prompts.map((item) => (
          <button
            key={item.id}
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif border transition-all duration-200 shadow-sm shrink-0 active:scale-95 disabled:opacity-50 ${
              isDark
                ? 'bg-charcoal border-olive/40 text-cream-light hover:bg-olive-dark hover:border-vintage-gold'
                : 'bg-cream-light border-denim/30 text-charcoal hover:bg-parchment hover:border-denim'
            }`}
          >
            {getCategoryIcon(item.category)}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
