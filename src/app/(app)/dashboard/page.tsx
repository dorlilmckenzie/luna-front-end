'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSummary } from '@/hooks/useCycles';
import { usePrediction } from '@/hooks/usePredictions';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { QueryState } from '@/components/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuickLog } from '@/components/QuickLog';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { PageHeading } from '@/components/layout/PageHeading';
import { formatDate, CONFIDENCE_LABELS } from '@/utils/format';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-rose-50/60 px-3 py-3 text-center">
      <p className="text-lg font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const summary = useSummary();
  const prediction = usePrediction();

  return (
    <div className="space-y-5">
      <PageHeading
        title={`Hi ${user?.firstName ?? ''}`.trim()}
        subtitle="Here's where your cycle stands today."
      />

      <Card>
        <CardHeader title="Current cycle" />
        <QueryState
          isLoading={summary.isLoading}
          isError={summary.isError}
          error={summary.error}
          isEmpty={!summary.data?.current.lastPeriodStart}
          empty={
            <EmptyState
              title="No periods recorded yet"
              description="Start tracking your cycle by adding your first period."
              action={<QuickLog variant="inline" />}
            />
          }
        >
          {summary.data && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold text-rose-600">
                  {summary.data.current.cycleDay ?? '—'}
                </span>
                <div className="text-sm text-ink-soft">
                  <p>Cycle day</p>
                  <p>
                    {summary.data.current.onPeriod ? (
                      <Badge tone="rose">On your period</Badge>
                    ) : (
                      <Badge tone="neutral">Not on your period</Badge>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat
                  label="Last period"
                  value={formatDate(summary.data.current.lastPeriodStart, '—')}
                />
                <Stat
                  label="Avg cycle length"
                  value={
                    summary.data.statistics.averageCycleLength
                      ? `${summary.data.statistics.averageCycleLength} days`
                      : '—'
                  }
                />
                <Stat
                  label="Avg period length"
                  value={
                    summary.data.statistics.averagePeriodLength
                      ? `${summary.data.statistics.averagePeriodLength} days`
                      : '—'
                  }
                />
                <Stat
                  label="Cycles tracked"
                  value={String(summary.data.statistics.cyclesTracked)}
                />
              </div>
            </>
          )}
        </QueryState>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader
            title="Upcoming period"
            action={
              prediction.data ? (
                <Badge tone="plum">{CONFIDENCE_LABELS[prediction.data.confidence]}</Badge>
              ) : null
            }
          />
          <QueryState
            isLoading={prediction.isLoading}
            isError={prediction.isError}
            error={prediction.error}
          >
            {prediction.data?.nextPeriod ? (
              <div>
                <p className="text-sm text-ink-soft">Your next period is expected around</p>
                <p className="mt-1 text-xl font-semibold text-ink">
                  {formatDate(prediction.data.nextPeriod.startDate)}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Estimated window {formatDate(prediction.data.nextPeriod.earliest)} –{' '}
                  {formatDate(prediction.data.nextPeriod.latest)}. This is an estimate, not a
                  guarantee.
                </p>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">
                {prediction.data?.note ??
                  'Log a period to start seeing predictions. Accuracy improves with more history.'}
              </p>
            )}
          </QueryState>
        </Card>

        <Card>
          <CardHeader title="Fertile window" />
          <QueryState
            isLoading={prediction.isLoading}
            isError={prediction.isError}
            error={prediction.error}
          >
            {prediction.data?.fertileWindow && prediction.data.confidence !== 'none' ? (
              <div>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {formatDate(prediction.data.fertileWindow.startDate)} –{' '}
                  {formatDate(prediction.data.fertileWindow.endDate)}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Estimated ovulation around{' '}
                  {formatDate(prediction.data.ovulation?.estimatedDate)}. Estimates only — not
                  medical advice and not a form of contraception.
                </p>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">
                Not enough history yet to estimate a fertile window. Keep logging your cycles.
              </p>
            )}
          </QueryState>
        </Card>
      </div>

      <Card>
        <CardHeader title="Quick actions" />
        <QuickLog />
      </Card>

      <DisclaimerBanner />
    </div>
  );
}
