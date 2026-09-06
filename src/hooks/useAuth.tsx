'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/auth.service';
import { setAccessToken, setAuthLostHandler } from '@/services/api';
import type { AuthPayload, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  login: (email: string, password: string) => Promise<void>;
  register: (input: authService.RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const queryClient = useQueryClient();
  const bootstrapped = useRef(false);

  const applyAuth = useCallback((payload: AuthPayload) => {
    setAccessToken(payload.accessToken);
    setUserState(payload.user);
    setStatus('authenticated');
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUserState(null);
    setStatus('unauthenticated');
    queryClient.clear();
  }, [queryClient]);

  // On first mount, try to restore a session using the httpOnly refresh cookie.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    setAuthLostHandler(() => {
      clearAuth();
    });

    (async () => {
      const token = await authService.refresh();
      if (!token) {
        clearAuth();
        return;
      }
      setAccessToken(token);
      try {
        const current = await authService.me();
        setUserState(current);
        setStatus('authenticated');
      } catch {
        clearAuth();
      }
    })();
  }, [clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const payload = await authService.login(email, password);
      applyAuth(payload);
    },
    [applyAuth],
  );

  const register = useCallback(
    async (input: authService.RegisterInput) => {
      const payload = await authService.register(input);
      applyAuth(payload);
    },
    [applyAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      setUser: (u: User) => setUserState(u),
    }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
