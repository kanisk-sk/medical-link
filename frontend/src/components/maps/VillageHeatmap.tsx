import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, ShieldAlert, Users } from 'lucide-react';

interface VillageData {
  name: string;
  lat: number;
  lng: number;
  disease: string;
  cases: number;
  severity: 'high' | 'medium' | 'low';
  ashaWorker: string;
}

const VILLAGES: VillageData[] = [
  { name: 'Alhoran', lat: 30.3820, lng: 76.1450, disease: 'Viral Fever & Low SpO2', cases: 14, severity: 'high', ashaWorker: 'Harpreet Kaur' },
  { name: 'Bhadson', lat: 30.3950, lng: 76.1720, disease: 'Dengue Suspected', cases: 8, severity: 'high', ashaWorker: 'Gurjit Kaur' },
  { name: 'Rohti Chhanna', lat: 30.3620, lng: 76.1380, disease: 'Hypertension', cases: 19, severity: 'medium', ashaWorker: 'Balwinder Kaur' },
  { name: 'Duladdi', lat: 30.3540, lng: 76.1680, disease: 'Seasonal Allergy', cases: 5, severity: 'low', ashaWorker: 'Manpreet Kaur' },
  { name: 'Kaulseri', lat: 30.3910, lng: 76.1280, disease: 'Waterborne Diarrhea', cases: 11, severity: 'medium', ashaWorker: 'Sarbjit Kaur' },
  { name: 'Agol', lat: 30.3420, lng: 76.1550, disease: 'Routine Intake', cases: 3, severity: 'low', ashaWorker: 'Kuldeep Kaur' }
];

export const VillageHeatmap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current).setView([30.3752, 76.1528], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    VILLAGES.forEach((v) => {
      const color = v.severity === 'high' ? '#C0392B' : v.severity === 'medium' ? '#D4A03C' : '#5D8A5E';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-heatmap-marker',
        html: `
          <div style="
            background-color: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            border: 2px solid #324A66;
            font-family: 'Merriweather', serif;
            font-weight: bold;
            font-size: 11px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            📍 ${v.name} (${v.cases})
          </div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      });

      L.marker([v.lat, v.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Merriweather', serif; color: #333; padding: 4px;">
            <strong style="color: ${color}; font-size: 14px;">Village: ${v.name}</strong><br/>
            <span style="font-size: 12px;">Active Concern: <b>${v.disease}</b></span><br/>
            <span style="font-size: 11px; color: #324A66;">Active Cases: <b>${v.cases} patients</b></span><br/>
            <span style="font-size: 11px; color: #707B67;">ASHA Lead: <b>${v.ashaWorker}</b></span>
          </div>
        `);

      // Draw radius circle for high/medium severity
      if (v.severity === 'high' || v.severity === 'medium') {
        L.circle([v.lat, v.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.2,
          radius: v.severity === 'high' ? 1200 : 700
        }).addTo(map);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-cream-light rounded-xl border-2 border-parchment-dark shadow-vintage overflow-hidden">
      <div className="bg-parchment px-4 py-2.5 border-b border-parchment-dark flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-denim uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-brick animate-pulse" />
          Rural Rural Disease Outbreak Heatmap
        </h4>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
          <span className="flex items-center gap-1 text-emergency-red">● High Risk</span>
          <span className="flex items-center gap-1 text-warning-amber">● Medium Risk</span>
          <span className="flex items-center gap-1 text-success-green">● Stable</span>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-80 bg-parchment/30 relative z-0" />
    </div>
  );
};
