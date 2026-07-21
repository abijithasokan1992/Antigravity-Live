import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. MOCK BACKGROUND PROGRESSION
    // Every time this endpoint is polled, we'll advance some jobs to simulate real processing.
    
    // Find a RUNNING job to complete
    const runningJobs = await prisma.processingJob.findMany({
      where: { status: 'RUNNING' },
      take: 1
    });
    if (runningJobs.length > 0) {
      await prisma.processingJob.update({
        where: { id: runningJobs[0].id },
        data: { status: 'COMPLETED', progress: 100, completedAt: new Date() }
      });
      // Also update the associated MediaAsset to VERIFIED if it's the right job type
      if (runningJobs[0].jobType === 'METADATA_EXTRACTION') {
         await prisma.mediaAsset.update({
           where: { id: runningJobs[0].assetId },
           data: { status: 'VERIFIED' }
         });
      }
    }

    // Find a QUEUED job to start running
    const queuedJobs = await prisma.processingJob.findMany({
      where: { status: 'QUEUED' },
      take: 1
    });
    if (queuedJobs.length > 0) {
      await prisma.processingJob.update({
        where: { id: queuedJobs[0].id },
        data: { status: 'RUNNING', progress: 10, startedAt: new Date() }
      });
    }

    // 2. Fetch the updated queue
    const jobs = await prisma.processingJob.findMany({
      include: {
        asset: true,
        project: true,
      },
      orderBy: { queuedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
