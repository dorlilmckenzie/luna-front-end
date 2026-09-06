import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-rose-500 text-white hover:bg-rose-600 disabled:bg-rose-300',
  secondary: 'bg-white text-ink border border-rose-200 hover:bg-rose-50 disabled:opacity-60',
  ghost: 'bg-transparent text-plum-600 hover:bg-plum-50 disabled:opacity-60',
  danger: 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 disabled:opacity-60',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 min-h-[36px]',
  md: 'text-sm px-4 py-2.5 min-h-[44px]',
  lg: 'text-base px-5 py-3 min-h-[48px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-plum-400',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
});
