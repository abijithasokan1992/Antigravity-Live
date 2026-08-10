'use client';

import { useMemo, useState } from 'react';
import {
  AudioLines,
  Captions,
  CreditCard,
  Download,
  FileCheck2,
  Film,
  FolderOpen,
  Image as ImageIcon,
  Languages,
  Layers3,
  Mic2,
  Music2,
  Play,
  Scissors,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  Video,
  WalletCards,
} from 'lucide-react';

const salesEmail = 'support-bridge@crayonspictures.com';
const representationPayLink = 'https://rzp.io/rzp/SbC2Zpe';

type AppId = 'search' | 'image' | 'video' | 'voice' | 'translate' | 'tts' | 'music' | 'character' | 'background' | 'subtitle' | 'dubbing' | 'description' | 'editing' | 'delivery';

type StudioApp = {
  id: AppId;
  name: string;
  description: string;
  icon: typeof Sparkles;
  badge: string;
  accent: string;
};

const studioApps: StudioApp[] = [
  { id: 'search', name: 'AI Search', description: 'Search projects, clips, scripts and media.', icon: Search, badge: 'Studio', accent: 'from-cyan-500 to-blue-600' },
  { id: 'image', name: 'Image Generator', description: 'Concept art, posters, key art and variations.', icon: ImageIcon, badge: 'GPT Image-ready', accent: 'from-pink-500 to-orange-400' },
  { id: 'video', name: 'Video Generator', description: 'Prompt/reference-driven video workflow.', icon: Video, badge: 'Provider adapter', accent: 'from-violet-500 to-fuchsia-500' },
  { id: 'voice', name: 'Voice Generator', description: 'Consent-gated voice and performance workflow.', icon: Mic2, badge: 'Human approval', accent: 'from-indigo-500 to-violet-500' },
  { id: 'translate', name: 'Video Translation', description: 'Translate dialogue and localisation assets.', icon: Languages, badge: '5 languages', accent: 'from-emerald-500 to-cyan-500' },
  { id: 'tts', name: 'Text to Speech', description: 'Generate speech for approved scripts and previews.', icon: AudioLines, badge: 'Voice workflow', accent: 'from-amber-500 to-orange-500' },
  { id: 'music', name: 'Music Generator', description: 'Demo music concepts and temp-score workflow.', icon: Music2, badge: 'Demo route', accent: 'from-rose-500 to-pink-500' },
  { id: 'character', name: 'AI Character', description: 'Character look development and visual continuity.', icon: Film, badge: 'Creative', accent: 'from-purple-500 to-indigo-500' },
  { id: 'background', name: 'Background Remover', description: 'Prepare people, products and artwork for compositing.', icon: Layers3, badge: 'Post', accent: 'from-sky-500 to-cyan-500' },
  { id: 'subtitle', name: 'AI Subtitles', description: 'Transcription, translation, SRT/VTT and QC.', icon: Captions, badge: 'Pipeline ready', accent: 'from-lime-500 to-emerald-500' },
  { id: 'dubbing', name: 'AI Dubbing', description: 'Rights-controlled dubbing, timing, voice, QC and export.', icon: AudioLines, badge: 'Existing engine', accent: 'from-blue-500 to-violet-500' },
  { id: 'description', name: 'Audio Description', description: 'Accessibility description with human editorial review.', icon: Mic2, badge: 'Human approved', accent: 'from-teal-500 to-emerald-500' },
  { id: 'editing', name: 'AI Editing', description: 'Edit prep, cleanup, conform and post support.', icon: Scissors, badge: 'Hybrid service', accent: 'from-orange-500 to-red-500' },
  { id: 'delivery', name: 'OTT / TV Delivery', description: 'Master, metadata, rights manifest and QC packaging.', icon: FileCheck2, badge: 'Commercial', accent: 'from-slate-500 to-zinc-700' },
];

