'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';

export interface DayMarkers {
  period: boolean;
  predictedPeriod: boolean;
  fertile: boolean;
  ovulation: boolean;
  symptom: boolean;
  mood: boolean;
}

export function MonthCalendar({
  month,
  onMonthChange,
  markersForDate,
  selectedDate,
  onSelectDate,
}: {
  month: Date;
  onMonthChange: (next: Date) => void;
  markersForDate: (date: Date) => DayMarkers;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}) {
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const today = new Date();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(subMonths(month, 1))}
          aria-label="Previous month"
        >
          ←
        </Button>
        <p className="text-sm font-semibold text-ink">{format(month, 'MMMM yyyy')}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(addMonths(month, 1))}
          aria-label="Next month"
        >
          →
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink-faint">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const m = markersForDate(day);
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              aria-pressed={!!isSelected}
              aria-label={format(day, 'EEEE, MMMM d, yyyy')}
              className={clsx(
                'relative flex min-h-[46px] flex-col items-center justify-start rounded-lg border p-1 text-xs',
                inMonth ? 'text-ink' : 'text-ink-faint/60',
                m.period
                  ? 'border-rose-300 bg-rose-100'
                  : m.predictedPeriod
                    ? 'border-rose-200 bg-rose-50'
                    : m.fertile
                      ? 'border-plum-200 bg-plum-50'
                      : 'border-transparent',
                isSelected && 'ring-2 ring-plum-400',
              )}
            >
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  isToday && 'bg-ink text-white',
                )}
              >
                {format(day, 'd')}
              </span>
              <span className="mt-0.5 flex gap-0.5">
                {m.ovulation && <Dot className="bg-plum-500" />}
                {m.symptom && <Dot className="bg-amber-500" />}
                {m.mood && <Dot className="bg-emerald-500" />}
              </span>
            </button>
          );
        })}
      </div>

      <Legend />
    </div>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={clsx('h-1.5 w-1.5 rounded-full', className)} aria-hidden />;
}

function Legend() {
  const items = [
    { label: 'Period', className: 'bg-rose-100 border border-rose-300' },
    { label: 'Predicted period', className: 'bg-rose-50 border border-rose-200' },
    { label: 'Fertile window', className: 'bg-plum-50 border border-plum-200' },
    { label: 'Ovulation', className: 'bg-plum-500' },
    { label: 'Symptoms', className: 'bg-amber-500' },
    { label: 'Mood', className: 'bg-emerald-500' },
  ];
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-ink-soft">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className={clsx('inline-block h-3 w-3 rounded', i.className)} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export function dateKey(date: Date | string): string {
  return typeof date === 'string' ? date.slice(0, 10) : format(date, 'yyyy-MM-dd');
}

export function isoToKey(iso: string): string {
  try {
    return format(parseISO(iso), 'yyyy-MM-dd');
  } catch {
    return iso.slice(0, 10);
  }
}
