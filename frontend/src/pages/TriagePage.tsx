import React from 'react';
import { TriageResult } from '../components/triage/TriageResult';
import { SymptomCard } from '../components/triage/SymptomCard';
import { usePatientStore } from '../store/patientStore';
import { Card } from '../components/common/Card';
import { evaluateTriage } from '../utils/triageRules';
import { Activity, Stethoscope } from 'lucide-react';

export const TriagePage: React.FC = () => {
  const { activeSymptoms, currentVitals, triagePriority } = usePatientStore();

  const speechSummary = activeSymptoms.map((s) => s.text).join(', ');
  const evaluation = evaluateTriage(speechSummary, currentVitals);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TriageResult
        priority={triagePriority || evaluation.priority}
        alerts={evaluation.alerts}
        symptomsCount={activeSymptoms.length}
      />

      <Card variant="paper" className="p-6 space-y-4">
        <h3 className="text-base font-serif font-bold text-denim border-b border-parchment-dark pb-2">
          Recorded Case Summary
        </h3>

        {/* Symptoms Breakdown */}
        <div>
          <h4 className="text-xs font-serif font-bold text-olive uppercase tracking-wider mb-2">
            Confirmed Symptoms ({activeSymptoms.length})
          </h4>
          <div className="space-y-2">
            {activeSymptoms.map((s) => (
              <SymptomCard key={s.id} symptom={s} />
            ))}
          </div>
        </div>

        {/* Vitals Summary */}
        {currentVitals && (
          <div className="border-t border-parchment-dark pt-3">
            <h4 className="text-xs font-serif font-bold text-olive uppercase tracking-wider mb-2 flex items-center gap-1">
              <Activity className="w-4 h-4 text-brick" />
              Logged Vitals
            </h4>
            <p className="text-xs font-mono text-charcoal bg-warm-white p-3 rounded-lg border border-parchment-dark">
              SpO2: <span className={currentVitals.spo2 && currentVitals.spo2 < 90 ? 'text-brick font-bold' : ''}>{currentVitals.spo2}%</span> •
              BP: {currentVitals.bloodPressureSystolic}/{currentVitals.bloodPressureDiastolic} mmHg •
              Pulse: {currentVitals.pulseRate} bpm •
              Temp: {currentVitals.temperature}°C
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
