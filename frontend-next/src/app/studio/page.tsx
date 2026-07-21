'use client';

import { useState } from 'react';
import { 
  Building2, 
  Camera, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  Sparkles, 
  Tv, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  Video,
  Film,
  HardDrive,
  UserCheck,
  FileText,
  Boxes,
  Zap,
  Lock,
  ShoppingBag,
  ShieldAlert,
  Award,
  Tag,
  DollarSign
} from 'lucide-react';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'physical' | 'equipment' | 'storage' | 'disk_bank' | 'ip_register' | 'gear_marketplace'>('physical');

  const physicalStages = [
    { name: 'Soundstage A (Acoustic Main)', size: '10,000 sq ft', status: 'OCCUPIED (Jananam 1947)', booking: 'Until July 30, 2026', specs: 'Dolby Atmos-certified, 30ft Grid Height' },
    { name: 'Soundstage B (Virtual Production LED)', size: '6,500 sq ft', status: 'AVAILABLE', booking: 'Ready for Booking', specs: 'Unreal Engine 5.4 Live LED Volume (1.5mm Pixel Pitch)' },
    { name: 'Edit Suite 01 (HDR Color & Atmos)', size: '400 sq ft', status: 'IN USE', booking: 'Color Grading Session', specs: 'Sony BVM-HX310 Master Monitor + Atmos 7.1.4' },
  ];

  const gearMarketplace = [
    { name: 'RED V-Raptor 8K VV (Certified Pre-Owned)', condition: 'EXCELLENT (140 Hours)', price: '₹22,50,00,000', seller: 'Crayons Certified Vault', warranty: '1 Year Warranty Included' },
    { name: 'Cooke Anamorphic /i 50mm Prime (Pre-Owned)', condition: 'LIKE NEW', price: '₹8,40,00,000', seller: 'Studio Gear Resale', warranty: 'Certified Optics Check' },
    { name: 'Aputure 1200d Pro LED Light Unit', condition: 'GOOD', price: '₹2,10,00,000', seller: 'Production Surplus', warranty: '6 Months Warranty' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>Crayons Studios • Facilities, Storage & IP Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Physical & Digital Studio Ecosystem</h1>
          <p className="text-slate-400 text-sm">Physical soundstage bookings, Insured Hard Disk Vault, IP Registration, and 2nd-Hand Gear Marketplace.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
            INSURED VAULT SECURE
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('physical')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'physical' 
              ? 'bg-cyan-600 text-white shadow-lg glow-cyan' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Soundstages
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'equipment' 
              ? 'bg-cyan-600 text-white shadow-lg glow-cyan' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Gear RFID Tracking
        </button>
        <button
          onClick={() => setActiveTab('disk_bank')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'disk_bank' 
              ? 'bg-cyan-600 text-white shadow-lg glow-cyan' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          3. Insured Disk Bank
        </button>
        <button
          onClick={() => setActiveTab('ip_register')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'ip_register' 
              ? 'bg-cyan-600 text-white shadow-lg glow-cyan' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          4. IP Registration
        </button>
        <button
          onClick={() => setActiveTab('gear_marketplace')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'gear_marketplace' 
              ? 'bg-cyan-600 text-white shadow-lg glow-cyan' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          5. Gear Rentals & Resale
        </button>
      </div>

      {/* TAB 1: Physical Soundstages */}
      {activeTab === 'physical' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-400" />
            <span>Physical Soundstage & Edit Suite Bookings</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {physicalStages.map((s, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">{s.size}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    s.status.includes('AVAILABLE') 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base">{s.name}</h3>
                <p className="text-xs text-slate-400">{s.specs}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Insured Physical Hard Disk Bank Vault */}
      {activeTab === 'disk_bank' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-400" />
            <span>Insured Master Hard Disk & LTO-8 Physical Safe Bank</span>
          </h2>

          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 space-y-5 glow-green">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">INSURED PHYSICAL SAFE BANK</span>
                <h3 className="text-xl font-bold text-white">Vault Safe #04 (Climate Controlled 18°C, 40% RH)</h3>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs">
                INSURANCE COVERAGE: ₹5,00,00,000
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">VAULTED MASTER DISK</span>
                <p className="text-white font-bold text-sm">Jananam 1947 8K Master LTO-8 Tape</p>
                <span className="text-emerald-400 text-[10px] block">Insured Vault Slot B-12</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">BIOMETRIC CUSTODY LOG</span>
                <p className="text-cyan-300 font-bold text-sm">Strict Dual-Key Access Control</p>
                <span className="text-slate-400 text-[10px] block">Last Logged: 2026-07-22 01:10</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">FIRE & FLOOD PROOFING</span>
                <p className="text-purple-300 font-bold text-sm">Class 350-4 Hour Fire Rating</p>
                <span className="text-emerald-400 text-[10px] block">FM-200 Gas Suppression</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IP Rights Registration Engine */}
      {activeTab === 'ip_register' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            <span>IP Rights & Copyright Official Registration Engine</span>
          </h2>

          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
            <div className="space-y-3 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <strong className="text-white text-sm">Official Copyright Registration (Class 9 / 41)</strong>
                  <p className="text-slate-400 text-[11px]">Government IP registry serial & title deed.</p>
                </div>
                <span className="text-emerald-400 font-bold">REGISTRATION #CR-2026-IND-9941</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <strong className="text-white text-sm">Screenplay WGA / FWA Registration</strong>
                  <p className="text-slate-400 text-[11px]">Film Writers Association script timestamp seal.</p>
                </div>
                <span className="text-cyan-300 font-bold font-mono">FWA #884920-REG</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Gear Rentals & 2nd-Hand Equipment Marketplace */}
      {activeTab === 'gear_marketplace' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
            <span>Camera Gear Rentals & Certified 2nd-Hand Resale Marketplace</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {gearMarketplace.map((g, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] font-bold">
                    {g.condition}
                  </span>
                  <strong className="text-emerald-400 font-mono text-base">{g.price}</strong>
                </div>

                <h3 className="font-bold text-white text-base">{g.name}</h3>
                <p className="text-xs text-slate-400">{g.seller} • {g.warranty}</p>

                <button className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all">
                  Buy / Rent Certified Equipment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
