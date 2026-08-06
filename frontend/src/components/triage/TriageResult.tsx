import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Priority } from '../../types';
import { AlertOctagon, PhoneCall, Stethoscope, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface TriageResultProps {
  priority: Priority;
  alerts: string[];
  symptomsCount: number;
}

export const TriageResult: React.FC<TriageResultProps> = ({ priority, alerts, symptomsCount }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isHigh = priority === 'HIGH';

  return (
    <Card
      variant="ornate"
      className={`p-6 my-6 ${
        isHigh ? 'border-brick bg-brick/5' : 'border-denim bg-cream-light'
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-parchment-dark pb-4 mb-4 gap-3">
        <div className="flex items-center space-x-3">
          {isHigh ? (
            <div className="p-3 rounded-full bg-brick text-white animate-pulse">
              <AlertOctagon className="w-8 h-8" />
            </div>
          ) : (
            <div className="p-3 rounded-full bg-olive text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}
          <div>
            <span className="text-xs font-mono uppercase text-charcoal-light tracking-wider">
              Triage Assessment Result
            </span>
            <h2 className="text-xl font-bold font-serif text-charcoal">
              {isHigh ? t('triage.highPriority') : t('triage.medPriority')}
            </h2>
          </div>
        </div>

        <Badge priority={priority} className="text-sm px-4 py-1.5" />
      </div>

      {/* Red-Flag Alerts List */}
      {alerts.length > 0 && (
        <div className="bg-brick/10 border border-brick/30 rounded-lg p-4 mb-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brick flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            Safety Alert Notes (Non-AI Protocol)
          </h4>
          <ul className="list-disc list-inside text-sm text-brick-dark space-y-1">
            {alerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-charcoal-light font-serif mb-6 leading-relaxed">
        {isHigh
          ? t('triage.emergencyNote')
          : 'Your symptoms have been logged and assigned to the doctor queue. An online remote doctor will review your vitals shortly.'}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isHigh && (
          <Button
            variant="emergency"
            size="lg"
            fullWidth
            icon={<PhoneCall className="w-5 h-5" />}
            onClick={() => navigate('/emergency')}
          >
            {t('triage.callEmergency')}
          </Button>
        )}
        <Button
          variant={isHigh ? 'outline' : 'primary'}
          size="lg"
          fullWidth
          icon={<Stethoscope className="w-5 h-5" />}
          onClick={() => navigate('/consultation')}
        >
          {t('triage.proceedDoctor')}
        </Button>
      </div>
    </Card>
  );
};
