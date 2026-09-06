'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/validators';
import * as authService from '@/services/auth.service';
import { toFriendlyMessage } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setErrorMsg(null);
    try {
      const msg = await authService.forgotPassword(values.email);
      setMessage(msg);
    } catch (err) {
      setErrorMsg(toFriendlyMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Reset your password</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Enter your email and we&apos;ll send a reset link. In development the link is printed to
        the backend console.
      </p>

      {message && (
        <div className="mt-4">
          <Alert tone="success">{message}</Alert>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" fullWidth loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/login" className="font-medium text-rose-600 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
