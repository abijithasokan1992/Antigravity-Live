'use client';

import Link from 'next/link';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MuseLanding() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (installPrompt?.prompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(124,58,237,.24),transparent_25%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,.07),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,.08),transparent_24%)]" />
      <div className="absolute left-1/2 top-[38%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white font-black text-black shadow-[0_0_35px_rgba(255,255,255,.12)]">SV</div>
          <div>
            <div className="text-sm font-black tracking-tight">StreamVista AI</div>
            <div className="text-[9px] uppercase tracking-[.28em] text-white/35">SV MUSE</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={install} className="rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-xs font-black text-violet-100">
            <Download className="mr-1.5 inline h-3.5 w-3.5" /> Install MUSE
          </button>
          <Link href="/?studio=1" className="hidden rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white/60 sm:inline-block">Open Studio</Link>
        </div>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-5 pb-12 pt-2 sm:px-8">
        <div className="w-full max-w-5xl text-center">
          <div className="mx-auto mb-10 flex h-52 w-52 items-center justify-center sm:h-64 sm:w-64 lg:h-72 lg:w-72">
            <div className="absolute h-72 w-72 rounded-full border border-violet-300/10 animate-[spin_28s_linear_infinite] sm:h-96 sm:w-96" />
            <div className="absolute h-60 w-60 rounded-full bg-violet-500/20 blur-2xl animate-pulse sm:h-72 sm:w-72" />
            <div className="relative grid h-48 w-48 place-items-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_32%_25%,#f8fafc,#b8dfff_10%,#8b5cf6_34%,#151522_72%)] shadow-[0_0_110px_rgba(124,58,237,.42),inset_-25px_-30px_60px_rgba(0,0,0,.65)] sm:h-60 sm:w-60">
              <div className="absolute h-28 w-20 rounded-[48%] bg-gradient-to-b from-white/30 via-violet-100/10 to-black/30 shadow-[inset_0_0_35px_rgba(255,255,255,.12)] sm:h-36 sm:w-24" />
              <div className="relative flex gap-8"><span className="h-2 w-7 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(165,243,252,.95)]" /><span className="h-2 w-7 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(165,243,252,.95)]" /></div>
              <div className="absolute bottom-10 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[10px] font-black tracking-[.16em] backdrop-blur-xl sm:bottom-12">SV MUSE</div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em] text-violet-200/70">
              <Sparkles className="h-3.5 w-3.5" /> Your creative studio
            </div>
            <h1 className="text-5xl font-black tracking-[-.055em] sm:text-7xl lg:text-8xl">Create with <span className="text-violet-300">MUSE.</span></h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
              Tell MUSE what you want to make. We&apos;ll guide you from idea to finished media.
            </p>

            <div className="mx-auto mt-9 max-w-xl rounded-3xl border border-white/10 bg-black/35 p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl">
              <div className="rounded-2xl border border-white/8 bg-white/[.03] px-5 py-5 text-left text-sm text-white/45">
                <span className="text-white/25">MUSE</span> · What are you creating today?
              </div>
              <Link href="/?studio=1" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-black shadow-[0_15px_50px_rgba(255,255,255,.10)]">
                Enter MUSE <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-6 text-[10px] uppercase tracking-[.2em] text-white/20">Cinema · Voice · Image · Dubbing · Delivery</p>
          </div>
        </div>
      </section>
    </main>
  );
}
