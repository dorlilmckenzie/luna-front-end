import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink min-h-[44px]',
          error ? 'border-rose-400' : 'border-rose-200 focus:border-plum-400',
          className,
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
});
