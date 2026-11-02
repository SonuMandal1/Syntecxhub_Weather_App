import { useId } from 'react';
import { formatClock, formatDuration } from '../utils/time';

interface Props {
  now: number;
  sunrise: number;
  sunset: number;
  tzOffset: number;
}

export function SunArc({ now, sunrise, sunset, tzOffset }: Props) {
  const gid = useId();
  const raw = (now - sunrise) / (sunset - sunrise);
  const p = Math.min(1, Math.max(0, raw));
  const daytime = raw >= 0 && raw <= 1;
  const R = 120;
  const cx = 150;
  const cy = 140;
  const sx = cx - R * Math.cos(p * Math.PI);
  const sy = cy - R * Math.sin(p * Math.PI);
  const arc = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;

  return (
    <div className="card flex h-full flex-col justify-between p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">Sun</h3>
        <span className="label">{formatDuration(sunset - sunrise)} of daylight</span>
      </div>
      <svg
        viewBox="0 0 300 160"
        className="mx-auto mt-2 max-h-[120px] w-full"
        role="img"
        aria-label={`Sunrise at ${formatClock(sunrise, tzOffset)}, sunset at ${formatClock(sunset, tzOffset)}`}
      >
        <defs>
          <linearGradient id={gid} x1="0" x2="1">
            <stop offset="0" stopColor="#10B981" />
            <stop offset="0.5" stopColor="#2DD4BF" />
            <stop offset="1" stopColor="#E8A93B" />
          </linearGradient>
        </defs>
        <path d={arc} fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" />
        <path d={arc} fill="none" stroke={`url(#${gid})`} strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray={`${p} 1`} />
        <line x1="14" y1={cy + 8} x2="286" y2={cy + 8} stroke="var(--line)" strokeWidth="2" />
        {daytime ? (
          <g>
            <circle cx={sx} cy={sy} r="16" fill="#E8A93B" fillOpacity=".25" />
            <circle cx={sx} cy={sy} r="9" fill="#E8A93B" stroke="#FFFDF8" strokeWidth="3" />
          </g>
        ) : (
          <circle cx={raw < 0 ? cx - R : cx + R} cy={cy} r="7" fill="var(--body)" fillOpacity=".5" />
        )}
      </svg>
      <dl className="flex justify-between">
        <div>
          <dt className="label">Sunrise</dt>
          <dd className="font-serif text-xl font-bold text-ink">{formatClock(sunrise, tzOffset)}</dd>
        </div>
        <div className="text-right">
          <dt className="label">Sunset</dt>
          <dd className="font-serif text-xl font-bold text-ink">{formatClock(sunset, tzOffset)}</dd>
        </div>
      </dl>
    </div>
  );
}
