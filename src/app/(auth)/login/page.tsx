'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginValues } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { toFriendlyMessage } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.replace('/dashboard');
    } catch (err) {
      setFormError(toFriendlyMessage(err, 'Your email or password is incorrect.'));
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-soft">Log in to see your cycle.</p>

      {formError && (
        <div className="mt-4">
          <Alert tone="error">{formError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-plum-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{' '}
        <Link href="/signup" className="font-medium text-rose-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
