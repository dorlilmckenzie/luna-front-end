import type { ReactNode } from 'react';
import clsx from 'clsx';

type Tone = 'error' | 'info' | 'success' | 'warning';

const tones: Record<Tone, string> = {
  error: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-plum-50 text-plum-700 ring-plum-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
};

export function Alert({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={clsx('rounded-xl px-4 py-3 text-sm ring-1', tones[tone])}
    >
      {children}
    </div>
  );
}
