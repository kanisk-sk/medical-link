import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { StethoscopeLogo } from '../components/common/StethoscopeLogo';
import { AuthLoading } from '../components/auth/AuthLoading';
import { useAuthStore } from '../store/authStore';
import { getRoleHomePath, resolvePostAuthPath } from '../utils/auth';
import { SehatLinkRole } from '../types';
import { useTranslation } from 'react-i18next';

const ROLE_CARDS: Array<{
  role: Exclude<SehatLinkRole, 'admin'>;
  titleKey: string;
  descriptionKey: string;
}> = [
  { role: 'patient', titleKey: 'auth.roles.patient.title', descriptionKey: 'auth.roles.patient.description' },
  { role: 'doctor', titleKey: 'auth.roles.doctor.title', descriptionKey: 'auth.roles.doctor.description' },
  { role: 'health_worker', titleKey: 'auth.roles.healthWorker.title', descriptionKey: 'auth.roles.healthWorker.description' },
  { role: 'pharmacist', titleKey: 'auth.roles.pharmacist.title', descriptionKey: 'auth.roles.pharmacist.description' },
];

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const setSelectedRole = useAuthStore((state) => state.setSelectedRole);
  const selectedRole = useAuthStore((state) => state.getSelectedRole(user?.id ?? null));

  useEffect(() => {
    if (!isLoaded || isSignedIn) {
      return;
    }

    navigate('/login', { replace: true, state: { from: location } });
  }, [isLoaded, isSignedIn, location, navigate]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !selectedRole) {
      return;
    }

    const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    navigate(resolvePostAuthPath(selectedRole, requestedPath), { replace: true });
  }, [isLoaded, isSignedIn, location.state, navigate, selectedRole]);

  if (!isLoaded || !isSignedIn || selectedRole) {
    return <AuthLoading message={t('session.loading')} />;
  }

  const handleChooseRole = (role: Exclude<SehatLinkRole, 'admin'>) => {
    if (!user?.id) {
      return;
    }

    setSelectedRole(user.id, role);
    const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    navigate(resolvePostAuthPath(role, requestedPath), { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-60 bg-paper-grain pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="flex items-center gap-2 text-denim font-bold font-serif">
            <StethoscopeLogo size={36} animate={false} />
            <span>{t('appName')}</span>
          </Link>
          <LanguageToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card variant="paper" className="p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-olive">{t('auth.roles.badge')}</p>
              <h1 className="text-3xl font-bold font-serif text-denim">{t('auth.roles.heading')}</h1>
              <p className="text-sm font-serif text-charcoal-light max-w-2xl">{t('auth.roles.subheading')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {ROLE_CARDS.map((item, index) => (
                <motion.button
                  key={item.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * index }}
                  onClick={() => handleChooseRole(item.role)}
                  className="text-left rounded-2xl border-2 border-parchment-dark bg-warm-white p-5 hover:border-denim hover:bg-cream-light focus:outline-none focus:ring-2 focus:ring-denim/40 min-h-[144px] shadow-sm transition-all"
                >
                  <p className="text-lg font-bold font-serif text-charcoal">{t(item.titleKey)}</p>
                  <p className="mt-2 text-sm font-serif text-charcoal-light leading-6">{t(item.descriptionKey)}</p>
                </motion.button>
              ))}
            </div>

            <div className="rounded-2xl border border-parchment-dark bg-cream-light p-4 text-sm font-serif text-charcoal-light">
              <p className="font-bold text-charcoal mb-1">{t('auth.roles.adminNoteTitle')}</p>
              <p>{t('auth.roles.adminNote')}</p>
            </div>

            <div className="text-sm font-serif text-charcoal-light">
              {t('auth.roles.cancelPrompt')}{' '}
              <button
                type="button"
                onClick={() => navigate(getRoleHomePath(selectedRole), { replace: true })}
                className="text-denim font-semibold hover:text-denim-dark focus:outline-none focus:underline"
              >
                {t('auth.roles.skipAction')}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};