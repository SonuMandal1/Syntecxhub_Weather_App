import type { GeoLocation } from '../types/weather';

/** Starting points for the welcome screen. Coordinates only; weather is always fetched live. */
export const SUGGESTED_CITIES: GeoLocation[] = [
  { id: 'ktm', name: 'Kathmandu', country: 'NP', lat: 27.7172, lon: 85.324 },
  { id: 'lon', name: 'London', country: 'GB', lat: 51.5072, lon: -0.1276 },
  { id: 'nyc', name: 'New York', state: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
  { id: 'tyo', name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { id: 'syd', name: 'Sydney', state: 'New South Wales', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { id: 'dxb', name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
];
