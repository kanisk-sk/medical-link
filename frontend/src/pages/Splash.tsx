import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StethoscopeLogo } from '../components/common/StethoscopeLogo';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck, WifiOff, Mic } from 'lucide-react';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between p-6 max-w-lg mx-auto text-center">
      {/* Top Bar */}
      <div className="flex justify-end pt-4">
        <LanguageToggle />
      </div>

      {/* Hero Vintage Emblem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center my-auto space-y-6"
      >
        <div className="p-6 rounded-full bg-cream-light border-4 border-denim shadow-vintage-lg relative">
          <StethoscopeLogo size={100} animate={true} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-serif text-brick tracking-tight">
            {t('appName')}
          </h1>
          <p className="text-sm font-serif text-charcoal-light font-medium max-w-xs mx-auto">
            {t('tagline')}
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 w-full pt-4">
          <div className="p-2.5 bg-warm-white rounded-lg border border-parchment-dark text-center">
            <Mic className="w-5 h-5 mx-auto text-brick mb-1" />
            <span className="text-[10px] font-serif font-semibold block text-charcoal">Voice Input</span>
          </div>
          <div className="p-2.5 bg-warm-white rounded-lg border border-parchment-dark text-center">
            <WifiOff className="w-5 h-5 mx-auto text-olive mb-1" />
            <span className="text-[10px] font-serif font-semibold block text-charcoal">Offline First</span>
          </div>
          <div className="p-2.5 bg-warm-white rounded-lg border border-parchment-dark text-center">
            <ShieldCheck className="w-5 h-5 mx-auto text-denim mb-1" />
            <span className="text-[10px] font-serif font-semibold block text-charcoal">ABHA Linked</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="space-y-3 pb-6">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          icon={<ArrowRight className="w-5 h-5" />}
          onClick={() => navigate('/onboarding')}
        >
          {t('onboarding.welcome')}
        </Button>
        <p className="text-[11px] font-mono text-charcoal-light">
          Official Rural Healthcare Portal • Govt of Punjab / ABDM Compliant
        </p>
      </div>
    </div>
  );
};
