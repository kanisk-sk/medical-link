import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ChevronRight,
  Clock3,
  ExternalLink,
  Loader2,
  MapPinned,
  Phone,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Button } from '../components/common/Button';
import { HealthcareMap } from '../components/maps/HealthcareMap';
import { supabase } from '../utils/supabase';
import {
  HealthcareFacility,
  HealthcareFacilityCategory,
  LocationPoint,
} from '../types';

const DEFAULT_LOCATION: LocationPoint = {
  latitude: 30.3752,
  longitude: 76.1528,
  label: 'Rural Punjab',
};

const CATEGORIES: Array<{ value: HealthcareFacilityCategory; label: string }> = [
  { value: 'hospital', label: 'Hospitals' },
  { value: 'clinic', label: 'Clinics' },
  { value: 'pharmacy', label: 'Pharmacies' },
  { value: 'laboratory', label: 'Diagnostic labs' },
  { value: 'emergency', label: 'Emergency care' },
];

const CATEGORY_LABELS: Record<HealthcareFacilityCategory, string> = {
  hospital: 'Hospital',
  clinic: 'Clinic',
  pharmacy: 'Pharmacy',
  laboratory: 'Diagnostic laboratory',
  emergency: 'Emergency care',
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceInKm = (from: LocationPoint, to: HealthcareFacility) => {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const isValidFacility = (facility: HealthcareFacility) =>
  Boolean(
    facility.id &&
      facility.name &&
      facility.address &&
      Number.isFinite(facility.latitude) &&
      Number.isFinite(facility.longitude) &&
      facility.latitude >= -90 &&
      facility.latitude <= 90 &&
      facility.longitude >= -180 &&
      facility.longitude <= 180 &&
      CATEGORIES.some(({ value }) => value === facility.category)
  );

export const HealthcareMapPage: React.FC = () => {
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
  const [focusedFacility, setFocusedFacility] = useState<HealthcareFacility | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<HealthcareFacilityCategory[]>(
    CATEGORIES.map(({ value }) => value)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);
  const [loading, setLoading] = useState(true);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadFacilities = async () => {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('healthcare_facilities')
        .select(
          'id,name,category,latitude,longitude,address,phone,operating_hours,description,website,is_verified'
        )
        .order('name');

      if (!active) return;
      if (queryError) {
        setError(
          'Healthcare facilities could not be loaded. Please check the Supabase table and try again.'
        );
        setLoading(false);
        return;
      }

      const validFacilities = ((data || []) as HealthcareFacility[]).filter(isValidFacility);
      setFacilities(validFacilities);
      setLoading(false);
    };

    void loadFacilities();
    return () => {
      active = false;
    };
  }, []);

  const requestLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location sharing. Search for a locality instead.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setSelectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          label: 'Your current location',
        });
        setFocusedFacility(null);
      },
      () => {
        setLocationError(
          'Location permission was not granted. Search for a town, village, or address instead.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const searchLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    const query = locationQuery.trim();
    if (!query) return;

    setSearchingLocation(true);
    setLocationError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Location search failed');
      const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      const result = results[0];
      if (!result) {
        setLocationError('No matching location was found. Try a nearby town or district.');
        return;
      }

      setSelectedLocation({
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        label: result.display_name,
      });
      setFocusedFacility(null);
    } catch {
      setLocationError('Location search is temporarily unavailable. Please try again later.');
    } finally {
      setSearchingLocation(false);
    }
  };

  const visibleFacilities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const origin = selectedLocation || DEFAULT_LOCATION;

    return facilities
      .filter((facility) => selectedCategories.includes(facility.category))
      .filter((facility) => {
        if (!normalizedSearch) return true;
        return [facility.name, facility.address, facility.category, facility.description]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch));
      })
      .map((facility) => ({
        ...facility,
        distanceKm: distanceInKm(origin, facility),
      }))
      .filter((facility) => !selectedLocation || facility.distanceKm! <= radiusKm)
      .sort((first, second) => first.distanceKm! - second.distanceKm!);
  }, [facilities, radiusKm, searchTerm, selectedCategories, selectedLocation]);

  const toggleCategory = (category: HealthcareFacilityCategory) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((value) => value !== category)
        : [...current, category]
    );
  };

  const openDirections = (facility: HealthcareFacility) => {
    const origin = selectedLocation
      ? `${selectedLocation.latitude},${selectedLocation.longitude}`
      : '';
    const destination = `${facility.latitude},${facility.longitude}`;
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
      origin
    )};${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-olive">Care near you</p>
            <h1 className="flex items-center gap-2 font-serif text-3xl font-bold text-denim">
              <MapPinned className="h-8 w-8 text-brick" />
              Healthcare Map
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-charcoal-light">
              Find verified hospitals, clinics, pharmacies, laboratories, and emergency care facilities.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<MapPinned className="h-4 w-4" />}
            onClick={requestLocation}
          >
            Use my location
          </Button>
        </div>
      </header>

      <section className="space-y-4 rounded-xl border-2 border-parchment-dark bg-cream-light p-4 shadow-vintage">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search facilities</span>
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-charcoal-light" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search facility, address, or locality"
              className="min-h-[44px] w-full rounded-lg border border-parchment-dark bg-warm-white pl-10 pr-3 text-sm outline-none focus:border-brick focus:ring-2 focus:ring-brick/20"
            />
          </label>
          <form onSubmit={searchLocation} className="flex gap-2">
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Search location</span>
              <MapPinned className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-charcoal-light" />
              <input
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Set location: village or town"
                className="min-h-[44px] w-full rounded-lg border border-parchment-dark bg-warm-white pl-10 pr-3 text-sm outline-none focus:border-brick focus:ring-2 focus:ring-brick/20"
              />
            </label>
            <Button type="submit" variant="secondary" size="sm" disabled={searchingLocation}>
              {searchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </form>
          <label className="flex min-h-[44px] items-center gap-2 rounded-lg border border-parchment-dark bg-warm-white px-3 text-sm text-denim">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="whitespace-nowrap">Radius: {radiusKm} km</span>
            <input
              type="range"
              min="1"
              max="100"
              value={radiusKm}
              onChange={(event) => setRadiusKm(Number(event.target.value))}
              className="w-full accent-brick"
              aria-label="Search radius in kilometres"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => toggleCategory(category.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                selectedCategories.includes(category.value)
                  ? 'border-brick bg-brick text-white'
                  : 'border-parchment-dark bg-warm-white text-charcoal-light'
              }`}
              aria-pressed={selectedCategories.includes(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {(selectedLocation || locationError) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {selectedLocation && (
              <span className="rounded-full bg-denim/10 px-3 py-1.5 font-semibold text-denim">
                Searching around: {selectedLocation.label || 'selected location'}
              </span>
            )}
            {locationError && (
              <span className="flex items-center gap-1 text-emergency-red">
                <AlertCircle className="h-4 w-4" />
                {locationError}
              </span>
            )}
          </div>
        )}
      </section>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-emergency-red" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <HealthcareMap
          facilities={visibleFacilities}
          selectedLocation={selectedLocation}
          focusedFacility={focusedFacility}
          onFacilitySelect={setFocusedFacility}
          onRequestLocation={requestLocation}
        />

        <section className="min-h-[420px] rounded-xl border-2 border-parchment-dark bg-cream-light p-4 shadow-vintage sm:min-h-[560px]">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-parchment-dark pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-denim">Nearby facilities</h2>
              <p className="text-xs text-charcoal-light">
                {loading ? 'Loading directory…' : `${visibleFacilities.length} facilities shown`}
              </p>
            </div>
            {selectedLocation && <span className="text-xs text-charcoal-light">Sorted by distance</span>}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-charcoal-light">
              <Loader2 className="h-5 w-5 animate-spin text-brick" />
              Loading healthcare facilities…
            </div>
          )}

          {!loading && !error && visibleFacilities.length === 0 && (
            <div className="py-16 text-center">
              <MapPinned className="mx-auto mb-3 h-10 w-10 text-parchment-dark" />
              <h3 className="font-serif font-bold text-denim">No facilities found</h3>
              <p className="mt-1 text-sm text-charcoal-light">
                Try a wider radius, another category, or a different search term.
              </p>
            </div>
          )}

          <div className="space-y-2">
            {visibleFacilities.map((facility) => (
              <article
                key={facility.id}
                className={`cursor-pointer rounded-lg border p-3 transition ${
                  focusedFacility?.id === facility.id
                    ? 'border-brick bg-brick/5 shadow-sm'
                    : 'border-parchment-dark bg-warm-white hover:border-brick/60'
                }`}
                onClick={() => setFocusedFacility(facility)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setFocusedFacility(facility);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-denim">{facility.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wide text-olive">
                      {CATEGORY_LABELS[facility.category]}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-charcoal-light" />
                </div>
                <p className="mt-2 text-xs text-charcoal-light">{facility.address}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-charcoal-light">
                  <span className="font-semibold text-denim">
                    {facility.distanceKm!.toFixed(1)} km straight-line
                  </span>
                  {facility.phone && (
                    <a
                      href={`tel:${facility.phone}`}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center gap-1 hover:text-brick"
                    >
                      <Phone className="h-3 w-3" />
                      {facility.phone}
                    </a>
                  )}
                  {facility.is_verified && facility.operating_hours && (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {facility.operating_hours}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openDirections(facility);
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brick hover:text-brick-dark"
                >
                  Open directions
                  <ExternalLink className="h-3 w-3" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <p className="text-center text-[11px] text-charcoal-light">
        Map data © OpenStreetMap contributors. Distances are straight-line estimates, not road distances or travel times.
      </p>
    </div>
  );
};
