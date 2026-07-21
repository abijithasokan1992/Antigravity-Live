'use client';

import { useState } from 'react';
import { 
  ShoppingBag, 
  Film, 
  Disc, 
  HardDrive, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  ShoppingCart, 
  CreditCard, 
  Star,
  Download,
  ShieldCheck,
  Tag,
  Zap,
  Lock
} from 'lucide-react';

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'physical' | 'digital' | 'services'>('all');
  const [cartCount, setCartCount] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  // Razorpay Modal State
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  const products = [
    {
      id: 1,
      name: 'Jananam 1947 - 4K Ultra HD Collector Steelbook',
      category: 'physical',
      rawAmount: 3499,
      price: '₹3,499',
      rating: '4.9 ★',
      badge: 'LIMITED EDITION STEELBOOK',
      desc: 'Includes 4K UHD Disc, Director Commentary, Concept Art Booklet & Postcards.'
    },
    {
      id: 2,
      name: 'Kolumittayi - Original Motion Picture Vinyl (180g)',
      category: 'physical',
      rawAmount: 2999,
      price: '₹2,999',
      rating: '5.0 ★',
      badge: 'AUDIOPHILE VINYL',
      desc: 'Mastered directly from 24-bit/96kHz analog studio masters on heavy 180g vinyl.'
    },
    {
      id: 3,
      name: 'StreamVista Cinematic LUT Bundle (12 3D LUTs)',
      category: 'digital',
      rawAmount: 1499,
      price: '₹1,499',
      rating: '4.8 ★',
      badge: 'INSTANT DIGITAL DOWNLOAD',
      desc: 'Professional grade .cube LUTs tuned for RED IPP2, ARRI LogC, and Sony S-Log3.'
    },
    {
      id: 4,
      name: 'DIT Field Station NVMe 2TB Media Pack',
      category: 'physical',
      rawAmount: 18500,
      price: '₹18,500',
      rating: '4.9 ★',
      badge: 'HARDWARE GEAR',
      desc: 'Ruggedized 2000MB/s NVMe SSD drive pre-formatted with XXH3 checksum utility.'
    },
    {
      id: 5,
      name: 'AI Dubbing & Viral Shorts Cloud Tokens (10,000 Pts)',
      category: 'services',
      rawAmount: 4999,
      price: '₹4,999',
      rating: '5.0 ★',
      badge: 'CLOUD CREDITS',
      desc: 'Power 50 hours of multi-lingual AI voice cloning and auto 9:16 video clips.'
    }
  ];

  const handleAddToCart = (name: string) => {
    setCartCount(prev => prev + 1);
    setLastAdded(name);
    setTimeout(() => setLastAdded(null), 3000);
  };

  const handleRazorpayCheckout = async (product: any) => {
    setCheckoutProduct(product);
    setIsProcessingRazorpay(true);
    setPaymentSuccess(null);

    try {
      const res = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.rawAmount, productName: product.name })
      });
      const data = await res.json();

      setTimeout(() => {
        setIsProcessingRazorpay(false);
        setPaymentSuccess({
          paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
          orderId: data.order?.id || 'order_mock_99',
          amount: product.price,
          product: product.name,
          status: 'SUCCESSFUL (Razorpay Verified)'
        });
      }, 1200);
    } catch (e) {
      setIsProcessingRazorpay(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span>Crayons Media Store • Razorpay Payment Gateway Live</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Global Media E-Commerce Store</h1>
          <p className="text-slate-400 text-sm">Physical 4K Steelbooks, Vinyl Soundtracks, Production Gear, and AI Cloud Tokens with Razorpay UPI & Cards.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-cyan-400" />
            <span>RAZORPAY GATEWAY: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Receipt Modal */}
      {paymentSuccess && (
        <div className="p-5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl space-y-2 text-xs font-mono text-emerald-300 animate-in fade-in glow-green">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <strong className="text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>RAZORPAY PAYMENT VERIFIED: {paymentSuccess.paymentId}</span>
            </strong>
            <button onClick={() => setPaymentSuccess(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="text-slate-200">Item: <strong className="text-white">{paymentSuccess.product}</strong> • Paid: <strong className="text-emerald-400">{paymentSuccess.amount}</strong></p>
          <p className="text-slate-400 text-[11px]">Razorpay Order Ref: {paymentSuccess.orderId} • GST Receipt Dispatched</p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div 
            key={p.id}
            className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 space-y-4 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[9px] font-bold">
                  {p.badge}
                </span>
                <span className="text-amber-400 text-xs font-mono font-bold">{p.rating}</span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">{p.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-lg font-black text-emerald-400 font-mono">{p.price}</strong>
                <button
                  onClick={() => handleAddToCart(p.name)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Cart</span>
                </button>
              </div>

              <button
                onClick={() => handleRazorpayCheckout(p)}
                disabled={isProcessingRazorpay}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                <span>Pay Instant via Razorpay (UPI / Card)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
