'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Languages,
  Pause,
  Palette,
  Play,
  Scissors,
  Upload,
  Video,
  Volume2,
  Cuboid,
  Flag,
  RotateCcw,
} from 'lucide-react';

type Tool = 'dubbing' | 'clipper' | 'stereoscopic_3d' | 'cartoon';
type MediaKind = 'video' | 'audio';
type Stage = 'service' | 'source' | 'language' | 'result' | 'processing' | 'delivery';
type Output = 'audio' | 'video';

type IssueMark = {
  id: number;
  time: number;
};

const tools = [
  { id: 'dubbing' as Tool, title: 'AI Dubbing', icon: Languages, description: 'Dub your media into another language.' },
  { id: 'clipper' as Tool, title: 'AI Short Clips', icon: Scissors, description: 'Turn a long video into short clips.' },
  { id: 'stereoscopic_3d' as Tool, title: '2D → 3D', icon: Cuboid, description: 'Create a spatial 3D version.' },
  { id: 'cartoon' as Tool, title: 'Cartoon & Anime', icon: Palette, description: 'Create a stylized version.' },
];

const languages = ['Malayalam', 'English', 'Hindi', 'Tamil', 'Telugu'];

const stageOrder: Stage[] = ['service', 'source', 'language', 'result', 'processing', 'delivery'];

