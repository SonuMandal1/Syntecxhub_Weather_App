import type { WeatherBundle } from '../types/weather';
import { DayCard } from './DayCard';

export function WeekView({ data }: { data: WeatherBundle }) {
  return (
    <div>
      {data.source === 'standard' && (
        <p className="mb-4 text-sm text-body">
          Showing the 5-day forecast available on the free plan. Enable One Call 3.0 for 7 days.
        </p>
      )}
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {data.daily.map((d, i) => (
          <li key={d.dt}>
            <DayCard day={d} tzOffset={data.tzOffset} isToday={i === 0} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
