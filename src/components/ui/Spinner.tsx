export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-ink-soft" role="status">
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-rose-300 border-t-transparent"
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
