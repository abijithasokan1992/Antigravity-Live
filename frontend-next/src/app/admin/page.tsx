'use client';

import { useState } from 'react';
import { 
  Users, 
  Building2, 
  ShoppingBag, 
  Film, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Database,
  Globe,
  Radio,
  Tv,
  Music,
  Tag,
  ShieldCheck
} from 'lucide-react';

export default function AdminPage() {
  const [unstructuredText, setUnstructuredText] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAIParse = () => {
    if (!unstructuredText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      setParsedData({
        title: "Jananam 1947 Pranayam Thudarunnu",
        language: "Malayalam",
        format: "Feature Film (4K UHD)",
        censor: "CBFC U (Universal Clearance)",
        logline: "Two septuagenarians at a retirement home decide to get married and start a new life together, challenging societal norms.",
        avails: [
          { territory: "WLD (Rest of World)", media: "SVOD (Non-Linear)", exclusivity: "Non-Exclusive", status: "Available", notes: "Excludes IND & AUS" },
          { territory: "IND (India)", media: "Satellite (Linear)", exclusivity: "Exclusive", status: "Available", notes: "Immediate Delivery" },
          { territory: "IND (India)", media: "AVOD (Non-Linear)", exclusivity: "Non-Exclusive", status: "Available", notes: "Clean Feed" },
          { territory: "WLD (Rest of World)", media: "FAST & IPTV (Linear)", exclusivity: "Non-Exclusive", status: "Syndicated", notes: "Crayons Loop Playout" },
          { territory: "GLOBAL", media: "Remake Rights (Ancillary)", exclusivity: "Exclusive", status: "Available", notes: "Script Adaptation Licensed" },
          { territory: "GLOBAL", media: "Multi-Lingual Dubbing", exclusivity: "Exclusive", status: "Cleared", notes: "Tamil, Tel, Hin, Eng Dubs" },
          { territory: "GLOBAL", media: "Music Sync & Publishing", exclusivity: "Non-Exclusive", status: "Cleared", notes: "PPL / IPRS Sync Cleared" },
          { territory: "GCC / Middle East", media: "Overseas Theatrical", exclusivity: "Exclusive", status: "Available", notes: "DCP Master Ready" }
        ],
        legalNotice: "NON-SUBLICENSABLE • NO RIGHT TO DELIVER TO NEXT PERSON"
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>Platform Owner Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Admin Control & 360-Degree Rights Matrix</h1>
          <p className="text-slate-400 text-sm font-sans">Linear, Non-Linear (AVOD/SVOD/TVOD), Ancillary, Remake, Overseas & Music Rights Management.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rights Engine: 100% Operational</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Creator Partners</p>
            <h3 className="text-3xl font-black text-white mt-1">83</h3>
            <span className="text-xs text-cyan-400 font-medium">Active Ingest Accounts</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Studio Partners</p>
            <h3 className="text-3xl font-black text-white mt-1">3</h3>
            <span className="text-xs text-purple-400 font-medium">DI Studios & Post Hubs</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Buyer Partners</p>
            <h3 className="text-3xl font-black text-white mt-1">9</h3>
            <span className="text-xs text-amber-400 font-medium">OTT & Broadcaster Networks</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Submitted Films</p>
            <h3 className="text-3xl font-black text-white mt-1">19</h3>
            <span className="text-xs text-emerald-400 font-medium">Catalog Masters Ready</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Film className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: AI Rights Engine + Financial Ledger */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: AI Rights Ingestion Engine */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">360-Degree Rights Matrix Extractor</h2>
                <p className="text-xs text-slate-400">Extracts Linear, Non-Linear, Dubbing, Remake, Music & Overseas Rights via AI.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Unstructured Deal & One-Sheet Text Box
            </label>
            <textarea
              value={unstructuredText}
              onChange={(e) => setUnstructuredText(e.target.value)}
              placeholder="Paste raw deal text here (e.g. TITLE: Jananam 1947, Linear/Non-Linear Rights, Dubbing, Remake, Music Sync)..."
              rows={5}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono transition-all"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => setUnstructuredText("TITLE: Jananam 1947\nRights Scope: SVOD, AVOD, FAST, Satellite, Remake, Multi-lingual Dubbing, Music Sync, GCC Overseas Theatrical\nCensor: CBFC U")}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                + Insert Full 360-Degree Rights Sample Text
              </button>

              <button
                onClick={handleAIParse}
                disabled={isProcessing || !unstructuredText}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Parsing Rights Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Extract 360-Degree Rights</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Parsed Output Result */}
          {parsedData && (
            <div className="space-y-4 bg-slate-900/90 border border-purple-500/30 rounded-xl p-5 glow-cyan animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase">Parsed 360-Degree Rights Matrix</span>
                  <h3 className="text-xl font-bold text-white">{parsedData.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  {parsedData.censor}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categorized Rights & Holdback Avails</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                      <tr>
                        <th className="p-2.5">Territory</th>
                        <th className="p-2.5">Rights Category</th>
                        <th className="p-2.5">Exclusivity</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {parsedData.avails.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-cyan-300">{item.territory}</td>
                          <td className="p-2.5 font-semibold text-white">{item.media}</td>
                          <td className="p-2.5">{item.exclusivity}</td>
                          <td className="p-2.5 text-emerald-400 font-semibold">{item.status}</td>
                          <td className="p-2.5 text-slate-400">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Financial Ledger */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <span>Financial Ledger & Payouts</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Total Gross Revenue</p>
                  <p className="text-lg font-black text-white">₹14,80,000</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono">+18% MoM</span>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Net Creator Balance</p>
                  <p className="text-lg font-black text-cyan-400">₹11,84,000</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">20% Dist. Cut</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
