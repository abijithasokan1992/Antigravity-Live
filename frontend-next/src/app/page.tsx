'use client';

import { useMemo, useRef, useState } from 'react';
import {
  AudioLines, Captions, Check, CreditCard, Download, FileCheck2, Film, FolderOpen,
  Image as ImageIcon, Languages, Layers3, Loader2, Mic2, Music2, Play, Scissors,
  Search, Settings2, ShieldCheck, Sparkles, Upload, Video, WalletCards, X,
} from 'lucide-react';

const salesEmail = 'support-bridge@crayonspictures.com';
const representationPayLink = 'https://rzp.io/rzp/SbC2Zpe';

type AppId = 'search' | 'image' | 'video' | 'voice' | 'translate' | 'tts' | 'music' | 'character' | 'background' | 'subtitle' | 'dubbing' | 'description' | 'editing' | 'delivery';
type StudioApp = { id: AppId; name: string; description: string; icon: typeof Sparkles; badge: string; accent: string };

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

const rail = [
  ['Create', Sparkles, 'video'], ['Projects', FolderOpen, 'search'], ['Uploads', Upload, 'image'],
  ['Layers', Layers3, 'editing'], ['Rights', ShieldCheck, 'rights'], ['Payments', CreditCard, 'delivery'],
] as const;

