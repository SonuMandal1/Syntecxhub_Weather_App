import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { API_KEY } from '../services/api';
import type { GeoLocation, MapLayer } from '../types/weather';

const LAYERS: { id: MapLayer; label: string }[] = [
  { id: 'precipitation_new', label: 'Precipitation' },
  { id: 'clouds_new', label: 'Clouds' },
  { id: 'temp_new', label: 'Temperature' },
  { id: 'wind_new', label: 'Wind' },
];

const pin = L.divIcon({
  className: '',
  html: '<span style="display:block;width:20px;height:20px;border-radius:9999px;background:#10B981;border:3px solid #FFFDF8;box-shadow:0 0 0 6px rgba(16,185,129,.25),0 2px 6px rgba(0,0,0,.3)"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lon]); }, [map, lat, lon]);
  return null;
}

export function WeatherMap({ location }: { location: GeoLocation }) {
  const [layer, setLayer] = useState<MapLayer>('precipitation_new');
  const [opacity, setOpacity] = useState(0.75);

  return (
    <section aria-label="Weather map" className="card relative h-[68vh] min-h-[420px] overflow-hidden p-0">
      <MapContainer center={[location.lat, location.lon]} zoom={6} scrollWheelZoom zoomControl={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="warm-tiles"
        />
        {(
          <TileLayer
            key={layer}
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={opacity}
            attribution='Weather &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
          />
        )}
        <Marker position={[location.lat, location.lon]} icon={pin} keyboard={false} />
        <ZoomControl position="topright" />
        <Recenter lat={location.lat} lon={location.lon} />
      </MapContainer>

      <div className="glass absolute left-3 right-3 top-3 z-[500] flex flex-wrap items-center gap-2 rounded-3xl p-2 sm:right-auto" role="group" aria-label="Map layers">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayer(l.id)}
            aria-pressed={layer === l.id}
            className={`rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
              layer === l.id ? 'bg-emerald text-[#04281D]' : 'text-ink hover:bg-emerald/15'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="glass absolute bottom-6 left-3 z-[500] flex items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold text-ink">
        <label htmlFor="opacity">Overlay</label>
        <input id="opacity" type="range" min="0.2" max="1" step="0.05" value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))} className="w-24 accent-emerald" />
      </div>

    </section>
  );
}
