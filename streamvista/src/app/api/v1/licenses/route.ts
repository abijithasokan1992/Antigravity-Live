import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { licenseSchema, type LicenseInput } from '@/schemas/license';

type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function POST(req: Request) {
  const idempotencyKey = req.headers.get('Idempotency-Key');
  if (!idempotencyKey) {
    return NextResponse.json<ActionResponse<null>>(
      { success: false, error: 'Missing Idempotency-Key header' },
      { status: 400 }
    );
  }

  const json = await req.json();
  const result = licenseSchema.safeParse(json);
  if (!result.success) {
    const fieldErrors = result.error.format();
    return NextResponse.json<ActionResponse<null>>(
      {
        success: false,
        error: 'Validation failed',
        fieldErrors: Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v._errors])
        ),
      },
      { status: 422 }
    );
  }
  const data: LicenseInput = result.data;

  const existing = await prisma.license.findFirst({
    where: { projectId: data.projectId, userId: data.userId },
  });
  if (existing) {
    return NextResponse.json<ActionResponse<typeof existing>>({
      success: true,
      data: existing,
      message: 'License already exists (idempotent response)',
    });
  }

  try {
    const license = await prisma.$transaction(async (tx) => {
      return await tx.license.create({
        data: {
          projectId: data.projectId,
          userId: data.userId,
          terms: data.terms,
        },
      });
    });
    return NextResponse.json<ActionResponse<typeof license>>({
      success: true,
      data: license,
      message: 'License created successfully',
    });
  } catch (e) {
    console.error('License creation error', e);
    return NextResponse.json<ActionResponse<null>>(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}
