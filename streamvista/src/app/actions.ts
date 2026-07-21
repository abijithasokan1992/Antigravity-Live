'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to get or create a mock default organization for prototyping
async function getDefaultOrganization() {
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        legalName: 'StreamVista Mock Studio',
        displayName: 'StreamVista Studio',
        organizationType: 'DI Studio',
      },
    });
  }
  return org;
}

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return { error: 'Project name is required' };

  const org = await getDefaultOrganization();

  await prisma.project.create({
    data: {
      title: name,
      internalCode: 'PRJ-' + Math.floor(Math.random() * 10000),
      productionType: 'FEATURE FILM',
      organizationId: org.id,
      status: 'DRAFT',
    },
  });

  revalidatePath('/');
}

export async function getProjects() {
  const org = await getDefaultOrganization();
  return prisma.project.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createShootDay(projectId: string, data: FormData) {
  return await prisma.shootDay.create({
    data: {
      projectId,
      dayNumber: parseInt(data.get('dayNumber') as string),
      shootDate: new Date(),
      location: data.get('location') as string,
    }
  });
}

export async function createMockIngestAndProcessing(projectId: string, fileName: string) {
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

  return asset.id;
}
