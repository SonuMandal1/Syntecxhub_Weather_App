import { useEffect, useId, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useCitySearch } from '../hooks/useWeather';
import { useAppStore } from '../store/useAppStore';
import type { GeoLocation } from '../types/weather';

const place = (l: GeoLocation): string => [l.state, l.country].filter(Boolean).join(', ');

export function SearchBar() {
  const setActive = useAppStore((s) => s.setActive);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const debounced = useDebounce(text, 350);
  const { data = [], isFetching, isError } = useCitySearch(debounced);
  const listId = useId();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent): void => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pick = (l: GeoLocation): void => {
    setActive(l);
    setText('');
    setOpen(false);
    setHi(-1);
  };

  const onKey = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, data.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && data[Math.max(hi, 0)]) pick(data[Math.max(hi, 0)]);
    else if (e.key === 'Escape') setOpen(false);
  };

  const showList = open && debounced.trim().length >= 2;

  return (
    <div ref={box} className="relative w-full" role="search">
      <label htmlFor={`${listId}-input`} className="sr-only">Search for a city</label>
      <div className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 shadow-inset focus-within:ring-2 focus-within:ring-emerald">
        <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0 text-body" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={hi >= 0 ? `${listId}-${hi}` : undefined}
          autoComplete="off"
          placeholder="Search for a city"
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true); setHi(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          className="w-full bg-transparent text-sm text-ink placeholder:text-body focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {isFetching && <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-emerald border-t-transparent" aria-label="Searching" />}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="glass absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl shadow-lift"
        >
          {data.map((l, i) => (
            <li key={l.id} id={`${listId}-${i}`} role="option" aria-selected={i === hi}>
              <button
                onClick={() => pick(l)}
                onMouseEnter={() => setHi(i)}
                className={`flex w-full items-baseline justify-between gap-3 px-4 py-3 text-left ${i === hi ? 'bg-emerald/15' : ''}`}
              >
                <span className="font-serif text-base font-semibold text-ink">{l.name}</span>
                <span className="truncate text-xs text-body">{place(l)}</span>
              </button>
            </li>
          ))}
          {!isFetching && data.length === 0 && (
            <li className="px-4 py-3 text-sm text-body">
              {isError ? 'Search failed. Try again.' : `No cities match "${debounced.trim()}".`}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
