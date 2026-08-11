import { NextResponse } from 'next/server';

const RAZORPAY_API = 'https://api.razorpay.com/v1/orders';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR', productName } = await req.json();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the production environment.' },
        { status: 503 },
      );
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const receipt = `sv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch(RAZORPAY_API, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt,
        notes: {
          product_name: String(productName || 'StreamVista Item').slice(0, 250),
          source: 'streamvista-antigravity',
        },
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.description || 'Razorpay order creation failed' },
        { status: response.status >= 400 && response.status < 500 ? response.status : 502 },
      );
    }

    return NextResponse.json({
      status: 'success',
      keyId,
      order: data,
    });
  } catch {
    return NextResponse.json({ error: 'Razorpay order creation failed' }, { status: 500 });
  }
}
