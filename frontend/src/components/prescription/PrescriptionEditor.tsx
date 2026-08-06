import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Prescription, PrescriptionMedication } from '../../types';
import { Plus, Trash2, CheckCircle2, FileSignature } from 'lucide-react';

interface PrescriptionEditorProps {
  patientId: string;
  patientName: string;
  onSavePrescription: (rx: Prescription) => void;
}

export const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  patientId,
  patientName,
  onSavePrescription,
}) => {
  const [diagnosis, setDiagnosis] = useState(
    'Suspected Angina Pectoris / Ischemic Episode'
  );
  const [medications, setMedications] = useState<PrescriptionMedication[]>([
    {
      name: 'Tab. Sorbitrate (Isosorbide Dinitrate)',
      dosage: '5mg',
      frequency: 'Sublingual immediately',
      durationDays: 3,
    },
    {
      name: 'Tab. Aspirin',
      dosage: '150mg',
      frequency: '1-0-0 after food',
      durationDays: 7,
    },
  ]);

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '500mg', frequency: '1-0-1', durationDays: 5 },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof PrescriptionMedication,
    value: any
  ) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rxId = 'RX-NABHA-' + Math.floor(100000 + Math.random() * 900000);
    const newRx: Prescription = {
      id: rxId,
      consultationId: 'c-101',
      patientId,
      patientName,
      doctorName: 'Dr. Amanpreet Singh',
      doctorLicense: 'PMC-84920-PB',
      diagnosis,
      medications,
      followUpDate: 'In 3 Days',
      qrCodeData: `https://sehatlink.nabha.gov.in/rx/${rxId}`,
      issuedAt: new Date().toLocaleDateString('en-IN'),
      isSigned: true,
    };
    onSavePrescription(newRx);
  };

  return (
    <Card variant="paper" className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-parchment-dark pb-3">
          <FileSignature className="w-6 h-6 text-brick" />
          <h3 className="text-xl font-bold font-serif text-denim">
            Generate E-Prescription for {patientName}
          </h3>
        </div>

        <Input
          label="Clinical Diagnosis & Summary"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g. Acute viral fever, hypertension..."
          required
        />

        {/* Medications List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-olive">
              Prescribed Medicines
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={addMedication}
            >
              Add Medicine
            </Button>
          </div>

          <div className="space-y-3">
            {medications.map((med, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-warm-white p-3 rounded-lg border border-parchment-dark items-center"
              >
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                    placeholder="Medicine Name (e.g. Paracetamol)"
                    className="w-full bg-cream-light border border-parchment-dark rounded px-2.5 py-1.5 text-sm"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                    placeholder="Dosage"
                    className="w-full bg-cream-light border border-parchment-dark rounded px-2.5 py-1.5 text-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                    placeholder="Frequency (e.g. 1-0-1)"
                    className="w-full bg-cream-light border border-parchment-dark rounded px-2.5 py-1.5 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between">
                  <input
                    type="number"
                    value={med.durationDays}
                    onChange={(e) => updateMedication(idx, 'durationDays', Number(e.target.value))}
                    placeholder="Days"
                    className="w-16 bg-cream-light border border-parchment-dark rounded px-2 py-1.5 text-sm"
                  />
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(idx)}
                      className="p-1 text-brick hover:bg-brick/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          Sign & Issue E-Prescription
        </Button>
      </form>
    </Card>
  );
};
