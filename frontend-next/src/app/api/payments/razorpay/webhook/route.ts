import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers.get('x-razorpay-signature');

  if (!secret || !signature) {
    return NextResponse.json({ ok: false, error: 'Webhook is not configured' }, { status: 503 });
  }

  const rawBody = await req.text();
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Persist/order fulfillment can be attached here once the canonical production
  // order model is selected. Signature verification is intentionally fail-closed.
  return NextResponse.json({ ok: true, event: event.event || 'unknown' });
}
