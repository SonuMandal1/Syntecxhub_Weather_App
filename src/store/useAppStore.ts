import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeoLocation, SpeedUnit, TempUnit, ViewTab } from '../types/weather';

type Theme = 'light' | 'dark';

interface AppState {
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  theme: Theme;
  saved: GeoLocation[];
  active: GeoLocation | null;
  tab: ViewTab;
  setTempUnit: (u: TempUnit) => void;
  setSpeedUnit: (u: SpeedUnit) => void;
  toggleTheme: () => void;
  setActive: (l: GeoLocation) => void;
  setTab: (t: ViewTab) => void;
  toggleSaved: (l: GeoLocation) => void;
  removeSaved: (id: string) => void;
}

const prefersDark = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tempUnit: 'C',
      speedUnit: 'kmh',
      theme: prefersDark() ? 'dark' : 'light',
      saved: [],
      active: null,
      tab: 'today',
      setTempUnit: (tempUnit) => set({ tempUnit }),
      setSpeedUnit: (speedUnit) => set({ speedUnit }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setActive: (active) => set({ active, tab: 'today' }),
      setTab: (tab) => set({ tab }),
      toggleSaved: (l) =>
        set((s) => ({
          saved: s.saved.some((x) => x.id === l.id) ? s.saved.filter((x) => x.id !== l.id) : [...s.saved, l],
        })),
      removeSaved: (id) => set((s) => ({ saved: s.saved.filter((x) => x.id !== id) })),
    }),
    {
      name: 'hearth-store',
      partialize: (s) => ({
        tempUnit: s.tempUnit, speedUnit: s.speedUnit, theme: s.theme, saved: s.saved, active: s.active,
      }),
    },
  ),
);
