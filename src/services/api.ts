import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_URL } from '@/lib/config';
import type { ApiErrorBody } from '@/types';

/**
 * Shared axios instance. All service modules use this; components never call axios directly.
 *
 * Auth model:
 *  - Access token lives in memory only (set via setAccessToken). Not in localStorage.
 *  - Refresh token is an httpOnly cookie the browser sends automatically (withCredentials).
 *  - On 401 we try POST /auth/refresh exactly once, then replay the original request.
 */
let accessToken: string | null = null;
let onAuthLost: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAuthLostHandler(handler: () => void): void {
  onAuthLost = handler;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ data: { accessToken: string } }>(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        const token = res.data.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh');

    if (status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      onAuthLost?.();
    }

    return Promise.reject(error);
  },
);

/** Turn any thrown error into a friendly, user-facing message. */
export function toFriendlyMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return 'We could not reach the server. Check your connection and try again.';
    const body = error.response.data;
    if (body?.error?.message) return body.error.message;
    if (error.response.status === 401) return 'Your email or password is incorrect.';
    if (error.response.status === 429) return 'Too many attempts. Please wait a moment and try again.';
  }
  return fallback;
}

/** Extract field-level validation errors keyed by field name, if the backend sent them. */
export function toFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const details = error.response?.data?.error?.details;
    if (Array.isArray(details)) {
      for (const d of details) {
        if (d.field) result[d.field] = d.message;
      }
    }
  }
  return result;
}

export function unwrap<T>(payload: { data: T }): T {
  return payload.data;
}
