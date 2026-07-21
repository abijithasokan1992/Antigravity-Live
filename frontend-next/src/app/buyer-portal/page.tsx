'use client';

import { useState } from 'react';
import { 
  ShoppingBag, 
  Film, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Tv, 
  Building2, 
  ArrowRight, 
  FileCheck, 
  Lock, 
  Eye, 
  DollarSign, 
  Globe, 
  ShieldCheck,
  Check,
  FileText,
  PenTool
} from 'lucide-react';

export default function BuyerPortalPage() {
  const [selectedBuyer, setSelectedBuyer] = useState<'sun' | 'hotstar' | 'tubi' | 'samsung'>('sun');
  const [contractGenerated, setContractGenerated] = useState(false);

  // Custom Negotiation Form Inputs
  const [customOfferFee, setCustomOfferFee] = useState('5000000');
  const [selectedTerritory, setSelectedTerritory] = useState('IND (India)');
  const [selectedTerm, setSelectedTerm] = useState('5 Years');
  const [isExclusive, setIsExclusive] = useState(true);

  const buyers = {
    sun: {
      name: 'Sun Network (Sun TV / Sun NXT)',
      type: 'Broadcaster & Regional OTT',
      rightsNeeded: 'Satellite (IND) & Regional Digital',
      budget: '₹45,00,000 - ₹60,00,000',
      mappedTitles: [
        { title: 'Jananam 1947', matchScore: '99% MATCH', reason: 'Malayalam + Satellite Exclusive Available + Award Winner', valuation: '₹50,00,000', status: 'READY TO LICENSE' },
        { title: 'Kolumittayi', matchScore: '94% MATCH', reason: 'Family Audience + Regional Broadcaster Fit', valuation: '₹25,00,000', status: 'READY TO LICENSE' },
      ]
    },
    hotstar: {
      name: 'JioHotstar Enterprise',
      type: 'SVOD Streaming Giant',
      rightsNeeded: 'Exclusive SVOD (IND + Global NRI)',
      budget: '₹75,00,000 MG',
      mappedTitles: [
        { title: 'Jananam 1947', matchScore: '97% MATCH', reason: 'High SVOD Completion Rate + Premium 4K Master', valuation: '₹40,00,000', status: 'READY TO LICENSE' },
      ]
    },
    tubi: {
      name: 'Tubi TV (Fox Corporation)',
      type: 'AVOD Streaming Platform',
      rightsNeeded: 'Non-Exclusive AVOD (WLD / North America)',
      budget: '80/20 Revenue Share',
      mappedTitles: [
        { title: 'Jananam 1947', matchScore: '92% MATCH', reason: 'Subtitles SRT Ready + ProRes 422 HQ Spec', valuation: 'Est. ₹15L/yr Ad Rev', status: 'AUTO DISPATCH READY' },
      ]
    },
    samsung: {
      name: 'Samsung TV Plus',
      type: 'Smart TV FAST OEM',
      rightsNeeded: '24/7 FAST Feed (Crayons Loop)',
      budget: '50/50 SSAI Split',
      mappedTitles: [
        { title: 'Crayons Loop Channel 01', matchScore: '100% MATCH', reason: 'Live SCTE-35 Ad Cues + XMLTV EPG Feed', valuation: '50/50 Ad Fill', status: 'LIVE SYNDICATED' },
      ]
    }
  };

  const current = buyers[selectedBuyer];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>Automated Buyer Choice & Rights Mapping Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Buyer Choice & Deal Negotiation Portal</h1>
          <p className="text-slate-400 text-sm">Interactive custom licensing forms, territory selection, and instant legal term sheet generation.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
            DEAL FORM ACTIVE
          </span>
        </div>
      </div>

      {/* Buyer Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(buyers) as Array<keyof typeof buyers>).map((key) => {
          const b = buyers[key];
          const isSelected = selectedBuyer === key;
          return (
            <div
              key={key}
              onClick={() => { setSelectedBuyer(key); setContractGenerated(false); }}
              className={`glass-card p-4 rounded-2xl cursor-pointer border transition-all space-y-2 ${
                isSelected 
                  ? 'border-cyan-500 bg-cyan-950/30 glow-cyan' 
                  : 'border-slate-800 hover:border-slate-700 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className={`h-5 w-5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
              </div>
              <h3 className="font-bold text-white text-sm">{b.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{b.type}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content: Mapped Titles & Interactive Offer Form */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Mapped Content Cards & Offer Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-cyan-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Filtered Buyer Rights Matrix</span>
                <h2 className="text-xl font-bold text-white">{current.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Target Scope: <span className="text-cyan-300 font-semibold">{current.rightsNeeded}</span> • Budget: <span className="text-emerald-400 font-mono font-bold">{current.budget}</span></p>
              </div>
            </div>

            {/* Title List */}
            <div className="space-y-4 pt-2">
              {current.mappedTitles.map((title, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                        {title.matchScore}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{title.title}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Valuation Offer</span>
                      <strong className="text-base font-black text-emerald-400 font-mono">{title.valuation}</strong>
                    </div>
                  </div>

                  {/* Interactive Custom Offer Negotiation Form */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-300 font-mono block uppercase">Customize Licensing Offer Parameters</span>
                    
                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 text-[10px] font-mono mb-1">Offer Fee (INR ₹)</label>
                        <input
                          type="number"
                          value={customOfferFee}
                          onChange={(e) => setCustomOfferFee(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[10px] font-mono mb-1">Territory Scope</label>
                        <select
                          value={selectedTerritory}
                          onChange={(e) => setSelectedTerritory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        >
                          <option value="IND (India)">IND (India Only)</option>
                          <option value="GCC (Middle East)">GCC (Middle East)</option>
                          <option value="WLD (Rest of World)">WLD (Rest of World)</option>
                          <option value="GLOBAL (Worldwide)">GLOBAL (Worldwide)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[10px] font-mono mb-1">License Term</label>
                        <select
                          value={selectedTerm}
                          onChange={(e) => setSelectedTerm(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        >
                          <option value="1 Year">1 Year</option>
                          <option value="3 Years">3 Years</option>
                          <option value="5 Years">5 Years</option>
                          <option value="Perpetual">Perpetual (Buyout)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-cyan-400 font-mono font-semibold">{title.status}</span>
                    <button
                      onClick={() => setContractGenerated(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg transition-all"
                    >
                      Generate Custom Term Sheet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Generated Contract Preview */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-400" />
              <span>Auto-Generated License Contract</span>
            </h3>

            {contractGenerated ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/40 space-y-3 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Licensor:</span>
                    <strong className="text-white">Crayons Pictures Union</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Licensee:</span>
                    <strong className="text-cyan-300">{current.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Territory / Term:</span>
                    <strong className="text-white">{selectedTerritory} • {selectedTerm}</strong>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-slate-300">Contract Value:</span>
                    <strong className="text-emerald-400 font-black">₹{parseInt(customOfferFee).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg glow-green transition-all flex items-center justify-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <span>Execute DocuSign Contract</span>
                </button>
              </div>
            ) : (
              <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-2">
                <Lock className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Fill in offer parameters and click "Generate Custom Term Sheet".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
