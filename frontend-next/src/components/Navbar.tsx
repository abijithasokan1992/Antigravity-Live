'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Film, 
  ShieldCheck, 
  Clapperboard, 
  ShoppingBag, 
  Tv, 
  LogIn, 
  Layers,
  Globe,
  Bot,
  BrainCircuit,
  UserCheck,
  Settings,
  Download,
  ShieldAlert,
  User,
  ChevronDown,
  Briefcase,
  Building2,
  ShoppingCart
} from 'lucide-react';

export type UserRole = 'SUPER_ADMIN' | 'PRODUCER_CREATOR' | 'B2B_BUYER' | 'DIT_ENGINEER' | 'CONSUMER_VIEWER';

export default function Navbar() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>('');
  const [activeRole, setActiveRole] = useState<UserRole>('SUPER_ADMIN');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const allNavItems = [
    { name: 'OS Shell', href: '/', icon: Layers, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR'] },
    { name: 'Admin Kernel', href: '/admin', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
    { name: 'Creator Submit', href: '/creator', icon: Clapperboard, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR', 'DIT_ENGINEER'] },
    { name: 'Studio Vault', href: '/studio', icon: Building2, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR', 'DIT_ENGINEER'] },
    { name: 'AI Studio', href: '/ai-studio', icon: Bot, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR'] },
    { name: 'Intelligence', href: '/intelligence', icon: BrainCircuit, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR'] },
    { name: 'Buyer Choice', href: '/buyer-portal', icon: UserCheck, roles: ['SUPER_ADMIN', 'B2B_BUYER'] },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR', 'B2B_BUYER'] },
    { name: 'Media Store', href: '/store', icon: ShoppingCart, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR', 'B2B_BUYER', 'CONSUMER_VIEWER'] },
    { name: 'Investors', href: '/investors', icon: Briefcase, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR', 'B2B_BUYER'] },
    { name: 'Syndication', href: '/distribution', icon: Globe, roles: ['SUPER_ADMIN'] },
    { name: 'Packaging', href: '/packaging', icon: Settings, roles: ['SUPER_ADMIN', 'DIT_ENGINEER'] },
    { name: 'Deliveries', href: '/deliveries', icon: Download, roles: ['SUPER_ADMIN', 'B2B_BUYER', 'DIT_ENGINEER'] },
    { name: 'Anti-Piracy', href: '/compliance', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
    { name: 'FAST Loop', href: '/watch', icon: Tv, roles: ['SUPER_ADMIN', 'PRODUCER_CREATOR', 'B2B_BUYER', 'CONSUMER_VIEWER'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(activeRole));

  return (
    <header className="sticky top-0 z-50 bg-[#000000] border-b border-white/10 px-4 py-2.5 select-none">
      <div className="max-w-[1800px] mx-auto space-y-2">
        {/* Top Control Strip */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-white text-black flex items-center justify-center font-black text-xs">
              SV
            </div>
            <span className="font-bold text-xs tracking-wider text-white uppercase font-mono">
              STREAMVISTA <span className="text-zinc-500">MEDIA OS WORKSTATION</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Role Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#111111] border border-white/10 text-white font-bold text-xs cursor-pointer hover:border-white/30 transition-all">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span>ROLE: {activeRole.replace('_', ' ')}</span>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </div>

              <div className="absolute right-0 top-full mt-1 w-52 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl p-1.5 hidden group-hover:block z-50 space-y-1">
                <span className="text-[9px] text-zinc-500 px-2 py-1 block uppercase font-bold">Select Active Role</span>
                <button onClick={() => setActiveRole('SUPER_ADMIN')} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold transition-all ${activeRole === 'SUPER_ADMIN' ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}>Super Admin</button>
                <button onClick={() => setActiveRole('PRODUCER_CREATOR')} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold transition-all ${activeRole === 'PRODUCER_CREATOR' ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}>Producer / Creator</button>
                <button onClick={() => setActiveRole('B2B_BUYER')} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold transition-all ${activeRole === 'B2B_BUYER' ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}>B2B Buyer</button>
                <button onClick={() => setActiveRole('DIT_ENGINEER')} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold transition-all ${activeRole === 'DIT_ENGINEER' ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}>DIT Engineer</button>
                <button onClick={() => setActiveRole('CONSUMER_VIEWER')} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-bold transition-all ${activeRole === 'CONSUMER_VIEWER' ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900'}`}>Viewer (Crayons Loop)</button>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded bg-[#111111] border border-white/10 text-zinc-400 font-mono text-[11px]">
              {time || '00:00:00'}
            </div>
          </div>
        </div>

        {/* Bottom Clickable Workstation Module Navigation Bar (NO SCROLLBAR) */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-[#0a0a0a] p-1.5 rounded-lg border border-white/10">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-white/10'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
