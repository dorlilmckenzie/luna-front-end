'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordValues } from '@/lib/validators';
import * as authService from '@/services/auth.service';
import { toFriendlyMessage } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [error, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordValues) => {
    setErrorMsg(null);
    try {
      await authService.resetPassword(token, values.password);
      setDone(true);
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err) {
      setErrorMsg(toFriendlyMessage(err, 'This reset link is invalid or has expired.'));
    }
  };

  if (!token) {
    return (
      <Alert tone="error">
        This link is missing its reset token. Please request a new link from the{' '}
        <Link href="/forgot-password" className="underline">
          forgot password
        </Link>{' '}
        page.
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Choose a new password</h1>
      {done ? (
        <div className="mt-4">
          <Alert tone="success">Your password has been reset. Redirecting to log in…</Alert>
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-4">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              hint="At least 8 characters, with an uppercase letter and a number."
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" fullWidth loading={isSubmitting}>
              Reset password
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-soft">Loading…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
