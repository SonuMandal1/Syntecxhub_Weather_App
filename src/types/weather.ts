export interface Condition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  uvi: number | null;
  clouds: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  condition: Condition;
}

export interface HourlyWeather {
  dt: number;
  temp: number;
  pop: number;
  windSpeed: number;
  condition: Condition;
}

export interface DailyWeather {
  dt: number;
  min: number;
  max: number;
  pop: number;
  uvi: number | null;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
  condition: Condition;
}

export interface WeatherAlert {
  sender: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

export interface AirQuality {
  /** OpenWeatherMap index: 1 (good) to 5 (very poor) */
  index: 1 | 2 | 3 | 4 | 5;
  pm25: number;
}

/** All values metric: °C, m/s, hPa, metres. Converted at render time. */
export interface WeatherBundle {
  lat: number;
  lon: number;
  /** Offset from UTC in seconds for the location */
  tzOffset: number;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts: WeatherAlert[];
  air: AirQuality | null;
  source: 'onecall' | 'standard';
}

export interface GeoLocation {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';
export type ViewTab = 'today' | 'hourly' | 'week' | 'map' | 'saved';
export type MapLayer = 'precipitation_new' | 'clouds_new' | 'temp_new' | 'wind_new';
