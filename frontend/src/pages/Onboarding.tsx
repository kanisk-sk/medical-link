import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useUser } from '@clerk/react';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSehatLinkIdentity } from '../hooks/useSehatLinkIdentity';
import { getRoleHomePath } from '../utils/auth';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();
  const { profile, selectedRole } = useSehatLinkIdentity();
  const setProfile = useAuthStore((state) => state.setProfile);

  const [name, setName] = useState(profile?.name || user?.fullName || 'Gurpreet Singh');
  const [age, setAge] = useState(profile?.age ? String(profile.age) : '60');
  const [gender, setGender] = useState(profile?.gender || 'Male');
  const [phone, setPhone] = useState(profile?.phone || user?.phoneNumbers[0]?.phoneNumber || '+91 98765 43210');
  const [village, setVillage] = useState(profile?.village || 'Alhoran');
  const [abhaId, setAbhaId] = useState(profile?.abhaId || '91-4820-1928-3741');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      return;
    }

    setProfile({
      id: user.id,
      name,
      age: Number(age),
      gender,
      phone,
      village,
      abhaId,
      role: selectedRole ?? 'patient',
      language: profile?.language || 'pa',
    });

    navigate(getRoleHomePath(selectedRole ?? 'patient'));
  };

  return (
    <div className="max-w-md mx-auto py-4 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-brick">{t('onboarding.welcome')}</h1>
        <p className="text-xs font-serif text-charcoal-light">{t('onboarding.subtitle')}</p>
      </div>

      <Card variant="paper" className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('onboarding.fullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('onboarding.age')}
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1 font-serif">
                {t('onboarding.gender')}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg bg-warm-white border border-parchment-dark px-3 py-2.5 text-charcoal text-base min-h-[44px]"
              >
                <option value="Male">{t('onboarding.male')}</option>
                <option value="Female">{t('onboarding.female')}</option>
                <option value="Other">{t('onboarding.other')}</option>
              </select>
            </div>
          </div>

          <Input
            label={t('onboarding.mobile')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Input
            label="Village / Post Office (Rural Block)"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            required
          />

          <div className="bg-olive/10 p-3 rounded-lg border border-olive/30 space-y-2">
            <div className="flex items-center space-x-2 text-olive-dark font-serif font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-olive" />
              <span>ABHA Health ID Integration</span>
            </div>
            <Input
              label={t('onboarding.abhaId')}
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="e.g. 91-4820-1928-3741"
            />
            <p className="text-[10px] text-charcoal-light">
              Linking ABHA allows instant synchronization with National Health Stack lockers.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Save & Continue to Patient Home
          </Button>
        </form>
      </Card>
    </div>
  );
};
