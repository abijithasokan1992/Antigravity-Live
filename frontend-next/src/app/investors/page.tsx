'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Building2, 
  Film, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  CreditCard, 
  Users,
  Briefcase
} from 'lucide-react';

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState<'platform' | 'projects'>('platform');
  const [investmentAmount, setInvestmentAmount] = useState('1000000'); // ₹10,00,000

  // Calculate projected 3-year return
  const roiMultiplier = 1.38; // 38% projected ROI across catalog yield
  const projectedReturn = Math.round(Number(investmentAmount) * roiMultiplier);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <span>Crayons Capital • Enterprise & Project Investor Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Investor Portal & Slate Co-Investment</h1>
          <p className="text-slate-400 text-sm">Invest in the StreamVista Platform OS equity or co-finance high-yield film slate portfolios.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
            PROJECTED IRR: 28.4%
          </span>
        </div>
      </div>

      {/* Mode Switcher: Platform Equity vs Film Slate Projects */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('platform')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'platform' 
              ? 'bg-emerald-600 text-white shadow-lg glow-green' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Platform Equity Investment (StreamVista OS)
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'projects' 
              ? 'bg-emerald-600 text-white shadow-lg glow-green' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Project Slate Co-Investment (Film Level)
        </button>
      </div>

      {/* TAB 1: Platform Equity Investment */}
      {activeTab === 'platform' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Platform Valuation</span>
              <h3 className="text-2xl font-black text-white">₹45,00,00,000</h3>
              <p className="text-xs text-emerald-400 font-mono">Series A Pre-Money</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Annual Distribution Yield</span>
              <h3 className="text-2xl font-black text-emerald-400">35% Commission</h3>
              <p className="text-xs text-slate-400 font-mono">Gross Licensing Fee Capture</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Catalog Growth</span>
              <h3 className="text-2xl font-black text-cyan-400">120+ Titles / Year</h3>
              <p className="text-xs text-slate-400 font-mono">Regional & International</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-emerald-400" />
              <span>Investment Return Calculator</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <label className="block text-xs font-mono text-slate-300">Enter Capital Investment (INR ₹)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400">Calculated over 3-year distribution licensing cycle with pre-sold OTT holdbacks.</p>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-right">
                <span className="text-xs text-slate-400 font-mono">Projected Total Return (3-Yr)</span>
                <h2 className="text-3xl font-black text-emerald-400 font-mono">₹{projectedReturn.toLocaleString('en-IN')}</h2>
                <span className="text-[10px] text-purple-300 font-mono block">+38% Net Capital Yield</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Project Slate Co-Investment */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Film Slate 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                    PRE-SOLD SATELLITE HOLDBACK
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Jananam 1947 Slate</h3>
                  <p className="text-xs text-slate-400">Award-winning regional drama co-investment pool.</p>
                </div>
                <strong className="text-emerald-400 font-mono text-base">26% IRR</strong>
              </div>

              <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Capital:</span>
                  <span className="text-white">₹1,50,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min. Share Ticket:</span>
                  <span className="text-cyan-300">₹5,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Profile:</span>
                  <span className="text-emerald-400 font-bold">LOW (Collateral Protected)</span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all">
                Participate in Jananam 1947 Slate (₹5L Unit)
              </button>
            </div>

            {/* Film Slate 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    FAST 24/7 ORIGINAL SLATE
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Crayons Loop FAST Originals</h3>
                  <p className="text-xs text-slate-400">Ad-supported programmatic revenue share slate.</p>
                </div>
                <strong className="text-emerald-400 font-mono text-base">32% IRR</strong>
              </div>

              <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Capital:</span>
                  <span className="text-white">₹2,00,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min. Share Ticket:</span>
                  <span className="text-cyan-300">₹10,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ad Split:</span>
                  <span className="text-purple-300 font-bold">50/50 SSAI Programmatic</span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all">
                Participate in FAST Original Slate (₹10L Unit)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
