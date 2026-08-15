import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignUp, useAuth, useUser } from '@clerk/react';
import { motion } from 'framer-motion';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { StethoscopeLogo } from '../components/common/StethoscopeLogo';
import { Card } from '../components/common/Card';
import { useAuthStore } from '../store/authStore';
import { resolvePostAuthPath } from '../utils/auth';
import { useTranslation } from 'react-i18next';

const authAppearance = {
  layout: {
    socialButtonsPlacement: 'bottom' as const,
  },
  variables: {
    colorPrimary: '#324A66',
    colorText: '#333333',
    colorBackground: 'transparent',
    borderRadius: '14px',
  },
  elements: {
    cardBox: 'bg-transparent shadow-none border-0 p-0 w-full',
    headerTitle: 'text-charcoal font-serif text-2xl font-bold tracking-tight',
    headerSubtitle: 'text-charcoal-light font-serif text-sm',
    formButtonPrimary:
      'bg-brick hover:bg-brick-dark text-white border border-brick-dark shadow-sm min-h-[44px] font-semibold',
    formFieldInput:
      'bg-warm-white border border-parchment-dark text-charcoal min-h-[44px] focus:border-denim focus:ring-denim/20',
    footerActionLink: 'text-denim hover:text-denim-dark font-semibold',
    identityPreviewText: 'text-charcoal font-serif',
    socialButtonsBlockButton:
      'bg-warm-white border border-parchment-dark text-charcoal hover:bg-parchment min-h-[44px]',
    dividerLine: 'bg-parchment-dark',
    dividerText: 'text-charcoal-light',
  },
};

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const selectedRole = useAuthStore((state) => state.getSelectedRole(user?.id ?? null));

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    const target = selectedRole ? resolvePostAuthPath(selectedRole, requestedPath) : '/select-role';
    navigate(target, { replace: true });
  }, [isLoaded, isSignedIn, location.state, navigate, selectedRole]);

  return (
    <div className="min-h-screen bg-cream text-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-60 bg-paper-grain pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="flex items-center gap-2 text-denim font-bold font-serif">
            <StethoscopeLogo size={36} animate={false} />
            <span>{t('appName')}</span>
          </Link>
          <LanguageToggle />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch min-h-[calc(100vh-110px)] pb-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Card variant="paper" className="h-full p-6 sm:p-8 lg:p-10 overflow-hidden relative">
              <div className="absolute inset-0 opacity-60 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(161,76,65,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(50,74,102,0.08),transparent_28%)]" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <StethoscopeLogo size={52} animate={true} />
                  <div>
                    <p className="text-3xl font-bold font-serif text-brick">SehatLink</p>
                    <p className="text-sm font-serif text-olive-dark">Digital Medical Consulting Platform</p>
                  </div>
                </div>

                <div className="space-y-3 max-w-xl">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-denim leading-tight">
                    {t('auth.signup.heroTitle')}
                  </h1>
                  <p className="text-sm sm:text-base font-serif text-charcoal-light leading-7">
                    {t('auth.signup.heroCopy')}
                  </p>
                </div>

                <div className="bg-warm-white/85 border border-parchment-dark rounded-2xl p-4 sm:p-5 shadow-vintage">
                  <svg viewBox="0 0 520 180" className="w-full h-auto text-denim" aria-hidden="true">
                    <motion.path
                      d="M48 96 C 112 24, 164 24, 220 96 S 326 168, 384 96 S 454 24, 486 64"
                      fill="none"
                      stroke="#324A66"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, ease: 'easeInOut' }}
                    />
                    <circle cx="48" cy="96" r="7" fill="#A14C41" />
                    <circle cx="220" cy="96" r="7" fill="#707B67" />
                    <circle cx="384" cy="96" r="7" fill="#324A66" />
                    <motion.circle
                      cx="486"
                      cy="64"
                      r="10"
                      fill="#EDE4D3"
                      stroke="#324A66"
                      strokeWidth="2"
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <text x="40" y="132" className="fill-charcoal text-[14px] font-serif">Village</text>
                    <text x="194" y="132" className="fill-charcoal text-[14px] font-serif">Health Worker</text>
                    <text x="366" y="132" className="fill-charcoal text-[14px] font-serif">Hospital</text>
                    <text x="456" y="132" className="fill-charcoal text-[14px] font-serif">Doctor</text>
                  </svg>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm font-medium">
                  {[
                    t('auth.login.trust.secure'),
                    t('auth.login.trust.languages'),
                    t('auth.login.trust.ruralFirst'),
                    t('auth.login.trust.support'),
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 bg-cream-light/90 border border-parchment-dark rounded-xl px-3 py-2.5">
                      <span className="text-olive font-bold">✓</span>
                      <span className="text-charcoal leading-5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <Card variant="paper" className="h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="space-y-2 mb-4">
                <h2 className="text-2xl font-bold font-serif text-charcoal">{t('auth.signup.heading')}</h2>
                <p className="text-sm font-serif text-charcoal-light">{t('auth.signup.subheading')}</p>
              </div>

              {/* Demo Account Credentials Banner for SIH Prototype */}
              <div className="mb-4 bg-vintage-paper p-4 rounded-xl border-2 border-vintage-gold shadow-sm font-serif">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-brick uppercase tracking-wider">
                    🔑 Prototype Demo Credentials
                  </span>
                  <span className="text-[10px] bg-olive/20 text-olive px-2 py-0.5 rounded font-mono font-bold">
                    SIH 2026 Prototype
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-charcoal bg-warm-white p-2.5 rounded border border-parchment-dark">
                  <div>
                    <span className="text-[10px] text-charcoal-light block">Email:</span>
                    <strong className="text-denim">dummy@gmail.com</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-light block">Password:</span>
                    <strong className="text-denim">user12345</strong>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      useAuthStore.getState().setDemoLogin('patient');
                      navigate('/patient/home', { replace: true });
                    }}
                    className="flex-1 py-2.5 px-3 bg-brick hover:bg-brick-dark text-white rounded-lg text-xs font-serif font-bold shadow-sm transition active:scale-95 text-center cursor-pointer"
                  >
                    🚀 Enter as Dummy Patient
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      useAuthStore.getState().setDemoLogin('doctor');
                      navigate('/doctor/dashboard', { replace: true });
                    }}
                    className="py-2.5 px-3 bg-denim hover:bg-denim-dark text-white rounded-lg text-xs font-serif font-bold shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    👨‍⚕️ Doctor Demo
                  </button>
                </div>
              </div>


              <div className="w-full overflow-hidden rounded-2xl border border-parchment-dark bg-warm-white shadow-vintage p-4 sm:p-5">
                <SignUp appearance={authAppearance} />
              </div>

              <p className="mt-5 text-sm font-serif text-charcoal-light">
                {t('auth.signup.switchPrompt')}{' '}
                <Link to="/login" className="text-denim font-semibold hover:text-denim-dark focus:outline-none focus:underline">
                  {t('auth.signup.switchAction')}
                </Link>
              </p>

            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
};