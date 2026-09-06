'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupValues } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { toFieldErrors, toFriendlyMessage } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function SignupPage() {
  const router = useRouter();
  const { register: registerUser, status } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  const onSubmit = async (values: SignupValues) => {
    setFormError(null);
    try {
      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        dateOfBirth: values.dateOfBirth,
      });
      router.replace('/dashboard');
    } catch (err) {
      const fieldErrors = toFieldErrors(err);
      const keys = Object.keys(fieldErrors);
      if (keys.length) {
        keys.forEach((k) =>
          setError(k as keyof SignupValues, { message: fieldErrors[k] }),
        );
      } else {
        setFormError(toFriendlyMessage(err, 'We could not create your account. Please try again.'));
      }
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-ink-soft">It takes less than a minute.</p>

      {formError && (
        <div className="mt-4">
          <Alert tone="error">{formError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
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
          autoComplete="new-password"
          hint="At least 8 characters, with an uppercase letter and a number."
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Input
          label="Date of birth"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          error={errors.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
        <Button type="submit" fullWidth loading={isSubmitting}>
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-rose-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
