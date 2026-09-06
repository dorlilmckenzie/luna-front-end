'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PeriodForm } from '@/components/forms/PeriodForm';
import { SymptomForm } from '@/components/forms/SymptomForm';
import { MoodForm } from '@/components/forms/MoodForm';
import { useCreatePeriod } from '@/hooks/usePeriods';
import { useCreateSymptoms } from '@/hooks/useSymptoms';
import { useCreateMood } from '@/hooks/useMoods';
import { useToast } from '@/components/ui/Toast';
import { toFriendlyMessage } from '@/services/api';
import type { SymptomType } from '@/types';

type OpenModal = 'period' | 'symptom' | 'mood' | null;

export function QuickLog({ variant = 'grid' }: { variant?: 'grid' | 'inline' }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState<OpenModal>(null);
  const [error, setError] = useState<string | null>(null);

  const createPeriod = useCreatePeriod();
  const createSymptoms = useCreateSymptoms();
  const createMood = useCreateMood();

  const close = () => {
    setOpen(null);
    setError(null);
  };

  const actions = [
    { key: 'period' as const, label: 'Log period', icon: '🩸', onClick: () => setOpen('period') },
    { key: 'symptom' as const, label: 'Log symptoms', icon: '📝', onClick: () => setOpen('symptom') },
    { key: 'mood' as const, label: 'Log mood', icon: '💗', onClick: () => setOpen('mood') },
    { key: 'calendar' as const, label: 'View calendar', icon: '📅', onClick: () => router.push('/calendar') },
    { key: 'history' as const, label: 'View history', icon: '🗂️', onClick: () => router.push('/history') },
  ];

  return (
    <>
      <div
        className={
          variant === 'grid'
            ? 'grid grid-cols-2 gap-3 sm:grid-cols-3'
            : 'flex flex-wrap gap-2'
        }
      >
        {actions.map((a) => (
          <Button
            key={a.key}
            variant="secondary"
            onClick={a.onClick}
            className={variant === 'grid' ? 'h-full flex-col gap-1 py-4' : ''}
          >
            <span aria-hidden className="text-lg">
              {a.icon}
            </span>
            {a.label}
          </Button>
        ))}
      </div>

      <Modal open={open === 'period'} onClose={close} title="Log a period">
        <PeriodForm
          submitting={createPeriod.isPending}
          error={error}
          onCancel={close}
          onSubmit={async (values) => {
            setError(null);
            try {
              await createPeriod.mutateAsync(values);
              notify('Period logged', 'success');
              close();
            } catch (err) {
              setError(toFriendlyMessage(err));
            }
          }}
        />
      </Modal>

      <Modal open={open === 'symptom'} onClose={close} title="Log symptoms">
        <SymptomForm
          submitting={createSymptoms.isPending}
          error={error}
          onCancel={close}
          onSubmit={async (values) => {
            setError(null);
            try {
              await createSymptoms.mutateAsync({
                date: values.date,
                types: values.types as SymptomType[],
                severity: values.severity,
                notes: values.notes,
              });
              notify('Symptoms logged', 'success');
              close();
            } catch (err) {
              setError(toFriendlyMessage(err));
            }
          }}
        />
      </Modal>

      <Modal open={open === 'mood'} onClose={close} title="Log your mood">
        <MoodForm
          submitting={createMood.isPending}
          error={error}
          onCancel={close}
          onSubmit={async (values) => {
            setError(null);
            try {
              await createMood.mutateAsync(values);
              notify('Mood logged', 'success');
              close();
            } catch (err) {
              setError(toFriendlyMessage(err));
            }
          }}
        />
      </Modal>
    </>
  );
}
