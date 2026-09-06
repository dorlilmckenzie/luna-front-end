'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from './navItems';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-rose-100 bg-white px-4 py-6 md:flex">
      <span className="px-2 text-lg font-semibold tracking-tight text-rose-600">Luna</span>
      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                active ? 'bg-rose-50 text-rose-700' : 'text-ink-soft hover:bg-rose-50/60',
              )}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-rose-100 pt-4">
        {user && (
          <p className="px-2 text-xs text-ink-faint">
            {user.firstName} {user.lastName}
          </p>
        )}
        <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={() => logout()}>
          Log out
        </Button>
      </div>
    </aside>
  );
}
