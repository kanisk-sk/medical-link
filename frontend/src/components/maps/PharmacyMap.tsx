import React, { useEffect } from 'react';
import { PharmacyItem } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

interface PharmacyMapProps {
  pharmacies: PharmacyItem[];
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({ pharmacies }) => {
  useEffect(() => {
    // Dynamically initialize Leaflet map if Leaflet is loaded
    if (typeof window !== 'undefined' && (window as any).L) {
      const L = (window as any).L;
      const container = L.DomUtil.get('pharmacy-leaflet-map');
      if (container != null) {
        container._leaflet_id = null;
      }
      
      // Nabha, Punjab coordinates: 30.3752° N, 76.1528° E
      const map = L.map('pharmacy-leaflet-map').setView([30.3752, 76.1528], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom Vintage Red Cross / Pill Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color:#A14C41; color:white; padding:6px; border-radius:50%; border:2px solid #324A66; text-align:center; font-weight:bold; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏥</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      pharmacies.forEach((pharm) => {
        // Offset coords slightly around Nabha
        const lat = 30.3752 + (Math.random() - 0.5) * 0.04;
        const lng = 76.1528 + (Math.random() - 0.5) * 0.04;

        L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<b>${pharm.pharmacyName}</b><br/>${pharm.pharmacyAddress}<br/>Status: <b>${pharm.stockStatus}</b>`);
      });
    }
  }, [pharmacies]);

  return (
    <div className="bg-cream-light rounded-xl border-2 border-parchment-dark shadow-vintage overflow-hidden">
      <div className="bg-parchment px-4 py-2.5 border-b border-parchment-dark flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-denim uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brick" />
          Geographic Pharmacy Map (Nabha Region)
        </h4>
        <span className="text-[10px] font-mono text-olive font-bold">
          OpenStreetMap Integration
        </span>
      </div>

      <div id="pharmacy-leaflet-map" className="w-full h-64 md:h-80 bg-parchment/30 relative">
        <div className="absolute inset-0 flex items-center justify-center text-charcoal-light font-serif text-sm pointer-events-none">
          <span>Loading Nabha Pharmacy Coordinates...</span>
        </div>
      </div>
    </div>
  );
};
