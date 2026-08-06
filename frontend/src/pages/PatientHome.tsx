import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Mic, Stethoscope, Pill, FileText, PhoneCall, UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useSehatLinkIdentity } from '../hooks/useSehatLinkIdentity';

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { name, village, abhaId } = useSehatLinkIdentity();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Banner Card */}
      <Card variant="paper" className="p-6 border-l-4 border-brick">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-olive font-bold tracking-wider">
              SEHATLINK RURAL CLINIC PORTAL
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-charcoal">
              Sat Sri Akal, {name} ji!
            </h1>
            <p className="text-xs font-serif text-charcoal-light mt-1">
              Village: {village} • ABHA: {abhaId}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-warm-white p-2 rounded-lg border border-parchment-dark">
            <ShieldCheck className="w-5 h-5 text-olive" />
            <span className="text-xs font-serif font-bold text-olive">Offline Safe</span>
          </div>
        </div>
      </Card>

      {/* Main 5 Big Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Speak Symptoms */}
        <button
          onClick={() => navigate('/symptom-capture')}
          className="group text-left bg-cream-light hover:bg-parchment p-6 rounded-2xl border-2 border-brick shadow-vintage hover:shadow-vintage-lg transition-all transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="p-4 rounded-full bg-brick text-white w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Mic className="w-8 h-8 animate-pulse-slow" />
          </div>
          <h3 className="text-xl font-bold font-serif text-brick group-hover:text-brick-dark">
            🎤 {t('actions.speakSymptoms')}
          </h3>
          <p className="text-xs font-serif text-charcoal-light mt-1">
            Speak your health concerns in Punjabi, Hindi or English
          </p>
        </button>

        {/* 2. Talk to Doctor */}
        <button
          onClick={() => navigate('/consultation')}
          className="group text-left bg-cream-light hover:bg-parchment p-6 rounded-2xl border-2 border-denim shadow-vintage hover:shadow-vintage-lg transition-all transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="p-4 rounded-full bg-denim text-white w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-denim group-hover:text-denim-dark">
            👨‍⚕️ {t('actions.talkToDoctor')}
          </h3>
          <p className="text-xs font-serif text-charcoal-light mt-1">
            Connect via Video, Audio or Async Doctor Queue
          </p>
        </button>

        {/* 3. Find Medicine */}
        <button
          onClick={() => navigate('/pharmacy')}
          className="group text-left bg-cream-light hover:bg-parchment p-6 rounded-2xl border-2 border-olive shadow-vintage hover:shadow-vintage-lg transition-all transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="p-4 rounded-full bg-olive text-white w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Pill className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-olive-dark">
            💊 {t('actions.findMedicine')}
          </h3>
          <p className="text-xs font-serif text-charcoal-light mt-1">
            Search nearby Jan Aushadhi Kendras & Stock
          </p>
        </button>

        {/* 4. My Prescription */}
        <button
          onClick={() => navigate('/prescription-view')}
          className="group text-left bg-cream-light hover:bg-parchment p-6 rounded-2xl border-2 border-parchment-dark shadow-vintage hover:shadow-vintage-lg transition-all transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="p-4 rounded-full bg-charcoal text-white w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-charcoal">
            📄 {t('actions.myPrescription')}
          </h3>
          <p className="text-xs font-serif text-charcoal-light mt-1">
            View digital e-prescriptions & QR Codes
          </p>
        </button>

        {/* 5. Emergency */}
        <button
          onClick={() => navigate('/emergency')}
          className="group text-left bg-emergency-red hover:bg-red-800 text-white p-6 rounded-2xl border-2 border-red-900 shadow-vintage hover:shadow-vintage-lg transition-all transform hover:-translate-y-1 relative overflow-hidden sm:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-white text-emergency-red w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
              <PhoneCall className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif tracking-wide uppercase">
                🚑 {t('actions.emergency')}
              </h3>
              <p className="text-xs font-serif text-white/90 mt-1">
                One-Touch Ambulance Dispatch & GPS Location Sharing
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Secondary Quick Links for role-based care teams */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-parchment-dark">
        <Button
          variant="outline"
          size="sm"
          icon={<HeartHandshake className="w-4 h-4 text-olive" />}
          onClick={() => navigate('/assisted-intake')}
        >
          {t('actions.recordVitals')}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/doctor-dashboard')}
        >
          Doctor Queue Dashboard →
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin')}
        >
          {t('actions.adminDashboard')} →
        </Button>
      </div>
    </div>
  );
};
