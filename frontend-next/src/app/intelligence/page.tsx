'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  FileText, 
  DollarSign, 
  BrainCircuit, 
  Building, 
  Send, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  PieChart, 
  Briefcase,
  Users,
  ShieldCheck,
  Maximize2,
  Smile,
  Globe,
  Layers
} from 'lucide-react';

export default function IntelligencePage() {
  const [selectedLead, setSelectedLead] = useState<string>('Sun Network');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyOutput, setStrategyOutput] = useState<any>(null);

  const multiVersionRevenue = [
    { version: '4K Feature Master (Live-Action)', format: 'Theatrical DCP & SVOD', langs: 'Malayalam, Tamil, Hindi', revenue: '₹60,00,000', yield: '52% Share' },
    { version: 'AI 2D-to-3D Spatial Version', format: '3D Laser & Apple Vision Pro', langs: 'English, Global 3D', revenue: '₹28,00,000', yield: '24% Share' },
    { version: 'AI Cartoon / Anime Version', format: 'Kids FAST Channels & Web Toon', langs: 'Multi-Lingual Dubs', revenue: '₹18,00,000', yield: '16% Share' },
    { version: 'Shorts & Social Clips', format: '9:16 Vertical Monetization', langs: 'Auto-Subtitles', revenue: '₹9,00,000', yield: '8% Share' },
  ];

  const buyerLeads = [
    { name: 'Sun Network (Sun NXT / TV)', type: 'Broadcaster & OTT', intent: 'HIGH INTENT (Satellite / Digital)', budget: '₹45,00,000 - ₹60,00,000', contact: 'ellen.saira@sunnetwork.in' },
    { name: 'JioHotstar Regional', type: 'Enterprise OTT', intent: 'VERY HIGH (Malayalam SVOD)', budget: '₹75,00,000 MG', contact: 'acquisitions@jiohotstar.com' },
    { name: 'Sainaf Infotainments', type: 'Regional Aggregator', intent: 'MEDIUM (AVOD & FAST)', budget: '50/50 Ad Share', contact: 'amal@sainafinfotainments.com' },
  ];

  const handleGenerateStrategy = () => {
    setIsGeneratingStrategy(true);
    setTimeout(() => {
      setIsGeneratingStrategy(false);
      setStrategyOutput({
        title: "Jananam 1947 Multi-Version Yield Strategy",
        optimalPackaging: "Multi-Format Versioning Window",
        recommendations: [
          { tier: "Phase 1 (Live Action 4K)", action: "Theatrical DCP & Sun TV Satellite", valuation: "₹60,00,000", window: "Day 1" },
          { tier: "Phase 2 (3D Spatial Version)", action: "Apple Vision Pro & 3D Theaters", valuation: "₹28,00,000", window: "+15 Days" },
          { tier: "Phase 3 (Cartoon Version)", action: "Kids FAST Channels & Web Toon", valuation: "₹18,00,000", window: "+45 Days" }
        ],
        projectedTotalRoi: "₹1,15,00,000 (115 Lakhs)"
      });
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <span>StreamVista Market Intelligence & Multi-Version Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Multi-Version Multi-Format Revenue Analytics</h1>
          <p className="text-slate-400 text-sm">Revenue breakdown across 4K Masters, 3D Spatial Versions, Animated Toon Versions, and Multi-Lingual Dubs.</p>
        </div>

        <button 
          onClick={handleGenerateStrategy}
          disabled={isGeneratingStrategy}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold shadow-lg glow-cyan transition-all disabled:opacity-50"
        >
          <BrainCircuit className="h-4 w-4" />
          <span>{isGeneratingStrategy ? 'Calculating Version Yield...' : 'Run Version Yield AI'}</span>
        </button>
      </div>

      {/* Multi-Version Revenue Breakdown Table */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 space-y-4 glow-green">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>Multi-Version & Multi-Format Revenue Matrix</span>
          </h2>
          <span className="text-xs font-mono text-emerald-300">TOTAL COMBINED YIELD: ₹1,15,00,000</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="p-3">Derivative Version</th>
                <th className="p-3">Target Format & Platform</th>
                <th className="p-3">Languages & Dubs</th>
                <th className="p-3">Gross Revenue</th>
                <th className="p-3">Share Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {multiVersionRevenue.map((v, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    {v.version.includes('3D') && <Maximize2 className="h-4 w-4 text-amber-400" />}
                    {v.version.includes('Cartoon') && <Smile className="h-4 w-4 text-purple-400" />}
                    {v.version.includes('4K') && <Layers className="h-4 w-4 text-cyan-400" />}
                    {v.version}
                  </td>
                  <td className="p-3 text-slate-300">{v.format}</td>
                  <td className="p-3 text-cyan-300">{v.langs}</td>
                  <td className="p-3 font-bold text-emerald-400 text-sm">{v.revenue}</td>
                  <td className="p-3 font-bold text-purple-300">{v.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
