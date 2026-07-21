'use client';

import { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Search, 
  Globe, 
  Zap, 
  RefreshCw,
  XCircle,
  FileCheck
} from 'lucide-react';

export default function CompliancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [takedownSent, setTakedownSent] = useState(false);

  const piracyDetections = [
    { site: 't.me/MalayalamMoviesPirate (Telegram)', status: 'TAKEDOWN ISSUED', matchConfidence: '99.8%', IP: '185.220.101.4', date: '2026-07-22 01:20' },
    { site: 'illegal-iptv-streams.net', status: 'STREAM KILLED VIA DRM', matchConfidence: '100%', IP: '45.142.214.99', date: '2026-07-21 23:45' },
    { site: 'torrent-vault-hd.org', status: 'CEASE & DESIST SENT', matchConfidence: '97.4%', IP: '194.26.29.112', date: '2026-07-21 18:10' }
  ];

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleSendDmca = () => {
    setTakedownSent(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-red-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-widest">
            <span>StreamVista Legal Compliance & Anti-Piracy Shield</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Anti-Piracy & Unauthorized Usage Enforcement</h1>
          <p className="text-slate-400 text-sm">Automated web/Telegram piracy crawlers, 1-click DMCA takedowns, forensic DRM watermarking, and legal compliance tracking.</p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg transition-all disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Scanning Darkweb & Telegram...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Run Global Piracy Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: 3 Core Security Workstations */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Workstation 1: Forensic DRM & Watermarking */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-400" />
              <span>Forensic DRM Watermarking</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">WIDEVINE L1 ACTIVE</span>
          </div>

          <p className="text-xs text-slate-400">
            Invisible session-based forensic watermarking dynamically embeds viewer IP, user ID, and timestamp directly into video frames to trace leaks.
          </p>

          <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">DRM Standard:</span>
              <span className="text-white font-bold">Widevine + FairPlay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Forensic Watermark:</span>
              <span className="text-emerald-400 font-bold">INVISIBLY EMBEDDED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Viewer ID:</span>
              <span className="text-cyan-300">USER_99482_DELHI</span>
            </div>
          </div>
        </div>

        {/* Workstation 2: Automated Piracy Crawler */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-red-600/30 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span>Automated Piracy Crawler & Takedown Queue</span>
            </h3>
            <span className="text-[10px] font-mono text-red-400 font-bold">3 INFRACTIONS DETECTED</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="p-3">Detected Target / Host</th>
                  <th className="p-3">Match %</th>
                  <th className="p-3">Source IP</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {piracyDetections.map((p, idx) => (
                  <tr key={idx} className="bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-white">{p.site}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{p.matchConfidence}</td>
                    <td className="p-3 font-mono text-slate-400">{p.IP}</td>
                    <td className="p-3 text-red-400 font-mono font-bold">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!takedownSent ? (
            <button
              onClick={handleSendDmca}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>Issue Automated DMCA Takedowns & ISP Blocking Notices</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-mono">
              ✓ DMCA Takedown notices generated and transmitted to Cloudflare & Telegram Trust & Safety.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
