import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ verified: false, error: 'Missing payment verification fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ verified: false, error: 'Razorpay secret is not configured' }, { status: 503 });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verified = crypto.timingSafeEqual(
      Buffer.from(expected, 'utf8'),
      Buffer.from(String(signature), 'utf8'),
    );

    return NextResponse.json({ verified });
  } catch {
    return NextResponse.json({ verified: false, error: 'Payment verification failed' }, { status: 400 });
  }
}
