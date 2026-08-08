import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StethoscopeLogo } from '../components/common/StethoscopeLogo';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { VintageSealBadge } from '../components/assistant/VintageSealBadge';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  WifiOff,
  Mic,
  PhoneCall,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Pill,
  Building2,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Users
} from 'lucide-react';
import { SehatLinkRole } from '../types';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<SehatLinkRole>('patient');

  const rolePortals = [
    {
      role: 'patient' as SehatLinkRole,
      title: 'ਮਰੀਜ਼ ਪੋਰਟਲ (Patient Portal)',
      desc: 'Book tele-consultations, describe symptoms by voice, check prescription & QR card.',
      icon: <Users className="w-6 h-6 text-brick" />,
      targetPath: '/patient/home',
      badge: 'Citizen Access'
    },
    {
      role: 'health_worker' as SehatLinkRole,
      title: 'ਆਸ਼ਾ ਵਰਕਰ (ASHA Health Worker)',
      desc: 'Door-to-door village intake, record vitals (SpO2, BP, Temp), sync offline queues.',
      icon: <HeartPulse className="w-6 h-6 text-olive" />,
      targetPath: '/worker/dashboard',
      badge: 'Offline Intake'
    },
    {
      role: 'doctor' as SehatLinkRole,
      title: 'ਡਾਕਟਰ ਡੈਸ਼ਬੋਰਡ (Remote Doctor)',
      desc: 'Review priority triage cases, conduct video consultations, issue digital prescriptions.',
      icon: <Stethoscope className="w-6 h-6 text-denim" />,
      targetPath: '/doctor/dashboard',
      badge: 'Tele-Consultant'
    },
    {
      role: 'pharmacist' as SehatLinkRole,
      title: 'ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ (Pharmacy Portal)',
      desc: 'Track medicine stock in Nabha, lookup generic alternatives, fulfill patient reserves.',
      icon: <Pill className="w-6 h-6 text-vintage-gold" />,
      targetPath: '/pharmacy/dashboard',
      badge: 'Generic Stock'
    },
    {
      role: 'admin' as SehatLinkRole,
      title: 'ਜ਼ਿਲ੍ਹਾ ਐਡਮਿਨ (District Analytics)',
      desc: 'Monitor village disease heatmaps, doctor stats, emergency 108 dispatch logs.',
      icon: <Building2 className="w-6 h-6 text-brick-dark" />,
      targetPath: '/admin/dashboard',
      badge: 'Nabha Health Admin'
    }
  ];

  const quickStats = [
    { label: 'Connected Villages', val: '48 Villages', sub: 'Nabha Tehsil, Punjab' },
    { label: 'Jan Aushadhi Stores', val: '12 Kendras', sub: 'Generic Meds In Stock' },
    { label: 'ASHA Field Workers', val: '140+ Workers', sub: 'Door-to-Door Intake' },
    { label: 'Emergency 108 ETA', val: '< 8 Minutes', sub: 'Nabha Ambulance Unit' }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-brick selection:text-white pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-cream-light/95 backdrop-blur-md border-b-2 border-parchment-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <StethoscopeLogo size={36} animate={false} />
            <div>
              <span className="text-xl font-bold font-serif text-brick tracking-tight">
                SehatLink (ਸਿਹਤ ਲਿੰਕ)
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-olive ml-2 bg-olive/10 px-1.5 py-0.5 rounded border border-olive/20">
                OFFLINE-FIRST RURAL TELEMEDICINE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <LinkToEmergency />
          </div>
        </div>
      </header>

      {/* Hero Section with Vintage Hospital Aesthetics */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parchment border border-vintage-gold text-xs font-serif text-denim font-bold shadow-sm">
              <VintageSealBadge size="sm" />
              <span>Smart India Hackathon Prototype • Nabha Rural Health Project</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-brick leading-tight">
              Offline-First Telemedicine for Rural Punjab Villages
            </h1>

            <p className="text-base sm:text-lg font-serif text-charcoal-light leading-relaxed">
              Bridging the healthcare gap in Nabha through voice-assisted AI triage, door-to-door ASHA worker intakes, digital prescriptions, and local Jan Aushadhi pharmacy inventory—even without active internet.
            </p>

            {/* Quick Hero Features */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark shadow-sm">
                <Mic className="w-5 h-5 text-brick mb-1" />
                <h4 className="text-xs font-serif font-bold text-charcoal">Voice Triage</h4>
                <p className="text-[10px] text-charcoal-light">Punjabi & Hindi Input</p>
              </div>
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark shadow-sm">
                <WifiOff className="w-5 h-5 text-olive mb-1" />
                <h4 className="text-xs font-serif font-bold text-charcoal">Offline Sync</h4>
                <p className="text-[10px] text-charcoal-light">IndexedDB Local Queue</p>
              </div>
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark shadow-sm">
                <ShieldCheck className="w-5 h-5 text-denim mb-1" />
                <h4 className="text-xs font-serif font-bold text-charcoal">ABHA Linked</h4>
                <p className="text-[10px] text-charcoal-light">Digital QR Cards</p>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="xl"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => navigate('/select-role')}
              >
                Launch Telemedicine Portals
              </Button>
              <Button
                variant="outline"
                size="xl"
                icon={<PhoneCall className="w-5 h-5 text-emergency-red animate-bounce" />}
                onClick={() => navigate('/patient/emergency')}
              >
                Nabha 108 SOS
              </Button>
            </div>
          </motion.div>

          {/* Vintage Hospital Wooden Signboard Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 bg-paper-grain p-6 rounded-2xl border-4 border-denim shadow-vintage-lg relative overflow-hidden"
          >
            {/* Header Stamp */}
            <div className="flex items-center justify-between border-b-2 border-vintage-gold pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-olive uppercase block">
                  GOVERNMENT CIVIL HOSPITAL • NABHA
                </span>
                <h3 className="font-serif font-bold text-xl text-denim">
                  ਸਿਹਤ ਸੇਵਾਵਾਂ (Health Services)
                </h3>
              </div>
              <VintageSealBadge size="lg" />
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/patient/symptom-capture')}
                className="w-full p-3.5 bg-warm-white hover:bg-parchment rounded-xl border-2 border-denim/40 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brick/10 text-brick">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-serif font-bold text-sm text-charcoal group-hover:text-brick">
                      ਬੋਲ ਕੇ ਲੱਛਣ ਦੱਸੋ (Speak Symptoms)
                    </p>
                    <p className="text-[11px] text-charcoal-light">Voice AI Triage in Punjabi / Hindi</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-brick group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/worker/dashboard')}
                className="w-full p-3.5 bg-warm-white hover:bg-parchment rounded-xl border-2 border-denim/40 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-olive/10 text-olive">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-serif font-bold text-sm text-charcoal group-hover:text-olive">
                      ਆਸ਼ਾ ਵਰਕਰ ਇਨਟੇਕ (ASHA Intake)
                    </p>
                    <p className="text-[11px] text-charcoal-light">Record Vitals offline (SpO2, BP, Temp)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-olive group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/pharmacy/dashboard')}
                className="w-full p-3.5 bg-warm-white hover:bg-parchment rounded-xl border-2 border-denim/40 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-denim/10 text-denim">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-serif font-bold text-sm text-charcoal group-hover:text-denim">
                      ਜਨ ਔਸ਼ਧੀ ਦਵਾਈਆਂ (Jan Aushadhi Search)
                    </p>
                    <p className="text-[11px] text-charcoal-light">Find generic stock in Nabha kendras</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-denim group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regional Impact Numbers */}
      <section className="bg-parchment py-8 border-y-2 border-parchment-dark my-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {quickStats.map((st, i) => (
            <div key={i} className="p-4 bg-cream-light rounded-xl border border-vintage-gold/50 shadow-vintage">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-brick block">
                {st.val}
              </span>
              <span className="text-xs font-serif font-bold text-denim uppercase block mt-1">
                {st.label}
              </span>
              <span className="text-[11px] font-mono text-olive block mt-0.5">
                {st.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Unique Role Portals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brick">
            Explore SehatLink Ecosystem Portals
          </h2>
          <p className="text-sm font-serif text-charcoal-light">
            Custom tailored workflows for every participant in the rural healthcare supply chain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolePortals.map((item, idx) => (
            <div
              key={idx}
              className="bg-cream-light p-5 rounded-xl border-2 border-parchment-dark hover:border-vintage-gold shadow-vintage transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-parchment rounded-lg border border-parchment-dark">
                    {item.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-serif font-bold uppercase bg-olive/10 text-olive border border-olive/20">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-denim mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-light leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(item.targetPath)}
              >
                Open Portal
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Testimonials & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-paper-grain p-8 rounded-2xl border-2 border-denim shadow-vintage-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-olive tracking-widest block">
                PUNJAB RURAL HEALTH MISSION
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brick">
                Empowering Village ASHA Workers & Remote Doctors
              </h2>
              <p className="text-sm font-serif text-charcoal-light leading-relaxed">
                "SehatLink allows us to capture patient vitals during home visits in Alhoran even when there is no mobile signal. Once we reach the main road, all records sync automatically to Dr. Amanpreet in Nabha."
              </p>
              <div className="pt-2">
                <p className="font-serif font-bold text-sm text-denim">Harpreet Kaur</p>
                <p className="text-xs text-olive font-serif">Lead ASHA Worker • Nabha Sector 3</p>
              </div>
            </div>

            <div className="space-y-3 bg-cream-light p-6 rounded-xl border border-parchment-dark shadow-sm">
              <h3 className="font-serif font-bold text-base text-brick flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-green" />
                ABDM & Ayushman Bharat Compliant
              </h3>
              <ul className="space-y-2 text-xs font-serif text-charcoal">
                <li className="flex items-center gap-2">
                  <span className="text-olive">•</span> Every patient gets a unique 14-digit ABHA Health Card & QR code.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-olive">•</span> Instant emergency dispatch with Nabha 108 GPS unit tracking.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-olive">•</span> Multilingual Sehat Sahayak AI Assistant available 24/7.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LinkToEmergency: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/patient/emergency')}
      className="bg-emergency-red hover:bg-red-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold font-serif flex items-center space-x-1 shadow-sm transition-transform active:scale-95"
    >
      <PhoneCall className="w-4 h-4 animate-bounce" />
      <span className="hidden sm:inline">Nabha 108 Emergency</span>
    </button>
  );
};
