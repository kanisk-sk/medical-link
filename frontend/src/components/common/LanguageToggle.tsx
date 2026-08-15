import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { Language } from '../../types';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAuthStore();

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'hi', label: 'हिंदी' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-parchment/60 p-1 rounded-lg border border-parchment-dark shadow-inner">
      <Globe className="w-4 h-4 text-charcoal-light ml-1.5 hidden sm:inline-block" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
            language === lang.code
              ? 'bg-brick text-white shadow-sm font-bold'
              : 'text-charcoal-light hover:text-charcoal hover:bg-cream-light'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
