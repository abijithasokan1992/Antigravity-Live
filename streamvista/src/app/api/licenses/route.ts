import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod schema for request validation
const LicenseCreateSchema = z.object({
  organizationId: z.string().uuid(),
  issuedAt: z.string().optional(), // ISO date string
  expiresAt: z.string().optional(),
  notes: z.string().optional()
});

export async function GET() {
  const licenses = await prisma.license.findMany({
    include: { organization: { select: { id: true, legalName: true, displayName: true } } }
  });
  return NextResponse.json(licenses);
}

export async function POST(req: Request) {
  const json = await req.json();
  const parseResult = LicenseCreateSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid request', details: parseResult.error.format() }, { status: 400 });
  }
  const data = parseResult.data;
  // Enforce non‑sublicensable clause
  const license = await prisma.license.create({
    data: {
      organizationId: data.organizationId,
      issuedAt: data.issuedAt ? new Date(data.issuedAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      notes: data.notes,
      isSublicensable: false // business rule
    },
    include: { organization: { select: { id: true, legalName: true, displayName: true } } }
  });
  return NextResponse.json(license, { status: 201 });
}
