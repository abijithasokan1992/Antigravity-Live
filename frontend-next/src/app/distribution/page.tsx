'use client';

import { useState } from 'react';
import { 
  Globe, 
  Tv, 
  Film, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Send, 
  Sparkles, 
  Sliders,
  Layers,
  FileCheck
} from 'lucide-react';

export default function DistributionPage() {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'Amazon Prime Video', 'Tubi TV', 'Apple TV', 'Samsung TV Plus', 'Plex'
  ]);

  const channels = [
    { name: 'Amazon Prime Video', type: 'SVOD / TVOD', spec: 'Amazon Mezzanine (ProRes 422)', status: 'ACTIVE', reach: '200M+ Viewers' },
    { name: 'Tubi TV', type: 'AVOD', spec: 'Standard H.264 / 1080p', status: 'ACTIVE', reach: '74M+ Viewers' },
    { name: 'Apple TV', type: 'TVOD', spec: 'ProRes 422 HQ / 4K UHD', status: 'ACTIVE', reach: '100M+ Viewers' },
    { name: 'Samsung TV Plus', type: 'FAST Channel', spec: 'HLS .m3u8 / SCTE-35 SSAI', status: 'LIVE FAST FEED', reach: '50M+ Smart TVs' },
    { name: 'Plex', type: 'AVOD / FAST', spec: 'Standard MP4 / 5.1 Surround', status: 'ACTIVE', reach: '25M+ Viewers' },
    { name: 'Roku Channel', type: 'AVOD / FAST', spec: 'H.264 / XMLTV EPG', status: 'IN REVIEW', reach: '70M+ Devices' },
    { name: 'Pluto TV', type: 'FAST Channel', spec: 'HLS / SCTE-35', status: 'READY FOR DISPATCH', reach: '80M+ Viewers' },
    { name: 'Google TV', type: 'TVOD / SVOD', spec: 'Standard MP4 / Subtitles', status: 'ACTIVE', reach: '150M+ Devices' },
  ];

  const toggleChannel = (name: string) => {
    if (selectedChannels.includes(name)) {
      setSelectedChannels(selectedChannels.filter(c => c !== name));
    } else {
      setSelectedChannels([...selectedChannels, name]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>StreamVista Multiplatform Syndication</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Global Channel Syndication Hub</h1>
          <p className="text-slate-400 text-sm">One-click automated distribution to 100+ OTT, AVOD, SVOD, and FAST platforms worldwide.</p>
        </div>

        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg glow-cyan transition-all">
          <Send className="h-4 w-4" />
          <span>Dispatch Deliverables to Selected Channels ({selectedChannels.length})</span>
        </button>
      </div>

      {/* Distribution Channel Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            <span>Target Distribution Networks ({channels.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">StreamVista Universal Spec Presets</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {channels.map((c, i) => {
            const isSelected = selectedChannels.includes(c.name);
            return (
              <div
                key={i}
                onClick={() => toggleChannel(c.name)}
                className={`glass-card p-5 rounded-2xl cursor-pointer border transition-all space-y-3 ${
                  isSelected 
                    ? 'border-cyan-500 bg-cyan-950/20 glow-cyan' 
                    : 'border-slate-800 hover:border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">{c.type}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 accent-cyan-500 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{c.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{c.reach}</p>
                </div>

                <div className="p-2 bg-slate-950/80 rounded-lg text-[10px] font-mono text-slate-300 border border-slate-800">
                  <span className="text-slate-500 block">Spec Preset:</span>
                  {c.spec}
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-mono font-bold ${
                    c.status.includes('ACTIVE') || c.status.includes('LIVE') ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filmhub Asset Ingest & QC Pipeline Status */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Title Master Package Status */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Film className="h-5 w-5 text-purple-400" />
            <span>Title Package QC Compliance (Jananam 1947)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Video Master</span>
              <strong className="text-emerald-400 font-mono flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                ProRes 422 HQ (Passed)
              </strong>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Audio Tracks</span>
              <strong className="text-emerald-400 font-mono flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                5.1 Surround + Stereo
              </strong>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Subtitles</span>
              <strong className="text-emerald-400 font-mono flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                English .SRT (Synced)
              </strong>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Key Art (16:9 / 2:3)</span>
              <strong className="text-emerald-400 font-mono flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                3840x2160 (Passed)
              </strong>
            </div>
          </div>

          <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs space-y-1">
            <span className="font-mono text-purple-400 font-bold uppercase">Automated Manifest Generation</span>
            <p className="text-slate-300">
              Generating channel-specific manifests: <strong>SKU_JANANAM_AMAZONMEZZ</strong>, <strong>SKU_JANANAM_TUBI_H264</strong>, and <strong>SKU_JANANAM_APPLE_PRORES</strong>.
            </p>
          </div>
        </div>

        {/* Right 1 Column: Multiplatform Revenue Analytics */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span>Channel Revenue Share</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-slate-400">Tubi TV (AVOD)</p>
                <p className="text-base font-black text-emerald-400">₹3,40,000</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">80/20 Split</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-slate-400">Amazon Prime (SVOD)</p>
                <p className="text-base font-black text-emerald-400">₹5,20,000</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Fixed MG + Royalty</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-slate-400">Samsung TV Plus (FAST)</p>
                <p className="text-base font-black text-emerald-400">₹2,10,000</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">50/50 SSAI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
