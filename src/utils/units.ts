import type { SpeedUnit, TempUnit } from '../types/weather';

export const toTemp = (c: number, unit: TempUnit): number =>
  Math.round(unit === 'F' ? (c * 9) / 5 + 32 : c);

export const toSpeed = (ms: number, unit: SpeedUnit): number =>
  Math.round(unit === 'mph' ? ms * 2.23694 : ms * 3.6);

export const speedLabel = (unit: SpeedUnit): string => (unit === 'mph' ? 'mph' : 'km/h');

export const compass = (deg: number): string =>
  ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
