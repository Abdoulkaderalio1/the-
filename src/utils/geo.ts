import { NigerRegion, LocationCoordinates } from '../types';

export interface RegionInfo {
  name: NigerRegion;
  capital: string;
  lat: number;
  lng: number;
  activeSinglesCount: number;
  popularDistricts: string[];
}

export const NIGER_REGIONS: Record<NigerRegion, RegionInfo> = {
  Niamey: {
    name: 'Niamey',
    capital: 'Niamey',
    lat: 13.5116,
    lng: 2.1254,
    activeSinglesCount: 1240,
    popularDistricts: ['Koira Kano', 'Plateau', 'Yantala', 'Dar-Es-Salam', 'Niamey 2000', 'Terminus'],
  },
  Maradi: {
    name: 'Maradi',
    capital: 'Maradi',
    lat: 13.5000,
    lng: 7.1017,
    activeSinglesCount: 890,
    popularDistricts: ['Sabon Gari', 'Ali Dan Sofo', 'Zaria', 'Bagalam'],
  },
  Zinder: {
    name: 'Zinder',
    capital: 'Zinder',
    lat: 13.8072,
    lng: 8.9883,
    activeSinglesCount: 760,
    popularDistricts: ['Birni', 'Sabon Gari', 'Garin Malam', 'Kara Kara'],
  },
  Tahoua: {
    name: 'Tahoua',
    capital: 'Tahoua',
    lat: 14.8888,
    lng: 5.2692,
    activeSinglesCount: 420,
    popularDistricts: ['Wadata', 'Tchabal', 'Kourfeyel'],
  },
  Agadez: {
    name: 'Agadez',
    capital: 'Agadez',
    lat: 16.9706,
    lng: 7.9903,
    activeSinglesCount: 310,
    popularDistricts: ['Oboubou', 'Dagmanet', 'Fadama'],
  },
  Tillabéri: {
    name: 'Tillabéri',
    capital: 'Tillabéri',
    lat: 14.2081,
    lng: 1.4542,
    activeSinglesCount: 280,
    popularDistricts: ['Quartier Administratif', 'Kouara Tegui'],
  },
  Dosso: {
    name: 'Dosso',
    capital: 'Dosso',
    lat: 13.0444,
    lng: 3.1950,
    activeSinglesCount: 340,
    popularDistricts: ['Djadado', 'Garin Djamila', 'Tondi'],
  },
  Diffa: {
    name: 'Diffa',
    capital: 'Diffa',
    lat: 13.3154,
    lng: 12.6113,
    activeSinglesCount: 160,
    popularDistricts: ['Quartier Résidentiel', 'Festival'],
  },
};

// Haversine formula to calculate accurate distance in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// User location display helper taking privacy settings into account
export function formatLocationDisplay(
  location: LocationCoordinates,
  accuracy: 'exact' | 'city' | 'hidden',
  userDistanceKm?: number
): string {
  if (accuracy === 'hidden') {
    return 'Position confidentielle (Niger)';
  }
  if (accuracy === 'city') {
    return `${location.city}, Niger`;
  }
  const districtPart = location.district ? `${location.district}, ` : '';
  const distPart = userDistanceKm !== undefined ? ` · à ${userDistanceKm} km` : '';
  return `${districtPart}${location.city}${distPart}`;
}
