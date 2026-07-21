import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans text-white overflow-hidden relative">
      {/* Background gradients and glows */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[500px] bg-gradient-to-r from-purple-600/30 via-blue-500/30 to-teal-400/30 blur-[120px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-zinc-800 to-transparent blur-[100px] pointer-events-none opacity-40" />

      <main className="z-10 flex w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-200 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Pipeline Connected & Live
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 drop-shadow-sm">
          Project Antigravity
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-xl sm:text-2xl leading-relaxed text-zinc-400 mb-12 font-light">
          Your full-stack application is completely set up. GitHub and Vercel are perfectly synced. It's time to build the future.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95">
            Start Building
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-lg transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 backdrop-blur-md">
            View Documentation
          </button>
        </div>
      </main>

      {/* Footer / Status */}
      <footer className="absolute bottom-8 left-0 right-0 flex justify-center text-sm font-medium text-zinc-500">
        <p>Deployed automatically via GitHub & Vercel</p>
      </footer>
    </div>
  );
}
