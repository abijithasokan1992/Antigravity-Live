'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Clapperboard, Building2, Bot, ShoppingBag, Download, LogIn } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // End users see only product capabilities. Admin/kernel controls remain internal.
  const navItems = [
    { name: 'Studio', href: '/studio', icon: Building2 },
    { name: 'AI Studio', href: '/ai-studio', icon: Bot },
    { name: 'Submit', href: '/creator', icon: Clapperboard },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Deliveries', href: '/deliveries', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#000000] border-b border-white/10 px-4 py-3 select-none">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs">SV</div>
          <div className="min-w-0">
            <div className="font-black text-sm tracking-widest text-white">STREAMVISTA</div>
            <div className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">AI Digital Studio</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold border border-white/10">
          <LogIn className="h-3.5 w-3.5" />
          Sign in
        </Link>
      </div>
    </header>
  );
}
