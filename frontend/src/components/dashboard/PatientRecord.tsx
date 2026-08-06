import React from 'react';
import { PatientRecord as PatientRecordType } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { User, Activity, Heart, Thermometer, AlertTriangle, FileText, Video } from 'lucide-react';

interface PatientRecordProps {
  patient: PatientRecordType;
  onStartConsultation: () => void;
}

export const PatientRecord: React.FC<PatientRecordProps> = ({ patient, onStartConsultation }) => {
  return (
    <Card variant="paper" className="p-6 space-y-6">
      {/* Patient Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-parchment-dark pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold font-serif text-denim">{patient.name}</h2>
            <Badge priority={patient.priority} />
          </div>
          <p className="text-xs font-mono text-charcoal-light mt-1">
            Age: {patient.age} • Gender: {patient.gender} • Village: {patient.village} • ABHA: {patient.abhaId || 'N/A'}
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Video className="w-4 h-4" />}
          onClick={onStartConsultation}
        >
          Start Consultation
        </Button>
      </div>

      {/* Vitals Grid */}
      {patient.vitals && (
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-olive flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Vitals Recorded by ASHA ({patient.vitals.recordedBy || 'ASHA Worker'})
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg border text-center ${patient.vitals.spo2 && patient.vitals.spo2 < 90 ? 'bg-brick/15 border-brick text-brick' : 'bg-warm-white border-parchment-dark'}`}>
              <span className="text-[10px] uppercase font-mono block text-charcoal-light">SpO2 Oxygen</span>
              <span className="text-xl font-bold font-serif">{patient.vitals.spo2}%</span>
            </div>

            <div className="p-3 rounded-lg border border-parchment-dark bg-warm-white text-center">
              <span className="text-[10px] uppercase font-mono block text-charcoal-light">Blood Pressure</span>
              <span className="text-xl font-bold font-serif">
                {patient.vitals.bloodPressureSystolic}/{patient.vitals.bloodPressureDiastolic}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-parchment-dark bg-warm-white text-center">
              <span className="text-[10px] uppercase font-mono block text-charcoal-light">Pulse Rate</span>
              <span className="text-xl font-bold font-serif">{patient.vitals.pulseRate} bpm</span>
            </div>

            <div className="p-3 rounded-lg border border-parchment-dark bg-warm-white text-center">
              <span className="text-[10px] uppercase font-mono block text-charcoal-light">Temperature</span>
              <span className="text-xl font-bold font-serif">{patient.vitals.temperature}°C</span>
            </div>
          </div>
        </div>
      )}

      {/* Symptoms & Triage Alert Notes */}
      <div className="space-y-3">
        <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-olive">
          Reported Symptoms & Protocol Notes
        </h4>
        {patient.triageNotes && (
          <div className="bg-brick/10 border-l-4 border-brick p-3 text-xs text-brick-dark font-mono rounded">
            {patient.triageNotes}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {patient.symptoms.map((s) => (
            <span
              key={s.id}
              className={`px-3 py-1 rounded-full text-xs font-serif border ${
                s.isRedFlag ? 'bg-brick text-white border-brick-dark font-bold' : 'bg-parchment text-charcoal border-parchment-dark'
              }`}
            >
              {s.text}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
