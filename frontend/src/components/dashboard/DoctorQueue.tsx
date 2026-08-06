import React from 'react';
import { usePatientStore } from '../../store/patientStore';
import { Badge } from '../common/Badge';
import { PatientRecord } from '../../types';
import { User, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface DoctorQueueProps {
  onSelectPatient: (patient: PatientRecord) => void;
  selectedId?: string;
}

export const DoctorQueue: React.FC<DoctorQueueProps> = ({ onSelectPatient, selectedId }) => {
  const { patientQueue } = usePatientStore();

  return (
    <div className="bg-cream-light rounded-xl border-2 border-parchment-dark shadow-vintage overflow-hidden">
      <div className="bg-denim text-white p-4 flex items-center justify-between border-b-2 border-denim-dark">
        <h3 className="text-base font-serif font-bold tracking-wide">Doctor Waiting Queue</h3>
        <span className="text-xs font-mono bg-cream/20 px-2.5 py-0.5 rounded-full text-cream font-bold">
          {patientQueue.length} Waiting
        </span>
      </div>

      <div className="divide-y divide-parchment-dark max-h-[500px] overflow-y-auto">
        {patientQueue.map((patient) => {
          const isSelected = patient.id === selectedId;
          const isHigh = patient.priority === 'HIGH';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`p-4 transition-colors cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-parchment/90 border-l-4 border-brick'
                  : isHigh
                  ? 'bg-brick/5 hover:bg-brick/10'
                  : 'hover:bg-parchment/40'
              }`}
            >
              <div className="space-y-1.5 flex-1 pr-3">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-base text-charcoal">{patient.name}</span>
                  <span className="text-xs font-mono text-charcoal-light">({patient.age}y, {patient.gender})</span>
                  <Badge priority={patient.priority} />
                </div>

                <p className="text-xs text-charcoal-light font-mono flex items-center gap-1">
                  <span>Village: {patient.village}</span>
                  {patient.vitals?.spo2 && (
                    <span className={`ml-2 px-1.5 py-0.2 rounded ${patient.vitals.spo2 < 90 ? 'bg-brick text-white font-bold' : 'bg-olive/20 text-olive-dark'}`}>
                      SpO2: {patient.vitals.spo2}%
                    </span>
                  )}
                </p>

                {patient.symptoms.length > 0 && (
                  <p className="text-xs text-brick font-serif italic truncate max-w-xs">
                    Symptoms: {patient.symptoms.map(s => s.text).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex items-center text-charcoal-light">
                <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-brick translate-x-1' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
