'use client';

import { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Wifi, 
  Wand2, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  Send,
  BrainCircuit,
  Zap
} from 'lucide-react';

export default function AIStudioPage() {
  // Crayons Bridge AI State
  const [crayonsPrompt, setCrayonsPrompt] = useState('Jananam 1947');
  const [crayonsTask, setCrayonsTask] = useState<'logline' | 'rights_match' | 'shorts'>('logline');
  const [isCrayonsRunning, setIsCrayonsRunning] = useState(false);
  const [crayonsResponse, setCrayonsResponse] = useState<any>(null);

  // Agent State
  const [selectedAgent, setSelectedAgent] = useState<'dubbing' | 'clipper' | 'stereoscopic_3d' | 'cartoon'>('dubbing');
  const [isProcessingAgent, setIsProcessingAgent] = useState(false);
  const [agentOutput, setAgentOutput] = useState<any>(null);

  const handleRunCrayonsBridgeAI = async () => {
    setIsCrayonsRunning(true);
    setCrayonsResponse(null);

    try {
      const res = await fetch('/api/ai/crayons-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: crayonsPrompt, taskType: crayonsTask })
      });
      const data = await res.json();
      setIsCrayonsRunning(false);
      setCrayonsResponse(data);
    } catch (e) {
      setIsCrayonsRunning(false);
    }
  };

  const handleRunAgent = () => {
    setIsProcessingAgent(true);
    setAgentOutput(null);

    setTimeout(() => {
      setIsProcessingAgent(false);
      if (selectedAgent === 'dubbing') {
        setAgentOutput({
          type: 'AI Dubbing & Lip-Sync',
          voiceMatch: '98.4% Pitch & Emotion Retained',
          sampleTrack: `Jananam_1947_Dubbed_English.wav`,
          status: 'DUBBING COMPLETE'
        });
      } else if (selectedAgent === 'stereoscopic_3d') {
        setAgentOutput({
          type: 'AI 2D-to-3D Stereoscopic Conversion',
          outputFormat: 'Apple Vision Pro Spatial Video & 3D DCP',
          status: '3D STEREO RENDERED'
        });
      } else if (selectedAgent === 'cartoon') {
        setAgentOutput({
          type: 'AI Cartoon & Anime Stylization',
          style: 'Anime Cell Shaded 24 FPS',
          status: 'TOON SERIES GENERATED'
        });
      } else {
        setAgentOutput({
          type: 'AI 9:16 Vertical Video Clipper',
          clipsGenerated: 4,
          status: '9:16 SHORTS CLIPPED'
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span>Free AI Tool • Crayons Bridge AI Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Crayons Bridge AI & AI Conversion Studio</h1>
          <p className="text-zinc-400 text-sm">Free AI assistant for general users: 1-click script optimizer, OTT buyer matchmaker, and AI 3D/Anime converter.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-white text-black font-mono font-bold text-xs">
            $0.00 FREE TIER ACTIVE
          </span>
        </div>
      </div>

      {/* CRAYONS BRIDGE AI ASSISTANT BOX FOR GENERAL USERS */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 font-mono text-xs">
          <h2 className="font-bold text-white flex items-center gap-2 text-base">
            <BrainCircuit className="h-5 w-5 text-white" />
            <span>Crayons Bridge AI Assistant (Free for General Users)</span>
          </h2>
          <span className="text-zinc-400">Gemini 1.5 Flash API Connected</span>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3 text-xs font-mono">
            <button
              onClick={() => setCrayonsTask('logline')}
              className={`p-3 rounded-xl border text-left transition-all ${crayonsTask === 'logline' ? 'bg-white text-black font-bold' : 'bg-zinc-950 text-zinc-400 border-white/10'}`}
            >
              1-Click Logline & Synopsis
            </button>
            <button
              onClick={() => setCrayonsTask('rights_match')}
              className={`p-3 rounded-xl border text-left transition-all ${crayonsTask === 'rights_match' ? 'bg-white text-black font-bold' : 'bg-zinc-950 text-zinc-400 border-white/10'}`}
            >
              1-Click OTT Buyer Matchmaker
            </button>
            <button
              onClick={() => setCrayonsTask('shorts')}
              className={`p-3 rounded-xl border text-left transition-all ${crayonsTask === 'shorts' ? 'bg-white text-black font-bold' : 'bg-zinc-950 text-zinc-400 border-white/10'}`}
            >
              1-Click 9:16 Viral Shorts Script
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={crayonsPrompt}
              onChange={(e) => setCrayonsPrompt(e.target.value)}
              placeholder="Enter film title or script premise..."
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
            <button
              onClick={handleRunCrayonsBridgeAI}
              disabled={isCrayonsRunning}
              className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              {isCrayonsRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Ask Crayons Bridge AI</span>
            </button>
          </div>

          {crayonsResponse && (
            <div className="p-4 bg-zinc-950 rounded-xl border border-white/10 font-mono text-xs text-zinc-200 space-y-2">
              <span className="text-white font-bold block">{crayonsResponse.engine}</span>
              <pre className="text-zinc-300 text-[11px] whitespace-pre-wrap leading-relaxed">{crayonsResponse.result}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Agent Selector Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white uppercase font-mono">Heavy Rendering AI Pipeline</h2>

          <div 
            onClick={() => setSelectedAgent('dubbing')}
            className={`glass-card p-4 rounded-xl cursor-pointer border transition-all ${selectedAgent === 'dubbing' ? 'border-white bg-zinc-900' : 'border-white/10'}`}
          >
            <h3 className="font-bold text-white text-sm">1. AI Dubbing & Voice Clone</h3>
          </div>

          <div 
            onClick={() => setSelectedAgent('stereoscopic_3d')}
            className={`glass-card p-4 rounded-xl cursor-pointer border transition-all ${selectedAgent === 'stereoscopic_3d' ? 'border-white bg-zinc-900' : 'border-white/10'}`}
          >
            <h3 className="font-bold text-white text-sm">2. AI 2D-to-3D Spatial Converter</h3>
          </div>

          <div 
            onClick={() => setSelectedAgent('cartoon')}
            className={`glass-card p-4 rounded-xl cursor-pointer border transition-all ${selectedAgent === 'cartoon' ? 'border-white bg-zinc-900' : 'border-white/10'}`}
          >
            <h3 className="font-bold text-white text-sm">3. AI Cartoon & Anime Stylizer</h3>
          </div>
        </div>

        {/* Execution Area */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6 border border-white/10">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white">
              {selectedAgent === 'dubbing' && 'AI Multi-Lingual Dubbing'}
              {selectedAgent === 'stereoscopic_3d' && 'AI 2D-to-3D Spatial Video Conversion'}
              {selectedAgent === 'cartoon' && 'AI Anime & Cartoon Render Pipeline'}
            </h3>

            <button
              onClick={handleRunAgent}
              disabled={isProcessingAgent}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold shadow-lg transition-all"
            >
              {isProcessingAgent ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Execute Render</span>
            </button>
          </div>

          {agentOutput && (
            <div className="p-4 bg-zinc-950 rounded-xl border border-white/10 font-mono text-xs space-y-1">
              <span className="text-white font-bold">✓ {agentOutput.type} COMPLETED</span>
              <p className="text-zinc-400">Status: <strong className="text-white">{agentOutput.status}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
