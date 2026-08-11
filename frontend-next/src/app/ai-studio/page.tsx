'use client';

import { useState } from 'react';
import { Upload, Languages, Cuboid, Palette, Scissors, ArrowRight } from 'lucide-react';

type Tool = 'dubbing' | 'clipper' | 'stereoscopic_3d' | 'cartoon';

const tools = [
  { id: 'dubbing' as Tool, title: 'AI Dubbing', icon: Languages, description: 'Dub your video into another language.' },
  { id: 'clipper' as Tool, title: 'AI Short Clips', icon: Scissors, description: 'Turn a long video into short clips.' },
  { id: 'stereoscopic_3d' as Tool, title: '2D → 3D', icon: Cuboid, description: 'Create a spatial 3D version.' },
  { id: 'cartoon' as Tool, title: 'Cartoon & Anime', icon: Palette, description: 'Create a stylized version.' },
];

export default function AIStudioPage() {
  const [tool, setTool] = useState<Tool>('dubbing');
  const [sourceName, setSourceName] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Malayalam');
  const [output, setOutput] = useState<'audio' | 'video'>('video');
  const [started, setStarted] = useState(false);

  const selected = tools.find((item) => item.id === tool)!;
  const Icon = selected.icon;

  const chooseTool = (id: Tool) => {
    setTool(id);
    setSourceName('');
    setStarted(false);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#080808] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <header className="max-w-2xl mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">StreamVista AI Studio</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-black tracking-tight">Create with AI.</h1>
          <p className="mt-3 text-zinc-400">Choose one service, add your video, choose the result, and start.</p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {tools.map((item) => {
            const ToolIcon = item.icon;
            const active = tool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => chooseTool(item.id)}
                className={`text-left rounded-2xl border p-4 transition ${active ? 'bg-white text-black border-white' : 'bg-zinc-950 text-white border-white/10 hover:border-white/30'}`}
              >
                <ToolIcon className="h-5 w-5 mb-6" />
                <div className="font-bold">{item.title}</div>
                <div className={`mt-1 text-xs leading-5 ${active ? 'text-zinc-600' : 'text-zinc-500'}`}>{item.description}</div>
              </button>
            );
          })}
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-5 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="h-11 w-11 rounded-xl bg-white text-black flex items-center justify-center"><Icon className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-xl">{selected.title}</h2>
              <p className="text-sm text-zinc-500">{selected.description}</p>
            </div>
          </div>

          {!started ? (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="text-sm font-bold">1. Add your video</label>
                <label className="mt-2 block rounded-2xl border border-dashed border-white/20 bg-black p-8 text-center cursor-pointer hover:border-white/50 transition">
                  <Upload className="h-7 w-7 mx-auto mb-3" />
                  <span className="font-bold">Choose video</span>
                  <span className="block text-xs text-zinc-500 mt-2">MP4, MOV and supported video files</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => setSourceName(e.target.files?.[0]?.name || '')} />
                </label>
                {sourceName && <div className="mt-2 text-sm text-zinc-300">Selected: <strong>{sourceName}</strong></div>}
              </div>

              {tool === 'dubbing' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold">2. Language</label>
                    <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="mt-2 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-white">
                      <option>Malayalam</option><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold">3. Result</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button onClick={() => setOutput('audio')} className={`rounded-xl border p-4 text-left font-bold ${output === 'audio' ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400'}`}>Dubbed Audio</button>
                      <button onClick={() => setOutput('video')} className={`rounded-xl border p-4 text-left font-bold ${output === 'video' ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400'}`}>Dubbed Video</button>
                    </div>
                  </div>
                </div>
              )}

              {tool !== 'dubbing' && (
                <div className="rounded-xl border border-white/10 bg-black p-4 text-sm text-zinc-400">
                  The studio will use the standard settings for <strong className="text-white">{selected.title}</strong>.
                </div>
              )}

              <button disabled={!sourceName} onClick={() => setStarted(true)} className="px-6 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-30 inline-flex items-center gap-2">
                Start <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black p-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-zinc-500">Source</span><span className="text-right">{sourceName}</span></div>
                {tool === 'dubbing' && <>
                  <div className="flex justify-between"><span className="text-zinc-500">Language</span><span>{targetLanguage}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Result</span><span>{output === 'video' ? 'Dubbed Video' : 'Dubbed Audio'}</span></div>
                </>}
              </div>
              <div className="rounded-2xl border border-white/10 p-6 bg-black">
                <h3 className="text-xl font-bold">Ready to create</h3>
                <p className="text-sm text-zinc-500 mt-2">Your request is ready for the production AI processing service.</p>
                <button disabled className="mt-5 px-6 py-3 rounded-xl bg-white text-black font-bold opacity-40">Create with AI</button>
              </div>
              <button onClick={() => setStarted(false)} className="text-sm font-bold text-zinc-400 hover:text-white">Change selection</button>
            </div>
          )}
        </section>

        <p className="text-xs text-zinc-600 mt-6">Powered by Crayons Bridge · StreamVista AI Studio</p>
      </div>
    </main>
  );
}
