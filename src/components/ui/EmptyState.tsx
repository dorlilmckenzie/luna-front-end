import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
  icon = '🌸',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-10 text-center">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
