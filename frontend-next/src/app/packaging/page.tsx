'use client';

import { useState } from 'react';
import { 
  Video, 
  Film, 
  Tv, 
  Settings, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  FileCheck,
  Zap,
  HardDrive,
  Maximize2,
  Volume2
} from 'lucide-react';

export default function PackagingPage() {
  const [isProcessingDcp, setIsProcessingDcp] = useState(false);
  const [dcpStatus, setDcpStatus] = useState<string | null>(null);

  const [isYoutubeSyncing, setIsYoutubeSyncing] = useState(false);
  const [youtubeStatus, setYoutubeStatus] = useState<string | null>(null);

  const [isImaxConverting, setIsImaxConverting] = useState(false);
  const [imaxStatus, setImaxStatus] = useState<string | null>(null);

  const handleGenerateDCP = () => {
    setIsProcessingDcp(true);
    setTimeout(() => {
      setIsProcessingDcp(false);
      setDcpStatus("DCP_PACKAGE_GENERATED (DCI 4K JPEG 2000, 24fps, Unencrypted KDM)");
    }, 1200);
  };

  const handleYoutubePublish = () => {
    setIsYoutubeSyncing(true);
    setTimeout(() => {
      setIsYoutubeSyncing(false);
      setYoutubeStatus("YOUTUBE_CONTENT_ID_REGISTERED (Fingerprint Claimed & Ad Monetization Live)");
    }, 1200);
  };

  const handleImaxConversion = () => {
    setIsImaxConverting(true);
    setTimeout(() => {
      setIsImaxConverting(false);
      setImaxStatus("IMAX_ENHANCED_MASTER_GENERATED (1.90:1 Expanded Canvas + DTS:X 12.0 Audio)");
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>StreamVista Packaging & Transcoding Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Multi-Channel Packaging & IMAX Conversion Hub</h1>
          <p className="text-slate-400 text-sm">IMAX Enhanced & DMR conversion, YouTube Content ID/Ads, DCI Theater DCP, and OTT Transcoding.</p>
        </div>
      </div>

      {/* Grid: 4 Core Delivery Workstations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Workstation 1: IMAX Enhanced & DMR Conversion */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-amber-500/40 glow-amber flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Maximize2 className="h-5 w-5 text-amber-400" />
                <span>IMAX Conversion</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-400 font-bold">IMAX DMR 4K</span>
            </div>

            <p className="text-xs text-slate-400">
              Remaster feature films into IMAX 1.90:1 / 1.43:1 expanded aspect ratio canvas with IMAX Enhanced DTS:X 12.0 audio.
            </p>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Aspect Ratio:</span>
                <span className="text-amber-300 font-bold">1.90:1 Expanded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audio Master:</span>
                <span className="text-purple-300 font-bold">DTS:X 12.0 Audio</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DMR De-Noising:</span>
                <span className="text-emerald-400 font-bold">IMAX TUNED</span>
              </div>
            </div>
          </div>

          {imaxStatus ? (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono">
              ✓ {imaxStatus}
            </div>
          ) : (
            <button
              onClick={handleImaxConversion}
              disabled={isImaxConverting}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isImaxConverting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Maximize2 className="h-4 w-4" />}
              <span>Convert to IMAX Enhanced Master</span>
            </button>
          )}
        </div>

        {/* Workstation 2: YouTube Integration & Content ID */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-red-600/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-red-500" />
                <span>YouTube & Content ID</span>
              </h3>
              <span className="text-[10px] font-mono text-red-400">PARTNER API</span>
            </div>

            <p className="text-xs text-slate-400">
              Auto-publish trailers or full movies to YouTube Movies, apply Content ID fingerprinting, and claim ad revenue.
            </p>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Content ID Claim:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fingerprint Hash:</span>
                <span className="text-cyan-300">YT_CID_JANANAM_99</span>
              </div>
            </div>
          </div>

          {youtubeStatus ? (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono">
              ✓ {youtubeStatus}
            </div>
          ) : (
            <button
              onClick={handleYoutubePublish}
              disabled={isYoutubeSyncing}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isYoutubeSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
              <span>Sync Content ID & Launch Ads</span>
            </button>
          )}
        </div>

        {/* Workstation 3: DCI Theater DCP Packaging */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-purple-500/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Film className="h-5 w-5 text-purple-400" />
                <span>DCP Theater Delivery</span>
              </h3>
              <span className="text-[10px] font-mono text-purple-400">DCI COMPLIANT</span>
            </div>

            <p className="text-xs text-slate-400">
              Generate Digital Cinema Packages (DCP): JPEG 2000 4K, 24fps, XYZ color space, and SMPTE subtitles.
            </p>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Container:</span>
                <span className="text-white">DCI MXF Wrapper</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Picture Codec:</span>
                <span className="text-cyan-300">JPEG 2000 (250 Mbps)</span>
              </div>
            </div>
          </div>

          {dcpStatus ? (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono">
              ✓ {dcpStatus}
            </div>
          ) : (
            <button
              onClick={handleGenerateDCP}
              disabled={isProcessingDcp}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessingDcp ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate 4K Theatrical DCP</span>
            </button>
          )}
        </div>

        {/* Workstation 4: Automated OTT Conversions */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-cyan-500/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Tv className="h-5 w-5 text-cyan-400" />
                <span>OTT Transcoding Matrix</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">AUTO CONVERT</span>
            </div>

            <p className="text-xs text-slate-400">
              Convert masters to Apple HLS, MPEG-DASH, ProRes 422 HQ, and Interoperable Master Format (IMF).
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-300">Apple HLS .m3u8</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-300">IMF Master Package</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            <span>Batch Export OTT Profiles</span>
          </button>
        </div>
      </div>
    </div>
  );
}
