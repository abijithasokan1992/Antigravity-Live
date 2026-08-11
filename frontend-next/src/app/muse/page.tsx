'use client';

import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
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
    <main className="relative min-h-screen overflow-hidden bg-[#08080d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(139,92,246,.18),transparent_30%),radial-gradient(circle_at_18%_78%,rgba(34,211,238,.05),transparent_24%),linear-gradient(180deg,#09090d_0%,#08080d_100%)]" />
      <div className="absolute left-1/2 top-[39%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-black">SV</div>
          <div>
            <div className="text-sm font-black tracking-tight">StreamVista AI</div>
            <div className="text-[9px] uppercase tracking-[.28em] text-white/35">SV MUSE</div>
          </div>
        </div>
        <button onClick={install} className="rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/[.08]">
          <Download className="mr-1.5 inline h-3.5 w-3.5" /> Install MUSE
        </button>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 pb-10 pt-0 sm:px-8">
        <div className="w-full max-w-4xl text-center">
          <div className="relative mx-auto mb-9 flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
            <div className="absolute inset-[-35px] rounded-full border border-violet-300/10" />
            <div className="absolute inset-[-16px] rounded-full border border-white/[.06]" />
            <div className="absolute inset-[-4px] rounded-full bg-violet-500/15 blur-2xl" />
            <div className="relative grid h-48 w-48 place-items-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_24%,#ffffff,#b9ddff_9%,#a78bfa_30%,#302050_52%,#11111a_76%)] shadow-[0_0_90px_rgba(139,92,246,.34),inset_-25px_-30px_55px_rgba(0,0,0,.7)] sm:h-56 sm:w-56">
              <div className="absolute h-32 w-24 rounded-[48%] bg-gradient-to-b from-white/25 via-violet-100/10 to-black/35 shadow-[inset_0_0_30px_rgba(255,255,255,.10)]" />
              <div className="relative flex gap-8"><span className="h-2 w-7 rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(165,243,252,.9)]" /><span className="h-2 w-7 rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(165,243,252,.9)]" /></div>
              <div className="absolute bottom-8 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[9px] font-black tracking-[.22em] backdrop-blur-xl">SV MUSE</div>
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[.42em] text-violet-200/55">StreamVista · Creative Intelligence</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-.06em] sm:text-7xl lg:text-8xl">Create. Imagine.<br /><span className="text-violet-300">Make it real.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/45 sm:text-base sm:leading-7">Tell MUSE what you want to create. MUSE guides the work, handles the setup, and brings you into your studio when you are ready.</p>

          <div className="mx-auto mt-8 max-w-md">
            <Link href="/?studio=1" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-black shadow-[0_15px_50px_rgba(255,255,255,.10)] transition hover:scale-[1.01]">
              Enter MUSE <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-[9px] uppercase tracking-[.25em] text-white/20">Cinema · Voice · Image · Dubbing · Delivery</p>
          </div>
        </div>
      </section>
    </main>
  );
}
