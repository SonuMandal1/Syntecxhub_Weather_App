import { useWeather } from '../hooks/useWeather';
import { useAppStore } from '../store/useAppStore';
import type { GeoLocation } from '../types/weather';
import { badgeFor, moodOf } from '../utils/condition';
import { toTemp } from '../utils/units';
import { Badge } from './Badge';
import { WeatherIcon } from './WeatherIcon';

function SavedCard({ loc }: { loc: GeoLocation }) {
  const { tempUnit, setActive, removeSaved } = useAppStore();
  const { data, isLoading, isError } = useWeather(loc);
  const c = data?.current;
  const night = c ? c.dt < c.sunrise || c.dt > c.sunset : false;
  const mood = c ? moodOf(c.condition, night) : null;
  const badge = mood ? badgeFor(mood) : null;
  const today = data?.daily[0];

  return (
    <article className="card card-hover relative flex h-full w-[82%] shrink-0 snap-center flex-col p-6 sm:w-auto">
      <button
        onClick={() => removeSaved(loc.id)}
        aria-label={`Remove ${loc.name} from saved`}
        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-body hover:bg-emerald/15 hover:text-ink"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <button onClick={() => setActive(loc)} className="flex flex-1 flex-col text-left" aria-label={`Open ${loc.name}`}>
        <h3 className="pr-8 text-2xl font-semibold">{loc.name}</h3>
        <p className="text-xs text-body">{[loc.state, loc.country].filter(Boolean).join(', ')}</p>
        <div className="mt-3 min-h-6">
          {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : isError ? <Badge tone="alert">Unavailable</Badge> : null}
        </div>
        <div className="mt-6 flex items-end justify-between">
          {isLoading || !c ? (
            <div className="h-16 w-28 animate-pulse rounded-2xl bg-emerald/10" />
          ) : (
            <p className="flex items-baseline gap-3">
              <span className="temp-number text-6xl leading-none">{toTemp(c.temp, tempUnit)}°</span>
              {today && <span className="font-serif text-xl font-semibold text-body">{toTemp(today.min, tempUnit)}°</span>}
            </p>
          )}
          {mood && <WeatherIcon mood={mood} size={52} />}
        </div>
      </button>
    </article>
  );
}

export function SavedView() {
  const saved = useAppStore((s) => s.saved);

  if (saved.length === 0) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <h2 className="text-2xl font-semibold">No saved locations yet</h2>
        <p className="mt-2 text-body">Open a city and tap the bookmark on its card to keep it here.</p>
      </div>
    );
  }

  return (
    <ul className="scroll-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-5">
      {saved.map((l) => (
        <li key={l.id} className="contents">
          <SavedCard loc={l} />
        </li>
      ))}
    </ul>
  );
}
