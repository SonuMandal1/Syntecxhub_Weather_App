import { useCallback, useState } from 'react';
import { reverseGeocode } from '../services/weatherService';
import { useAppStore } from '../store/useAppStore';

type GeoStatus = 'idle' | 'locating' | 'denied' | 'unsupported';

export function useGeolocation() {
  const setActive = useAppStore((s) => s.setActive);
  const [status, setStatus] = useState<GeoStatus>('idle');

  /** auto=true is the on-load lookup: it must not overwrite a city the user already picked. */
  const locate = useCallback((auto = false) => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (!auto || !useAppStore.getState().active) setActive(loc);
        setStatus('idle');
      },
      () => setStatus('denied'),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, [setActive]);

  return { status, locate };
}
