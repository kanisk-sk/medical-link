import React from 'react';
import { PrescriptionCard } from '../components/prescription/PrescriptionCard';
import { usePatientStore } from '../store/patientStore';
import { Prescription } from '../types';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PrescriptionView: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { activePrescription, currentRecord } = usePatientStore();

  const fallbackPrescription: Prescription = {
    id: 'RX-NABHA-849201',
    consultationId: 'c-101',
    patientId: currentRecord?.id || 'pat-101',
    patientName: currentRecord?.name || 'Gurpreet Singh',
    doctorName: 'Dr. Amanpreet Singh',
    doctorLicense: 'PMC-84920-PB',
    diagnosis: 'Angina Pectoris / Precordial Tightness Episode',
    medications: [
      {
        name: 'Tab. Sorbitrate (Isosorbide Dinitrate)',
        dosage: '5mg',
        frequency: 'Sublingual immediately during pain',
        durationDays: 3,
        inStock: true,
      },
      {
        name: 'Tab. Aspirin',
        dosage: '150mg',
        frequency: '1-0-0 after food',
        durationDays: 7,
        inStock: true,
      },
      {
        name: 'Tab. Atorvastatin',
        dosage: '20mg',
        frequency: '0-0-1 at bedtime',
        durationDays: 14,
        inStock: true,
      },
    ],
    followUpDate: 'In 3 Days at Civil Hospital Nabha',
    qrCodeData: 'https://sehatlink.nabha.gov.in/rx/RX-NABHA-849201',
    issuedAt: new Date().toLocaleDateString('en-IN'),
    isSigned: true,
  };

  const rxToDisplay = activePrescription || fallbackPrescription;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-brick">
          📄 {t('actions.myPrescription')}
        </h1>

        <Button
          variant="olive"
          size="sm"
          icon={<Pill className="w-4 h-4" />}
          onClick={() => navigate('/pharmacy')}
        >
          {t('actions.findMedicine')}
        </Button>
      </div>

      <PrescriptionCard prescription={rxToDisplay} />
    </div>
  );
};
