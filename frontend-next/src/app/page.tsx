'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  Clapperboard, 
  ShoppingBag, 
  Tv, 
  ArrowRight, 
  Bot,
  Globe,
  Zap,
  Play,
  Terminal,
  Activity,
  HardDrive,
  Sparkles,
  FileCheck,
  UserCheck,
  CreditCard,
  Video,
  FileText,
  DollarSign,
  Smile,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Header Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>MEDIA OPERATING SYSTEM v4.2</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
            StreamVista <span className="gradient-text">Media OS</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            End-to-End Media Ecosystem: Wireless C2C Ingest, AI Rights Matchmaking, FAST Syndication & E-Commerce.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            href="/creator"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-xl glow-cyan transition-all"
          >
            <Clapperboard className="h-4 w-4" />
            <span>Submit Film Free (65/35 Split)</span>
          </Link>
          <Link
            href="/watch"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xl transition-all"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Watch Crayons Loop</span>
          </Link>
        </div>
      </div>

      {/* 1-Click Action Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-black text-white">Quick Workstation Launch</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            100% OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link 
            href="/creator"
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 space-y-2 group transition-all text-center block glass-card"
          >
            <Clapperboard className="h-5 w-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-xs block">Submit Film</span>
            <span className="text-[10px] text-slate-400 block font-mono">Free 65% Share</span>
          </Link>

          <Link 
            href="/buyer-portal"
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-purple-500/50 space-y-2 group transition-all text-center block glass-card"
          >
            <UserCheck className="h-5 w-5 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-xs block">Buyer Choice</span>
            <span className="text-[10px] text-slate-400 block font-mono">99% Match AI</span>
          </Link>

          <Link 
            href="/watch"
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-red-500/50 space-y-2 group transition-all text-center block glass-card"
          >
            <Tv className="h-5 w-5 text-red-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-xs block">Crayons Loop</span>
            <span className="text-[10px] text-slate-400 block font-mono">24/7 FAST Network</span>
          </Link>

          <Link 
            href="/studio"
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/50 space-y-2 group transition-all text-center block glass-card"
          >
            <Building2 className="h-5 w-5 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-xs block">Insured Vault</span>
            <span className="text-[10px] text-slate-400 block font-mono">₹5 Cr Safe Bank</span>
          </Link>

          <Link 
            href="/store"
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/50 space-y-2 group transition-all text-center block glass-card"
          >
            <ShoppingBag className="h-5 w-5 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-xs block">Media Store</span>
            <span className="text-[10px] text-slate-400 block font-mono">Razorpay UPI/Cards</span>
          </Link>

          <Link 
            href="/intelligence"
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 space-y-2 group transition-all text-center block glass-card"
          >
            <DollarSign className="h-5 w-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-xs block">GST Invoicing</span>
            <span className="text-[10px] text-slate-400 block font-mono">Tax Invoices & Payouts</span>
          </Link>
        </div>
      </div>

      {/* Module Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin" className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 block">
          <div className="flex justify-between items-center">
            <ShieldCheck className="h-6 w-6 text-purple-400" />
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">ADMIN KERNEL</span>
          </div>
          <h3 className="font-bold text-white text-lg">Admin OS & 360° Rights</h3>
          <p className="text-xs text-slate-400">Extract territory avails, holdbacks, and censor certificates via AI.</p>
        </Link>

        <Link href="/ai-studio" className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 block">
          <div className="flex justify-between items-center">
            <Bot className="h-6 w-6 text-indigo-400" />
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">AI CONVERSION</span>
          </div>
          <h3 className="font-bold text-white text-lg">AI 3D & Anime Converter</h3>
          <p className="text-xs text-slate-400">Convert 2D to 3D Vision Pro spatial video & AI anime toon series.</p>
        </Link>

        <Link href="/packaging" className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 block">
          <div className="flex justify-between items-center">
            <Video className="h-6 w-6 text-red-400" />
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">IMAX & DCP</span>
          </div>
          <h3 className="font-bold text-white text-lg">IMAX & YouTube Content ID</h3>
          <p className="text-xs text-slate-400">IMAX 1.90:1 expanded canvas remastering & DCI 4K theater DCP.</p>
        </Link>
      </div>
    </div>
  );
}
