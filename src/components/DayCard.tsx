import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { DailyWeather } from '../types/weather';
import { badgeFor, moodOf, uvLabel } from '../utils/condition';
import { dayName, shortDate } from '../utils/time';
import { toTemp } from '../utils/units';
import { Badge } from './Badge';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  day: DailyWeather;
  tzOffset: number;
  isToday: boolean;
  index: number;
}

export function DayCard({ day, tzOffset, isToday, index }: Props) {
  const tempUnit = useAppStore((s) => s.tempUnit);
  const mood = moodOf(day.condition);
  const badge = badgeFor(mood);
  const highUv = day.uvi !== null && uvLabel(day.uvi).high;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="card card-hover flex flex-col p-6"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xl font-semibold">{isToday ? 'Today' : dayName(day.dt, tzOffset)}</h3>
          <p className="text-xs text-body">{shortDate(day.dt, tzOffset)}</p>
        </div>
        <WeatherIcon mood={mood} size={52} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge tone={badge.tone}>{badge.label}</Badge>
        {day.pop >= 0.4 && <Badge tone="teal">{Math.round(day.pop * 100)}% rain</Badge>}
        {highUv && <Badge tone="alert">High UV</Badge>}
      </div>

      <p className="mt-6 flex items-baseline gap-3">
        <span className="temp-number text-6xl leading-none" aria-label={`High ${toTemp(day.max, tempUnit)} degrees`}>
          {toTemp(day.max, tempUnit)}°
        </span>
        <span className="font-serif text-2xl font-semibold text-body" aria-label={`Low ${toTemp(day.min, tempUnit)} degrees`}>
          {toTemp(day.min, tempUnit)}°
        </span>
      </p>
    </motion.article>
  );
}
