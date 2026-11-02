import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { ViewTab } from '../types/weather';

const TABS: { id: ViewTab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'week', label: 'This week' },
  { id: 'map', label: 'Map' },
];

export function TabPills() {
  const { tab, setTab } = useAppStore();

  const onKey = (e: React.KeyboardEvent, i: number): void => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div role="tablist" aria-label="Weather views" className="scroll-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0">
      {TABS.map((t, i) => {
        const on = tab === t.id;
        return (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={on}
            aria-controls="view-panel"
            tabIndex={on ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              on ? 'border-transparent text-[#04281D]' : 'border-line bg-card text-ink hover:border-emerald'
            }`}
          >
            {on && (
              <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-emerald" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
            )}
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
