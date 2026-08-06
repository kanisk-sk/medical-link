import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PhoneCall, Navigation, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSehatLinkIdentity } from '../hooks/useSehatLinkIdentity';

export const EmergencyPage: React.FC = () => {
  const { t } = useTranslation();
  const { name, village } = useSehatLinkIdentity();
  const [dispatched, setDispatched] = useState(false);

  const handleCallAmbulance = () => {
    setDispatched(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Emergency Warning Banner */}
      <Card variant="paper" className="p-6 border-4 border-emergency-red bg-brick/10 space-y-4 text-center">
        <div className="p-4 rounded-full bg-emergency-red text-white w-20 h-20 mx-auto flex items-center justify-center animate-bounce shadow-lg">
          <PhoneCall className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-3xl font-bold font-serif text-emergency-red tracking-wider uppercase">
            🚑 {t('emergency.title')}
          </h1>
          <p className="text-xs font-serif text-charcoal font-semibold mt-1">
            One-Touch 108 Ambulance Dispatch & Emergency Response Unit
          </p>
        </div>

        {dispatched ? (
          <div className="bg-success-green/15 border-2 border-success-green p-4 rounded-xl text-success-green space-y-2 font-serif text-left">
            <div className="flex items-center space-x-2 font-bold text-base">
              <CheckCircle2 className="w-6 h-6" />
              <span>AMBULANCE DISPATCH CONFIRMED!</span>
            </div>
            <p className="text-xs text-charcoal">
              {t('emergency.alertMessage')}
            </p>
            <div className="bg-warm-white p-3 rounded-lg border border-parchment-dark text-xs font-mono text-charcoal space-y-1">
              <p><b>Unit Dispatched:</b> Nabha 108 Emergency Unit #PB-11-7482</p>
              <p><b>ETA:</b> ~8-12 Minutes</p>
              <p><b>GPS Coords Shared:</b> 30.3752° N, 76.1528° E ({village})</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="bg-warm-white p-3 rounded-lg border border-parchment-dark text-xs font-mono text-charcoal-light flex items-center justify-between">
              <span>Patient: <b>{name}</b></span>
              <span>Village: <b>{village}</b></span>
            </div>

            <Button
              variant="emergency"
              size="xl"
              fullWidth
              icon={<PhoneCall className="w-6 h-6" />}
              onClick={handleCallAmbulance}
            >
              DISPATCH 108 AMBULANCE NOW
            </Button>
          </div>
        )}
      </Card>

      {/* Immediate First Aid Guidance */}
      <Card variant="paper" className="p-6 space-y-4">
        <h3 className="text-base font-serif font-bold text-denim border-b border-parchment-dark pb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-brick" />
          {t('emergency.firstAidTitle')}
        </h3>

        <ul className="space-y-3 text-sm font-serif text-charcoal">
          <li className="flex items-start space-x-3 p-3 bg-warm-white rounded-lg border border-parchment-dark">
            <span className="font-mono font-bold text-brick bg-brick/10 px-2 py-0.5 rounded text-xs">1</span>
            <span>Keep the patient sitting upright in a quiet, ventilated space. Do not allow them to walk or strain.</span>
          </li>
          <li className="flex items-start space-x-3 p-3 bg-warm-white rounded-lg border border-parchment-dark">
            <span className="font-mono font-bold text-brick bg-brick/10 px-2 py-0.5 rounded text-xs">2</span>
            <span>Loosen any tight clothing around the neck, chest, or waist.</span>
          </li>
          <li className="flex items-start space-x-3 p-3 bg-warm-white rounded-lg border border-parchment-dark">
            <span className="font-mono font-bold text-brick bg-brick/10 px-2 py-0.5 rounded text-xs">3</span>
            <span>If Sorbitrate / Aspirin is prescribed by the doctor, administer under ASHA guidance immediately.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
