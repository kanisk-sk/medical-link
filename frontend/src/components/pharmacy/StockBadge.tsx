import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface StockBadgeProps {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  if (status === 'in_stock') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-success-green/15 text-success-green border border-success-green/30">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{t('pharmacy.inStock')}</span>
      </span>
    );
  }

  if (status === 'low_stock') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-warning-amber/20 text-yellow-950 border border-warning-amber/40">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>{t('pharmacy.lowStock')}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-brick/15 text-brick border border-brick/30">
      <XCircle className="w-3.5 h-3.5" />
      <span>{t('pharmacy.outOfStock')}</span>
    </span>
  );
};
