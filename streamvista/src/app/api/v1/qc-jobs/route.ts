import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Mock progression for QC jobs similar to processing jobs
    // Complete a RUNNING QC job
    const running = await prisma.qcJob.findMany({ where: { status: 'RUNNING' }, take: 1 });
    if (running.length) {
      await prisma.qcJob.update({
        where: { id: running[0].id },
        data: { status: 'COMPLETED', progress: 100, completedAt: new Date() },
      });
    }
    // Start a QUEUED QC job
    const queued = await prisma.qcJob.findMany({ where: { status: 'QUEUED' }, take: 1 });
    if (queued.length) {
      await prisma.qcJob.update({
        where: { id: queued[0].id },
        data: { status: 'RUNNING', progress: 10, startedAt: new Date() },
      });
    }
    const jobs = await prisma.qcJob.findMany({
      include: { asset: true, project: true },
      orderBy: { queuedAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
