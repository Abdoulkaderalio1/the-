import React, { useState } from 'react';
import { MapPin, Navigation, Eye, EyeOff, Compass, Shield, Users, ArrowRight } from 'lucide-react';
import { NigerRegion, Profile } from '../types';
import { NIGER_REGIONS, calculateDistanceKm } from '../utils/geo';

interface GeoMapFilterProps {
  userLocation: { latitude: number; longitude: number; city: NigerRegion };
  setUserLocation: (loc: { latitude: number; longitude: number; city: NigerRegion }) => void;
  locationPrivacy: 'exact' | 'city' | 'hidden';
  setLocationPrivacy: (val: 'exact' | 'city' | 'hidden') => void;
  selectedRegion: 'all' | NigerRegion;
  setSelectedRegion: (region: 'all' | NigerRegion) => void;
  maxDistanceKm: number;
  setMaxDistanceKm: (dist: number) => void;
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
}

export const GeoMapFilter: React.FC<GeoMapFilterProps> = ({
  userLocation,
  setUserLocation,
  locationPrivacy,
  setLocationPrivacy,
  selectedRegion,
  setSelectedRegion,
  maxDistanceKm,
  setMaxDistanceKm,
  profiles,
  onSelectProfile,
}) => {
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string | null>(null);

  // Request actual device GPS position
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setGpsDetecting(true);
    setGpsSuccessMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsDetecting(false);
        // Determine nearest Niger region
        let nearestCity: NigerRegion = 'Niamey';
        let minD = Infinity;

        Object.entries(NIGER_REGIONS).forEach(([name, info]) => {
          const d = calculateDistanceKm(pos.coords.latitude, pos.coords.longitude, info.lat, info.lng);
          if (d < minD) {
            minD = d;
            nearestCity = name as NigerRegion;
          }
        });

        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: nearestCity,
        });

        setGpsSuccessMessage(`Coordonnées GPS captées avec succès (Région la plus proche : ${nearestCity})`);
        setTimeout(() => setGpsSuccessMessage(null), 4000);
      },
      () => {
        setGpsDetecting(false);
        // Fallback default Niamey
        setGpsSuccessMessage("Position définie par défaut sur Niamey (accès GPS restreint par l'appareil).");
        setTimeout(() => setGpsSuccessMessage(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Privacy Location Control Strip (Required by user prompt) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-800" />
              <h2 className="text-base font-bold text-stone-900">
                Paramètre de Confidentialité de Géolocalisation
              </h2>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Contrôlez si et comment les autres célibataires peuvent voir votre position et la distance en temps réel.
            </p>
          </div>

          {/* Real-time Toggle buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setLocationPrivacy('exact')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                locationPrivacy === 'exact'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Position Réelle</span>
            </button>
            <button
              type="button"
              onClick={() => setLocationPrivacy('city')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                locationPrivacy === 'city'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ville Uniquement</span>
            </button>
            <button
              type="button"
              onClick={() => setLocationPrivacy('hidden')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                locationPrivacy === 'hidden'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Masquer</span>
            </button>
          </div>
        </div>

        {/* Current User Base Location & GPS Button */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>
              Votre position de recherche actuelle : <strong>{userLocation.city}</strong> ({userLocation.latitude.toFixed(2)}° N, {userLocation.longitude.toFixed(2)}° E)
            </span>
          </div>

          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={gpsDetecting}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${gpsDetecting ? 'animate-spin' : ''}`} />
            <span>{gpsDetecting ? 'Détection GPS...' : 'Actualiser via GPS réel'}</span>
          </button>
        </div>

        {gpsSuccessMessage && (
          <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-medium border border-emerald-200">
            {gpsSuccessMessage}
          </div>
        )}
      </div>

      {/* Interactive Region Selector & Distance Radius */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regions Grid (The Map of Niger 8 Regions) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">
              Explorer par Région du Niger
            </h3>
            <span className="text-xs text-stone-500">8 Régions administratives</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(NIGER_REGIONS).map(([regionName, info]) => {
              const isSelected = selectedRegion === regionName;
              const distFromUser = calculateDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                info.lat,
                info.lng
              );

              return (
                <button
                  key={regionName}
                  type="button"
                  onClick={() => setSelectedRegion(isSelected ? 'all' : (regionName as NigerRegion))}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-800 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-800/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-stone-900 flex items-center justify-between">
                      <span>{regionName}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-700" />
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-stone-400" />
                      <span className="font-mono tabular-nums">{info.activeSinglesCount}</span>
                      <span>inscrits</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-600">
                    <span>Distance :</span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-950">
                      ~{distFromUser} km
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Distance Radius Filter Slider */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-stone-700">
                Rayon de proximité géographique
              </label>
              <span className="font-mono font-bold text-emerald-900">
                {maxDistanceKm >= 500 ? 'Tout le Niger (Illimité)' : `Jusqu'à ${maxDistanceKm} km`}
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={500}
              step={20}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>20 km (Même ville)</span>
              <span>150 km (Région voisine)</span>
              <span>500 km+ (Tout le Niger)</span>
            </div>
          </div>
        </div>

        {/* Nearby Profiles Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Profils à Proximité
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Classés par distance depuis votre position ({userLocation.city}).
            </p>

            <div className="space-y-3">
              {profiles.slice(0, 4).map((p) => {
                const dist = calculateDistanceKm(
                  userLocation.latitude,
                  userLocation.longitude,
                  p.coordinates.latitude,
                  p.coordinates.longitude
                );

                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 hover:border-emerald-600 hover:bg-stone-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photoUrl}
                        alt={p.pseudonym}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {p.pseudonym}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {p.age} ans · {p.region}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-800">
                        {dist} km
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 ml-auto mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
            💡 Astuce Nikah : Vous pouvez masquer ou flouter votre position exacte à tout moment dans l'onglet Sécurité.
          </div>
        </div>
      </div>
    </div>
  );
};
