import { useAppStore } from '../store/useAppStore';
import { SearchBar } from './SearchBar';
import { UnitToggle } from './UnitToggle';

const iconBtn =
  'relative grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-ink transition hover:-translate-y-0.5 hover:shadow-card';

interface Props {
  onLocate: () => void;
  locating: boolean;
}

export function Header({ onLocate, locating }: Props) {
  const { theme, toggleTheme, saved, tab, setTab } = useAppStore();
  const savedOpen = tab === 'saved';

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-10">
        <a href="/" className="order-1 flex items-center gap-2" aria-label="Hearth home">
          <img src="/favicon.svg" alt="" width="32" height="32" className="rounded-lg" />
          <span className="font-serif text-2xl font-bold tracking-tight text-ink">Hearth</span>
        </a>

        <div className="order-3 w-full lg:order-2 lg:mx-auto lg:max-w-xl lg:flex-1">
          <SearchBar />
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 lg:order-3">
          <UnitToggle />
          <button onClick={onLocate} className={iconBtn} aria-label="Use my current location" title="Use my location">
            <svg viewBox="0 0 24 24" width="18" height="18" className={locating ? 'animate-pulse text-emerald' : ''} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </button>
          <button
            onClick={() => setTab(savedOpen ? 'today' : 'saved')}
            className={`${iconBtn} ${savedOpen ? '!border-emerald !bg-emerald/15' : ''}`}
            aria-label={`Saved locations (${saved.length})`}
            aria-pressed={savedOpen}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill={savedOpen ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
            {saved.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald px-1 text-[11px] font-bold text-[#04281D]">
                {saved.length}
              </span>
            )}
          </button>
          <button onClick={toggleTheme} className={iconBtn} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
