'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function AppHeader({ title }: { title: string }) {
  const { logout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-rose-100 bg-white/80 px-5 py-3 backdrop-blur md:hidden">
      <span className="text-base font-semibold tracking-tight text-rose-600">Luna</span>
      <span className="sr-only">{title}</span>
      <Button variant="ghost" size="sm" onClick={() => logout()}>
        Log out
      </Button>
    </header>
  );
}
