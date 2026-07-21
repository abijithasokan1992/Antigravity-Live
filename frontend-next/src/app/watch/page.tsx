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

  const movies = [
    { id: 1, title: 'Jananam 1947', tag: '2x Kerala State Award Winner', duration: '1h 45m', rating: 'U', year: '2024', genre: 'Drama / Romance', desc: 'Two septuagenarians at a retirement home decide to get married and start a new life together, challenging societal norms.' },
    { id: 2, title: 'Kolumittayi', tag: 'State Award Winner', duration: '2h 05m', rating: 'U', year: '2023', genre: 'Family / Nostalgia', desc: 'A heart-warming story of innocence, childhood friendships, and nostalgic memories in rural Kerala.' },
    { id: 3, title: 'Civilian', tag: 'Festival Favorite', duration: '1h 19m', rating: 'UA', year: '2014', genre: 'Intense Drama', desc: 'A young man returning from military duty encounters confrontation and truth.' },
    { id: 4, title: 'Ali\'s Nature', tag: 'Top Rated', duration: '1h 27m', rating: 'U', year: '2021', genre: 'Drama / Mystery', desc: 'In a village where tradition and modernity meet, Ali upholds sacred fishing customs.' },
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
              CRAYONS EXCLUSIVE
            </span>
            <span className="text-zinc-400 flex items-center gap-1 font-bold">
              <Star className="h-3.5 w-3.5 fill-white text-white" />
              9.4 AUDIENCE SCORE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            Jananam 1947
          </h1>
          <p className="text-sm font-semibold text-zinc-400 font-mono">Pranayam Thudarunnu</p>

          <p className="text-zinc-300 text-xs md:text-sm line-clamp-3 leading-relaxed">
            Two septuagenarians at a retirement home decide to get married and start a new life together, challenging societal norms.
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

      {/* Movie Rows & Carousels */}
      <div className="space-y-8">
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase">Trending on Crayons Loop</h2>
            <span className="text-xs text-zinc-400 hover:text-white cursor-pointer">View All →</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {movies.map((m) => (
              <div 
                key={m.id}
                className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-white/30 group cursor-pointer transition-all shadow-xl"
              >
                <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-lg text-zinc-500">{m.title}</span>
                  <div className="absolute top-2 left-2 z-20">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono text-[9px] font-bold uppercase border border-white/10">
                      {m.tag}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-zinc-950 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.title}</span>
                    <span className="px-1 py-0.5 rounded border border-white/10 text-zinc-400 text-[10px]">{m.rating}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{m.desc}</p>
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
                <p className="text-xs text-zinc-400">Stream Format: HLS 1080p @ 25fps • -24 LKFS</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
