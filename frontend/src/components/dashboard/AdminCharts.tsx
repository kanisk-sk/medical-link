import React from 'react';
import { Card } from '../common/Card';
import { Activity, AlertTriangle, Users, Pill, TrendingUp } from 'lucide-react';

export const AdminCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="paper" className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-brick/15 text-brick rounded-lg border border-brick/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal-light block">Total Consultations</span>
            <span className="text-2xl font-bold font-serif text-charcoal">1,428</span>
            <span className="text-[10px] text-success-green font-mono block">↑ 14% vs last week</span>
          </div>
        </Card>

        <Card variant="paper" className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-warning-amber/20 text-yellow-950 rounded-lg border border-warning-amber/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal-light block">High-Priority Cases</span>
            <span className="text-2xl font-bold font-serif text-brick">42</span>
            <span className="text-[10px] text-brick font-mono block">Emergency Routed</span>
          </div>
        </Card>

        <Card variant="paper" className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-olive/15 text-olive-dark rounded-lg border border-olive/30">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal-light block">E-Prescriptions Issued</span>
            <span className="text-2xl font-bold font-serif text-charcoal">1,190</span>
            <span className="text-[10px] text-olive font-mono block">98% Dispensed</span>
          </div>
        </Card>

        <Card variant="paper" className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-denim/15 text-denim rounded-lg border border-denim/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal-light block">Active ASHA Workers</span>
            <span className="text-2xl font-bold font-serif text-denim">86</span>
            <span className="text-[10px] text-charcoal-light font-mono block">Across 44 Villages</span>
          </div>
        </Card>
      </div>

      {/* Outbreak / Symptom Cluster Bar Visualizer */}
      <Card variant="paper" className="p-6">
        <div className="flex items-center justify-between border-b border-parchment-dark pb-3 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-denim">Symptom Distribution & Outbreak Monitoring</h3>
            <p className="text-xs font-mono text-charcoal-light">Rural Block • Real-time Data (DPDP De-identified)</p>
          </div>
          <span className="text-xs font-mono bg-brick/10 text-brick px-2.5 py-1 rounded border border-brick/30 font-bold">
            ⚠ Outbreak Alert: Fever Spike in Village Bhadson
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-serif font-bold mb-1">
              <span>Fever / Viral Illness (ਬੁਖਾਰ)</span>
              <span>420 cases (38%)</span>
            </div>
            <div className="w-full bg-parchment h-3 rounded-full overflow-hidden">
              <div className="bg-brick h-full rounded-full" style={{ width: '38%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-serif font-bold mb-1">
              <span>Respiratory / Cough (ਖੰਘ)</span>
              <span>310 cases (28%)</span>
            </div>
            <div className="w-full bg-parchment h-3 rounded-full overflow-hidden">
              <div className="bg-denim h-full rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-serif font-bold mb-1">
              <span>Hypertension & Chest Symptoms</span>
              <span>180 cases (16%)</span>
            </div>
            <div className="w-full bg-parchment h-3 rounded-full overflow-hidden">
              <div className="bg-warning-amber h-full rounded-full" style={{ width: '16%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-serif font-bold mb-1">
              <span>Dermatology / Skin Rashes</span>
              <span>120 cases (11%)</span>
            </div>
            <div className="w-full bg-parchment h-3 rounded-full overflow-hidden">
              <div className="bg-olive h-full rounded-full" style={{ width: '11%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
