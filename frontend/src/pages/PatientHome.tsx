import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { QRHealthCard } from '../components/patient/QRHealthCard';
import { usePatientStore } from '../store/patientStore';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  Stethoscope,
  Pill,
  FileText,
  PhoneCall,
  ShieldCheck,
  HeartHandshake,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useSehatLinkIdentity } from '../hooks/useSehatLinkIdentity';

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { name, village, abhaId } = useSehatLinkIdentity();
  const { currentRecord } = usePatientStore();
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const mockAppointments = [
    {
      id: 'apt-1',
      doctorName: 'Dr. Amanpreet Singh (MD Internal Medicine)',
      clinic: 'Rural Rural Health Center',
      date: 'Today, 11:30 AM',
      type: 'Tele-Consultation Queue',
      status: 'Confirmed'
    },
    {
      id: 'apt-2',
      doctorName: 'Dr. Neha Sharma (Pediatrician)',
      clinic: 'Civil Hospital',
      date: '12 Aug 2026, 10:00 AM',
      type: 'Follow-up Review',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner Card with QR Health Card trigger */}
      <Card variant="paper" className="p-6 border-l-4 border-brick shadow-vintage">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-olive font-bold tracking-wider">
              SEHATLINK RURAL PATIENT PORTAL • RURAL REGION
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-charcoal">
              Sat Sri Akal, {name} ji!
            </h1>
            <p className="text-xs font-serif text-charcoal-light mt-1 flex items-center gap-2">
              <span>Village: <b>{village}</b></span>
              <span>•</span>
              <span>ABHA ID: <b>{abhaId}</b></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3.5 py-2 rounded-lg bg-denim text-cream border-2 border-vintage-gold font-serif text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-denim-dark transition active:scale-95"
            >
              <QrCode className="w-4 h-4 text-vintage-gold" />
              <span>Show QR Health Card</span>
            </button>

            <div className="flex items-center space-x-1.5 bg-warm-white px-3 py-1.5 rounded-lg border border-parchment-dark">
              <ShieldCheck className="w-4 h-4 text-olive" />
              <span className="text-xs font-serif font-bold text-olive">Offline Safe</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Primary Healthcare Portals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Speak Symptoms */}
        <button
          onClick={() => navigate('/symptom-capture')}
          className="group text-left bg-cream-light hover:bg-parchment p-6 rounded-2xl border-2 border-brick shadow-vintage hover:shadow-vintage-lg transition-all transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="p-4 rounded-full bg-brick text-white w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Mic className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold font-serif text-brick group-hover:text-brick-dark">
            🎤 {t('actions.speakSymptoms')}
          </h3>
          <p className="text-xs font-serif text-charcoal-light mt-1">
            Voice AI Triage in Punjabi, Hindi or English with red-flag detection
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
            Connect via Video, Audio call, or priority tele-consultation queue
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
            Locate generic medicines in nearby Jan Aushadhi Kendras
          </p>
        </button>

        {/* 4. Digital Prescription */}
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
            View signed e-prescriptions, dosage timing, and QR records
          </p>
        </button>

        {/* 5. Emergency SOS */}
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
                🚑 {t('actions.emergency')} (108 SOS)
              </h3>
              <p className="text-xs font-serif text-white/90 mt-1">
                Instant GPS village dispatch to Civil Hospital & Ambulance Unit
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Upcoming Appointments & Health Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="paper" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-parchment-dark pb-2">
            <h3 className="font-serif font-bold text-base text-denim flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brick" />
              Upcoming Tele-Consultations
            </h3>
            <span className="text-xs font-mono font-bold text-olive bg-olive/10 px-2 py-0.5 rounded">
              2 Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {mockAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 bg-warm-white rounded-lg border border-parchment-dark flex items-center justify-between shadow-sm"
              >
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-charcoal">
                    {apt.doctorName}
                  </h4>
                  <p className="text-xs text-charcoal-light flex items-center gap-2">
                    <span><Clock className="w-3 h-3 inline text-olive" /> {apt.date}</span>
                    <span>•</span>
                    <span><MapPin className="w-3 h-3 inline text-brick" /> {apt.clinic}</span>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/consultation')}
                >
                  Join Call
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="paper" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-parchment-dark pb-2">
            <h3 className="font-serif font-bold text-base text-denim flex items-center gap-2">
              <Activity className="w-5 h-5 text-olive" />
              My Latest Vitals & Triage Summary
            </h3>
            <span className="text-xs font-serif font-bold text-brick uppercase bg-brick/10 px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>

          {currentRecord?.vitals ? (
            <div className="grid grid-cols-2 gap-3 text-xs font-serif">
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark">
                <span className="text-[10px] font-mono text-olive uppercase block">Blood Pressure</span>
                <span className="font-bold text-sm text-charcoal">
                  {currentRecord.vitals.bloodPressureSystolic}/{currentRecord.vitals.bloodPressureDiastolic} mmHg
                </span>
              </div>
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark">
                <span className="text-[10px] font-mono text-olive uppercase block">Blood Oxygen (SpO2)</span>
                <span className="font-bold text-sm text-emergency-red">
                  {currentRecord.vitals.spo2}% (Low SpO2 Alert)
                </span>
              </div>
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark">
                <span className="text-[10px] font-mono text-olive uppercase block">Pulse Rate</span>
                <span className="font-bold text-sm text-charcoal">
                  {currentRecord.vitals.pulseRate} bpm
                </span>
              </div>
              <div className="p-3 bg-warm-white rounded-lg border border-parchment-dark">
                <span className="text-[10px] font-mono text-olive uppercase block">Body Temperature</span>
                <span className="font-bold text-sm text-charcoal">
                  {currentRecord.vitals.temperature}°C
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-charcoal-light italic">No recorded vitals yet.</p>
          )}
        </Card>
      </div>

      {/* Role Navigation Helpers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-parchment-dark">
        <Button
          variant="outline"
          size="sm"
          icon={<HeartHandshake className="w-4 h-4 text-olive" />}
          onClick={() => navigate('/worker/dashboard')}
        >
          {t('actions.recordVitals')}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/doctor/dashboard')}
        >
          Doctor Queue Dashboard →
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/dashboard')}
        >
          {t('actions.adminDashboard')} →
        </Button>
      </div>

      {/* QR Health Card Modal */}
      {showQrModal && (
        <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="My ABHA Health Identity Card">
          <QRHealthCard patient={currentRecord || {
            id: 'pat-101',
            name: name || 'Gurpreet Singh',
            age: 60,
            gender: 'Male',
            phone: '+91 98765 43210',
            village: village || 'Alhoran',
            abhaId: abhaId || '91-4820-1928-3741',
            priority: 'HIGH',
            status: 'waiting',
            createdAt: new Date().toISOString(),
            symptoms: []
          }} />
        </Modal>
      )}
    </div>
  );
};
