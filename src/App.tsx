import { Suspense, lazy, useCallback, useEffect } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { AlertBanner } from './components/AlertBanner';
import { Header } from './components/Header';
import { HourlyStrip } from './components/HourlyStrip';
import { SavedView } from './components/SavedView';
import { ErrorState, MissingKey, Skeleton, Welcome } from './components/States';
import { TabPills } from './components/TabPills';
import { TodayView } from './components/TodayView';
import { WeekView } from './components/WeekView';
import { useGeolocation } from './hooks/useGeolocation';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { useWeather } from './hooks/useWeather';
import { HAS_KEY } from './services/api';
import { useAppStore } from './store/useAppStore';

const WeatherMap = lazy(() => import('./components/WeatherMap').then((m) => ({ default: m.WeatherMap })));

export default function App() {
  const { active, tab, theme } = useAppStore();
  const { status, locate } = useGeolocation();
  const qc = useQueryClient();
  const weather = useWeather(active);
  const fetching = useIsFetching({ queryKey: ['weather'] }) > 0;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0F1713' : '#FAF6EC');
  }, [theme]);

  useEffect(() => {
    if (HAS_KEY && !useAppStore.getState().active) locate(true);
  }, [locate]);

  const refresh = useCallback(() => { void qc.invalidateQueries({ queryKey: ['weather'] }); }, [qc]);
  const pull = usePullToRefresh(refresh, !active);

  if (!HAS_KEY) {
    return (
      <div className="min-h-screen">
        <Header onLocate={() => locate()} locating={false} />
        <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10"><MissingKey /></main>
      </div>
    );
  }

  const data = weather.data;
  const showSaved = tab === 'saved';

  return (
    <div className="min-h-screen">
      <Header onLocate={() => locate()} locating={status === 'locating'} />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-16 z-40 -translate-x-1/2 transition-opacity"
        style={{ opacity: pull > 8 || (fetching && pull > 0) ? 1 : 0, transform: `translate(-50%, ${pull / 2}px)` }}
      >
        <span className="glass grid h-10 w-10 place-items-center rounded-full">
          <span className={`h-5 w-5 rounded-full border-2 border-emerald border-t-transparent ${fetching ? 'animate-spin' : ''}`} style={{ rotate: `${pull * 4}deg` }} />
        </span>
      </div>

      <main id="main" className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 lg:px-10">

        <div className="mb-5 flex items-center justify-between gap-3">
          {showSaved ? <h2 className="text-2xl font-semibold">Saved locations</h2> : <TabPills />}
          {active && !showSaved && (
            <button
              onClick={refresh}
              disabled={fetching}
              aria-label="Refresh weather"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-card text-ink transition hover:border-emerald disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" className={fetching ? 'animate-spin' : ''} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
              </svg>
            </button>
          )}
        </div>

        <div id="view-panel" role={showSaved ? undefined : 'tabpanel'} aria-labelledby={showSaved ? undefined : `tab-${tab}`}>
          {showSaved ? (
            <SavedView />
          ) : !active ? (
            <Welcome onLocate={() => locate()} status={status} />
          ) : weather.isLoading ? (
            <Skeleton />
          ) : weather.isError || !data ? (
            <ErrorState message={weather.error instanceof Error ? weather.error.message : 'Unknown error.'} onRetry={refresh} />
          ) : (
            <div className="space-y-5">
              {data.alerts.length > 0 && <AlertBanner alerts={data.alerts} tzOffset={data.tzOffset} />}
              {tab === 'today' && <TodayView location={active} data={data} updatedAt={weather.dataUpdatedAt} />}
              {tab === 'hourly' && <HourlyStrip hours={data.hourly} data={data} title={`Hourly forecast for ${active.name}`} />}
              {tab === 'week' && <WeekView data={data} />}
              {tab === 'map' && (
                <Suspense fallback={<div className="card h-[68vh] animate-pulse" />}>
                  <WeatherMap location={active} />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
