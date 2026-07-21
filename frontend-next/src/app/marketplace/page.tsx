'use client';

import { useState } from 'react';
import { 
  ShoppingBag, 
  Film, 
  Download, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  RefreshCw, 
  FileCheck, 
  Play, 
  Layers, 
  Sparkles, 
  Sliders, 
  Award,
  ArrowRight,
  UserCheck,
  CreditCard,
  Repeat,
  Tag,
  PenTool,
  Lock
} from 'lucide-react';

export default function MarketplacePage() {
  const [selectedFilm, setSelectedFilm] = useState('Jananam 1947');
  const [activeTab, setActiveTab] = useState<'deal' | 'docusign' | 'tagging' | 'legal' | 'qc' | 'delivery' | 'invoicing' | 'renewal'>('deal');

  // Deal Thread Messages
  const [messages, setMessages] = useState([
    { sender: 'Sun Network (Buyer)', text: 'We are interested in acquiring Satellite rights for IND territory for Jananam 1947.' },
    { sender: 'StreamVista Admin', text: 'Confirmed. Exclusive Satellite rights are available at ₹50,00,000 for 5 years.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Deal States
  const [dealStatus, setDealStatus] = useState('AGREEMENT_PENDING');
  const [isSigned, setIsSigned] = useState(false);
  const [docuSignCertificate, setDocuSignCertificate] = useState<string | null>(null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isRenewed, setIsRenewed] = useState(false);

  // AI Tagging State
  const [tagsExtracted, setTagsExtracted] = useState(true);

  const handleSendMsg = () => {
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'You (Buyer)', text: inputMsg }]);
    setInputMsg('');
  };

  const handleExecuteDocuSign = () => {
    setIsSigned(true);
    setDealStatus('FULLY_EXECUTED_LEGAL');
    setDocuSignCertificate("DOCUSIGN_CERT_889721 (SHA-256: 4f8892a9... | IP: 103.22.45.109 | Timestamp: 2026-07-22 01:33:45 UTC)");
  };

  const handleTriggerDelivery = () => {
    setIsDelivered(true);
    setDealStatus('ASSETS_DELIVERED');
  };

  const handleProcessPayment = () => {
    setIsPaid(true);
    setDealStatus('PAYMENT_SETTLED');
  };

  const handleRenewLicense = () => {
    setIsRenewed(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
            <span>Crayons Bridge • End-to-End Deal & Rights OS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Digital Deal Room & Rights Management</h1>
          <p className="text-slate-400 text-sm">Internal DocuSign e-Signatures, AI Metadata Tagging, Legal Chain-of-Title, QC, & Renewal Workflows.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
            STATUS: {dealStatus}
          </span>
        </div>
      </div>

      {/* 10-Stage Pipeline Lifecycle Stepper */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[1000px] text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>1. Curation</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Tag className="h-4 w-4 text-purple-400" />
            <span>2. AI Metadata</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>3. Legal Check</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>4. Technical QC</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <MessageSquare className="h-4 w-4" />
            <span>5. Negotiation</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className={`flex items-center gap-2 font-bold ${isSigned ? 'text-emerald-400' : 'text-slate-500'}`}>
            <PenTool className="h-4 w-4" />
            <span>6. Internal DocuSign</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className={`flex items-center gap-2 font-bold ${isDelivered ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Download className="h-4 w-4" />
            <span>7. Asset Delivery</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className={`flex items-center gap-2 font-bold ${isPaid ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CreditCard className="h-4 w-4" />
            <span>8. Payment & GST</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Curated Catalog List & Filters */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            <span>Curated Title Catalog</span>
          </h2>

          <div className="space-y-3">
            <div 
              onClick={() => setSelectedFilm('Jananam 1947')}
              className={`glass-card p-4 rounded-xl cursor-pointer border transition-all ${
                selectedFilm === 'Jananam 1947' 
                  ? 'border-purple-500 bg-purple-950/20 glow-cyan' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Jananam 1947</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">CURATED 98/100</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Two septuagenarians at a retirement home decide to get married and start a new life together.
              </p>
              <div className="flex gap-2 mt-3 text-[11px] text-purple-300 font-mono">
                <span>Malayalam</span> • <span>4K UHD</span> • <span>Censor U</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Integrated Deal Lifecycle Workstation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs font-semibold">
            <button 
              onClick={() => setActiveTab('deal')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'deal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Negotiation
            </button>
            <button 
              onClick={() => setActiveTab('docusign')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'docusign' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Internal DocuSign
            </button>
            <button 
              onClick={() => setActiveTab('tagging')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'tagging' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              AI Metadata Tagging
            </button>
            <button 
              onClick={() => setActiveTab('legal')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'legal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Legal & Chain-of-Title
            </button>
            <button 
              onClick={() => setActiveTab('invoicing')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'invoicing' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              GST Invoicing
            </button>
          </div>

          {/* TAB 1: Negotiation */}
          {activeTab === 'deal' && (
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase">Active Licensing Negotiation</span>
                  <h2 className="text-2xl font-black text-white">{selectedFilm} Pranayam Thudarunnu</h2>
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                {messages.map((m, i) => (
                  <div key={i} className="space-y-1">
                    <span className="font-bold text-cyan-400 font-mono">{m.sender}:</span>
                    <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Internal DocuSign Engine */}
          {activeTab === 'docusign' && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 space-y-5 glow-green">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-emerald-400" />
                  <span>Internal DocuSign Legal e-Signature Engine</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">AES-256 ENCRYPTED SEAL</span>
              </div>

              {!isSigned ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                    <p className="font-bold text-white">Legal Declaration & E-Signature Confirmation</p>
                    <p className="text-slate-400">
                      By executing this internal DocuSign signature, you legally bind Licensor and Licensee under standard entertainment licensing law for ₹50,00,000.
                    </p>
                  </div>

                  <button
                    onClick={handleExecuteDocuSign}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs shadow-xl glow-green transition-all flex items-center justify-center gap-2"
                  >
                    <PenTool className="h-4 w-4" />
                    <span>Execute DocuSign Legal Signature (₹50,00,000)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2 text-xs font-mono text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <strong className="text-white text-sm">AGREEMENT FULLY EXECUTED & LEGALLY BINDING</strong>
                    </div>
                    <p className="text-slate-300 text-[11px] pt-1">{docuSignCertificate}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI Automated Metadata Tagging */}
          {activeTab === 'tagging' && (
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-400" />
                <span>AI Automated Video & Audio Metadata Tagging</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">GENRE & SUB-GENRES</span>
                  <p className="text-cyan-300 font-bold">Malayalam, Senior Citizen Romance, Social Drama</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">MOOD & TONE</span>
                  <p className="text-purple-300 font-bold">Heartwarming, Emotional, Poignant, Inspiring</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">CAST AI ENTITIES</span>
                  <p className="text-emerald-400 font-bold">Kozhikode Narayanan Nair, K.P.A.C. Leela</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">CENSOR & CONTENT RATING</span>
                  <p className="text-amber-400 font-bold">Censor U (Suitable for All Audiences)</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Legal & Chain-of-Title */}
          {activeTab === 'legal' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-purple-400" />
                <span>Chain of Title Verification</span>
              </h3>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <strong className="text-white">Producer Copyright Ownership Deed</strong>
                <span className="text-emerald-400 font-bold font-mono">VERIFIED</span>
              </div>
            </div>
          )}

          {/* TAB 5: GST Invoicing */}
          {activeTab === 'invoicing' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                <span>GST Tax Invoice Settlement</span>
              </h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-200">Total Invoice Amount (incl. 18% GST):</span>
                  <span className="text-emerald-400 font-black">₹59,00,000</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
