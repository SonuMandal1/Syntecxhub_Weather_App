import type { Condition } from './weather';

export interface OwmOneCall {
  timezone_offset: number;
  current: {
    dt: number; sunrise: number; sunset: number; temp: number; feels_like: number;
    pressure: number; humidity: number; uvi: number; clouds: number; visibility: number;
    wind_speed: number; wind_deg: number; weather: Condition[];
  };
  hourly: { dt: number; temp: number; pop: number; wind_speed: number; weather: Condition[] }[];
  daily: {
    dt: number; sunrise: number; sunset: number; pop: number; uvi: number; humidity: number;
    wind_speed: number; temp: { min: number; max: number }; weather: Condition[];
  }[];
  alerts?: { sender_name: string; event: string; start: number; end: number; description: string }[];
}

export interface OwmCurrent {
  dt: number;
  timezone: number;
  visibility: number;
  clouds: { all: number };
  weather: Condition[];
  main: { temp: number; feels_like: number; pressure: number; humidity: number };
  wind: { speed: number; deg: number };
  sys: { sunrise: number; sunset: number };
}

export interface OwmForecast {
  city: { timezone: number };
  list: {
    dt: number; pop: number; weather: Condition[];
    main: { temp: number; temp_min: number; temp_max: number; humidity: number };
    wind: { speed: number };
  }[];
}

export interface OwmAir {
  list: { main: { aqi: 1 | 2 | 3 | 4 | 5 }; components: { pm2_5: number } }[];
}

export interface OwmGeoItem {
  name: string; state?: string; country: string; lat: number; lon: number;
}
