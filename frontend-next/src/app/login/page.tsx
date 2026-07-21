'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, LogIn, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@crayonspictures.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('Super Admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-cyan-500/30 glow-cyan">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-xl glow-cyan">
            <Film className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Unified Identity Sign In</h1>
          <p className="text-slate-400 text-xs font-mono">login.crayonspictures.com</p>
        </div>

        {isLoggedIn ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Identity Authenticated</h3>
            <p className="text-xs text-slate-300">
              Resolved Role: <strong className="text-emerald-400 font-mono">{role}</strong>
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="block w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all"
              >
                Proceed to Workspace Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Work Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Product Role Context</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Super Admin">Super Admin (Full Platform Access)</option>
                <option value="DIT">DIT / Ingest Specialist</option>
                <option value="Producer">Producer / Screening Room</option>
                <option value="Buyer">OTT Buyer / Licensing Partner</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Authenticate Session</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            Protected by Crayons Pictures Security Protocol. Tenant isolation enforced.
          </p>
        </div>
      </div>
    </div>
  );
}
