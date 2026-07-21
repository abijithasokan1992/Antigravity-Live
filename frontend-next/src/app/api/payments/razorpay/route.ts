import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', productName } = body;

    // Simulate Razorpay Order Creation (or connect live RZR_KEY_ID)
    const razorpayOrder = {
      id: `order_${Math.random().toString(36).substring(2, 12)}`,
      entity: 'order',
      amount: amount * 100, // Amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: currency,
      receipt: `rcpt_${Date.now()}`,
      status: 'created',
      productName: productName || 'StreamVista Item',
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_StreamVista2026'
    };

    return NextResponse.json({
      status: 'success',
      order: razorpayOrder
    });
  } catch (error) {
    return NextResponse.json({ error: 'Razorpay order creation failed' }, { status: 400 });
  }
}
