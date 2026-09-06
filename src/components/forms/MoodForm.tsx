'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { moodSchema, type MoodValues } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { MOOD_EMOJI, MOOD_LABELS, todayInputValue } from '@/utils/format';
import type { MoodValue } from '@/types';

const MOOD_OPTIONS = Object.keys(MOOD_LABELS) as MoodValue[];

export function MoodForm({
  onSubmit,
  onCancel,
  error,
  submitting,
}: {
  onSubmit: (values: MoodValues) => void;
  onCancel?: () => void;
  error?: string | null;
  submitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MoodValues>({
    resolver: zodResolver(moodSchema),
    defaultValues: { date: todayInputValue(), mood: 'NEUTRAL', notes: '' },
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
        <span className="mb-1.5 block text-sm font-medium text-ink">Mood</span>
        <Controller
          control={control}
          name="mood"
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const selected = field.value === mood;
                return (
                  <button
                    type="button"
                    key={mood}
                    aria-pressed={selected}
                    onClick={() => field.onChange(mood)}
                    className={clsx(
                      'flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-xs transition-colors',
                      selected
                        ? 'border-plum-400 bg-plum-100 text-plum-700'
                        : 'border-rose-200 bg-white text-ink-soft hover:bg-rose-50',
                    )}
                  >
                    <span className="text-xl" aria-hidden>
                      {MOOD_EMOJI[mood]}
                    </span>
                    {MOOD_LABELS[mood]}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <Textarea label="Notes (optional)" error={errors.notes?.message} {...register('notes')} />

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          Save mood
        </Button>
      </div>
    </form>
  );
}
