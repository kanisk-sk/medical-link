import React, { useState } from 'react';
import { DoctorQueue } from '../components/dashboard/DoctorQueue';
import { PatientRecord } from '../components/dashboard/PatientRecord';
import { PrescriptionEditor } from '../components/prescription/PrescriptionEditor';
import { usePatientStore } from '../store/patientStore';
import { useConsultationStore } from '../store/consultationStore';
import { PatientRecord as PatientRecordType, Prescription } from '../types';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, CheckCircle2, AlertTriangle, ShieldCheck, Filter, PhoneCall } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patientQueue, setRecord, setPrescription } = usePatientStore();
  const { startCall } = useConsultationStore();

  const [selectedPatient, setSelectedPatient] = useState<PatientRecordType>(patientQueue[0]);
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [showRxEditor, setShowRxEditor] = useState(false);
  const [rxSuccessMsg, setRxSuccessMsg] = useState('');

  const filteredQueue = patientQueue.filter((p) => {
    if (priorityFilter === 'ALL') return true;
    return p.priority === priorityFilter;
  });

  const handleSelectPatient = (patient: PatientRecordType) => {
    setSelectedPatient(patient);
    setRecord(patient);
    setShowRxEditor(false);
  };

  const handleStartConsult = () => {
    startCall('video');
    navigate('/consultation');
  };

  const handleSaveRx = (rx: Prescription) => {
    setPrescription(rx);
    setShowRxEditor(false);
    setRxSuccessMsg(`Prescription ${rx.id} issued successfully for ${rx.patientName}!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Top Banner */}
      <div className="bg-denim text-white p-6 rounded-xl border-2 border-denim-dark shadow-vintage flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-cream-light tracking-widest block">
            DISTRICT TELEMEDICINE DASHBOARD • RURAL REGION
          </span>
          <h1 className="text-2xl font-bold font-serif text-white">Dr. Amanpreet Singh, MD</h1>
          <p className="text-xs font-serif text-cream-light/80">Civil Hospital • OPD Tele-Consultation & Triage Desk</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-cream/20 px-3 py-1.5 rounded-lg border border-cream/30">
            <Stethoscope className="w-5 h-5 text-vintage-gold" />
            <span className="text-xs font-serif font-bold text-cream">Queue Status: {filteredQueue.length} Active Cases</span>
          </div>

          <button
            onClick={() => navigate('/patient/emergency')}
            className="px-3 py-1.5 bg-emergency-red hover:bg-red-800 text-white rounded-lg font-serif text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency 108 Alert</span>
          </button>
        </div>
      </div>

      {rxSuccessMsg && (
        <div className="bg-success-green/15 border border-success-green text-success-green p-4 rounded-xl font-serif text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{rxSuccessMsg}</span>
        </div>
      )}

      {/* Priority Filter Bar */}
      <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-dark">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-denim" />
          <span className="text-xs font-serif font-bold text-denim uppercase">Filter Triage Queue:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setPriorityFilter(lvl)}
              className={`px-3 py-1 rounded text-xs font-serif font-bold border transition ${
                priorityFilter === lvl
                  ? 'bg-brick text-white border-brick-dark'
                  : 'bg-cream-light text-charcoal border-parchment-dark hover:bg-parchment'
              }`}
            >
              {lvl === 'ALL' ? 'All Priority' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout: Queue (Left) & Record (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <DoctorQueue
            selectedId={selectedPatient.id}
            onSelectPatient={handleSelectPatient}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <PatientRecord
            patient={selectedPatient}
            onStartConsultation={handleStartConsult}
          />

          {showRxEditor ? (
            <PrescriptionEditor
              patientId={selectedPatient.id}
              patientName={selectedPatient.name}
              onSavePrescription={handleSaveRx}
            />
          ) : (
            <div className="flex justify-end">
              <button
                onClick={() => setShowRxEditor(true)}
                className="px-6 py-3 bg-brick hover:bg-brick-dark text-white rounded-lg font-serif font-bold text-sm shadow-sm transition-colors"
              >
                + Issue Digital E-Prescription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
