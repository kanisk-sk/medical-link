import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PharmacyItem } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

interface PharmacyMapProps {
  pharmacies: PharmacyItem[];
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({ pharmacies }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing map instance if present
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Punjab coordinates: 30.3752° N, 76.1528° E
    const map = L.map(containerRef.current).setView([30.3752, 76.1528], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Vintage Red Cross / Pill Marker Icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background-color:#A14C41; color:white; padding:6px; border-radius:50%; border:2px solid #324A66; text-align:center; font-weight:bold; font-size:14px; box-shadow: 0 4px 10px rgba(50,74,102,0.3);">🏥</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const knownLocations: Record<string, [number, number]> = {
      'ph-1': [30.3780, 76.1510],
      'ph-2': [30.3720, 76.1580],
      'ph-3': [30.3810, 76.1450]
    };

    pharmacies.forEach((pharm, idx) => {
      const coords = knownLocations[pharm.id] || [
        30.3752 + (idx * 0.006 - 0.009),
        76.1528 + (idx * 0.007 - 0.008)
      ];

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Merriweather', serif; color: #333; padding: 4px;">
            <strong style="color: #A14C41; font-size: 14px;">${pharm.pharmacyName}</strong><br/>
            <span style="font-size: 12px;">${pharm.pharmacyAddress}</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: #707B67;">${pharm.name}</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: #324A66;">Stock Status: ${pharm.stockStatus.toUpperCase()}</span>
          </div>
        `);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pharmacies]);

  return (
    <div className="bg-cream-light rounded-xl border-2 border-parchment-dark shadow-vintage overflow-hidden">
      <div className="bg-parchment px-4 py-2.5 border-b border-parchment-dark flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-denim uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brick" />
          Geographic Pharmacy & Jan Aushadhi Map (Rural Region)
        </h4>
        <span className="text-[10px] font-mono text-olive font-bold flex items-center gap-1">
          <Navigation className="w-3 h-3 text-brick" /> Live GPS Markers
        </span>
      </div>

      <div ref={containerRef} className="w-full h-64 md:h-80 bg-parchment/30 relative z-0" />
    </div>
  );
};
