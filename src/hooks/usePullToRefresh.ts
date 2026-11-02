import { useEffect, useState } from 'react';

const THRESHOLD = 80;

/** Touch pull-to-refresh at the top of the page. Returns current pull distance. */
export function usePullToRefresh(onRefresh: () => void, disabled = false): number {
  const [pull, setPull] = useState(0);

  useEffect(() => {
    if (disabled) return;
    let startY: number | null = null;
    let current = 0;

    const onStart = (e: TouchEvent): void => {
      startY = window.scrollY <= 0 ? e.touches[0].clientY : null;
    };
    const onMove = (e: TouchEvent): void => {
      if (startY === null) return;
      current = Math.max(0, Math.min(120, (e.touches[0].clientY - startY) * 0.5));
      setPull(current);
    };
    const onEnd = (): void => {
      if (current >= THRESHOLD / 2) onRefresh();
      startY = null;
      current = 0;
      setPull(0);
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [onRefresh, disabled]);

  return pull;
}
