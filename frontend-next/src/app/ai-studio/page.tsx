'use client';

import Link from 'next/link';

const services = [
  ['AI Dubbing', 'Dub audio or video into a target language.', '/ai-studio/dubbing'],
  ['Subtitles & Translation', 'Create translated subtitles and review them.', '#'],
  ['Audio Description', 'Create accessible audio description.', '#'],
  ['Edit & Post', 'Prepare, clean, edit and export media.', '#'],
  ['Image & Poster', 'Create artwork and production stills.', '#'],
  ['Video', 'Create video from an idea or reference.', '#'],
];

export default function AIStudioPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#15131a]">
      <header className="border-b border-black/10 bg-[#f4f0e8]/95 px-5 py-4 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-[0.28em]">STREAMVISTA</Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-black/10 px-4 py-2 text-xs font-semibold md:inline-flex">Powered by Crayons Bridge</span>
            <Link href="/login" className="rounded-full bg-[#17151b] px-5 py-2.5 text-sm font-semibold text-white">Sign in</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold tracking-[0.28em] text-[#6534dc]">STREAMVISTA AI DIGITAL STUDIO</p>
          <h1 className="text-6xl font-black leading-[0.9] tracking-[-0.06em] md:text-8xl">Create.<br /><span className="font-serif font-normal italic text-[#6737df]">Check.</span> Publish.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/60 md:text-xl">One simple production workspace. Add your source, choose the output, let Muse work, check the result and publish.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/ai-studio/dubbing" className="rounded-full bg-[#17151b] px-7 py-4 font-semibold text-white">Start a project →</Link><Link href="/projects" className="rounded-full border border-black/15 bg-white/50 px-7 py-4 font-semibold">View projects</Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <p className="text-xs font-bold tracking-[0.25em] text-black/45">STUDIO SERVICES</p>
        <h2 className="mt-2 text-3xl font-bold">Choose what you want to make.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, description, href], index) => <Link key={title} href={href} className="group rounded-3xl bg-[#151419] p-7 text-white transition hover:-translate-y-1"><div className="mb-12 flex items-center justify-between"><span className="text-xs font-bold tracking-[0.2em] text-white/45">0{index + 1}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-[#7139e7]">→</span></div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-3 text-white/55">{description}</p></Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10"><div className="rounded-[2rem] bg-[#151419] p-7 text-white md:p-10"><p className="text-xs font-bold tracking-[0.25em] text-[#bca0ff]">ONE WORKFLOW</p><div className="mt-7 grid gap-4 md:grid-cols-5">{[["01", "Add", "Upload or select source"], ["02", "Choose", "Select output"], ["03", "Create", "Real backend job"], ["04", "Check", "Preview and approve"], ["05", "Publish", "Save, download or deliver"]].map(([n, title, text]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><span className="text-xs text-white/35">{n}</span><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-2 text-sm text-white/50">{text}</p></div>)}</div></div></section>
    </main>
  );
}
