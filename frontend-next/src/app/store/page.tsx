'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Film,
  Disc,
  HardDrive,
  CheckCircle2,
  ShoppingCart,
  CreditCard,
  Zap,
  AlertTriangle,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: 'physical' | 'digital' | 'services';
  rawAmount: number;
  price: string;
  rating: string;
  badge: string;
  desc: string;
};

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export default function StorePage() {
  const [cartCount, setCartCount] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ ok: boolean; paymentId?: string; orderId?: string; product?: string; amount?: string; message?: string } | null>(null);

  const products: Product[] = [
    { id: 1, name: 'Jananam 1947 - 4K Ultra HD Collector Steelbook', category: 'physical', rawAmount: 3499, price: '₹3,499', rating: '4.9 ★', badge: 'LIMITED EDITION STEELBOOK', desc: 'Includes 4K UHD Disc, Director Commentary, Concept Art Booklet & Postcards.' },
    { id: 2, name: 'Kolumittayi - Original Motion Picture Vinyl (180g)', category: 'physical', rawAmount: 2999, price: '₹2,999', rating: '5.0 ★', badge: 'AUDIOPHILE VINYL', desc: 'Mastered directly from 24-bit/96kHz analog studio masters on heavy 180g vinyl.' },
    { id: 3, name: 'StreamVista Cinematic LUT Bundle (12 3D LUTs)', category: 'digital', rawAmount: 1499, price: '₹1,499', rating: '4.8 ★', badge: 'INSTANT DIGITAL DOWNLOAD', desc: 'Professional grade .cube LUTs tuned for RED IPP2, ARRI LogC, and Sony S-Log3.' },
    { id: 4, name: 'DIT Field Station NVMe 2TB Media Pack', category: 'physical', rawAmount: 18500, price: '₹18,500', rating: '4.9 ★', badge: 'HARDWARE GEAR', desc: 'Ruggedized 2000MB/s NVMe SSD drive pre-formatted with XXH3 checksum utility.' },
    { id: 5, name: 'AI Dubbing & Viral Shorts Cloud Tokens (10,000 Pts)', category: 'services', rawAmount: 4999, price: '₹4,999', rating: '5.0 ★', badge: 'CLOUD CREDITS', desc: 'Power multilingual AI-assisted media workflows with operator review and rights gates.' },
  ];

  const handleAddToCart = (name: string) => {
    setCartCount((prev) => prev + 1);
    setLastAdded(name);
    setTimeout(() => setLastAdded(null), 3000);
  };

  const loadRazorpay = async () => {
    if (window.Razorpay) return true;
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Razorpay checkout failed to load')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay checkout failed to load'));
      document.body.appendChild(script);
    });
    return Boolean(window.Razorpay);
  };

  const handleRazorpayCheckout = async (product: Product) => {
    setIsProcessingRazorpay(true);
    setPaymentResult(null);

    try {
      const orderResponse = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.rawAmount, productName: product.name }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.order?.id || !orderData.keyId) {
        throw new Error(orderData.error || 'Unable to create a Razorpay order');
      }

      await loadRazorpay();
      if (!window.Razorpay) throw new Error('Razorpay checkout is unavailable');

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'StreamVista AI Digital Studio',
        description: product.name,
        order_id: orderData.order.id,
        theme: { color: '#7c3aed' },
        handler: async (response: RazorpaySuccess) => {
          const verifyResponse = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature }),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.verified) {
            setPaymentResult({ ok: false, message: 'Payment returned, but server verification failed. Do not treat the order as paid.' });
            setIsProcessingRazorpay(false);
            return;
          }
          setPaymentResult({ ok: true, paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id, product: product.name, amount: product.price });
          setIsProcessingRazorpay(false);
        },
        modal: { ondismiss: () => setIsProcessingRazorpay(false) },
      });

      razorpay.open();
    } catch (error) {
      setPaymentResult({ ok: false, message: error instanceof Error ? error.message : 'Payment could not be started' });
      setIsProcessingRazorpay(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest"><ShoppingBag className="h-4 w-4" /> StreamVista Media Store</div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Global Media E-Commerce Store</h1>
          <p className="text-slate-400 text-sm">Physical media, production assets and paid studio services with verified Razorpay checkout.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono font-bold text-xs flex items-center gap-2"><CreditCard className="h-4 w-4 text-cyan-400" /> REAL RAZORPAY CHECKOUT</div>
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs">Cart {cartCount}</div>
        </div>
      </div>

      {lastAdded && <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300">Added: <strong className="text-white">{lastAdded}</strong></div>}

      {paymentResult && (
        <div className={`p-5 rounded-2xl space-y-2 text-xs font-mono ${paymentResult.ok ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' : 'bg-amber-950/50 border border-amber-500/40 text-amber-200'}`}>
          <div className="flex items-center gap-2 font-bold text-white text-sm">{paymentResult.ok ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertTriangle className="h-5 w-5 text-amber-400" />}{paymentResult.ok ? 'RAZORPAY PAYMENT VERIFIED' : 'PAYMENT NOT VERIFIED'}</div>
          {paymentResult.ok ? <><p>Item: <strong>{paymentResult.product}</strong> · Paid: <strong>{paymentResult.amount}</strong></p><p className="text-slate-400 text-[11px]">Payment: {paymentResult.paymentId} · Order: {paymentResult.orderId}</p></> : <p>{paymentResult.message}</p>}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-violet-500/40 space-y-4 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl">
            <div className="space-y-3">
              <div className="flex justify-between items-start"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[9px] font-bold">{p.badge}</span><span className="text-amber-400 text-xs font-mono font-bold">{p.rating}</span></div>
              <h3 className="font-bold text-white text-base leading-snug">{p.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between"><strong className="text-lg font-black text-emerald-400 font-mono">{p.price}</strong><button onClick={() => handleAddToCart(p.name)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1"><ShoppingCart className="h-3.5 w-3.5" /> Cart</button></div>
              <button onClick={() => handleRazorpayCheckout(p)} disabled={isProcessingRazorpay} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"><Zap className="h-4 w-4 text-amber-300" />{isProcessingRazorpay ? 'Opening secure checkout…' : 'Pay securely with Razorpay'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
