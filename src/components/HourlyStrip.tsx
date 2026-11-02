import { useAppStore } from '../store/useAppStore';
import type { HourlyWeather, WeatherBundle } from '../types/weather';
import { moodOf } from '../utils/condition';
import { dayName, formatHour, localDateKey } from '../utils/time';
import { toSpeed, speedLabel, toTemp } from '../utils/units';
import { isNight } from '../utils/time';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  hours: HourlyWeather[];
  data: WeatherBundle;
  title: string;
}

export function HourlyStrip({ hours, data, title }: Props) {
  const { tempUnit, speedUnit } = useAppStore();
  const { sunrise, sunset } = data.current;
  const tz = data.tzOffset;

  return (
    <section aria-label={title} className="card p-5 sm:p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <ul className="scroll-hide -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2" tabIndex={0} aria-label={`${title}, scroll horizontally`}>
        {hours.map((h, i) => {
          const newDay = i > 0 && localDateKey(h.dt, tz) !== localDateKey(hours[i - 1].dt, tz);
          const mood = moodOf(h.condition, isNight(h.dt + tz, sunrise + tz, sunset + tz));
          return (
            <li
              key={h.dt}
              className={`flex w-[92px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-[28px] border px-3 py-4 text-center ${
                i === 0 ? 'border-emerald bg-emerald/10' : 'border-line bg-page/60'
              }`}
            >
              <span className="text-xs font-semibold text-body">
                {i === 0 ? 'Now' : newDay ? dayName(h.dt, tz).slice(0, 3) : formatHour(h.dt, tz)}
              </span>
              {newDay && <span className="-mt-1 text-[11px] text-body">{formatHour(h.dt, tz)}</span>}
              <WeatherIcon mood={mood} size={40} />
              <span className="font-serif text-2xl font-bold text-ink">{toTemp(h.temp, tempUnit)}°</span>
              <span className={`pill ${h.pop >= 0.3 ? 'bg-[#D3F5F0] text-[#0B5E56] dark:bg-[#10353A] dark:text-[#8CEDE0]' : 'bg-transparent text-body'}`}>
                {Math.round(h.pop * 100)}%
              </span>
              <span className="text-[11px] text-body">{toSpeed(h.windSpeed, speedUnit)} {speedLabel(speedUnit)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
