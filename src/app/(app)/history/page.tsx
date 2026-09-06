'use client';

import { useMemo, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { QueryState } from '@/components/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeading } from '@/components/layout/PageHeading';
import { PeriodForm } from '@/components/forms/PeriodForm';
import { QuickLog } from '@/components/QuickLog';
import { usePeriods, useUpdatePeriod, useDeletePeriod } from '@/hooks/usePeriods';
import { useCycles } from '@/hooks/useCycles';
import { useSymptoms, useDeleteSymptom } from '@/hooks/useSymptoms';
import { useMoods, useDeleteMood } from '@/hooks/useMoods';
import { useToast } from '@/components/ui/Toast';
import { toFriendlyMessage } from '@/services/api';
import {
  FLOW_LABELS,
  MOOD_EMOJI,
  MOOD_LABELS,
  SEVERITY_LABELS,
  SYMPTOM_LABELS,
  formatDate,
  isoToDayKey,
} from '@/utils/format';
import type { Period } from '@/types';

type Tab = 'periods' | 'symptoms' | 'moods';

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>('periods');

  return (
    <div className="space-y-5">
      <PageHeading
        title="History"
        subtitle="Everything you've logged, most recent first."
        action={<QuickLog variant="inline" />}
      />

      <div className="flex gap-1 rounded-xl bg-rose-50 p-1 text-sm">
        {(['periods', 'symptoms', 'moods'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={clsx(
              'flex-1 rounded-lg px-3 py-2 font-medium capitalize transition-colors',
              tab === t ? 'bg-white text-rose-700 shadow-sm' : 'text-ink-soft',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'periods' && <PeriodsTab />}
      {tab === 'symptoms' && <SymptomsTab />}
      {tab === 'moods' && <MoodsTab />}
    </div>
  );
}

function PeriodsTab() {
  const periods = usePeriods();
  const cycles = useCycles();
  const updatePeriod = useUpdatePeriod();
  const deletePeriod = useDeletePeriod();
  const { notify } = useToast();

  const [editing, setEditing] = useState<Period | null>(null);
  const [deleting, setDeleting] = useState<Period | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const cycleLengthByStart = useMemo(() => {
    const map = new Map<string, number | null>();
    (cycles.data ?? []).forEach((c) => map.set(isoToDayKey(c.periodStart), c.cycleLength));
    return map;
  }, [cycles.data]);

  const rows = (periods.data ?? []).map((p) => ({
    period: p,
    periodLength: p.endDate
      ? differenceInCalendarDays(parseISO(p.endDate), parseISO(p.startDate)) + 1
      : null,
    cycleLength: cycleLengthByStart.get(isoToDayKey(p.startDate)) ?? null,
  }));

  return (
    <>
      <QueryState
        isLoading={periods.isLoading}
        isError={periods.isError}
        error={periods.error}
        isEmpty={rows.length === 0}
        empty={
          <EmptyState
            title="No periods recorded yet"
            description="Start tracking your cycle by adding your first period."
          />
        }
      >
        <div className="space-y-3">
          {rows.map(({ period, periodLength, cycleLength }) => (
            <Card key={period.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {formatDate(period.startDate)} –{' '}
                    {period.endDate ? formatDate(period.endDate) : 'ongoing'}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-ink-soft">
                    <Badge tone="rose">{FLOW_LABELS[period.flow]}</Badge>
                    <Badge tone="neutral">
                      Period:{' '}
                      {periodLength ? `${periodLength} day${periodLength > 1 ? 's' : ''}` : '—'}
                    </Badge>
                    <Badge tone="plum">Cycle: {cycleLength ? `${cycleLength} days` : '—'}</Badge>
                  </div>
                  {period.notes && (
                    <p className="mt-1 text-xs text-ink-faint">Notes: {period.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFormError(null);
                      setEditing(period);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleting(period)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </QueryState>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit period">
        {editing && (
          <PeriodForm
            initial={editing}
            submitLabel="Save changes"
            submitting={updatePeriod.isPending}
            error={formError}
            onCancel={() => setEditing(null)}
            onSubmit={async (values) => {
              setFormError(null);
              try {
                await updatePeriod.mutateAsync({ id: editing.id, input: values });
                notify('Period updated', 'success');
                setEditing(null);
              } catch (err) {
                setFormError(toFriendlyMessage(err));
              }
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete this period?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deletePeriod.isPending}
              onClick={async () => {
                if (!deleting) return;
                try {
                  await deletePeriod.mutateAsync(deleting.id);
                  notify('Period deleted', 'success');
                  setDeleting(null);
                } catch (err) {
                  notify(toFriendlyMessage(err), 'error');
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          This permanently removes the period logged for{' '}
          <strong>{deleting ? formatDate(deleting.startDate) : ''}</strong>. This cannot be undone.
        </p>
      </Modal>
    </>
  );
}

function SymptomsTab() {
  const symptoms = useSymptoms();
  const remove = useDeleteSymptom();
  const { notify } = useToast();

  return (
    <QueryState
      isLoading={symptoms.isLoading}
      isError={symptoms.isError}
      error={symptoms.error}
      isEmpty={(symptoms.data ?? []).length === 0}
      empty={
        <EmptyState
          title="No symptoms logged yet"
          description="Use “Log symptoms” above to record how you're feeling on any day."
          icon="📝"
        />
      }
    >
      <div className="space-y-2">
        {(symptoms.data ?? []).map((s) => (
          <Card key={s.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">{SYMPTOM_LABELS[s.type]}</p>
              <p className="text-xs text-ink-soft">
                {formatDate(s.date)} · {SEVERITY_LABELS[s.severity]}
                {s.notes ? ` · ${s.notes}` : ''}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                try {
                  await remove.mutateAsync(s.id);
                  notify('Symptom deleted', 'success');
                } catch (err) {
                  notify(toFriendlyMessage(err), 'error');
                }
              }}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </QueryState>
  );
}

function MoodsTab() {
  const moods = useMoods();
  const remove = useDeleteMood();
  const { notify } = useToast();

  return (
    <QueryState
      isLoading={moods.isLoading}
      isError={moods.isError}
      error={moods.error}
      isEmpty={(moods.data ?? []).length === 0}
      empty={
        <EmptyState
          title="No moods logged yet"
          description="Use “Log mood” above to keep track of how you feel across your cycle."
          icon="💗"
        />
      }
    >
      <div className="space-y-2">
        {(moods.data ?? []).map((m) => (
          <Card key={m.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">
                {MOOD_EMOJI[m.mood]} {MOOD_LABELS[m.mood]}
              </p>
              <p className="text-xs text-ink-soft">
                {formatDate(m.date)}
                {m.notes ? ` · ${m.notes}` : ''}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                try {
                  await remove.mutateAsync(m.id);
                  notify('Mood deleted', 'success');
                } catch (err) {
                  notify(toFriendlyMessage(err), 'error');
                }
              }}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </QueryState>
  );
}
