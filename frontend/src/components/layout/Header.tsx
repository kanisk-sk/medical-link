import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StethoscopeLogo } from '../common/StethoscopeLogo';
import { LanguageToggle } from '../common/LanguageToggle';
import { ArrowLeft, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserButton, useAuth, useUser } from '@clerk/react';
import { Button } from '../common/Button';
import { useSehatLinkIdentity } from '../../hooks/useSehatLinkIdentity';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { name } = useSehatLinkIdentity();

  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <header className="sticky top-0 z-40 bg-cream-light/95 backdrop-blur-md border-b-2 border-parchment-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo or Back Button */}
          <div className="flex items-center space-x-3">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg bg-parchment/60 hover:bg-parchment text-charcoal border border-parchment-dark transition-colors mr-1"
                aria-label={t('actions.back')}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <Link to="/home" className="flex items-center space-x-2.5 group">
              <StethoscopeLogo size={36} animate={false} />
              <div>
                <span className="text-xl font-bold font-serif text-brick tracking-tight group-hover:text-brick-dark transition-colors">
                  {t('appName')}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-olive ml-2 bg-olive/10 px-1.5 py-0.5 rounded border border-olive/20">
                  TELEHEALTH
                </span>
              </div>
            </Link>
          </div>

          {/* Right section: Role switcher, Language toggle, Emergency trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageToggle />

            {!isSignedIn && (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              </div>
            )}

            {isSignedIn && (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-xs font-serif text-charcoal-light">
                    Hello, <span className="font-bold text-charcoal">{user?.firstName || name.split(' ')[0] || 'friend'}</span>
                  </span>
                  <UserButton appearance={{ elements: { avatarBox: 'w-9 h-9' } }} />
                </div>
                <div className="sm:hidden">
                  <UserButton appearance={{ elements: { avatarBox: 'w-9 h-9' } }} />
                </div>
              </>
            )}

            <Link
              to="/emergency"
              className="bg-emergency-red hover:bg-red-800 text-white p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">{t('actions.emergency')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
