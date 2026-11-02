import { SUGGESTED_CITIES } from '../services/cities';
import { useAppStore } from '../store/useAppStore';

export function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" aria-busy="true" aria-label="Loading weather">
      <div className="card h-[420px] animate-pulse sm:col-span-2 lg:row-span-2" />
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card h-[148px] animate-pulse" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="card mx-auto max-w-lg p-10 text-center">
      <h2 className="text-2xl font-semibold">Couldn’t load the weather</h2>
      <p className="mt-2 text-body">{message}</p>
      <button onClick={onRetry} className="mt-6 rounded-full bg-emerald px-6 py-3 text-sm font-bold text-[#04281D] transition hover:-translate-y-0.5 hover:shadow-card">
        Try again
      </button>
    </div>
  );
}

interface WelcomeProps {
  onLocate: () => void;
  status: 'idle' | 'locating' | 'denied' | 'unsupported';
}

const MESSAGES = {
  idle: 'Allow location access for local conditions, or search for any city.',
  locating: 'Finding your location…',
  denied: 'Location access is off. Search for a city, or pick one below.',
  unsupported: 'This browser can’t share your location. Search for a city instead.',
} as const;

export function Welcome({ onLocate, status }: WelcomeProps) {
  const setActive = useAppStore((s) => s.setActive);
  return (
    <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Where are you looking?</h1>
      <p className="mx-auto mt-3 max-w-md text-body" aria-live="polite">{MESSAGES[status]}</p>
      <button
        onClick={onLocate}
        disabled={status === 'locating'}
        className="mt-6 rounded-full bg-emerald px-6 py-3 text-sm font-bold text-[#04281D] transition hover:-translate-y-0.5 hover:shadow-card disabled:opacity-60"
      >
        {status === 'locating' ? 'Locating…' : 'Use my location'}
      </button>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {SUGGESTED_CITIES.map((c) => (
          <li key={c.id}>
            <button onClick={() => setActive(c)} className="rounded-full border border-line bg-page px-4 py-2 text-sm font-semibold text-ink transition hover:border-emerald">
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MissingKey() {
  return (
    <div role="alert" className="card mx-auto max-w-2xl p-8 sm:p-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Add your weather API key</h1>
      <p className="mt-3 text-body">
        Hearth shows live data from OpenWeatherMap and has no sample data. Create a free key, then restart the dev server.
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-body">
        <li>
          Get a key at{' '}
          <a className="font-semibold text-accent underline" href="https://home.openweathermap.org/api_keys" target="_blank" rel="noreferrer">
            openweathermap.org/api_keys
          </a>
          .
        </li>
        <li>Copy <code className="font-semibold text-ink">.env.example</code> to <code className="font-semibold text-ink">.env</code>.</li>
        <li>Set <code className="font-semibold text-ink">VITE_OWM_API_KEY=your_key</code> and restart <code className="font-semibold text-ink">npm run dev</code>.</li>
      </ol>
      <p className="mt-4 text-sm text-body">New keys can take up to two hours to activate.</p>
    </div>
  );
}
