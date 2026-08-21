import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-black text-white">Access denied</h1>
      <p className="mt-3 text-zinc-500">Your signed-in account does not have permission to open this area.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/studio" className="px-4 py-2 rounded-xl bg-white text-black font-bold">Open Studio</Link>
        <Link href="/" className="px-4 py-2 rounded-xl border border-white/10 text-white">Home</Link>
      </div>
    </main>
  );
}
