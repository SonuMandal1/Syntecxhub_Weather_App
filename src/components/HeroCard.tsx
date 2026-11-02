import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { GeoLocation, WeatherBundle } from '../types/weather';
import { badgeFor, moodOf, titleCase } from '../utils/condition';
import { dayName, formatClock, shortDate } from '../utils/time';
import { toTemp } from '../utils/units';
import { Badge } from './Badge';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  location: GeoLocation;
  data: WeatherBundle;
  updatedAt: number;
}

export function HeroCard({ location, data, updatedAt }: Props) {
  const { tempUnit, saved, toggleSaved } = useAppStore();
  const c = data.current;
  const night = c.dt < c.sunrise || c.dt > c.sunset;
  const mood = moodOf(c.condition, night);
  const badge = badgeFor(mood);
  const today = data.daily[0];
  const isSaved = saved.some((s) => s.id === location.id);
  const place = [location.state, location.country].filter(Boolean).join(', ');

  return (
    <motion.section
      aria-label={`Current weather in ${location.name}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="card relative overflow-hidden p-6 sm:p-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#E8B04B]/20 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{location.name}</h1>
          <p className="mt-1 text-sm text-body">
            {place && `${place} · `}{dayName(c.dt, data.tzOffset)}, {shortDate(c.dt, data.tzOffset)} · {formatClock(c.dt, data.tzOffset)}
          </p>
        </div>
        <button
          onClick={() => toggleSaved(location)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${location.name} from saved` : `Save ${location.name}`}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition ${
            isSaved ? 'border-emerald bg-emerald text-[#04281D]' : 'border-line bg-card text-ink hover:border-emerald'
          }`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </button>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <Badge tone={badge.tone}>{badge.label}</Badge>
        {data.alerts.length === 0 && c.condition.description.toLowerCase() !== badge.label.toLowerCase() && (
          <Badge tone="slate">{titleCase(c.condition.description)}</Badge>
        )}
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="temp-number text-[7rem] leading-[0.85] sm:text-[9rem]" aria-label={`${toTemp(c.temp, tempUnit)} degrees ${tempUnit === 'C' ? 'Celsius' : 'Fahrenheit'}`}>
            {toTemp(c.temp, tempUnit)}
            <span className="align-top text-5xl sm:text-6xl">°</span>
          </p>
          <p className="mt-4 text-base text-body">
            Feels like <span className="font-semibold text-ink">{toTemp(c.feelsLike, tempUnit)}°</span>
            {today && (
              <>
                {' · '}High <span className="font-semibold text-ink">{toTemp(today.max, tempUnit)}°</span>
                {' · '}Low <span className="font-semibold text-ink">{toTemp(today.min, tempUnit)}°</span>
              </>
            )}
          </p>
        </div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <WeatherIcon mood={mood} size={112} className="h-24 w-24 sm:h-32 sm:w-32" />
        </motion.div>
      </div>

      <p className="relative mt-5 text-xs text-body">
        Updated {new Date(updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </p>
    </motion.section>
  );
}
