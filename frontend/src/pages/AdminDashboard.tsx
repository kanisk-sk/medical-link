import React from 'react';
import { AdminCharts } from '../components/dashboard/AdminCharts';
import { VillageHeatmap } from '../components/maps/VillageHeatmap';
import { Card } from '../components/common/Card';
import { ShieldCheck, Download, Users, Sliders, Activity, PhoneCall, Building2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminDashboard: React.FC = () => {
  const summaryMetrics = [
    { label: 'Total Village Consultations', val: '1,420', sub: 'Nabha Tehsil (Past 30 Days)' },
    { label: 'Emergency 108 Dispatches', val: '38 Alerts', sub: 'Avg Response: 7.8 Mins' },
    { label: 'Active ASHA Workers', val: '142 Workers', sub: '48 Villages Covered' },
    { label: 'Jan Aushadhi Inventory', val: '94.2%', sub: 'Generic Stock Availability' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Banner Header */}
      <div className="bg-denim text-white p-6 rounded-xl border-2 border-vintage-gold shadow-vintage flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-vintage-gold font-bold tracking-widest block">
            PUNJAB RURAL TELE-HEALTH ADMINISTRATION • NABHA TEHSIL
          </span>
          <h1 className="text-2xl font-bold font-serif text-white">
            District Healthcare Analytics & Disease Outbreak Heatmap
          </h1>
          <p className="text-xs font-serif text-cream-light/80">
            De-identified Telemedicine Metrics & ABDM Compliance Oversight (India DPDP Act 2023 Compliant)
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('Downloading Nabha District Healthcare Report (CSV)...')}
          >
            Export Health Report (CSV)
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m, idx) => (
          <Card key={idx} variant="paper" className="p-4 border-l-4 border-brick">
            <span className="text-[10px] font-mono font-bold uppercase text-olive block">{m.label}</span>
            <span className="text-2xl font-serif font-bold text-charcoal block mt-1">{m.val}</span>
            <span className="text-[11px] font-serif text-charcoal-light block mt-0.5">{m.sub}</span>
          </Card>
        ))}
      </div>

      {/* Disease Outbreak Heatmap Map */}
      <VillageHeatmap />

      {/* Doctor Statistics & Charts */}
      <AdminCharts />
    </div>
  );
};
