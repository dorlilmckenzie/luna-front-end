import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <Link href="/" className="mb-6 text-lg font-semibold tracking-tight text-rose-600">
        Luna
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card ring-1 ring-rose-100/60 sm:p-8">
        {children}
      </div>
    </div>
  );
}