const stageLabels: Record<Stage, string> = {
  service: 'Service',
  source: 'Source',
  language: 'Language',
  result: 'Result',
  processing: 'Create',
  delivery: 'Delivery',
};

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function AIStudioPage() {
  const [tool, setTool] = useState<Tool>('dubbing');
  const [stage, setStage] = useState<Stage>('service');
  const [sourceName, setSourceName] = useState('');
  const [mediaKind, setMediaKind] = useState<MediaKind | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Tamil');
  const [targetLanguage, setTargetLanguage] = useState('Malayalam');
  const [output, setOutput] = useState<Output>('video');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [issueMarks, setIssueMarks] = useState<IssueMark[]>([]);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');

  const selected = tools.find((item) => item.id === tool)!;
  const Icon = selected.icon;

  const targetLanguages = useMemo(
    () => languages.filter((language) => language !== sourceLanguage),
    [sourceLanguage],
  );

  const canUseVideoOutput = mediaKind === 'video';

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  useEffect(() => {
    if (!targetLanguages.includes(targetLanguage)) {
      setTargetLanguage(targetLanguages[0] || 'Malayalam');
    }
  }, [sourceLanguage, targetLanguage, targetLanguages]);

  const chooseTool = (id: Tool) => {
    setTool(id);
    setStage('source');
    setSourceName('');
    setMediaKind(null);
    setSourceUrl('');
    setProcessing(false);
    setProgress(null);
    setPreviewReady(false);
    setResultUrl('');
    setError('');
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);

    const kind: MediaKind = file.type.startsWith('audio/') ? 'audio' : 'video';
    setSourceName(file.name);
    setMediaKind(kind);
    setSourceUrl(URL.createObjectURL(file));
    setError('');

    if (tool !== 'dubbing' && kind === 'audio') {
      setError('This service needs a video source. Choose a video file.');
      return;
    }

    if (kind === 'audio') setOutput('audio');
    else if (output !== 'audio' && output !== 'video') setOutput('video');
  };

  const nextFromSource = () => {
    if (!sourceName || !mediaKind) return;
    setStage(tool === 'dubbing' ? 'language' : 'result');
  };

  const nextFromLanguage = () => setStage('result');

  const nextFromResult = () => {
    setError('');
    setProcessing(true);
    setProgress(null);
    setPreviewReady(false);
    setStage('processing');
  };

  const markIssue = () => {
    setIssueMarks((current) => [...current, { id: Date.now(), time: previewTime }]);
  };

  const reset = () => {
    setStage('service');
    setSourceName('');
    setMediaKind(null);
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl('');
    setProcessing(false);
    setProgress(null);
    setPreviewReady(false);
    setResultUrl('');
    setIssueMarks([]);
    setError('');
  };

  // This intentionally does not fake render completion. A real processing adapter can
  // feed progress/resultUrl into this UI later; until then the screen stays in a truthful
  // waiting state rather than inventing a finished file.
  useEffect(() => {
    if (!processing) return;
    const timer = window.setTimeout(() => setProcessing(false), 1500);
    return () => window.clearTimeout(timer);
  }, [processing]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#080808] text-white">
      <div className="max-w-4xl mx-auto px-4 py-7 md:py-10">
        <header className="mb-7">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">StreamVista AI Studio</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-black tracking-tight">Create with AI.</h1>
          <p className="mt-3 text-zinc-400">One guided flow. Choose → upload → create → check → deliver.</p>
        </header>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
          {stageOrder.map((item, index) => {
            const active = stage === item;
            const currentIndex = stageOrder.indexOf(stage);
            const done = index < currentIndex;
            return (
              <div key={item} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => done && setStage(item)}
                  className={`h-8 px-3 rounded-full text-xs font-bold border ${
                    active ? 'bg-white text-black border-white' : done ? 'border-white/30 text-white' : 'border-white/10 text-zinc-600'
                  }`}
                >
                  {done ? <Check className="inline h-3.5 w-3.5 mr-1" /> : `${index + 1}. `}
                  {stageLabels[item]}
                </button>
                {index < stageOrder.length - 1 && <span className="text-zinc-800">→</span>}
              </div>
            );
          })}
        </div>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
          <div className="px-5 py-5 md:px-7 border-b border-white/10 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white text-black flex items-center justify-center"><Icon className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-xl">{selected.title}</h2>
              <p className="text-sm text-zinc-500">{selected.description}</p>
            </div>
          </div>

          <div className="p-5 md:p-7">
            {stage === 'service' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold">Choose one service</h3>
                  <p className="text-sm text-zinc-500 mt-1">Only one decision at a time.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tools.map((item) => {
                    const ToolIcon = item.icon;
                    const active = tool === item.id;
                    return (
                      <button key={item.id} onClick={() => chooseTool(item.id)} className={`text-left rounded-2xl border p-5 ${active ? 'bg-white text-black border-white' : 'border-white/10 bg-black hover:border-white/30'}`}>
                        <ToolIcon className="h-5 w-5 mb-7" />
                        <div className="font-bold">{item.title}</div>
                        <div className={`text-sm mt-1 ${active ? 'text-zinc-600' : 'text-zinc-500'}`}>{item.description}</div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setStage('source')} className="px-6 py-3 rounded-xl bg-white text-black font-bold inline-flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}

            {stage === 'source' && (
              <div className="space-y-5 max-w-2xl">
                <div>
                  <h3 className="text-2xl font-bold">Add your source</h3>
                  <p className="text-sm text-zinc-500 mt-1">The studio automatically adapts to the file you load.</p>
                </div>

                <label className="block rounded-2xl border border-dashed border-white/20 bg-black p-8 text-center cursor-pointer hover:border-white/50 transition">
                  <Upload className="h-7 w-7 mx-auto mb-3" />
                  <span className="font-bold">Choose audio or video</span>
                  <span className="block text-xs text-zinc-500 mt-2">MP4, MOV, MP3, WAV and supported media</span>
                  <input type="file" accept="audio/*,video/*" className="hidden" onChange={handleFile} />
                </label>

                {sourceName && mediaKind && (
                  <div className="rounded-2xl border border-white/10 bg-black p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {mediaKind === 'video' ? <Video className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      <div className="min-w-0">
                        <div className="font-bold truncate">{sourceName}</div>
                        <div className="text-xs text-zinc-500">{mediaKind === 'video' ? 'Video loaded' : 'Audio loaded'}</div>
                      </div>
                    </div>
                    {mediaKind === 'video' && sourceUrl && <video src={sourceUrl} controls className="w-full rounded-xl max-h-72 bg-black" />}
                    {mediaKind === 'audio' && sourceUrl && <audio src={sourceUrl} controls className="w-full" />}
                  </div>
                )}

                {error && <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</div>}

                <button disabled={!sourceName || !mediaKind || !!error} onClick={nextFromSource} className="px-6 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-30 inline-flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}

            {stage === 'language' && tool === 'dubbing' && (
              <div className="space-y-5 max-w-2xl">
                <div>
                  <h3 className="text-2xl font-bold">Choose languages</h3>
                  <p className="text-sm text-zinc-500 mt-1">Source language is excluded automatically from the target list.</p>
                </div>

                <label className="block text-sm font-bold">Source language
                  <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} className="mt-2 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-white">
                    {languages.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-bold">Target language
                  <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="mt-2 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-white">
                    {targetLanguages.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>

                <div className="flex gap-3">
                  <button onClick={() => setStage('source')} className="px-5 py-3 rounded-xl border border-white/10 font-bold inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button onClick={nextFromLanguage} className="px-6 py-3 rounded-xl bg-white text-black font-bold inline-flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            {stage === 'result' && (
              <div className="space-y-5 max-w-2xl">
                <div>
                  <h3 className="text-2xl font-bold">Choose the result</h3>
                  <p className="text-sm text-zinc-500 mt-1">The options change automatically based on your source.</p>
                </div>

                {tool === 'dubbing' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => setOutput('audio')} className={`rounded-2xl border p-5 text-left ${output === 'audio' ? 'bg-white text-black border-white' : 'border-white/10 bg-black text-zinc-400'}`}>
                      <Volume2 className="h-5 w-5 mb-8" />
                      <div className="font-bold">Dubbed Audio</div>
                      <div className="text-xs mt-1 opacity-60">Audio result only</div>
                    </button>
                    {canUseVideoOutput && <button onClick={() => setOutput('video')} className={`rounded-2xl border p-5 text-left ${output === 'video' ? 'bg-white text-black border-white' : 'border-white/10 bg-black text-zinc-400'}`}>
                      <Video className="h-5 w-5 mb-8" />
                      <div className="font-bold">Dubbed Video</div>
                      <div className="text-xs mt-1 opacity-60">Video with new language</div>
                    </button>}
                  </div>
                )}

                {tool !== 'dubbing' && <div className="rounded-2xl border border-white/10 bg-black p-5"><div className="font-bold">{selected.title}</div><div className="text-sm text-zinc-500 mt-1">Standard output is selected automatically for this service.</div></div>}

                <div className="rounded-2xl border border-white/10 bg-black p-4 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-zinc-500">File</span><span className="truncate">{sourceName}</span></div>
                  {tool === 'dubbing' && <>
                    <div className="flex justify-between mt-2"><span className="text-zinc-500">From</span><span>{sourceLanguage}</span></div>
                    <div className="flex justify-between mt-2"><span className="text-zinc-500">To</span><span>{targetLanguage}</span></div>
                    <div className="flex justify-between mt-2"><span className="text-zinc-500">Result</span><span>{output === 'video' ? 'Dubbed Video' : 'Dubbed Audio'}</span></div>
                  </>}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStage(tool === 'dubbing' ? 'language' : 'source')} className="px-5 py-3 rounded-xl border border-white/10 font-bold inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button onClick={nextFromResult} className="px-6 py-3 rounded-xl bg-white text-black font-bold inline-flex items-center gap-2">Start <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            {stage === 'processing' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-2xl font-bold">Creating your result</h3>
                  <p className="text-sm text-zinc-500 mt-1">You do not need to manage the processing steps. We will keep the progress visible here.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold">{progress === null ? 'Processing' : `${progress}% complete`}</span>
                    <span className="text-xs text-zinc-500">{sourceName}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    {progress === null ? <div className="h-full w-1/3 bg-white animate-pulse rounded-full" /> : <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />}
                  </div>
                </div>

                {progress !== null && progress >= 25 && (
                  <div className="rounded-2xl border border-white/10 bg-black p-5 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold">25% checkpoint ready</div>
                        <div className="text-sm text-zinc-500">Check the preview before the full render continues.</div>
                      </div>
                      <button onClick={() => setPreviewReady(true)} className="px-4 py-2 rounded-xl bg-white text-black font-bold">Check preview</button>
                    </div>
                  </div>
                )}

                {previewReady && sourceUrl && (
                  <div className="rounded-2xl border border-white/10 bg-black overflow-hidden">
                    <div className="p-5 border-b border-white/10">
                      <div className="font-bold">Preview check</div>
                      <div className="text-xs text-zinc-500 mt-1">If something is wrong, pause and mark the exact timecode.</div>
                    </div>
                    <div className="p-5">
                      {mediaKind === 'video' ? <video src={sourceUrl} controls className="w-full rounded-xl bg-black" onTimeUpdate={(e) => setPreviewTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} /> : <audio src={sourceUrl} controls className="w-full" onTimeUpdate={(e) => setPreviewTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button onClick={() => setPreviewPlaying((value) => !value)} className="px-4 py-2 rounded-xl border border-white/10 font-bold inline-flex items-center gap-2">{previewPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {previewPlaying ? 'Pause' : 'Play'}</button>
                        <span className="px-3 py-2 rounded-xl bg-white/5 text-sm font-mono">{formatTime(previewTime)} / {formatTime(duration)}</span>
                        <button onClick={markIssue} className="px-4 py-2 rounded-xl border border-white/10 font-bold inline-flex items-center gap-2"><Flag className="h-4 w-4" /> Mark issue</button>
                      </div>
                      {issueMarks.length > 0 && <div className="mt-4 space-y-2"><div className="text-xs uppercase tracking-wider text-zinc-600">Marked timecodes</div>{issueMarks.map((mark) => <div key={mark.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"><span>Issue at {formatTime(mark.time)}</span><Check className="h-4 w-4 text-zinc-400" /></div>)}</div>}
                    </div>
                  </div>
                )}

                {resultUrl && <button onClick={() => setStage('delivery')} className="px-6 py-3 rounded-xl bg-white text-black font-bold">Continue to delivery</button>}

                {!resultUrl && !processing && <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-zinc-400">The production processing service is not connected to this preview yet. No fake completion or fake output is shown.</div>}
              </div>
            )}

            {stage === 'delivery' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-2xl font-bold">Your file is ready</h3>
                  <p className="text-sm text-zinc-500 mt-1">Download the final result directly.</p>
                </div>
                {resultUrl ? (
                  <a href={resultUrl} download className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold inline-flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download final file</a>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black p-5 text-sm text-zinc-400">Final delivery unlocks only after the verified production result is returned.</div>
                )}
                <button onClick={reset} className="text-sm font-bold text-zinc-500 hover:text-white inline-flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Create another</button>
              </div>
            )}
          </div>
        </section>

        <p className="text-xs text-zinc-600 mt-6">Powered by Crayons Bridge · StreamVista AI Studio</p>
      </div>
    </main>
  );
}
