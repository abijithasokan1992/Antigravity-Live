import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, fileName } = body;

    if (!projectId || !fileName) {
      return NextResponse.json({ error: 'Missing projectId or fileName' }, { status: 400 });
    }

    // 1. Create a mock MediaAsset
    const asset = await prisma.mediaAsset.create({
      data: {
        projectId: projectId,
        assetType: 'CAMERA_RAW',
        originalFilename: fileName,
        fileSize: BigInt(Math.floor(Math.random() * 10000000000)), // ~10GB mock
        status: 'VERIFIED',
      }
    });

    // 2. Create 3 Processing Jobs (Metadata, Proxy, Thumbnail)
    await prisma.processingJob.create({
      data: {
        projectId: projectId,
        assetId: asset.id,
        jobType: 'METADATA_EXTRACTION',
        status: 'COMPLETED',
        progress: 100,
      }
    });

    await prisma.processingJob.create({
      data: {
        projectId: projectId,
        assetId: asset.id,
        jobType: 'PROXY_GENERATION',
        status: 'RUNNING',
        progress: 45,
      }
    });

    await prisma.processingJob.create({
      data: {
        projectId: projectId,
        assetId: asset.id,
        jobType: 'THUMBNAIL_GENERATION',
        status: 'QUEUED',
        progress: 0,
      }
    });

    // 3. Create a mock QC Report
    await prisma.qcReport.create({
      data: {
        projectId: projectId,
        assetId: asset.id,
        overallStatus: Math.random() > 0.8 ? 'WARNING' : 'PASS',
        technicalStatus: 'PASS',
        visualStatus: 'AWAITING_REVIEW',
        deliveryStatus: 'PENDING',
        summary: 'Automated FFmpeg analysis complete. Waiting for visual review.'
      }
    });

    return NextResponse.json({ success: true, assetId: asset.id }, { status: 201 });

  } catch (error: any) {
    console.error('Ingest API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
