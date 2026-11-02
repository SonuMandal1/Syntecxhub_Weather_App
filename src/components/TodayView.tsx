import { useAppStore } from '../store/useAppStore';
import type { GeoLocation, WeatherBundle } from '../types/weather';
import { aqiLabel, uvLabel } from '../utils/condition';
import { compass, speedLabel, toSpeed, toTemp } from '../utils/units';
import { Badge } from './Badge';
import { HeroCard } from './HeroCard';
import { HourlyStrip } from './HourlyStrip';
import { Icons, MetricCard } from './MetricCard';
import { SunArc } from './SunArc';

interface Props {
  location: GeoLocation;
  data: WeatherBundle;
  updatedAt: number;
}

export function TodayView({ location, data, updatedAt }: Props) {
  const { tempUnit, speedUnit } = useAppStore();
  const c = data.current;
  const uv = c.uvi === null ? null : uvLabel(c.uvi);
  const aq = data.air ? aqiLabel(data.air.index) : null;
  const rainChance = Math.round((data.hourly[0]?.pop ?? 0) * 100);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 [grid-auto-flow:dense]">
        <div className="sm:col-span-2 lg:row-span-2">
          <HeroCard location={location} data={data} updatedAt={updatedAt} />
        </div>

        <MetricCard label="Feels like" value={`${toTemp(c.feelsLike, tempUnit)}°`} icon={Icons.feels}
          footer={<Badge tone="slate">{c.feelsLike > c.temp + 1 ? 'Warmer than actual' : c.feelsLike < c.temp - 1 ? 'Cooler than actual' : 'Close to actual'}</Badge>} />
        <MetricCard label="Humidity" value={`${c.humidity}`} unit="%" icon={Icons.humidity}
          footer={<Badge tone="teal">{c.humidity > 70 ? 'Humid' : c.humidity < 30 ? 'Dry' : 'Comfortable'}</Badge>} />
        <MetricCard label="Wind" value={`${toSpeed(c.windSpeed, speedUnit)}`} unit={speedLabel(speedUnit)} icon={Icons.wind}
          footer={<Badge tone="emerald">From {compass(c.windDeg)}</Badge>} />
        <MetricCard label="Pressure" value={`${c.pressure}`} unit="hPa" icon={Icons.pressure}
          footer={<Badge tone="slate">{c.pressure < 1009 ? 'Low' : c.pressure > 1022 ? 'High' : 'Steady'}</Badge>} />
        <MetricCard label="Visibility" value={(c.visibility / 1000).toFixed(c.visibility >= 10000 ? 0 : 1)} unit="km" icon={Icons.visibility}
          footer={<Badge tone="sky">{c.visibility >= 8000 ? 'Clear view' : 'Reduced'}</Badge>} />
        <MetricCard label="UV index" value={c.uvi === null ? '–' : c.uvi.toFixed(0)} icon={Icons.uv}
          footer={uv ? <Badge tone={uv.high ? 'alert' : 'emerald'}>{uv.high ? `High UV · ${uv.label}` : uv.label}</Badge> : <Badge tone="slate">Not in free plan</Badge>} />
        <MetricCard label="Air quality" value={data.air ? `${data.air.index}` : '–'} unit={data.air ? '/ 5' : undefined} icon={Icons.air}
          footer={aq ? <Badge tone={aq.poor ? 'alert' : 'emerald'}>{aq.label}{data.air ? ` · PM2.5 ${Math.round(data.air.pm25)}` : ''}</Badge> : <Badge tone="slate">Unavailable</Badge>} />
        <MetricCard label="Cloud cover" value={`${c.clouds}`} unit="%" icon={Icons.cloud}
          footer={<Badge tone="slate">{c.clouds < 25 ? 'Mostly clear' : c.clouds < 75 ? 'Partly covered' : 'Overcast'}</Badge>} />
        <MetricCard label="Rain chance" value={`${rainChance}`} unit="%" icon={Icons.rain}
          footer={<Badge tone="teal">Next hour</Badge>} />

        <div className="sm:col-span-2">
          <SunArc now={c.dt} sunrise={c.sunrise} sunset={c.sunset} tzOffset={data.tzOffset} />
        </div>
      </div>

      <HourlyStrip hours={data.hourly.slice(0, 24)} data={data} title="Next 24 hours" />
    </div>
  );
}
