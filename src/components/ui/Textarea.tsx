import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const areaId = id ?? generatedId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={areaId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={3}
        aria-invalid={!!error}
        className={clsx(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-faint',
          error ? 'border-rose-400' : 'border-rose-200 focus:border-plum-400',
          className,
        )}
        {...rest}
      />
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});
