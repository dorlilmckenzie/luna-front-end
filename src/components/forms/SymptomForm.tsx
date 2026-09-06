'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { symptomSchema, type SymptomValues } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SEVERITY_LABELS, SYMPTOM_LABELS, todayInputValue } from '@/utils/format';
import type { Severity, SymptomType } from '@/types';

const SYMPTOM_OPTIONS = Object.keys(SYMPTOM_LABELS) as SymptomType[];
const SEVERITY_OPTIONS = (Object.keys(SEVERITY_LABELS) as Severity[]).map((value) => ({
  value,
  label: SEVERITY_LABELS[value],
}));

export function SymptomForm({
  onSubmit,
  onCancel,
  error,
  submitting,
}: {
  onSubmit: (values: SymptomValues) => void;
  onCancel?: () => void;
  error?: string | null;
  submitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SymptomValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: { date: todayInputValue(), types: [], severity: 'MODERATE', notes: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && <Alert tone="error">{error}</Alert>}
      <Input
        label="Date"
        type="date"
        max={todayInputValue()}
        error={errors.date?.message}
        {...register('date')}
      />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Symptoms</span>
        <Controller
          control={control}
          name="types"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map((type) => {
                const selected = field.value.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    aria-pressed={selected}
                    onClick={() =>
                      field.onChange(
                        selected
                          ? field.value.filter((t) => t !== type)
                          : [...field.value, type],
                      )
                    }
                    className={clsx(
                      'min-h-[40px] rounded-full border px-3 py-1.5 text-sm transition-colors',
                      selected
                        ? 'border-rose-400 bg-rose-100 text-rose-700'
                        : 'border-rose-200 bg-white text-ink-soft hover:bg-rose-50',
                    )}
                  >
                    {SYMPTOM_LABELS[type]}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.types?.message && (
          <p className="mt-1 text-xs font-medium text-rose-600">{errors.types.message}</p>
        )}
      </div>

      <Select label="Severity" options={SEVERITY_OPTIONS} {...register('severity')} />
      <Textarea label="Notes (optional)" error={errors.notes?.message} {...register('notes')} />

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          Save symptoms
        </Button>
      </div>
    </form>
  );
}
