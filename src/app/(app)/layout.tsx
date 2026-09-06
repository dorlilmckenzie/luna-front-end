'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { Spinner } from '@/components/ui/Spinner';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner label="Loading your account…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title="Luna" />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
