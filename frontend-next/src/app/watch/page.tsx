'use client';

import { useState } from 'react';
import { 
  Play, 
  Plus, 
  Info, 
  Volume2, 
  VolumeX, 
  Tv, 
  Radio, 
  Sparkles, 
  Star, 
  Clock, 
  Check, 
  Film,
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function WatchPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeMode, setActiveMode] = useState<'svod' | 'fast'>('svod');

  // Ingested JSON Database Film Catalog (5 Real Titles)
  const movies = [
    { 
      id: 7, 
      uuid: '58a6c2131e0a4ac9beaa8675df6db8e6', 
      title: 'Jananam 1947 Pranayam Thudarunnu (Malayalam)', 
      tag: '2x Kerala State Award Winner', 
      duration: '105m', 
      rating: 'U', 
      year: '2024', 
      s3Key: 'films/videos/58a6c213-1e0a-4ac9-beaa-8675df6db8e6/Reel_01.mp4', 
      desc: 'Directed & Produced by Abijith Asokan. Gowri and Shivan forge a touching tale of love during twilight years.' 
    },
    { 
      id: 36, 
      uuid: 'e68b3030a40140dea755c58478340efa', 
      title: 'Pranayam 1947 (Telugu Dubbed Master)', 
      tag: 'Telugu 5.1 & 2.0 Audio', 
      duration: '105m', 
      rating: 'U', 
      year: '2024', 
      s3Key: 'films/videos/e68b3030-a401-40de-a755-c58478340efa/PRANAYAM 1947_FULL MOVIE (TELUGU)_H.264  FINAL_5.1&2.0.mov', 
      desc: 'Telugu Dubbed Release of Jananam 1947. Full feature 5.1 Surround Sound.' 
    },
    { 
      id: 37, 
      uuid: '54a4bbedff044d21a3b756f973172b64', 
      title: 'Bahumukham (Lumexx Media 4K Master)', 
      tag: 'Telugu 4K Feature', 
      duration: '118m', 
      rating: 'U/A', 
      year: '2024', 
      s3Key: 'films/videos/54a4bbed-ff04-4d21-a3b7-56f973172b64/BAHUMUKHAM_LUMEXX_MEDIA_4K.mp4', 
      desc: 'Directed by Harshiv Karthik. High-octane psychological drama in 4K resolution.' 
    },
    { 
      id: 8, 
      uuid: '3c6ee2596bc64b6ebaf3153c1b5b20b5', 
      title: 'Civilian', 
      tag: 'Turkish Festival Feature', 
      duration: '79m', 
      rating: 'U/A', 
      year: '2014', 
      s3Key: 'films/videos/3c6ee259-6bc6-4b6e-baf3-153c1b5b20b5/Sivil _Textless.mp4', 
      desc: 'Directed by Levent Çetin. A young man returning from military duty encounters confrontation and truth.' 
    },
    { 
      id: 9, 
      uuid: 'baeb500d0f6e4558b7de459d9756edb7', 
      title: 'Ali\'s Nature', 
      tag: 'Turkish Drama', 
      duration: '87m', 
      rating: 'U', 
      year: '2021', 
      s3Key: 'films/videos/baeb500d-0f6e-4558-b7de-459d9756edb7/Ali\'s Nature_Textless.mp4', 
      desc: 'Directed by Levent Çetin. Ali is the last representative of traditional sacred fish customs.' 
    }
  ];

  return (
    <div className="space-y-10 font-sans pb-12 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Header Control */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-sm">
            CL
          </div>
          <div>
            <span className="font-bold text-base tracking-wider text-white uppercase">
              CRAYONS <span className="text-zinc-500">LOOP</span>
            </span>
          </div>
        </div>

        {/* Streaming Mode Switcher */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveMode('svod')}
            className={`px-4 py-1.5 rounded transition-all font-bold ${
              activeMode === 'svod' 
                ? 'bg-white text-black' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            On-Demand SVOD
          </button>
          <button
            onClick={() => setActiveMode('fast')}
            className={`px-4 py-1.5 rounded transition-all font-bold ${
              activeMode === 'fast' 
                ? 'bg-white text-black' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            24/7 FAST Network
          </button>
        </div>
      </div>

      {/* Hero Spotlight Billboard */}
      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 group-hover:scale-100" 
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop')` }} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-8 left-8 md:left-12 max-w-2xl space-y-4 z-10">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px] uppercase">
              INGESTED MASTER #7
            </span>
            <span className="text-zinc-400 flex items-center gap-1 font-bold">
              <Star className="h-3.5 w-3.5 fill-white text-white" />
              9.4 AUDIENCE SCORE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            Jananam 1947
          </h1>
          <p className="text-sm font-semibold text-zinc-400 font-mono">Pranayam Thudarunnu (Malayalam Master)</p>

          <p className="text-zinc-300 text-xs md:text-sm line-clamp-3 leading-relaxed">
            Directed & Produced by Abijith Asokan. Gowri and Shivan forge a touching tale of love during twilight years. S3: films/videos/58a6c213-1e0a-4ac9-beaa-8675df6db8e6/Reel_01.mp4
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all">
              <Play className="h-4 w-4 fill-black" />
              <span>Play Movie</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-bold text-xs border border-white/10 transition-all">
              <Plus className="h-4 w-4" />
              <span>My List</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3 font-mono text-xs">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="h-9 w-9 rounded bg-zinc-900 border border-white/10 text-white flex items-center justify-center"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <span className="px-3 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-400">
            4K UHD • DOLBY ATMOS
          </span>
        </div>
      </div>

      {/* Ingested JSON Catalog Grid */}
      <div className="space-y-8">
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase">Ingested Film Catalog (5 Real Titles from json_export)</h2>
            <span className="text-xs text-zinc-400">5 Active Ingested Records</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {movies.map((m) => (
              <div 
                key={m.id}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-white/30 group cursor-pointer transition-all shadow-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-white text-black font-mono text-[9px] font-bold uppercase">
                    ID: {m.id} • {m.tag}
                  </span>
                  <span className="text-zinc-400 text-xs font-mono">{m.duration}</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{m.title}</h3>
                  <p className="text-[11px] text-zinc-400 mt-1">{m.desc}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                  <span>UUID: {m.uuid.substring(0, 8)}...</span>
                  <span className="text-white font-bold">S3 VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24/7 FAST Linear Playout */}
        {activeMode === 'fast' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-white" />
                <h3 className="text-sm font-bold text-white">Crayons Loop 24/7 FAST Live Stream Channel 01</h3>
              </div>
              <span className="text-zinc-400 font-bold">SCTE-35 AD CUES ACTIVE</span>
            </div>

            <div className="aspect-video bg-black rounded-xl border border-white/10 relative flex items-center justify-center group overflow-hidden">
              <div className="text-center space-y-2 z-10 font-mono">
                <div className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-xl">
                  <Play className="h-6 w-6 fill-black ml-1" />
                </div>
                <h4 className="text-lg font-bold text-white">Jananam 1947 (Live Playout)</h4>
                <p className="text-xs text-zinc-400">S3 Key: films/videos/58a6c213-1e0a-4ac9-beaa-8675df6db8e6/Reel_01.mp4</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
