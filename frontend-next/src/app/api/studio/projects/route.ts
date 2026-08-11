import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || 'Hybrid Film Demo').trim();
    const app = String(body?.app || 'video');
    const prompt = String(body?.prompt || '').trim();
    if (!name || !prompt) return NextResponse.json({ ok: false, error: 'Project name and prompt are required' }, { status: 400 });

    return NextResponse.json({
      ok: true,
      project: {
        id: `proj_${Date.now()}`,
        name,
        app,
        prompt,
        savedAt: new Date().toISOString(),
        persistence: 'demo-session',
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Project save failed' }, { status: 500 });
  }
}
