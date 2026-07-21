import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectHub({ params }: { params: { id: string } }) {
  const projectId = params.id;
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) notFound();

  // Fetch some summary data
  const assetCount = await prisma.mediaAsset.count({ where: { projectId } });
  
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
          <Link href="/" className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            &larr; Studio Dashboard
          </Link>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Project Hub: {project.title}
          </h1>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--spacing-8) 0' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
          
          {/* Quick Actions Panel */}
          <section className="glass-panel" style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <Link href={`/projects/${projectId}/ingest`}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Open DIT Ingest Station
                </button>
              </Link>
              <Link href={`/projects/${projectId}/media`}>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Browse Media Library
                </button>
              </Link>
            </div>
          </section>

          {/* Project Stats Panel */}
          <section className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Project Stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Assets</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{assetCount}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status</span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--status-success)' }}>Active</p>
              </div>
            </div>
          </section>

        </div>

        {/* Shoot Days & CRM Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-6)' }}>
          <section className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Shoot Days</h2>
              <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.875rem' }}>+ Add Shoot Day</button>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: 'var(--spacing-4)', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              No shoot days logged yet.
            </div>
          </section>

          <section className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Equipment Assigned</h2>
             <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: 'var(--spacing-4)', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              No equipment assigned.
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
