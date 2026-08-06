import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PharmacySearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const PharmacySearch: React.FC<PharmacySearchProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-light">
        <Search className="w-5 h-5 text-olive" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('pharmacy.searchPlaceholder')}
        className="w-full pl-11 pr-4 py-3 bg-warm-white border-2 border-parchment-dark rounded-xl text-charcoal text-base placeholder-charcoal-light/60 shadow-vintage focus:border-denim focus:outline-none focus:ring-2 focus:ring-denim/20 transition-all"
      />
    </div>
  );
};
