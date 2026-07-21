'use client';

import { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileCheck, 
  ShieldCheck, 
  RefreshCw, 
  HardDrive, 
  Globe, 
  Lock,
  Copy,
  Check,
  ShieldAlert,
  Cloud
} from 'lucide-react';

export default function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState('DELIV_001_SUN_TV');
  const [isCopied, setIsCopied] = useState(false);
  const [c2cStatus, setC2cStatus] = useState<string | null>(null);

  const deliveries = [
    {
      id: 'DELIV_001_SUN_TV',
      recipient: 'Sun TV Network (Satellite & OTT Team)',
      title: 'Jananam 1947',
      packageSize: '142.8 GB',
      format: 'ProRes 422 HQ + 5.1 Audio + SRT Subtitles',
      status: 'C2C_READY',
      bucketTarget: 's3://sun-network-ingest-prod/jananam_1947/',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'DELIV_002_TUBI_AVOD',
      recipient: 'Tubi TV Ingest Automation System',
      title: 'Kolumittayi',
      packageSize: '88.4 GB',
      format: 'H.264 High Profile + Stereo 2.0 + SRT',
      status: 'C2C_TRANSIT (84%)',
      bucketTarget: 's3://tubi-media-ingest-us/kolumittayi/',
      sha256: '8f434346648f6b96df89dda901c5176b10a6d0d829bf927a7c067e2a9a838541'
    }
  ];

  const current = deliveries.find(d => d.id === selectedDelivery) || deliveries[0];

  const handleTriggerC2CTransfer = () => {
    setC2cStatus("CLOUD-TO-CLOUD SYNC INITIATED: Aspera/S3 sync running from StreamVista R2 -> " + current.bucketTarget);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
            <span>StreamVista Asset Handoff & Master Security Law</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Master Delivery & Cloud-to-Cloud Hub</h1>
          <p className="text-zinc-400 text-sm">Strict Cloud-to-Cloud (C2C) Master Distribution Engine. Browser downloads blocked for 4K masters.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-mono font-bold">
            C2C MASTER SECURITY ENFORCED
          </span>
        </div>
      </div>

      {/* Security Law Warning Bar */}
      <div className="p-4 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-white" />
          <span className="text-zinc-300">
            <strong className="text-white">SECURITY RULE:</strong> Direct 4K master browser downloads are disabled by distribution law. In-studio watermarked proxies only. All master deliveries execute via Cloud-to-Cloud (C2C) S3 bucket transfers.
          </span>
        </div>
      </div>

      {/* Main Delivery Workspace */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Active Delivery List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cloud className="h-5 w-5 text-white" />
            <span>Active Master C2C Dispatches</span>
          </h2>

          <div className="space-y-3">
            {deliveries.map((d) => (
              <div
                key={d.id}
                onClick={() => { setSelectedDelivery(d.id); setC2cStatus(null); }}
                className={`glass-card p-4 rounded-xl cursor-pointer border transition-all space-y-2 ${
                  selectedDelivery === d.id 
                    ? 'border-white bg-zinc-900' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-400 font-bold">{d.id}</span>
                  <span className="px-2 py-0.5 rounded bg-white text-black text-[10px] font-mono font-bold">
                    {d.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base">{d.title}</h3>
                <p className="text-xs text-zinc-400">{d.recipient}</p>
                <p className="text-[11px] font-mono text-zinc-500 truncate">{d.bucketTarget}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: C2C Transfer Control & Manifest */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">C2C Manifest Target</span>
                <h2 className="text-2xl font-black text-white">{current.title}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Recipient: <span className="text-white font-bold">{current.recipient}</span></p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-white text-black font-mono font-bold text-xs">
                {current.status}
              </span>
            </div>

            {/* Cloud-to-Cloud Sync Action */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Cloud className="h-4 w-4 text-white" />
                  Target S3 Ingest Bucket
                </span>
                <span className="text-zinc-400">AWS S3 / Aspera Token Active</span>
              </div>

              <div className="p-2.5 bg-black rounded text-zinc-300 font-mono text-[11px] border border-white/10">
                {current.bucketTarget}
              </div>

              <button
                onClick={handleTriggerC2CTransfer}
                className="w-full py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Cloud className="h-4 w-4" />
                <span>Execute Cloud-to-Cloud (C2C) Master Sync (142.8 GB)</span>
              </button>

              {c2cStatus && (
                <div className="p-3 bg-zinc-900 border border-white/20 rounded-lg text-xs font-mono text-emerald-400">
                  {c2cStatus}
                </div>
              )}
            </div>

            {/* Verification Manifest */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-zinc-950 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500">FORMAT SPECIFICATION</span>
                <p className="text-white font-bold">{current.format}</p>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500">SHA-256 MASTER CHECKSUM</span>
                <p className="text-zinc-300 text-[11px] break-all">{current.sha256}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
