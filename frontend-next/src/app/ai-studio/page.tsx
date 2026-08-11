'use client';

import { useState } from 'react';
import { Upload, Film, Languages, Cuboid, Palette, Scissors, CheckCircle2, ArrowRight } from 'lucide-react';

type Tool = 'dubbing' | 'clipper' | 'stereoscopic_3d' | 'cartoon';

const tools: { id: Tool; title: string; description: string; icon: typeof Film }[] = [
  { id: 'dubbing', title: 'AI Dubbing', description: 'Create a multilingual dubbed version of your source.', icon: Languages },
  { id: 'clipper', title: 'AI Short Clips', description: 'Turn a long video into short vertical clips.', icon: Scissors },
  { id: 'stereoscopic_3d', title: '2D → 3D', description: 'Prepare a spatial / stereoscopic version of your source.', icon: Cuboid },
  { id: 'cartoon', title: 'Cartoon & Anime', description: 'Create a stylized version from your source.', icon: Palette },
];

export default function AIStudioPage() {
  const [tool, setTool] = useState<Tool>('dubbing');
  const [sourceName, setSourceName] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Malayalam');
  const [output, setOutput] = useState<'audio' | 'video'>('video');
  const [step, setStep] = useState(1);

  const selected = tools.find((item) => item.id === tool)!;
  const Icon = selected.icon;

  const chooseTool = (id: Tool) => {
    setTool(id);
    setStep(1);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#080808] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">StreamVista AI Digital Studio</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-black tracking-tight">Create. Check. Publish.</h1>
          <p className="mt-4 text-zinc-400 text-base md:text-lg">Choose a tool, add your source, select the result you want, and move it through one simple studio workflow.</p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tools.map((item) => {
            const ToolIcon = item.icon;
            const active = tool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => chooseTool(item.id)}
                className={`text-left rounded-2xl border p-4 transition ${active ? 'bg-white text-black border-white' : 'bg-zinc-950 text-white border-white/10 hover:border-white/30'}`}
              >
                <ToolIcon className="h-5 w-5 mb-8" />
                <div className="font-bold">{item.title}</div>
                <div className={`mt-1 text-xs leading-5 ${active ? 'text-zinc-600' : 'text-zinc-500'}`}>{item.description}</div>
              </button>
            );
          })}
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
          <div className="px-5 py-4 md:px-8 md:py-5 border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center"><Icon className="h-5 w-5" /></div>
              <div>
                <h2 className="font-bold text-lg">{selected.title}</h2>
                <p className="text-xs text-zinc-500">{selected.description}</p>
              </div>
            </div>
            <div className="text-xs text-zinc-500">Step {step} of 5</div>
          </div>

          <div className="grid md:grid-cols-5 border-b border-white/10">
            {['Add source', 'Choose output', 'Create', 'Check', 'Publish'].map((label, index) => (
              <button key={label} onClick={() => setStep(index + 1)} className={`px-4 py-3 text-xs font-bold border-r border-white/10 last:border-r-0 ${step === index + 1 ? 'bg-white text-black' : 'text-zinc-500'}`}>
                {index + 1}. {label}
              </button>
            ))}
          </div>

          <div className="p-5 md:p-8 min-h-[300px]">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold">Add your source</h3>
                  <p className="text-sm text-zinc-500 mt-1">Upload the audio or video you want to work with.</p>
                </div>
                <label className="block rounded-2xl border border-dashed border-white/20 bg-black p-10 text-center cursor-pointer hover:border-white/50 transition">
                  <Upload className="h-7 w-7 mx-auto mb-3" />
                  <span className="font-bold">Choose Audio / Video</span>
                  <span className="block text-xs text-zinc-500 mt-2">MP4, MOV, MP3, WAV and supported media</span>
                  <input type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => setSourceName(e.target.files?.[0]?.name || '')} />
                </label>
                {sourceName && <div className="text-sm text-zinc-300">Selected: <strong>{sourceName}</strong></div>}
                <button onClick={() => setStep(2)} disabled={!sourceName} className="px-5 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-30 inline-flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-2xl font-bold">Choose your output</h3>
                  <p className="text-sm text-zinc-500 mt-1">Only the options relevant to this tool are shown.</p>
                </div>
                {tool === 'dubbing' && (
                  <>
                    <label className="block text-sm font-bold">Target language<select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="mt-2 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-white"><option>Malayalam</option><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select></label>
                    <div><div className="text-sm font-bold mb-2">Output</div><div className="grid grid-cols-2 gap-3">{(['audio', 'video'] as const).map((type) => <button key={type} onClick={() => setOutput(type)} className={`rounded-xl border p-4 text-left font-bold ${output === type ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400'}`}>{type === 'audio' ? 'Dubbed Audio' : 'Final Dubbed Video'}</button>)}</div></div>
                  </>
                )}
                {tool !== 'dubbing' && <div className="rounded-xl border border-white/10 p-4 text-sm text-zinc-400">Output settings for <strong className="text-white">{selected.title}</strong> will use the existing studio configuration.</div>}
                <button onClick={() => setStep(3)} className="px-5 py-3 rounded-xl bg-white text-black font-bold inline-flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-xl space-y-5">
                <h3 className="text-2xl font-bold">Create</h3>
                <div className="rounded-2xl border border-white/10 p-5 bg-black space-y-3 text-sm"><div className="flex justify-between"><span className="text-zinc-500">Source</span><span>{sourceName || 'Selected source'}</span></div>{tool === 'dubbing' && <><div className="flex justify-between"><span className="text-zinc-500">Language</span><span>{targetLanguage}</span></div><div className="flex justify-between"><span className="text-zinc-500">Output</span><span>{output === 'video' ? 'Final Dubbed Video' : 'Dubbed Audio'}</span></div></>}</div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-zinc-400">This step is ready for the existing production AI processing API. No simulated completion is shown.</div>
                <button disabled className="px-5 py-3 rounded-xl bg-white text-black font-bold opacity-40 cursor-not-allowed">Create with AI</button>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-xl space-y-5"><h3 className="text-2xl font-bold">View & Check</h3><div className="rounded-2xl border border-white/10 p-8 text-center text-zinc-500">Your generated result will appear here after the real processing job returns a result.</div><button disabled className="px-5 py-3 rounded-xl bg-white text-black font-bold opacity-40">Approve result</button></div>
            )}

            {step === 5 && (
              <div className="max-w-xl space-y-5"><h3 className="text-2xl font-bold">Publish</h3><div className="rounded-2xl border border-white/10 p-5 flex gap-3"><CheckCircle2 className="h-5 w-5 text-zinc-500" /><div><div className="font-bold">Ready to publish</div><div className="text-sm text-zinc-500 mt-1">Publishing unlocks after a verified processing result and approval.</div></div></div><button disabled className="px-5 py-3 rounded-xl bg-white text-black font-bold opacity-40">Publish final</button></div>
            )}
          </div>
        </section>

        <p className="text-xs text-zinc-600">Powered by Crayons Bridge · StreamVista AI Digital Studio</p>
      </div>
    </main>
  );
}
