'use client';

import { useState } from 'react';
import { 
  Clapperboard, 
  CheckCircle, 
  Wifi, 
  Zap, 
  Gift
} from 'lucide-react';

export default function CreatorPage() {
  const [filmTitle, setFilmTitle] = useState('');
  const [licensingModel, setLicensingModel] = useState<'exclusive' | 'non_exclusive'>('exclusive');
  const [submissionSubmitted, setSubmissionSubmitted] = useState(false);

  const specialPackages = [
    {
      title: '9:16 Vertical Micro-Drama',
      target: 'Web Series',
      split: '80% Creator / 20% OS',
      perks: 'Episode micro-billing + Auto 9:16 AI Subtitles',
      badge: 'MICRO-DRAMA'
    },
    {
      title: 'Digital Creator Fast-Track',
      target: 'Social Creators',
      split: '75% Creator / 25% OS',
      perks: 'FAST channel playout + Content ID monetization',
      badge: 'CREATOR FAST-TRACK'
    },
    {
      title: 'Low-Budget Indie Grant',
      target: 'Films Under ₹25 Lakhs',
      split: '65% Creator / 35% OS',
      perks: 'Free Technical QC + Master Encoding',
      badge: 'INDIE GRANT'
    }
  ];

  const wirelessFeeds = [
    { camera: 'RED V-Raptor 8K (Cam A)', tech: 'RED Connect IP', fps: '24 FPS', latency: '12ms', status: 'LIVE C2C' },
    { camera: 'ARRI Alexa Mini LF (Cam B)', tech: 'ARRI WVT-1', fps: '24 FPS', latency: '15ms', status: 'LIVE C2C' },
    { camera: 'Sony Venice 2 (Cam C)', tech: 'Sony C3 Portal', fps: '24 FPS', latency: '18ms', status: 'LIVE C2C' },
    { camera: 'Blackmagic URSA 12K (Cam D)', tech: 'Blackmagic SRT', fps: '24 FPS', latency: '16ms', status: 'LIVE C2C' },
  ];

  const handleSubmitFilm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filmTitle.trim()) return;
    setSubmissionSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span>Creator Ingest & Micro-Drama Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Creator Submission & Ingest Hub</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-white text-black text-xs font-mono font-bold">
            CREATOR SYSTEM ACTIVE
          </span>
        </div>
      </div>

      {/* Support Packages Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase font-mono">Specialized Creator Support Packages</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {specialPackages.map((pkg, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/10 text-[9px] font-mono font-bold">
                  {pkg.badge}
                </span>
                <h3 className="font-bold text-white text-base leading-snug">{pkg.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">{pkg.target}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{pkg.perks}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <strong className="text-white font-mono text-xs font-bold">{pkg.split}</strong>
                <button className="px-3 py-1.5 rounded bg-white text-black font-bold text-xs">
                  Apply Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wireless Camera Feeds */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 font-mono text-xs">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Wifi className="h-4 w-4 text-white" />
            <span>On-Set Wireless Multi-Camera Feed (C2C Ingest)</span>
          </h2>
          <span className="text-zinc-500">TC 01:14:22:10</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {wirelessFeeds.map((feed, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-white text-black font-bold">{feed.status}</span>
                <span className="text-zinc-400">{feed.latency}</span>
              </div>
              <h3 className="font-bold text-white text-sm">{feed.camera}</h3>
              <p className="text-[11px] text-zinc-400 font-mono">{feed.tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Window */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <h2 className="text-xl font-bold text-white">Free Creator Submission Window</h2>

        {!submissionSubmitted ? (
          <form onSubmit={handleSubmitFilm} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Film / Micro-Drama Title</label>
                <input
                  type="text"
                  required
                  value={filmTitle}
                  onChange={(e) => setFilmTitle(e.target.value)}
                  placeholder="e.g. Jananam 1947"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Licensing Model</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLicensingModel('exclusive')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      licensingModel === 'exclusive' 
                        ? 'bg-white text-black border-white' 
                        : 'bg-zinc-950 border-white/10 text-zinc-400'
                    }`}
                  >
                    Exclusive
                  </button>
                  <button
                    type="button"
                    onClick={() => setLicensingModel('non_exclusive')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      licensingModel === 'non_exclusive' 
                        ? 'bg-white text-black border-white' 
                        : 'bg-zinc-950 border-white/10 text-zinc-400'
                    }`}
                  >
                    Non-Exclusive
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-lg transition-all"
            >
              Submit Project (65/35 Revenue Share)
            </button>
          </form>
        ) : (
          <div className="p-4 bg-zinc-900 border border-white/20 rounded-xl space-y-2 text-xs text-white font-mono">
            <strong className="text-white">SUBMISSION SUCCESSFUL: {filmTitle}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
