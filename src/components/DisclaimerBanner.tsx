export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? 'text-xs text-ink-faint'
          : 'rounded-xl bg-plum-50 px-4 py-3 text-xs text-plum-700 ring-1 ring-plum-200'
      }
    >
      Predictions are estimates based on your logged history. They are for information only,
      are <strong>not medical advice</strong>, and must not be relied on as contraception or a
      diagnosis. Speak to a healthcare professional about any concerns.
    </p>
  );
}
