import { describe, expect, it } from 'vitest';
import { toSpeed, toTemp } from './units';
import { isNight } from './time';

describe('units', () => {
  it('converts temperature', () => {
    expect(toTemp(0, 'F')).toBe(32);
    expect(toTemp(21.6, 'C')).toBe(22);
  });
  it('converts wind speed from m/s', () => {
    expect(toSpeed(10, 'kmh')).toBe(36);
    expect(toSpeed(10, 'mph')).toBe(22);
  });
});

describe('isNight', () => {
  it('detects night by time of day', () => {
    const rise = 6 * 3600;
    const set = 18 * 3600;
    expect(isNight(12 * 3600, rise, set)).toBe(false);
    expect(isNight(23 * 3600, rise, set)).toBe(true);
    expect(isNight(86400 * 3 + 3 * 3600, rise, set)).toBe(true);
  });
});
