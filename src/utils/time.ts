/** Format a unix timestamp (s) in the location's local time using its UTC offset (s). */
const shifted = (dt: number, tzOffset: number): Date => new Date((dt + tzOffset) * 1000);

export const formatClock = (dt: number, tzOffset: number): string => {
  const d = shifted(dt, tzOffset);
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
};

export const formatHour = (dt: number, tzOffset: number): string => {
  const h = shifted(dt, tzOffset).getUTCHours();
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dayName = (dt: number, tzOffset: number): string =>
  DAYS[shifted(dt, tzOffset).getUTCDay()];

export const shortDate = (dt: number, tzOffset: number): string => {
  const d = shifted(dt, tzOffset);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
};

export const localDateKey = (dt: number, tzOffset: number): string =>
  shifted(dt, tzOffset).toISOString().slice(0, 10);

/** Compares time of day so forecast hours on other days work with today's sun times. */
export const isNight = (dt: number, sunrise: number, sunset: number): boolean => {
  const day = 86400;
  const mod = (n: number): number => ((n % day) + day) % day;
  const t = mod(dt);
  const rise = mod(sunrise);
  const set = mod(sunset);
  return rise <= set ? t < rise || t >= set : t >= set && t < rise;
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};
