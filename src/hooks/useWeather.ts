import { useQuery } from '@tanstack/react-query';
import { HAS_KEY } from '../services/api';
import { fetchWeather, searchCities } from '../services/weatherService';
import type { GeoLocation } from '../types/weather';

export const REFRESH_MS = 10 * 60 * 1000;

export function useWeather(loc: GeoLocation | null) {
  return useQuery({
    queryKey: ['weather', loc?.lat, loc?.lon],
    queryFn: ({ signal }) => fetchWeather(loc!.lat, loc!.lon, signal),
    enabled: HAS_KEY && loc !== null,
    staleTime: REFRESH_MS / 2,
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: true,
    retry: false, // the service layer already retries transient failures
  });
}

export function useCitySearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: ['geo', q.toLowerCase()],
    queryFn: ({ signal }) => searchCities(q, signal),
    enabled: HAS_KEY && q.length >= 2,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
