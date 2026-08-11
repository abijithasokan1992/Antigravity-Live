import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || '').trim();
    const app = String(body?.app || 'video');
    const rightsConfirmed = Boolean(body?.rightsConfirmed);

    if (!prompt) return NextResponse.json({ ok: false, error: 'Prompt is required' }, { status: 400 });
    if (!rightsConfirmed) return NextResponse.json({ ok: false, error: 'Processing rights must be confirmed' }, { status: 403 });

    const providerUrl = process.env.VIDEO_PROVIDER_URL;
    const providerKey = process.env.VIDEO_PROVIDER_API_KEY;

    if (providerUrl && providerKey && app === 'video') {
      const providerResponse = await fetch(providerUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${providerKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, source: 'streamvista-muse', app }),
        cache: 'no-store',
      });
      const providerData = await providerResponse.json().catch(() => ({}));
      if (!providerResponse.ok) {
        return NextResponse.json({ ok: false, error: providerData?.error || 'Video provider rejected the request' }, { status: 502 });
      }
      return NextResponse.json({ ok: true, mode: 'provider', jobId: providerData.id || `job_${Date.now()}`, provider: providerData });
    }

    return NextResponse.json({
      ok: true,
      mode: 'browser-demo',
      jobId: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'ready',
      message: 'Demo render ready. The browser will render a real playable preview video locally.',
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Studio run request failed' }, { status: 500 });
  }
}
