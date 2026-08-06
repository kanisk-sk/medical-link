import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { usePatientStore } from '../store/patientStore';
import { evaluateTriage } from '../utils/triageRules';
import { Activity, Camera, AlertOctagon, CheckCircle2, Heart } from 'lucide-react';

export const AssistedIntake: React.FC = () => {
  const navigate = useNavigate();
  const { setVitals, setTriagePriority, currentRecord } = usePatientStore();

  const [spo2, setSpo2] = useState('88'); // Default low SpO2 for Gurpreet demo scenario
  const [systolic, setSystolic] = useState('155');
  const [diastolic, setDiastolic] = useState('95');
  const [pulse, setPulse] = useState('104');
  const [temp, setTemp] = useState('37.8');
  const [ashaNotes, setAshaNotes] = useState('Patient complaining of acute retrosternal pressure.');

  const handleSaveIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const vitalsData = {
      spo2: Number(spo2),
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      pulseRate: Number(pulse),
      temperature: Number(temp),
      recordedAt: 'Just now',
      recordedBy: 'Harpreet Kaur (ASHA Worker)',
    };

    setVitals(vitalsData);

    // Evaluate Triage with Vitals
    const evaluation = evaluateTriage(ashaNotes, vitalsData);
    setTriagePriority(evaluation.priority);

    navigate('/triage');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-denim">
          🏥 Assisted Intake Mode (ASHA Worker)
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          Record patient clinical vitals and attach photos for remote doctor review
        </p>
      </div>

      <Card variant="paper" className="p-6">
        <form onSubmit={handleSaveIntake} className="space-y-6">
          <div className="bg-parchment p-3 rounded-lg border border-parchment-dark">
            <span className="text-xs font-mono uppercase text-charcoal-light">Target Patient Profile</span>
            <h3 className="font-serif font-bold text-base text-charcoal">
              {currentRecord?.name || 'Gurpreet Singh'} ({currentRecord?.age || 60}y, {currentRecord?.gender || 'Male'})
            </h3>
            <p className="text-xs font-serif text-charcoal-light">Village: {currentRecord?.village || 'Alhoran, Nabha'}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-olive flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brick" />
              Clinical Vitals Measurement
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="SpO2 Oxygen (%)"
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                helperText="Normal: 95-100%. < 90% is Red Flag"
                required
              />

              <Input
                label="Pulse Rate (bpm)"
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                required
              />

              <Input
                label="BP Systolic (mmHg)"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                required
              />

              <Input
                label="BP Diastolic (mmHg)"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                required
              />
            </div>

            <Input
              label="Body Temperature (°C)"
              type="number"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              required
            />
          </div>

          {/* Photo Attachment Prompt */}
          <div className="border-2 border-dashed border-parchment-dark p-4 rounded-xl text-center bg-warm-white space-y-2">
            <Camera className="w-8 h-8 text-olive mx-auto" />
            <p className="text-xs font-serif text-charcoal font-semibold">Attach Wound or Rash Photos (Optional)</p>
            <Button type="button" variant="outline" size="sm">
              Upload Image
            </Button>
          </div>

          <Input
            label="ASHA Field Notes & Observation"
            value={ashaNotes}
            onChange={(e) => setAshaNotes(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<CheckCircle2 className="w-5 h-5" />}
          >
            Submit Vitals & Evaluate Triage Priority
          </Button>
        </form>
      </Card>
    </div>
  );
};