export default function HomePage() {
  const [activeApp, setActiveApp] = useState<AppId>('video');
  const [prompt, setPrompt] = useState('Cinematic Kerala backwater at blue hour, slow dolly forward, realistic rain reflections, anamorphic lens');
  const [generated, setGenerated] = useState(false);
  const [rightsConfirmed, setRightsConfirmed] = useState(true);

  const current = useMemo(() => studioApps.find((app) => app.id === activeApp) ?? studioApps[0], [activeApp]);
  const CurrentIcon = current.icon;

  return (
    <div className="min-h-screen bg-[#09090c] text-white">
      <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#0b0b0e]/95 backdrop-blur-xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center font-black">SV</div>
          <div className="leading-tight min-w-0">
            <div className="font-black tracking-tight truncate">StreamVista AI Digital Studio</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">Full Demo Workspace</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-bold text-amber-200">DEMO MODE</span>
          <a href={`mailto:${salesEmail}?subject=${encodeURIComponent('StreamVista AI Digital Studio — paid project enquiry')}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/5">Hire Studio</a>
          <a href={representationPayLink} target="_blank" rel="noreferrer" className="hidden lg:flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-black"><WalletCards className="h-4 w-4" /> Film Representation</a>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-[76px_250px_minmax(0,1fr)] xl:grid-cols-[76px_250px_minmax(0,1fr)_310px]">
        <aside className="border-r border-white/10 bg-[#0a0a0d] py-3 flex flex-col items-center gap-2">
          {[
            ['Create', Sparkles],
            ['Projects', FolderOpen],
            ['Uploads', Upload],
            ['Layers', Layers3],
            ['Rights', ShieldCheck],
            ['Payments', CreditCard],
          ].map(([label, Icon], index) => {
            const IconComp = Icon as typeof Sparkles;
            return <button key={label as string} className={`w-[62px] h-[58px] rounded-xl flex flex-col items-center justify-center gap-1 text-[9px] font-bold ${index === 0 ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}><IconComp className="h-[18px] w-[18px]" /><span>{label as string}</span></button>;
          })}
          <button className="mt-auto w-[62px] h-[58px] rounded-xl flex flex-col items-center justify-center gap-1 text-[9px] font-bold text-white/35 hover:bg-white/5"><Settings2 className="h-[18px] w-[18px]" />Settings</button>
        </aside>

        <aside className="border-r border-white/10 bg-[#101014] p-3 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-2 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-white/30">AI Apps</div>
            <p className="mt-1 text-xs text-white/45">Each module can become a paid studio service.</p>
          </div>
          <div className="mt-2 space-y-1">
            {studioApps.map((app) => {
              const Icon = app.icon;
              const active = activeApp === app.id;
              return (
                <button key={app.id} onClick={() => { setActiveApp(app.id); setGenerated(false); }} className={`w-full rounded-xl p-2.5 text-left flex items-center gap-3 transition ${active ? 'bg-white text-black' : 'hover:bg-white/5 text-white'}`}>
                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${app.accent} grid place-items-center text-white shrink-0`}><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0"><div className="text-xs font-black truncate">{app.name}</div><div className={`mt-0.5 text-[9px] truncate ${active ? 'text-black/50' : 'text-white/30'}`}>{app.badge}</div></div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 bg-[#121217] flex flex-col">
          <div className="h-12 border-b border-white/10 bg-[#0f0f13] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs"><span className="text-white/30">Project</span><span className="text-white/15">/</span><span className="font-black">Hybrid Film Demo</span><span className="text-white/15">/</span><span className="text-violet-300 font-bold">{current.name}</span></div>
            <button className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] text-white/50">Save demo</button>
          </div>

          <section className="flex-1 p-4 lg:p-6 flex flex-col gap-4 min-h-[620px]">
            <div className="mx-auto w-full max-w-[1180px] flex-1 rounded-[24px] border border-white/10 bg-[#17171d] overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(139,92,246,.16), transparent 28%), linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)', backgroundSize: 'auto, 30px 30px, 30px 30px' }} />
              <div className="relative z-10 h-full min-h-[560px] flex items-center justify-center p-5 lg:p-10">
                <div className="w-full max-w-3xl">
                  {!generated ? (
                    <>
                      <div className="text-center mb-7">
                        <div className={`mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br ${current.accent} grid place-items-center shadow-xl`}><CurrentIcon className="h-6 w-6" /></div>
                        <h1 className="text-3xl lg:text-5xl font-black tracking-[-0.035em]">{current.name}</h1>
                        <p className="mt-3 text-sm text-white/45">{current.description}</p>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-[#0d0d11]/95 p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)]">
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-28 w-full resize-none bg-transparent p-3 text-sm leading-6 text-white outline-none placeholder:text-white/25" placeholder={`Describe what you want to do with ${current.name}…`} />
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3">
                          <div className="flex items-center gap-2"><button className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-white/55"><Upload className="h-3.5 w-3.5" /> Add media</button><span className="hidden sm:inline text-[10px] text-white/25">Rights-cleared source only</span></div>
                          <button onClick={() => setGenerated(true)} className={`rounded-xl bg-gradient-to-r ${current.accent} px-5 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-lg`}><Sparkles className="h-4 w-4" /> Run demo</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                      <div className={`aspect-video relative bg-gradient-to-br ${current.accent}`}>
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-0 grid place-items-center"><button className="h-16 w-16 rounded-full bg-white text-black grid place-items-center shadow-2xl"><Play className="h-7 w-7 fill-black" /></button></div>
                        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold backdrop-blur">{current.name.toUpperCase()} · DEMO PREVIEW</div>
                        <div className="absolute bottom-4 left-4 right-4"><div className="text-sm font-black">Workflow preview ready</div><div className="mt-1 text-[10px] text-white/60">UI simulation only. Real provider output is shown only after verified connection/API access.</div></div>
                      </div>
                      <div className="p-3 flex items-center justify-between gap-3"><button onClick={() => setGenerated(false)} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold text-white/60">Back to prompt</button><button className="rounded-lg bg-white px-3 py-2 text-[10px] font-black text-black flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Export demo</button></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 bg-[#0b0b0f] p-3 lg:p-4">
            <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-white/40" /><span className="text-xs font-black">Timeline</span><span className="text-[9px] text-white/25">00:00:26:00</span></div><div className="text-[9px] text-white/25">Hybrid Film Demo</div></div>
            <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-2">
              <div className="space-y-1.5"><div className="h-11 rounded-lg bg-white/[0.04] grid place-items-center text-[9px] text-white/30">V1</div><div className="h-8 rounded-lg bg-white/[0.04] grid place-items-center text-[9px] text-white/30">A1</div></div>
              <div className="min-w-0 overflow-hidden space-y-1.5"><div className="flex h-11 min-w-[700px] gap-1.5"><div className="w-[25%] rounded-lg bg-violet-500/15 border border-violet-400/20 px-3 py-2 text-[9px] font-bold">Opening shot</div><div className="w-[28%] rounded-lg bg-fuchsia-500/15 border border-fuchsia-400/20 px-3 py-2 text-[9px] font-bold">Character</div><div className="w-[20%] rounded-lg bg-cyan-500/15 border border-cyan-400/20 px-3 py-2 text-[9px] font-bold">Dialogue</div><div className="flex-1 rounded-lg bg-emerald-500/15 border border-emerald-400/20 px-3 py-2 text-[9px] font-bold">World extension</div></div><div className="flex h-8 min-w-[700px] gap-1.5"><div className="w-[58%] rounded-lg bg-emerald-500/10 border border-emerald-400/15 px-3 flex items-center gap-2"><Music2 className="h-3 w-3" /><span className="text-[8px] font-bold">Dialogue + ambience</span></div><div className="flex-1 rounded-lg bg-blue-500/10 border border-blue-400/15 px-3 flex items-center gap-2"><Captions className="h-3 w-3" /><span className="text-[8px] font-bold">Subtitles / localisation</span></div></div></div>
            </div>
          </section>
        </main>

        <aside className="hidden xl:block border-l border-white/10 bg-[#0c0c0f] overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between"><span className="text-xs font-black">Inspector</span><Settings2 className="h-4 w-4 text-white/30" /></div>
          <div className="p-4 space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><span className="text-xs font-black">Rights Gate</span></div><button onClick={() => setRightsConfirmed(!rightsConfirmed)} className="mt-3 w-full rounded-xl bg-black/30 p-3 flex items-center justify-between"><div className="text-left"><div className="text-[10px] font-bold">Processing rights</div><div className="mt-1 text-[9px] text-white/30">Required for real processing.</div></div><span className={`h-5 w-9 rounded-full p-0.5 ${rightsConfirmed ? 'bg-emerald-500' : 'bg-white/15'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${rightsConfirmed ? 'translate-x-4' : ''}`} /></span></button></section>
            <section className="space-y-2"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Selected App</div><div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${current.accent} grid place-items-center`}><CurrentIcon className="h-5 w-5" /></div><div className="mt-3 font-black">{current.name}</div><div className="mt-1 text-[10px] text-white/35">{current.badge}</div><p className="mt-3 text-[10px] leading-5 text-white/45">{current.description}</p></div></section>
            <section className="space-y-2"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Commercial</div><a href={`mailto:${salesEmail}?subject=${encodeURIComponent(`Paid ${current.name} project enquiry`)}`} className="block rounded-xl bg-violet-500 px-4 py-3 text-center text-xs font-black">Request paid job</a><a href={representationPayLink} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 px-4 py-3 text-center text-[10px] font-bold text-white/60">Film representation · ₹25,000 + GST</a></section>
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Provider status</div><div className="mt-3 space-y-2"><div className="flex items-center justify-between text-[10px]"><span>OpenAI creative adapter</span><span className="text-amber-300">Demo / optional</span></div><div className="flex items-center justify-between text-[10px]"><span>Local media engine</span><span className="text-emerald-300">Reuse target</span></div><div className="flex items-center justify-between text-[10px]"><span>Razorpay</span><span className="text-emerald-300">Existing payment route</span></div></div></section>
          </div>
        </aside>
      </div>
    </div>
  );
}
