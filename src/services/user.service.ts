import { api } from './api';
import type { ApiEnvelope, User } from '@/types';

export async function getProfile(): Promise<User> {
  const res = await api.get<ApiEnvelope<{ user: User }>>('/users/me');
  return res.data.data.user;
}

export async function updateProfile(
  input: Partial<{ firstName: string; lastName: string; email: string }>,
): Promise<User> {
  const res = await api.patch<ApiEnvelope<{ user: User }>>('/users/me', input);
  return res.data.data.user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.patch('/users/me/password', { currentPassword, newPassword });
}

export async function deleteAccount(password: string): Promise<void> {
  await api.delete('/users/me', { data: { password } });
}
