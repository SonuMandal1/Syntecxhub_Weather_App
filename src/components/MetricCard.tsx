import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  footer?: ReactNode;
}

export function MetricCard({ label, value, unit, icon, footer }: Props) {
  return (
    <div className="card card-hover flex min-h-[148px] flex-col justify-between p-5">
      <div className="flex items-center gap-2.5 text-accent">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald/15" aria-hidden="true">{icon}</span>
        <span className="label">{label}</span>
      </div>
      <div className="mt-3">
        <p className="font-serif text-4xl font-bold leading-none text-ink">
          {value}
          {unit && <span className="ml-1 font-sans text-base font-semibold text-body">{unit}</span>}
        </p>
        {footer && <div className="mt-3 flex flex-wrap gap-1.5">{footer}</div>}
      </div>
    </div>
  );
}

const svgProps = {
  viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
} as const;

export const Icons = {
  feels: <svg {...svgProps}><path d="M14 14.8V4a2 2 0 1 0-4 0v10.8a4 4 0 1 0 4 0z" /></svg>,
  humidity: <svg {...svgProps}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>,
  wind: <svg {...svgProps}><path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7" /></svg>,
  pressure: <svg {...svgProps}><circle cx="12" cy="12" r="9" /><path d="m12 12 4-3" /></svg>,
  visibility: <svg {...svgProps}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  uv: <svg {...svgProps}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  air: <svg {...svgProps}><path d="M4 8h9a2.5 2.5 0 1 0-2.5-2.5M4 12h14a2.5 2.5 0 1 1-2.5 2.5M4 16h6" /></svg>,
  cloud: <svg {...svgProps}><path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 11a3.5 3.5 0 0 1 0 7z" /></svg>,
  rain: <svg {...svgProps}><path d="M7 14a4 4 0 0 1-.5-8A6 6 0 0 1 18 7a3.5 3.5 0 0 1 0 7zM9 17l-1 3M13 17l-1 3M17 17l-1 3" /></svg>,
};
