import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={clsx(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-faint',
          'min-h-[44px] transition-colors',
          error ? 'border-rose-400 focus:border-rose-500' : 'border-rose-200 focus:border-plum-400',
          className,
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
});
