import { ApiError, apiGet } from './api';
import { localDateKey } from '../utils/time';
import type { OwmAir, OwmCurrent, OwmForecast, OwmGeoItem, OwmOneCall } from '../types/owm';
import type {
  AirQuality, Condition, DailyWeather, GeoLocation, HourlyWeather, WeatherBundle,
} from '../types/weather';

/** Set once One Call 3.0 rejects the key, so later fetches skip the doomed request. */
let oneCallUnavailable = false;

const fetchAir = async (lat: number, lon: number, signal?: AbortSignal): Promise<AirQuality | null> => {
  try {
    const res = await apiGet<OwmAir>('/data/2.5/air_pollution', { lat, lon }, { signal, retries: 1 });
    const item = res.list[0];
    return item ? { index: item.main.aqi, pm25: item.components.pm2_5 } : null;
  } catch {
    return null; // air quality is optional; never block the forecast
  }
};

const fromOneCall = (d: OwmOneCall, lat: number, lon: number, air: AirQuality | null): WeatherBundle => ({
  lat,
  lon,
  tzOffset: d.timezone_offset,
  source: 'onecall',
  air,
  current: {
    dt: d.current.dt,
    sunrise: d.current.sunrise,
    sunset: d.current.sunset,
    temp: d.current.temp,
    feelsLike: d.current.feels_like,
    pressure: d.current.pressure,
    humidity: d.current.humidity,
    uvi: d.current.uvi,
    clouds: d.current.clouds,
    visibility: d.current.visibility,
    windSpeed: d.current.wind_speed,
    windDeg: d.current.wind_deg,
    condition: d.current.weather[0],
  },
  hourly: d.hourly.slice(0, 48).map((h) => ({
    dt: h.dt, temp: h.temp, pop: h.pop, windSpeed: h.wind_speed, condition: h.weather[0],
  })),
  daily: d.daily.slice(0, 7).map((x) => ({
    dt: x.dt, min: x.temp.min, max: x.temp.max, pop: x.pop, uvi: x.uvi, humidity: x.humidity,
    windSpeed: x.wind_speed, sunrise: x.sunrise, sunset: x.sunset, condition: x.weather[0],
  })),
  alerts: (d.alerts ?? []).map((a) => ({
    sender: a.sender_name, event: a.event, start: a.start, end: a.end, description: a.description,
  })),
});

const pickCondition = (items: Condition[]): Condition => {
  const counts = new Map<number, { c: Condition; n: number }>();
  for (const c of items) {
    const e = counts.get(c.id);
    if (e) e.n += 1;
    else counts.set(c.id, { c, n: 1 });
  }
  return [...counts.values()].sort((a, b) => b.n - a.n)[0].c;
};

/** Free-tier fallback: /weather + /forecast (3-hourly, 5 days) + air pollution. */
const fromStandard = (cur: OwmCurrent, fc: OwmForecast, lat: number, lon: number, air: AirQuality | null): WeatherBundle => {
  const tz = cur.timezone;
  const hourly: HourlyWeather[] = fc.list.slice(0, 16).map((h) => ({
    dt: h.dt, temp: h.main.temp, pop: h.pop, windSpeed: h.wind.speed, condition: h.weather[0],
  }));

  const groups = new Map<string, typeof fc.list>();
  for (const item of fc.list) {
    const key = localDateKey(item.dt, tz);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const daily: DailyWeather[] = [...groups.values()].slice(0, 7).map((items, i) => ({
    dt: items[0].dt,
    min: Math.min(...items.map((x) => x.main.temp_min)),
    max: Math.max(...items.map((x) => x.main.temp_max)),
    pop: Math.max(...items.map((x) => x.pop)),
    uvi: null,
    humidity: Math.round(items.reduce((s, x) => s + x.main.humidity, 0) / items.length),
    windSpeed: Math.max(...items.map((x) => x.wind.speed)),
    sunrise: cur.sys.sunrise + i * 86400,
    sunset: cur.sys.sunset + i * 86400,
    condition: pickCondition(items.map((x) => x.weather[0])),
  }));

  return {
    lat, lon, tzOffset: tz, source: 'standard', air, alerts: [], hourly, daily,
    current: {
      dt: cur.dt, sunrise: cur.sys.sunrise, sunset: cur.sys.sunset, temp: cur.main.temp,
      feelsLike: cur.main.feels_like, pressure: cur.main.pressure, humidity: cur.main.humidity,
      uvi: null, clouds: cur.clouds.all, visibility: cur.visibility, windSpeed: cur.wind.speed,
      windDeg: cur.wind.deg, condition: cur.weather[0],
    },
  };
};

export async function fetchWeather(lat: number, lon: number, signal?: AbortSignal): Promise<WeatherBundle> {

  const air = fetchAir(lat, lon, signal);
  const params = { lat, lon, units: 'metric' };
  if (!oneCallUnavailable) {
    try {
      const oc = await apiGet<OwmOneCall>('/data/3.0/onecall', { ...params, exclude: 'minutely' }, { signal, retries: 1 });
      return fromOneCall(oc, lat, lon, await air);
    } catch (e) {
      // 401 = key lacks One Call 3.0 subscription; fall back to free endpoints
      if (!(e instanceof ApiError) || (e.status !== 401 && e.status < 500)) throw e;
      if (e.status === 401) oneCallUnavailable = true;
    }
  }
  const [cur, fc] = await Promise.all([
    apiGet<OwmCurrent>('/data/2.5/weather', params, { signal }),
    apiGet<OwmForecast>('/data/2.5/forecast', params, { signal }),
  ]);
  return fromStandard(cur, fc, lat, lon, await air);
}

const toLocation = (g: OwmGeoItem): GeoLocation => ({
  id: `${g.lat.toFixed(3)},${g.lon.toFixed(3)}`,
  name: g.name, state: g.state, country: g.country, lat: g.lat, lon: g.lon,
});

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const res = await apiGet<OwmGeoItem[]>('/geo/1.0/direct', { q: query, limit: 5 }, { signal, retries: 1 });
  const seen = new Set<string>();
  return res.map(toLocation).filter((l) => (seen.has(l.id) ? false : (seen.add(l.id), true)));
}

export async function reverseGeocode(lat: number, lon: number, signal?: AbortSignal): Promise<GeoLocation> {
  const fallback: GeoLocation = { id: `${lat.toFixed(3)},${lon.toFixed(3)}`, name: 'Current location', country: '', lat, lon };
  try {
    const res = await apiGet<OwmGeoItem[]>('/geo/1.0/reverse', { lat, lon, limit: 1 }, { signal, retries: 1 });
    return res[0] ? { ...toLocation(res[0]), id: fallback.id } : fallback;
  } catch {
    return fallback;
  }
}
