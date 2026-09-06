import type { ReactNode } from 'react';
import clsx from 'clsx';

type Tone = 'rose' | 'plum' | 'neutral' | 'green' | 'amber';

const tones: Record<Tone, string> = {
  rose: 'bg-rose-100 text-rose-700',
  plum: 'bg-plum-100 text-plum-700',
  neutral: 'bg-ink/5 text-ink-soft',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
