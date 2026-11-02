import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WeatherAlert } from '../types/weather';
import { dayName, formatClock } from '../utils/time';

interface Props {
  alerts: WeatherAlert[];
  tzOffset: number;
}

export function AlertBanner({ alerts, tzOffset }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [openKey, setOpenKey] = useState<string | null>(null);
  const visible = alerts.filter((a) => !dismissed.has(a.event + a.start));

  return (
    <div role="region" aria-label="Severe weather alerts" className="space-y-2">
      <AnimatePresence>
        {visible.map((a) => {
          const key = a.event + a.start;
          const open = openKey === key;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-[28px] border border-[#E8743B]/50 bg-[#FCE1CF] text-[#6B2C08] dark:bg-[#43250F] dark:text-[#F7B488]"
              role="alert"
            >
              <div className="flex items-center gap-3 px-5 py-3">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#E8743B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3 2 20h20L12 3zM12 10v4M12 17.5v.01" />
                </svg>
                <button
                  className="min-w-0 flex-1 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenKey(open ? null : key)}
                >
                  <span className="block truncate font-serif text-base font-bold">{a.event}</span>
                  <span className="block text-xs opacity-80">
                    Until {dayName(a.end, tzOffset)} {formatClock(a.end, tzOffset)} · {a.sender}
                  </span>
                </button>
                <button
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-[#E8743B]/20"
                  aria-label={`Dismiss ${a.event} alert`}
                  onClick={() => setDismissed((d) => new Set(d).add(key))}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </div>
              {open && <p className="px-5 pb-4 text-sm leading-relaxed">{a.description}</p>}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
