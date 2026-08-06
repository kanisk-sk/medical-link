import React from 'react';
import { Card } from '../components/common/Card';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { UserCheck, ShieldCheck, Globe, Bell, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSehatLinkIdentity } from '../hooks/useSehatLinkIdentity';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { name, phone, abhaId } = useSehatLinkIdentity();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-denim">
          ⚙️ Account & Application Settings
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          Manage language preferences, ABHA health ID, and notification options
        </p>
      </div>

      <Card variant="paper" className="p-6 space-y-6">
        {/* Profile Card */}
        <div className="flex items-center space-x-4 border-b border-parchment-dark pb-4">
          <div className="w-14 h-14 rounded-full bg-brick text-white flex items-center justify-center font-serif font-bold text-xl shadow-md">
            {name ? name[0] : 'S'}
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal">{name}</h3>
            <p className="text-xs font-mono text-charcoal-light">Phone: {phone || '—'}</p>
            <p className="text-xs font-mono text-olive font-bold">ABHA: {abhaId}</p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-serif font-bold text-olive uppercase tracking-wider">
            {t('language')}
          </label>
          <LanguageToggle />
        </div>

        {/* Privacy & Compliance Summary */}
        <div className="bg-olive/10 p-4 rounded-lg border border-olive/30 space-y-1">
          <div className="flex items-center space-x-2 text-olive-dark font-serif font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-olive" />
            <span>Digital Personal Data Protection (DPDP Act 2023)</span>
          </div>
          <p className="text-[11px] font-serif text-charcoal-light leading-relaxed">
            All your medical data, audio notes, and prescription logs are end-to-end encrypted and consent-managed under ABDM standards.
          </p>
        </div>
      </Card>
    </div>
  );
};
