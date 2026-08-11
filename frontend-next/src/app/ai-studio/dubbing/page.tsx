'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DubbingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('Malayalam');
  const [output, setOutput] = useState('Final dubbed video');
  const [message, setMessage] = useState('');

  function start() {
    setMessage('The production API is not connected for this capability yet. No mock job was created.');
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#15131a]">
      <header className="border-b border-black/10 px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between"><Link href="/ai-studio" className="font-semibold tracking-[0.28em]">STREAMVISTA</Link><span className="text-xs font-semibold text-black/45">AI DIGITAL STUDIO</span></div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-10">
        <Link href="/ai-studio" className="text-sm text-black/50">← Studio</Link>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.05em]">AI Dubbing</h1>
        <p className="mt-3 max-w-xl text-black/55">Upload your source, choose the output, create with the real production engine, check the result and publish.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl bg-[#151419] p-7 text-white"><p className="text-xs font-bold tracking-[0.2em] text-white/40">01 · ADD</p><label className="mt-6 block cursor-pointer rounded-2xl border border-dashed border-white/20 p-8 text-center"><input type="file" accept="audio/*,video/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} /><strong>{file ? file.name : 'Upload audio or video'}</strong><span className="mt-2 block text-sm text-white/45">Choose a source file</span></label></section>
          <section className="rounded-3xl bg-white p-7"><p className="text-xs font-bold tracking-[0.2em] text-black/35">02 · CHOOSE</p><label className="mt-6 block text-sm font-semibold">Target language<select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f4ee] p-3"><option>Malayalam</option><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select></label><label className="mt-5 block text-sm font-semibold">Output<select value={output} onChange={(e) => setOutput(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f4ee] p-3"><option>Final dubbed video</option><option>Dubbed audio</option></select></label></section>
        </div>

        <section className="mt-5 rounded-3xl bg-white p-7"><p className="text-xs font-bold tracking-[0.2em] text-black/35">03 · CREATE → 04 · CHECK → 05 · PUBLISH</p><button disabled={!file} onClick={start} className="mt-6 rounded-full bg-[#17151b] px-7 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30">Create dub →</button>{message && <p className="mt-5 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900">{message}</p>}<div className="mt-8 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-[#f7f4ee] p-5"><strong>Processing</strong><p className="mt-1 text-sm text-black/45">Live job status from the production API.</p></div><div className="rounded-2xl bg-[#f7f4ee] p-5"><strong>Check</strong><p className="mt-1 text-sm text-black/45">Preview and approve the actual result.</p></div><div className="rounded-2xl bg-[#f7f4ee] p-5"><strong>Publish</strong><p className="mt-1 text-sm text-black/45">Deliver only an approved final.</p></div></div></section>
      </div>
    </main>
  );
}
