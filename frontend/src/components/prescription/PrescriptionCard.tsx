import React from 'react';
import { Prescription } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { StethoscopeLogo } from '../common/StethoscopeLogo';
import { CheckCircle, Download, Pill } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface PrescriptionCardProps {
  prescription: Prescription;
  onDownloadPdf?: () => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onDownloadPdf,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-cream-light border-4 border-denim rounded-xl p-6 shadow-vintage-lg relative overflow-hidden space-y-6">
      {/* Decorative Stamp Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-parchment-dark pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <StethoscopeLogo size={44} animate={false} />
          <div>
            <h2 className="text-xl font-bold font-serif text-denim tracking-wide">
              CIVIL TELE-HOSPITAL, RURAL
            </h2>
            <p className="text-xs font-mono text-charcoal-light">
              Govt Health Services • ABDM Telemedicine Portal
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase bg-olive/15 text-olive-dark px-2.5 py-1 rounded border border-olive/30 font-bold block mb-1">
            Rx CODE: {prescription.id}
          </span>
          <span className="text-xs font-serif text-charcoal-light">
            Date: {prescription.issuedAt}
          </span>
        </div>
      </div>

      {/* Patient & Doctor Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-parchment/60 p-4 rounded-lg border border-parchment-dark">
        <div>
          <span className="text-[10px] font-mono uppercase text-charcoal-light block">Patient Details</span>
          <p className="font-serif font-bold text-base text-charcoal">{prescription.patientName}</p>
          <p className="text-xs font-serif text-charcoal-light">ID: {prescription.patientId}</p>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-charcoal-light block">Consulting Doctor</span>
          <p className="font-serif font-bold text-base text-denim">{prescription.doctorName}</p>
          <p className="text-xs font-mono text-charcoal-light">Reg. Lic: {prescription.doctorLicense}</p>
        </div>
      </div>

      {/* Clinical Diagnosis */}
      <div>
        <h4 className="text-xs font-serif font-bold uppercase text-olive tracking-wider mb-1">
          Diagnosis / Clinical Summary:
        </h4>
        <p className="text-base font-serif text-charcoal bg-warm-white p-3 rounded-lg border border-parchment-dark italic">
          "{prescription.diagnosis}"
        </p>
      </div>

      {/* Medicines Table */}
      <div>
        <h4 className="text-xs font-serif font-bold uppercase text-olive tracking-wider mb-2">
          Rx Prescribed Medications:
        </h4>
        <div className="overflow-x-auto rounded-lg border border-parchment-dark">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-denim text-white font-serif text-xs">
                <th className="p-2.5">Medicine Name</th>
                <th className="p-2.5">Dosage</th>
                <th className="p-2.5">Frequency</th>
                <th className="p-2.5">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-dark bg-warm-white">
              {prescription.medications.map((med, idx) => (
                <tr key={idx} className="hover:bg-parchment/40">
                  <td className="p-2.5 font-serif font-semibold text-charcoal">{med.name}</td>
                  <td className="p-2.5 font-mono text-xs text-charcoal-light">{med.dosage}</td>
                  <td className="p-2.5 font-mono text-xs text-olive-dark font-bold">{med.frequency}</td>
                  <td className="p-2.5 font-mono text-xs">{med.durationDays} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code & Digital Signature Verification */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-parchment-dark pt-4 gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white rounded-lg border border-parchment-dark shadow-sm">
            <QRCodeSVG value={prescription.qrCodeData} size={80} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-charcoal-light block">ABHA / Pharmacy Scan QR</span>
            <p className="text-xs font-serif text-charcoal max-w-xs">
              Show this QR code to Jan Aushadhi Kendra or local pharmacy for instant stock verification.
            </p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="flex items-center space-x-1 text-success-green text-xs font-bold font-serif mb-2">
            <CheckCircle className="w-4 h-4" />
            <span>Digitally Signed by Medical Officer</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={onDownloadPdf}
            >
              Download PDF
            </Button>
            <Button
              variant="olive"
              size="sm"
              icon={<Pill className="w-4 h-4" />}
              onClick={() => navigate('/pharmacy')}
            >
              Check Medicine Stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
