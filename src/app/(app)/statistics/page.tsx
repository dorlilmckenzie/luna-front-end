'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { QueryState } from '@/components/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeading } from '@/components/layout/PageHeading';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { useStatistics, useCycles } from '@/hooks/useCycles';
import { formatShortDate } from '@/utils/format';

function StatTile({ label, value, unit }: { label: string; value: number | null; unit?: string }) {
  return (
    <div className="rounded-xl bg-rose-50/60 px-3 py-4 text-center">
      <p className="text-2xl font-semibold text-ink">
        {value ?? '—'}
        {value != null && unit ? <span className="text-sm text-ink-soft"> {unit}</span> : null}
      </p>
      <p className="mt-1 text-xs text-ink-soft">{label}</p>
    </div>
  );
}

export default function StatisticsPage() {
  const stats = useStatistics();
  const cycles = useCycles();

  const chartData = (cycles.data ?? [])
    .filter((c) => c.cycleLength != null)
    .map((c) => ({
      name: formatShortDate(c.periodStart),
      cycle: c.cycleLength,
      period: c.periodLength ?? null,
    }));

  const noData = !stats.isLoading && !stats.isError && (stats.data?.periodsLogged ?? 0) === 0;

  return (
    <div className="space-y-5">
      <PageHeading title="Statistics" subtitle="Patterns from the cycles you've tracked." />

      <QueryState
        isLoading={stats.isLoading}
        isError={stats.isError}
        error={stats.error}
        isEmpty={noData}
        empty={
          <EmptyState
            title="No statistics yet"
            description="Log a few periods and your cycle averages will appear here."
            icon="📊"
          />
        }
      >
        {stats.data && (
          <>
            <Card>
              <CardHeader title="Cycle length" />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Average" value={stats.data.averageCycleLength} unit="days" />
                <StatTile label="Shortest" value={stats.data.shortestCycle} unit="days" />
                <StatTile label="Longest" value={stats.data.longestCycle} unit="days" />
              </div>
            </Card>

            <Card>
              <CardHeader title="Period duration" />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Average" value={stats.data.averagePeriodLength} unit="days" />
                <StatTile label="Shortest" value={stats.data.shortestPeriod} unit="days" />
                <StatTile label="Longest" value={stats.data.longestPeriod} unit="days" />
              </div>
            </Card>

            <Card>
              <CardHeader title="Tracking" />
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Cycles tracked" value={stats.data.cyclesTracked} />
                <StatTile label="Periods logged" value={stats.data.periodsLogged} />
              </div>
            </Card>

            {chartData.length >= 2 && (
              <Card>
                <CardHeader title="Cycle length over time" />
                <div className="h-56 w-full">
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5C6CD" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9C8E94" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9C8E94" domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="cycle"
                        stroke="#C85A72"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Cycle length"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {chartData.length >= 2 && (
              <Card>
                <CardHeader title="Period duration by cycle" />
                <div className="h-56 w-full">
                  <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5C6CD" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9C8E94" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9C8E94" allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="period" fill="#9B74AE" radius={[4, 4, 0, 0]} name="Period days" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            <p className="text-xs text-ink-faint">
              These figures describe your logged history only and are not a medical assessment.
            </p>
          </>
        )}
      </QueryState>

      <DisclaimerBanner />
    </div>
  );
}
