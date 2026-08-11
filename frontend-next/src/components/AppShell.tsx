'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStorefront = pathname === '/';

  if (isStorefront) {
    return <main className="min-h-screen bg-[#f6f3ee] text-[#111111]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100">
      <Navbar />
      <main className="w-full max-w-[1600px] mx-auto p-3 md:p-6">{children}</main>
    </div>
  );
}
