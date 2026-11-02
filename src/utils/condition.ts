import type { Condition } from '../types/weather';

export type Mood =
  | 'sunny' | 'clear-night' | 'partly' | 'cloudy' | 'rain'
  | 'drizzle' | 'storm' | 'snow' | 'mist' | 'windy';

export type BadgeTone = 'amber' | 'sky' | 'slate' | 'emerald' | 'teal' | 'violet';

export const moodOf = (c: Condition, night = false): Mood => {
  const id = c.id;
  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return id === 771 || id === 781 ? 'windy' : 'mist';
  if (id === 800) return night ? 'clear-night' : 'sunny';
  if (id === 801 || id === 802) return 'partly';
  return 'cloudy';
};

export const badgeFor = (mood: Mood): { label: string; tone: BadgeTone } => {
  switch (mood) {
    case 'sunny': return { label: 'Sunny', tone: 'amber' };
    case 'clear-night': return { label: 'Clear', tone: 'violet' };
    case 'partly': return { label: 'Partly cloudy', tone: 'amber' };
    case 'cloudy': return { label: 'Cloudy', tone: 'slate' };
    case 'rain': return { label: 'Rainy', tone: 'teal' };
    case 'drizzle': return { label: 'Drizzle', tone: 'teal' };
    case 'storm': return { label: 'Stormy', tone: 'violet' };
    case 'snow': return { label: 'Snow', tone: 'sky' };
    case 'mist': return { label: 'Misty', tone: 'slate' };
    case 'windy': return { label: 'Windy', tone: 'emerald' };
  }
};

export const titleCase = (s: string): string => s.replace(/\b\w/g, (m) => m.toUpperCase());

export const uvLabel = (uvi: number): { label: string; high: boolean } => {
  if (uvi < 3) return { label: 'Low', high: false };
  if (uvi < 6) return { label: 'Moderate', high: false };
  if (uvi < 8) return { label: 'High', high: true };
  if (uvi < 11) return { label: 'Very high', high: true };
  return { label: 'Extreme', high: true };
};

const AQI_LABELS = ['Unknown', 'Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];

export const aqiLabel = (index: number): { label: string; poor: boolean } => ({
  label: AQI_LABELS[index] ?? 'Unknown',
  poor: index >= 3,
});
