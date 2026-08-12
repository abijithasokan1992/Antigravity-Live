'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Film, LogIn, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? 'Unable to sign in');
        return;
      }

      router.replace('/studio');
      router.refresh();
    } catch {
      setError('Authentication service unavailable');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-white text-black flex items-center justify-center mx-auto">
            <Film className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in to StreamVista</h1>
          <p className="text-zinc-500 text-sm">Your access is resolved by the server from your stored identity and permissions.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block space-y-1.5 text-sm">
            <span className="text-zinc-300 font-medium">Work email</span>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3.5 text-zinc-600" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-white/40"
                required
              />
            </div>
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-zinc-300 font-medium">Password</span>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3.5 text-zinc-600" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-white/40"
                required
              />
            </div>
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-zinc-600">
          Roles cannot be selected on this screen. Access comes only from the canonical server policy.
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white">Return to StreamVista home</Link>
        </div>
      </div>
    </main>
  );
}
