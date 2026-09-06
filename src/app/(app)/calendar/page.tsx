'use client';

import { useMemo, useState } from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { QueryState } from '@/components/QueryState';
import { PageHeading } from '@/components/layout/PageHeading';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import {
  MonthCalendar,
  isoToKey,
  type DayMarkers,
} from '@/components/calendar/MonthCalendar';
import { usePeriods } from '@/hooks/usePeriods';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMoods } from '@/hooks/useMoods';
import { useCalendarOverlay } from '@/hooks/usePredictions';
import { FLOW_LABELS, MOOD_EMOJI, MOOD_LABELS, SYMPTOM_LABELS, formatDate } from '@/utils/format';

export default function CalendarPage() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(new Date());

  const rangeFrom = format(startOfMonth(month), 'yyyy-MM-dd');
  const rangeTo = format(endOfMonth(month), 'yyyy-MM-dd');

  const periods = usePeriods();
  const symptoms = useSymptoms({ from: rangeFrom, to: rangeTo });
  const moods = useMoods({ from: rangeFrom, to: rangeTo });
  const overlay = useCalendarOverlay(rangeFrom, rangeTo);

  const isLoading =
    periods.isLoading || symptoms.isLoading || moods.isLoading || overlay.isLoading;
  const isError = periods.isError || symptoms.isError || moods.isError || overlay.isError;

  const periodDayKeys = useMemo(() => {
    const set = new Set<string>();
    (periods.data ?? []).forEach((p) => {
      const start = parseISO(p.startDate);
      const end = p.endDate ? parseISO(p.endDate) : start;
      eachDayOfInterval({ start, end }).forEach((d) => set.add(format(d, 'yyyy-MM-dd')));
    });
    return set;
  }, [periods.data]);

  const symptomKeys = useMemo(
    () => new Set((symptoms.data ?? []).map((s) => isoToKey(s.date))),
    [symptoms.data],
  );
  const moodKeys = useMemo(
    () => new Set((moods.data ?? []).map((m) => isoToKey(m.date))),
    [moods.data],
  );

  const predictedPeriodKeys = useMemo(
    () => new Set(overlay.data?.overlay.predictedPeriod ?? []),
    [overlay.data],
  );
  const fertileKeys = useMemo(
    () => new Set(overlay.data?.overlay.fertileWindow ?? []),
    [overlay.data],
  );
  const ovulationKeys = useMemo(
    () => new Set(overlay.data?.overlay.ovulation ?? []),
    [overlay.data],
  );

  const markersForDate = (date: Date): DayMarkers => {
    const key = format(date, 'yyyy-MM-dd');
    return {
      period: periodDayKeys.has(key),
      predictedPeriod: predictedPeriodKeys.has(key) && !periodDayKeys.has(key),
      fertile: fertileKeys.has(key),
      ovulation: ovulationKeys.has(key),
      symptom: symptomKeys.has(key),
      mood: moodKeys.has(key),
    };
  };

  const selectedKey = selected ? format(selected, 'yyyy-MM-dd') : null;
  const daySymptoms = (symptoms.data ?? []).filter((s) => isoToKey(s.date) === selectedKey);
  const dayMoods = (moods.data ?? []).filter((m) => isoToKey(m.date) === selectedKey);
  const dayPeriod = (periods.data ?? []).find((p) => {
    if (!selected) return false;
    const start = parseISO(p.startDate);
    const end = p.endDate ? parseISO(p.endDate) : start;
    return selected >= start && selected <= end;
  });

  return (
    <div className="space-y-5">
      <PageHeading title="Calendar" subtitle="Tap a day to see what you logged." />

      <Card>
        <QueryState isLoading={isLoading} isError={isError} error={periods.error}>
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            markersForDate={markersForDate}
            selectedDate={selected}
            onSelectDate={setSelected}
          />
        </QueryState>
      </Card>

      <Card>
        <CardHeader title={selected ? formatDate(selected.toISOString()) : 'Select a day'} />
        {!selected ? (
          <p className="text-sm text-ink-soft">Choose a date on the calendar above.</p>
        ) : (
          <div className="space-y-3 text-sm">
            {dayPeriod && (
              <div className="rounded-xl bg-rose-50 px-3 py-2">
                <p className="font-medium text-rose-700">Period</p>
                <p className="text-ink-soft">
                  {FLOW_LABELS[dayPeriod.flow]} flow
                  {dayPeriod.notes ? ` · ${dayPeriod.notes}` : ''}
                </p>
              </div>
            )}
            {daySymptoms.length > 0 && (
              <div>
                <p className="font-medium text-ink">Symptoms</p>
                <ul className="mt-1 space-y-1 text-ink-soft">
                  {daySymptoms.map((s) => (
                    <li key={s.id}>
                      {SYMPTOM_LABELS[s.type]} — {s.severity.toLowerCase()}
                      {s.notes ? ` · ${s.notes}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {dayMoods.length > 0 && (
              <div>
                <p className="font-medium text-ink">Mood</p>
                <ul className="mt-1 space-y-1 text-ink-soft">
                  {dayMoods.map((m) => (
                    <li key={m.id}>
                      {MOOD_EMOJI[m.mood]} {MOOD_LABELS[m.mood]}
                      {m.notes ? ` · ${m.notes}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!dayPeriod && daySymptoms.length === 0 && dayMoods.length === 0 && (
              <p className="text-ink-soft">Nothing logged for this day.</p>
            )}
          </div>
        )}
      </Card>

      <DisclaimerBanner />
    </div>
  );
}
