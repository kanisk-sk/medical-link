import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VintageSealBadge } from '../assistant/VintageSealBadge';
import { PatientRecord } from '../../types';
import { ShieldCheck, Download, Printer, QrCode, FileText, ChevronDown, ChevronUp, Calendar, HeartPulse } from 'lucide-react';
import { Button } from '../common/Button';

interface QRHealthCardProps {
  patient: PatientRecord;
}

export const QRHealthCard: React.FC<QRHealthCardProps> = ({ patient }) => {
  const [showTimeline, setShowTimeline] = useState<boolean>(false);

  const qrData = JSON.stringify({
    sehatlink_id: patient.id,
    abha_id: patient.abhaId || '91-4820-1928-3741',
    name: patient.name,
    village: patient.village,
    priority: patient.priority,
    issued: 'Rural PHC'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-cream-light rounded-xl border-2 border-denim shadow-vintage-lg overflow-hidden max-w-lg mx-auto print:border-none print:shadow-none">
      {/* Top Vintage Card Header */}
      <div className="bg-denim text-cream px-5 py-4 border-b-2 border-vintage-gold flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VintageSealBadge size="md" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-vintage-gold uppercase block">
              Govt. of Punjab • Tele-Health ABHA Card
            </span>
            <h3 className="font-serif font-bold text-lg leading-tight text-white">
              ਸਿਹਤ ਲਿੰਕ Health Identity Card
            </h3>
          </div>
        </div>
        <ShieldCheck className="w-6 h-6 text-vintage-gold shrink-0" />
      </div>

      {/* Card Main Body */}
      <div className="p-5 bg-paper-grain space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-vintage-paper p-4 rounded-lg border border-parchment-dark shadow-sm">
          {/* QR Code */}
          <div className="p-3 bg-white rounded-lg border-2 border-denim shadow-inner shrink-0 text-center">
            <QRCodeSVG value={qrData} size={110} level="H" includeMargin={false} />
            <span className="text-[9px] font-mono font-bold text-charcoal block mt-1">
              ABHA QR Verified
            </span>
          </div>

          {/* Demographic Data */}
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h4 className="font-serif font-bold text-lg text-brick leading-tight">
              {patient.name}
            </h4>
            <p className="text-xs font-mono font-bold text-denim">
              ABHA ID: <span className="text-charcoal">{patient.abhaId || '91-4820-1928-3741'}</span>
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-serif text-charcoal-light pt-1">
              <div>
                <span className="text-[10px] font-mono text-olive uppercase block">Age / Gender</span>
                <span className="font-bold text-charcoal">{patient.age} Yrs • {patient.gender}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-olive uppercase block">Village</span>
                <span className="font-bold text-charcoal">{patient.village}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-olive uppercase block">Contact</span>
                <span className="font-bold text-charcoal">{patient.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-olive uppercase block">Triage Status</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  patient.priority === 'HIGH' ? 'bg-emergency-red text-white' : 'bg-success-green text-white'
                }`}>
                  {patient.priority} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History Accordion */}
        <div className="border border-parchment-dark rounded-lg overflow-hidden bg-warm-white">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="w-full px-4 py-2.5 bg-parchment flex items-center justify-between text-xs font-serif font-bold text-denim hover:bg-cream transition"
          >
            <span className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-brick" />
              Medical Records & Vaccination History
            </span>
            {showTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTimeline && (
            <div className="p-3 space-y-2 text-xs font-sans divide-y divide-parchment">
              <div className="pt-1 flex justify-between items-start">
                <div>
                  <p className="font-bold text-charcoal">Hypertension & Low SpO2 Triage</p>
                  <p className="text-[11px] text-charcoal-light">Recorded by Harpreet Kaur (ASHA)</p>
                </div>
                <span className="font-mono text-[10px] text-olive font-bold">10 Aug 2026</span>
              </div>
              <div className="pt-2 flex justify-between items-start">
                <div>
                  <p className="font-bold text-charcoal">Covid Booster Vaccination</p>
                  <p className="text-[11px] text-charcoal-light">Civil Hospital</p>
                </div>
                <span className="font-mono text-[10px] text-olive font-bold">14 Jan 2025</span>
              </div>
            </div>
          )}
        </div>

        {/* Print / Share Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Health Card
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('Downloading offline QR Card image...')}
          >
            Download Card
          </Button>
        </div>
      </div>
    </div>
  );
};
