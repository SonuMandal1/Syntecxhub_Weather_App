import type { Mood } from '../utils/condition';

const AMBER = '#E8A93B';
const EMERALD = '#10B981';
const TEAL = '#2DD4BF';

interface Props {
  mood: Mood;
  size?: number;
  className?: string;
}

const stroke = { strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

const Sun = ({ cx = 32, cy = 32, r = 11 }: { cx?: number; cy?: number; r?: number }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} stroke={AMBER} {...stroke} fill={AMBER} fillOpacity=".22" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      const x1 = cx + Math.cos(a) * (r + 5);
      const y1 = cy + Math.sin(a) * (r + 5);
      const x2 = cx + Math.cos(a) * (r + 10);
      const y2 = cy + Math.sin(a) * (r + 10);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMBER} {...stroke} />;
    })}
  </g>
);

const Moon = () => (
  <path d="M42 38a15 15 0 1 1-16-24 12 12 0 0 0 16 24z" {...stroke} fill="#8B7CF6" fillOpacity=".2" stroke="#8B7CF6" />
);

const CLOUD = 'M20 46a9 9 0 0 1-1-17.9A12 12 0 0 1 42 25a10 10 0 0 1 2 21z';
const Cloud = ({ transform }: { transform?: string }) => (
  <path d={CLOUD} transform={transform} {...stroke} fill={TEAL} fillOpacity=".2" stroke={EMERALD} />
);

const Drops = ({ n = 3, color = TEAL }: { n?: number; color?: string }) => (
  <g>
    {[22, 32, 42].slice(0, n).map((x, i) => (
      <line key={x} x1={x} y1={50 + (i % 2) * 2} x2={x - 3} y2={57 + (i % 2) * 2} stroke={color} {...stroke} />
    ))}
  </g>
);

const body = (mood: Mood): JSX.Element => {
  switch (mood) {
    case 'sunny': return <Sun />;
    case 'clear-night': return <Moon />;
    case 'partly':
      return (<><g transform="translate(-6 -6) scale(.8)"><Sun /></g><Cloud transform="translate(6 2)" /></>);
    case 'cloudy': return <Cloud transform="translate(0 -3)" />;
    case 'drizzle': return (<><Cloud transform="translate(0 -6)" /><Drops n={2} /></>);
    case 'rain': return (<><Cloud transform="translate(0 -6)" /><Drops /></>);
    case 'storm':
      return (
        <>
          <Cloud transform="translate(0 -6)" />
          <path d="M34 40l-6 9h7l-5 9" stroke={AMBER} {...stroke} />
        </>
      );
    case 'snow':
      return (
        <>
          <Cloud transform="translate(0 -6)" />
          {[22, 32, 42].map((x, i) => <circle key={x} cx={x} cy={52 + (i % 2) * 3} r="2" fill={TEAL} />)}
        </>
      );
    case 'mist':
      return (
        <g stroke={EMERALD} {...stroke}>
          <path d="M14 24h30M20 33h34M14 42h26M24 51h24" />
        </g>
      );
    case 'windy':
      return (
        <g stroke={EMERALD} {...stroke}>
          <path d="M10 26h30a6 6 0 1 0-6-6M10 38h40a6 6 0 1 1-6 6M10 32h18" />
        </g>
      );
  }
};

export function WeatherIcon({ mood, size = 56, className }: Props) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      {body(mood)}
    </svg>
  );
}
