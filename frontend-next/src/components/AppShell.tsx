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
    <div className="min-h-screen flex flex-col bg-[#05070d] text-slate-100">
      <Navbar />
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 md:p-6 space-y-6">{children}</main>
      <footer className="sticky bottom-0 z-40 bg-[#070a12]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex items-center justify-between shadow-2xl">
        <span>STREAMVISTA INTERNAL WORKSPACE</span>
        <span className="hidden md:inline">Rights-controlled · Operator-approved</span>
      </footer>
    </div>
  );
}
