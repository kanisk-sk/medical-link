import React, { useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';

import { HealthcareFacility, LocationPoint } from '../../types';

const CATEGORY_COLORS: Record<HealthcareFacility['category'], string> = {
  hospital: '#A14C41',
  clinic: '#324A66',
  pharmacy: '#707B67',
  laboratory: '#B47B38',
  emergency: '#B42318',
};

const CATEGORY_LABELS: Record<HealthcareFacility['category'], string> = {
  hospital: 'Hospital',
  clinic: 'Clinic',
  pharmacy: 'Pharmacy',
  laboratory: 'Diagnostic laboratory',
  emergency: 'Emergency care',
};

const iconFor = (category: HealthcareFacility['category']) =>
  L.divIcon({
    className: 'healthcare-map-marker',
    html: `<span style="background:${CATEGORY_COLORS[category]};">${category === 'pharmacy' ? '✚' : '✚'}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });

const formatDistance = (distanceKm?: number) =>
  distanceKm === undefined ? 'Distance unavailable' : `${distanceKm.toFixed(1)} km straight-line`;

interface MapViewportProps {
  selectedLocation: LocationPoint | null;
  focusedFacility: HealthcareFacility | null;
  onRequestLocation: () => void;
}

const MapViewport: React.FC<MapViewportProps> = ({
  selectedLocation,
  focusedFacility,
  onRequestLocation,
}) => {
  const map = useMap();

  useEffect(() => {
    if (focusedFacility) {
      map.flyTo([focusedFacility.latitude, focusedFacility.longitude], Math.max(map.getZoom(), 15));
    } else if (selectedLocation) {
      map.flyTo([selectedLocation.latitude, selectedLocation.longitude], Math.max(map.getZoom(), 13));
    }
  }, [focusedFacility, map, selectedLocation]);

  return (
    <button
      type="button"
      onClick={onRequestLocation}
      className="absolute right-3 top-3 z-[500] rounded-lg border border-parchment-dark bg-warm-white p-2 text-denim shadow-md hover:bg-parchment focus:outline-none focus:ring-2 focus:ring-brick"
      aria-label="Use my current location"
      title="Use my current location"
    >
      <LocateFixed className="h-5 w-5" />
    </button>
  );
};

interface HealthcareMapProps {
  facilities: HealthcareFacility[];
  selectedLocation: LocationPoint | null;
  focusedFacility: HealthcareFacility | null;
  onFacilitySelect: (facility: HealthcareFacility) => void;
  onRequestLocation: () => void;
}

export const HealthcareMap: React.FC<HealthcareMapProps> = ({
  facilities,
  selectedLocation,
  focusedFacility,
  onFacilitySelect,
  onRequestLocation,
}) => {
  const defaultCenter: LatLngExpression = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : [30.3752, 76.1528];

  return (
    <div className="relative z-0 h-[420px] overflow-hidden rounded-xl border-2 border-parchment-dark shadow-vintage sm:h-[560px]">
      <MapContainer center={defaultCenter} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport
          selectedLocation={selectedLocation}
          focusedFacility={focusedFacility}
          onRequestLocation={onRequestLocation}
        />

        {selectedLocation && (
          <CircleMarker
            center={[selectedLocation.latitude, selectedLocation.longitude]}
            radius={9}
            pathOptions={{ color: '#324A66', fillColor: '#324A66', fillOpacity: 0.9 }}
          >
            <Popup>Selected search location</Popup>
          </CircleMarker>
        )}

        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            icon={iconFor(facility.category)}
            eventHandlers={{ click: () => onFacilitySelect(facility) }}
          >
            <Popup>
              <div className="min-w-[210px] font-sans text-sm text-charcoal">
                <strong className="text-base" style={{ color: CATEGORY_COLORS[facility.category] }}>
                  {facility.name}
                </strong>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                  {CATEGORY_LABELS[facility.category]}
                </div>
                <p className="mt-2">{facility.address}</p>
                {facility.phone && <p>{facility.phone}</p>}
                {facility.is_verified && facility.operating_hours && (
                  <p>Hours: {facility.operating_hours}</p>
                )}
                <p className="mt-2 font-semibold text-denim">{formatDistance(facility.distanceKm)}</p>
                {facility.is_verified && (
                  <p className="mt-1 text-xs font-semibold text-olive">Verified facility information</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
