import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PhoneCall, Navigation, AlertOctagon, CheckCircle2, ShieldAlert, MapPin, Radio, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSehatLinkIdentity } from '../hooks/useSehatLinkIdentity';

export const EmergencyPage: React.FC = () => {
  const { t } = useTranslation();
  const { name, village } = useSehatLinkIdentity();
  const [dispatched, setDispatched] = useState(false);
  const [dispatchTime, setDispatchTime] = useState<string | null>(null);

  const handleCallAmbulance = () => {
    setDispatched(true);
    setDispatchTime(new Date().toLocaleTimeString());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Emergency Warning Header Banner */}
      <Card variant="paper" className="p-6 border-4 border-emergency-red bg-brick/10 space-y-4 text-center relative overflow-hidden shadow-vintage-lg">
        {/* Animated Ripple Pulse Ring */}
        <div className="relative inline-block my-2">
          <span className="absolute -inset-4 rounded-full border-4 border-emergency-red animate-ping opacity-60" />
          <div className="p-5 rounded-full bg-emergency-red text-white w-20 h-20 mx-auto flex items-center justify-center shadow-lg relative z-10">
            <PhoneCall className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold font-serif text-emergency-red tracking-wider uppercase">
            🚑 {t('emergency.title')} (Nabha 108 SOS)
          </h1>
          <p className="text-xs font-serif text-charcoal font-semibold mt-1">
            Instant GPS Location Sharing & 108 Ambulance Command Unit Dispatch
          </p>
        </div>

        {dispatched ? (
          <div className="bg-success-green/15 border-2 border-success-green p-5 rounded-xl text-success-green space-y-3 font-serif text-left shadow-sm">
            <div className="flex items-center space-x-2 font-bold text-lg">
              <CheckCircle2 className="w-7 h-7 text-success-green animate-bounce" />
              <span>AMBULANCE DISPATCH CONFIRMED!</span>
            </div>
            <p className="text-xs text-charcoal">
              {t('emergency.alertMessage')}
            </p>
            <div className="bg-warm-white p-4 rounded-lg border border-parchment-dark text-xs font-mono text-charcoal space-y-1.5 shadow-inner">
              <p className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emergency-red animate-pulse" />
                <b>Unit Dispatched:</b> Nabha 108 Emergency Unit #PB-11-7482
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-olive" />
                <b>ETA:</b> ~8 Minutes (Dispatched at {dispatchTime})
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brick" />
                <b>GPS Coords:</b> 30.3752° N, 76.1528° E ({village}, Nabha Tehsil)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2 max-w-md mx-auto">
            <div className="bg-warm-white p-3.5 rounded-lg border border-parchment-dark text-xs font-mono text-charcoal flex items-center justify-between shadow-sm">
              <span>Patient: <b>{name}</b></span>
              <span>Village: <b>{village}</b></span>
            </div>

            <Button
              variant="emergency"
              size="xl"
              fullWidth
              icon={<PhoneCall className="w-6 h-6 animate-pulse" />}
              onClick={handleCallAmbulance}
            >
              DISPATCH 108 AMBULANCE NOW
            </Button>
          </div>
        )}
      </Card>

      {/* Immediate First Aid Protocol Timeline */}
      <Card variant="paper" className="p-6 space-y-4 shadow-vintage">
        <h3 className="text-base font-serif font-bold text-denim border-b border-parchment-dark pb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-brick" />
          {t('emergency.firstAidTitle')}
        </h3>

        <ul className="space-y-3 text-xs sm:text-sm font-serif text-charcoal">
          <li className="flex items-start space-x-3 p-3.5 bg-warm-white rounded-lg border border-parchment-dark shadow-sm">
            <span className="font-mono font-bold text-brick bg-brick/10 px-2 py-0.5 rounded text-xs">Step 1</span>
            <span>Keep the patient sitting upright in a quiet, ventilated space. Do not allow them to strain.</span>
          </li>
          <li className="flex items-start space-x-3 p-3.5 bg-warm-white rounded-lg border border-parchment-dark shadow-sm">
            <span className="font-mono font-bold text-brick bg-brick/10 px-2 py-0.5 rounded text-xs">Step 2</span>
            <span>Loosen tight clothing around the neck and waist. Keep airway clear.</span>
          </li>
          <li className="flex items-start space-x-3 p-3.5 bg-warm-white rounded-lg border border-parchment-dark shadow-sm">
            <span className="font-mono font-bold text-brick bg-brick/10 px-2 py-0.5 rounded text-xs">Step 3</span>
            <span>If emergency Sorbitrate 5mg or Aspirin 150mg is available, administer under ASHA guidance immediately.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
