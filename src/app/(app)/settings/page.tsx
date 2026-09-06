'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordValues,
  type ProfileValues,
} from '@/lib/validators';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { PageHeading } from '@/components/layout/PageHeading';
import { QueryState } from '@/components/QueryState';
import { useAuth } from '@/hooks/useAuth';
import { useChangePassword, useDeleteAccount, useUpdateProfile } from '@/hooks/useProfile';
import { useReminders, useUpdateReminders } from '@/hooks/useReminders';
import { useToast } from '@/components/ui/Toast';
import { toFieldErrors, toFriendlyMessage } from '@/services/api';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-5">
      <PageHeading title="Settings" subtitle={user?.email} />
      <ProfileSection />
      <PasswordSection />
      <RemindersSection />
      <Card>
        <CardHeader title="Session" />
        <Button variant="secondary" onClick={() => logout()}>
          Log out
        </Button>
      </Card>
      <DangerZone />
    </div>
  );
}

function ProfileSection() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { notify } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: user
      ? { firstName: user.firstName, lastName: user.lastName, email: user.email }
      : undefined,
  });

  useEffect(() => {
    if (user) reset({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  }, [user, reset]);

  return (
    <Card>
      <CardHeader title="Profile" />
      {formError && (
        <div className="mb-3">
          <Alert tone="error">{formError}</Alert>
        </div>
      )}
      <form
        className="space-y-4"
        noValidate
        onSubmit={handleSubmit(async (values) => {
          setFormError(null);
          try {
            await updateProfile.mutateAsync(values);
            notify('Profile updated', 'success');
          } catch (err) {
            const fieldErrors = toFieldErrors(err);
            const keys = Object.keys(fieldErrors);
            if (keys.length) {
              keys.forEach((k) => setError(k as keyof ProfileValues, { message: fieldErrors[k] }));
            } else {
              setFormError(toFriendlyMessage(err));
            }
          }
        })}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <div className="flex justify-end">
          <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PasswordSection() {
  const changePassword = useChangePassword();
  const { notify } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  return (
    <Card>
      <CardHeader title="Change password" />
      {formError && (
        <div className="mb-3">
          <Alert tone="error">{formError}</Alert>
        </div>
      )}
      <form
        className="space-y-4"
        noValidate
        onSubmit={handleSubmit(async (values) => {
          setFormError(null);
          try {
            await changePassword.mutateAsync({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            });
            notify('Password changed', 'success');
            reset();
          } catch (err) {
            setFormError(toFriendlyMessage(err, 'We could not change your password.'));
          }
        })}
      >
        <Input
          label="Current password"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with an uppercase letter and a number."
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <div className="flex justify-end">
          <Button type="submit" loading={changePassword.isPending}>
            Update password
          </Button>
        </div>
      </form>
    </Card>
  );
}

function RemindersSection() {
  const reminders = useReminders();
  const update = useUpdateReminders();
  const { notify } = useToast();

  return (
    <Card>
      <CardHeader title="Reminders" />
      <QueryState isLoading={reminders.isLoading} isError={reminders.isError} error={reminders.error}>
        {reminders.data && (
          <div className="space-y-4 text-sm">
            <ToggleRow
              label="Upcoming period reminder"
              description="Get a nudge a couple of days before your predicted period."
              checked={reminders.data.periodReminder}
              onChange={(checked) =>
                update.mutate(
                  { periodReminder: checked },
                  { onSuccess: () => notify('Reminders updated', 'success') },
                )
              }
            />
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="daysBefore" className="text-ink-soft">
                Days before to remind
              </label>
              <input
                id="daysBefore"
                type="number"
                min={0}
                max={10}
                defaultValue={reminders.data.periodReminderDaysBefore}
                onBlur={(e) =>
                  update.mutate({ periodReminderDaysBefore: Number(e.target.value) })
                }
                className="w-20 rounded-xl border border-rose-200 px-3 py-2 text-center"
              />
            </div>
            <ToggleRow
              label="Daily symptom tracking reminder"
              description="A gentle daily prompt to log how you're feeling."
              checked={reminders.data.symptomReminder}
              onChange={(checked) =>
                update.mutate(
                  { symptomReminder: checked },
                  { onSuccess: () => notify('Reminders updated', 'success') },
                )
              }
            />
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="reminderTime" className="text-ink-soft">
                Reminder time
              </label>
              <input
                id="reminderTime"
                type="time"
                defaultValue={reminders.data.reminderTime}
                onBlur={(e) => update.mutate({ reminderTime: e.target.value })}
                className="rounded-xl border border-rose-200 px-3 py-2"
              />
            </div>
            <p className="text-xs text-ink-faint">
              Notifications are not yet delivered in this version — your preferences are saved and
              will be used when delivery is enabled.
            </p>
          </div>
        )}
      </QueryState>
    </Card>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-soft">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-rose-500' : 'bg-ink/15'
        }`}
      >
        <span
          className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-[22px]' : ''
          }`}
        />
      </button>
    </div>
  );
}

function DangerZone() {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const { logout } = useAuth();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="ring-rose-200">
      <CardHeader title="Delete account" />
      <p className="text-sm text-ink-soft">
        Permanently delete your account and all associated data — periods, symptoms, moods and
        reminder preferences. This cannot be undone.
      </p>
      <Button variant="danger" className="mt-3" onClick={() => setOpen(true)}>
        Delete my account
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete your account?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteAccount.isPending}
              onClick={async () => {
                setError(null);
                try {
                  await deleteAccount.mutateAsync(password);
                  notify('Your account has been deleted', 'success');
                  await logout();
                  router.replace('/');
                } catch (err) {
                  setError(toFriendlyMessage(err, 'We could not delete your account.'));
                }
              }}
            >
              Permanently delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Enter your password to confirm. Everything will be permanently removed.
        </p>
        {error && <Alert tone="error">{error}</Alert>}
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </Card>
  );
}
