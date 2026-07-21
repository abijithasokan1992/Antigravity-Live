import React from 'react';
import { prisma } from '@/lib/prisma';
import UploadClient from '@/components/UploadClient';

export default async function ProjectIngestPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id }
  });

  if (!project) {
    return (
      <div style={{ padding: 'var(--spacing-10)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--status-error)' }}>Project Not Found</h1>
        <a href="/" className="btn btn-secondary" style={{ marginTop: 'var(--spacing-4)' }}>Return Home</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: 'var(--spacing-4) var(--spacing-6)', 
        backgroundColor: 'var(--bg-surface)', 
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <a href="/" style={{ color: 'var(--text-muted)' }}>&larr; Back to Projects</a>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {project.title} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>| Ingest Station</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--status-success)' }}>● System Online</span>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--spacing-8) 0', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', width: '100%' }}>
        
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--spacing-1)' }}>ACTIVE SHOOT DAY</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Day 01 - Main Unit</h2>
          </div>
          <button className="btn btn-secondary">+ New Shoot Day</button>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
          {/* Resumable Upload Drag & Drop Client */}
          <UploadClient projectId={project.id} />
        </div>

      </main>
    </div>
  );
}
