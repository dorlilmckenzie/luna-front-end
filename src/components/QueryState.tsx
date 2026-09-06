import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { toFriendlyMessage } from '@/services/api';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  empty?: ReactNode;
  children: ReactNode;
  loadingLabel?: string;
}

/** Standard loading / error / empty wrapper so every data page behaves consistently. */
export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  empty,
  children,
  loadingLabel,
}: QueryStateProps) {
  if (isLoading) return <Spinner label={loadingLabel} />;
  if (isError) {
    return (
      <Alert tone="error">
        {toFriendlyMessage(error, 'We could not load this right now. Please refresh to try again.')}
      </Alert>
    );
  }
  if (isEmpty && empty) return <>{empty}</>;
  return <>{children}</>;
}
