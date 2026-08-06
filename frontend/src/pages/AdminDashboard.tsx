import React from 'react';
import { AdminCharts } from '../components/dashboard/AdminCharts';
import { Card } from '../components/common/Card';
import { ShieldCheck, Download, Users, Sliders } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Banner Header */}
      <div className="bg-cream-light p-6 rounded-xl border-2 border-parchment-dark shadow-vintage flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-olive font-bold tracking-widest block">
            ADMINISTRATION & ANALYTICS PORTAL
          </span>
          <h1 className="text-2xl font-bold font-serif text-denim">
            Nabha Tele-Health Analytics & ABHA Locker Status
          </h1>
          <p className="text-xs font-mono text-charcoal-light">
            Aggregated, De-identified Metrics (India DPDP Act 2023 Compliant)
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export Health Report (CSV)
          </Button>
        </div>
      </div>

      <AdminCharts />
    </div>
  );
};
