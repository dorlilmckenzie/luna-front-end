import { api } from './api';
import type { ApiEnvelope, AuthPayload, User } from '@/types';

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
}

export async function register(input: RegisterInput): Promise<AuthPayload> {
  const res = await api.post<ApiEnvelope<AuthPayload>>('/auth/register', input);
  return res.data.data;
}

export async function login(email: string, password: string): Promise<AuthPayload> {
  const res = await api.post<ApiEnvelope<AuthPayload>>('/auth/login', { email, password });
  return res.data.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function refresh(): Promise<string | null> {
  try {
    const res = await api.post<ApiEnvelope<{ accessToken: string }>>('/auth/refresh', {});
    return res.data.data.accessToken;
  } catch {
    return null;
  }
}

export async function me(): Promise<User> {
  const res = await api.get<ApiEnvelope<{ user: User }>>('/auth/me');
  return res.data.data.user;
}

export async function forgotPassword(email: string): Promise<string> {
  const res = await api.post<ApiEnvelope<null>>('/auth/forgot-password', { email });
  return res.data.message ?? 'If an account exists for that email, a reset link has been sent.';
}

export async function resetPassword(token: string, password: string): Promise<string> {
  const res = await api.post<ApiEnvelope<null>>('/auth/reset-password', { token, password });
  return res.data.message ?? 'Your password has been reset.';
}
