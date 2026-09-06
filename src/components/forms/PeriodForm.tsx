'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { periodSchema, type PeriodValues } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { FLOW_LABELS, toDateInputValue, todayInputValue } from '@/utils/format';
import type { Period } from '@/types';

export interface PeriodFormValues {
  startDate: string;
  endDate?: string | null;
  flow: PeriodValues['flow'];
  notes?: string | null;
}

const FLOW_OPTIONS = (Object.keys(FLOW_LABELS) as PeriodValues['flow'][]).map((value) => ({
  value,
  label: FLOW_LABELS[value],
}));

export function PeriodForm({
  initial,
  submitLabel = 'Save period',
  onSubmit,
  onCancel,
  error,
  submitting,
}: {
  initial?: Period | null;
  submitLabel?: string;
  onSubmit: (values: PeriodFormValues) => void;
  onCancel?: () => void;
  error?: string | null;
  submitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PeriodValues>({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      startDate: initial ? toDateInputValue(initial.startDate) : todayInputValue(),
      endDate: initial?.endDate ? toDateInputValue(initial.endDate) : '',
      flow: initial?.flow ?? 'MEDIUM',
      notes: initial?.notes ?? '',
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      startDate: values.startDate,
      endDate: values.endDate ? values.endDate : null,
      flow: values.flow,
      notes: values.notes?.trim() ? values.notes.trim() : null,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Start date"
          type="date"
          max={todayInputValue()}
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          label="End date (optional)"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>
      <Select label="Flow intensity" options={FLOW_OPTIONS} {...register('flow')} />
      <Textarea
        label="Notes (optional)"
        placeholder="Anything you want to remember about this period"
        error={errors.notes?.message}
        {...register('notes')}
      />
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