function AvatarSphere({ app }: { app: StudioApp }) {
  const Icon = app.icon;
  return (
    <div className="relative mx-auto mb-7 h-[210px] w-[210px] lg:h-[250px] lg:w-[250px]">
      <div className="absolute inset-[-24px] rounded-full border border-violet-300/10 animate-[spin_28s_linear_infinite]">
        <span className="absolute left-1/2 top-[-6px] h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(103,232,249,.9)]" />
        <span className="absolute bottom-[12%] right-[3%] h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_22px_rgba(240,171,252,.8)]" />
      </div>
      <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-violet-500/30 via-cyan-400/10 to-fuchsia-500/30 blur-xl animate-pulse" />
      <div className="absolute inset-0 overflow-hidden rounded-full border border-white/20 bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,.95),rgba(174,229,255,.55)_11%,rgba(124,58,237,.55)_31%,rgba(24,24,38,.98)_72%)] shadow-[0_0_90px_rgba(124,58,237,.28),inset_-24px_-28px_60px_rgba(0,0,0,.65)]">
        <div className="absolute left-1/2 top-[18%] h-[64%] w-[48%] -translate-x-1/2 rounded-[48%_48%_44%_44%/42%_42%_58%_58%] bg-gradient-to-b from-white/24 via-violet-100/10 to-black/35 shadow-[inset_0_0_35px_rgba(255,255,255,.10)] backdrop-blur-sm">
          <div className="absolute left-[20%] top-[38%] h-[5px] w-[18%] rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(165,243,252,.95)]" />
          <div className="absolute right-[20%] top-[38%] h-[5px] w-[18%] rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(165,243,252,.95)]" />
          <div className="absolute left-1/2 top-[53%] h-[1px] w-[20%] -translate-x-1/2 bg-white/20" />
          <div className="absolute left-1/2 bottom-[19%] h-[2px] w-[25%] -translate-x-1/2 rounded-full bg-fuchsia-100/65 shadow-[0_0_12px_rgba(244,114,182,.45)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-7 bottom-7 flex items-center justify-between rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2"><div className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${app.accent}`}><Icon className="h-3.5 w-3.5" /></div><div><div className="text-[9px] font-black">SV MUSE</div><div className="text-[8px] text-white/40">Digital Studio Assistant</div></div></div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,.9)]" />
        </div>
      </div>
      <div className="absolute -left-10 top-[34%] rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[9px] font-bold text-white/70 backdrop-blur-xl">VOICE</div>
      <div className="absolute -right-12 top-[23%] rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[9px] font-bold text-white/70 backdrop-blur-xl">VISION</div>
      <div className="absolute -right-8 bottom-[19%] rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[9px] font-bold text-white/70 backdrop-blur-xl">CINEMA</div>
    </div>
  );
}

export default function HomePage() {
  const [activeApp, setActiveApp] = useState<AppId>('video');
  const [prompt, setPrompt] = useState('Cinematic Kerala backwater at blue hour, slow dolly forward, realistic rain reflections, anamorphic lens');
  const [rightsConfirmed, setRightsConfirmed] = useState(true);
  const [running, setRunning] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [notice, setNotice] = useState('Ready');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const current = useMemo(() => studioApps.find((app) => app.id === activeApp) ?? studioApps[2], [activeApp]);
  const CurrentIcon = current.icon;

  const chooseApp = (id: AppId) => {
    setActiveApp(id);
    setVideoUrl(null);
    setVideoBlob(null);
    setNotice(`${studioApps.find((a) => a.id === id)?.name || 'App'} selected`);
  };

  const runStudio = async () => {
    if (!prompt.trim()) return setNotice('Enter a prompt first');
    if (!rightsConfirmed) return setNotice('Confirm processing rights before running');
    setRunning(true);
    setNotice('Connecting to Studio backend…');
    try {
      const response = await fetch('/api/studio/run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: activeApp, prompt, rightsConfirmed }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Studio run failed');
      if (data.mode === 'provider' && data.provider?.output_url) {
        setVideoUrl(data.provider.output_url);
        setNotice('Provider output connected');
      } else {
        setNotice('Backend connected · rendering playable demo video…');
        await renderBrowserVideo(prompt, current.name);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Studio run failed');
    } finally {
      setRunning(false);
    }
  };

  const renderBrowserVideo = async (text: string, title: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280; canvas.height = 720; canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx || !canvas.captureStream || typeof MediaRecorder === 'undefined') {
      setNotice('Browser video renderer is not supported in this browser');
      return;
    }
    const stream = canvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType: mime });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    const finished = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
    recorder.start(100);
    const started = performance.now();
    const duration = 6500;
    const draw = (now: number) => {
      const elapsed = now - started;
      const t = Math.min(elapsed / duration, 1);
      const pulse = (Math.sin(elapsed / 450) + 1) / 2;
      const g = ctx.createRadialGradient(640, 250, 20, 640, 360, 700);
      g.addColorStop(0, '#6d28d9'); g.addColorStop(.42, '#111827'); g.addColorStop(1, '#030308');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
      ctx.strokeStyle = `rgba(167,139,250,${0.15 + pulse * .25})`; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(640, 320, 110 + i * 34 + pulse * 12, 0, Math.PI * 2); ctx.stroke(); }
      const orb = 105 + pulse * 12;
      ctx.fillStyle = 'rgba(196,181,253,.18)'; ctx.beginPath(); ctx.arc(640, 320, orb + 28, 0, Math.PI * 2); ctx.fill();
      const orbGradient = ctx.createRadialGradient(610, 285, 10, 640, 320, orb);
      orbGradient.addColorStop(0, '#f8fafc'); orbGradient.addColorStop(.18, '#a5f3fc'); orbGradient.addColorStop(.45, '#8b5cf6'); orbGradient.addColorStop(1, '#111827');
      ctx.fillStyle = orbGradient; ctx.beginPath(); ctx.arc(640, 320, orb, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#020617'; ctx.font = '900 34px Arial'; ctx.textAlign = 'center'; ctx.fillText('SV MUSE', 640, 330);
      ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.font = '600 18px Arial'; ctx.fillText(title.toUpperCase(), 640, 510);
      ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.font = '500 15px Arial';
      const clipped = text.length > 105 ? `${text.slice(0, 102)}…` : text;
      ctx.fillText(clipped, 640, 545);
      ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fillRect(320, 610, 640, 4);
      ctx.fillStyle = '#c4b5fd'; ctx.fillRect(320, 610, 640 * t, 4);
      if (elapsed < duration) requestAnimationFrame(draw); else recorder.stop();
    };
    requestAnimationFrame(draw);
    await finished;
    const blob = new Blob(chunks, { type: mime });
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(blob);
    setVideoBlob(blob); setVideoUrl(url); setNotice('Playable demo video ready');
  };

  const saveDemo = async () => {
    setNotice('Saving project…');
    try {
      const response = await fetch('/api/studio/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Hybrid Film Demo', app: activeApp, prompt }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Save failed');
      localStorage.setItem('sv-muse-demo', JSON.stringify(data.project));
      setNotice(`Saved · ${data.project.id}`);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Save failed'); }
  };

  const downloadVideo = () => {
    if (!videoUrl) return setNotice('Run the generator first');
    const a = document.createElement('a'); a.href = videoUrl; a.download = `sv-muse-${activeApp}-demo.webm`; a.click();
  };

  return (
    <div className="min-h-screen bg-[#09090c] text-white">
      <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#0b0b0e]/95 backdrop-blur-xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0"><div className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center font-black">SV</div><div className="leading-tight min-w-0"><div className="font-black tracking-tight truncate">StreamVista AI Digital Studio</div><div className="text-[10px] uppercase tracking-[0.18em] text-white/35">Cinema · Voice · Image · Delivery</div></div></div>
        <div className="flex items-center gap-2"><span className="hidden md:inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-bold text-violet-200">SV MUSE ONLINE · DEMO</span><a href={`mailto:${salesEmail}?subject=${encodeURIComponent('StreamVista AI Digital Studio — paid project enquiry')}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/5">Hire Studio</a><a href={representationPayLink} target="_blank" rel="noreferrer" className="hidden lg:flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-black"><WalletCards className="h-4 w-4" /> Film Representation</a></div>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-[76px_250px_minmax(0,1fr)] xl:grid-cols-[76px_250px_minmax(0,1fr)_310px]">
        <aside className="border-r border-white/10 bg-[#0a0a0d] py-3 flex flex-col items-center gap-2">
          {rail.map(([label, Icon, target], index) => <button key={label} onClick={() => chooseApp(target as AppId)} className={`w-[62px] h-[58px] rounded-xl flex flex-col items-center justify-center gap-1 text-[9px] font-bold ${index === 0 && activeApp === 'video' ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}><Icon className="h-[18px] w-[18px]" /><span>{label}</span></button>)}
          <button onClick={() => setNotice('Settings are available in the Studio configuration layer')} className="mt-auto w-[62px] h-[58px] rounded-xl flex flex-col items-center justify-center gap-1 text-[9px] font-bold text-white/35 hover:bg-white/5"><Settings2 className="h-[18px] w-[18px]" />Settings</button>
        </aside>

        <aside className="border-r border-white/10 bg-[#101014] p-3 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-2 py-2"><div className="text-[10px] uppercase tracking-[0.18em] font-black text-white/30">AI Apps</div><p className="mt-1 text-xs text-white/45">Each module can become a paid studio service.</p></div>
          <div className="mt-2 space-y-1">{studioApps.map((app) => { const Icon = app.icon; const active = activeApp === app.id; return <button key={app.id} onClick={() => chooseApp(app.id)} className={`w-full rounded-xl p-2.5 text-left flex items-center gap-3 transition ${active ? 'bg-white text-black' : 'hover:bg-white/5 text-white'}`}><div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${app.accent} grid place-items-center text-white shrink-0`}><Icon className="h-4 w-4" /></div><div className="min-w-0"><div className="text-xs font-black truncate">{app.name}</div><div className={`mt-0.5 text-[9px] truncate ${active ? 'text-black/50' : 'text-white/30'}`}>{app.badge}</div></div></button>; })}</div>
        </aside>

        <main className="min-w-0 bg-[#121217] flex flex-col">
          <div className="h-12 border-b border-white/10 bg-[#0f0f13] px-4 flex items-center justify-between"><div className="flex items-center gap-2 text-xs"><span className="text-white/30">Project</span><span className="text-white/15">/</span><span className="font-black">Hybrid Film Demo</span><span className="text-white/15">/</span><span className="text-violet-300 font-bold">{current.name}</span></div><div className="flex items-center gap-2"><span className="hidden sm:inline text-[9px] text-white/30">{notice}</span><button onClick={saveDemo} className="rounded-lg bg-white/5 px-3 py-1.5 text-[10px] text-white/70 hover:bg-white/10">Save demo</button></div></div>

          <section className="flex-1 p-4 lg:p-6 min-h-[650px]">
            <div className="mx-auto w-full max-w-[1180px] min-h-[610px] rounded-[26px] border border-white/10 bg-[#17171d] overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(circle at 50% 8%, rgba(139,92,246,.20), transparent 29%), radial-gradient(circle at 20% 78%, rgba(34,211,238,.08), transparent 24%), linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)', backgroundSize: 'auto, auto, 30px 30px, 30px 30px' }} />
              <div className="relative z-10 min-h-[610px] flex items-center justify-center p-5 lg:p-10"><div className="w-full max-w-3xl">
                {!videoUrl ? <>
                  <AvatarSphere app={current} />
                  <div className="text-center mb-6"><h1 className="text-3xl lg:text-5xl font-black tracking-[-0.04em]">Create with <span className="text-violet-300">SV Muse</span>.</h1><p className="mt-3 text-sm text-white/45">{current.name} · {current.description}</p></div>
                  <div className="rounded-2xl border border-white/12 bg-[#0d0d11]/95 p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)]">
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-24 w-full resize-none bg-transparent p-3 text-sm leading-6 text-white outline-none placeholder:text-white/25" placeholder={`Tell SV Muse what to do with ${current.name}…`} />
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3"><div className="flex items-center gap-2"><label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/10"><Upload className="h-3.5 w-3.5" /> Add media<input type="file" accept="video/*,image/*,audio/*" className="hidden" onChange={(e) => setMediaName(e.target.files?.[0]?.name || null)} /></label>{mediaName ? <span className="max-w-[180px] truncate text-[10px] text-cyan-300">{mediaName}</span> : <span className="hidden sm:inline text-[10px] text-white/25">Rights-cleared source only</span>}</div><button disabled={running} onClick={runStudio} className={`rounded-xl bg-gradient-to-r ${current.accent} px-5 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-lg disabled:opacity-60`}>{running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {running ? 'Running…' : `Run ${current.name}`}</button></div>
                  </div>
                </> : <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"><div className="relative aspect-video bg-black"><video ref={videoRef} src={videoUrl} className="h-full w-full object-contain" controls playsInline /><div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold backdrop-blur">SV MUSE · {current.name.toUpperCase()}</div></div><div className="flex items-center justify-between gap-2 p-3"><button onClick={() => videoRef.current?.play()} className="rounded-lg bg-white px-3 py-2 text-[10px] font-black text-black flex items-center gap-1.5"><Play className="h-3.5 w-3.5 fill-black" /> Play</button><div className="flex items-center gap-2"><button onClick={() => { if (videoUrl) URL.revokeObjectURL(videoUrl); setVideoUrl(null); setVideoBlob(null); }} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold text-white/60"><X className="inline h-3.5 w-3.5" /> Back</button><button onClick={downloadVideo} className="rounded-lg bg-white px-3 py-2 text-[10px] font-black text-black flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Export video</button></div></div></div>}
                {videoBlob && <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-300"><Check className="h-3.5 w-3.5" /> Real playable browser-rendered video created · WebM</div>}
              </div></div>
            </div>
          </section>

          <section className="border-t border-white/10 bg-[#0b0b0f] p-3 lg:p-4"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-white/40" /><span className="text-xs font-black">Timeline</span><span className="text-[9px] text-white/25">00:00:26:00</span></div><div className="text-[9px] text-white/25">Hybrid Film Demo</div></div><div className="grid grid-cols-[52px_minmax(0,1fr)] gap-2"><div className="space-y-1.5"><div className="h-11 rounded-lg bg-white/[0.04] grid place-items-center text-[9px] text-white/30">V1</div><div className="h-8 rounded-lg bg-white/[0.04] grid place-items-center text-[9px] text-white/30">A1</div></div><div className="min-w-0 overflow-hidden space-y-1.5"><div className="flex h-11 min-w-[700px] gap-1.5"><div className="w-[25%] rounded-lg bg-violet-500/15 border border-violet-400/20 px-3 py-2 text-[9px] font-bold">Opening shot</div><div className="w-[28%] rounded-lg bg-fuchsia-500/15 border border-fuchsia-400/20 px-3 py-2 text-[9px] font-bold">Character</div><div className="w-[20%] rounded-lg bg-cyan-500/15 border border-cyan-400/20 px-3 py-2 text-[9px] font-bold">Dialogue</div><div className="flex-1 rounded-lg bg-emerald-500/15 border border-emerald-400/20 px-3 py-2 text-[9px] font-bold">World extension</div></div><div className="flex h-8 min-w-[700px] gap-1.5"><div className="w-[58%] rounded-lg bg-emerald-500/10 border border-emerald-400/15 px-3 flex items-center gap-2"><Music2 className="h-3 w-3" /><span className="text-[8px] font-bold">Dialogue + ambience</span></div><div className="flex-1 rounded-lg bg-blue-500/10 border border-blue-400/15 px-3 flex items-center gap-2"><Captions className="h-3 w-3" /><span className="text-[8px] font-bold">Subtitles / localisation</span></div></div></div></div></section>
        </main>

        <aside className="hidden xl:block border-l border-white/10 bg-[#0c0c0f] overflow-y-auto max-h-[calc(100vh-64px)]"><div className="h-12 border-b border-white/10 px-4 flex items-center justify-between"><span className="text-xs font-black">Inspector</span><Settings2 className="h-4 w-4 text-white/30" /></div><div className="p-4 space-y-4"><section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><span className="text-xs font-black">Rights Gate</span></div><button onClick={() => setRightsConfirmed(!rightsConfirmed)} className="mt-3 w-full rounded-xl bg-black/30 p-3 flex items-center justify-between"><div className="text-left"><div className="text-[10px] font-bold">Processing rights</div><div className="mt-1 text-[9px] text-white/30">Required for real processing.</div></div><span className={`h-5 w-9 rounded-full p-0.5 ${rightsConfirmed ? 'bg-emerald-500' : 'bg-white/15'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${rightsConfirmed ? 'translate-x-4' : ''}`} /></span></button></section><section className="rounded-2xl border border-violet-400/15 bg-violet-400/[.04] p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-200/60">SV Muse</div><div className="mt-3 flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_25%,white,#8b5cf6_35%,#111827_75%)] shadow-[0_0_30px_rgba(139,92,246,.25)]" /><div><div className="text-xs font-black">Creative AI Avatar</div><div className="mt-1 text-[9px] text-white/35">Connected studio runtime</div></div></div></section><section className="space-y-2"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Selected App</div><div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${current.accent} grid place-items-center`}><CurrentIcon className="h-5 w-5" /></div><div className="mt-3 font-black">{current.name}</div><div className="mt-1 text-[10px] text-white/35">{current.badge}</div><p className="mt-3 text-[10px] leading-5 text-white/45">{current.description}</p></div></section><section className="space-y-2"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Commercial</div><a href={`mailto:${salesEmail}?subject=${encodeURIComponent(`Paid ${current.name} project enquiry`)}`} className="block rounded-xl bg-violet-500 px-4 py-3 text-center text-xs font-black">Request paid job</a><a href={representationPayLink} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 px-4 py-3 text-center text-[10px] font-bold text-white/60">Film representation · ₹25,000 + GST</a></section></div></aside>
      </div>
    </div>
  );
}
