import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function MediaLibrary({ params }: { params: { id: string } }) {
  const projectId = params.id;
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  const assets = await prisma.mediaAsset.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });

  if (!project) return <div>Project not found</div>;

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
          <Link href={`/projects/${projectId}`} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            &larr; Project Hub
          </Link>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Media Library: {project.title}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <Link href={`/projects/${projectId}/ingest`}>
            <button className="btn btn-primary">Open Ingest Station</button>
          </Link>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--spacing-8) 0', width: '100%' }}>
        <section style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
             <select className="input" style={{ width: 'auto', padding: 'var(--spacing-2)' }}>
              <option>All Assets</option>
              <option>CAMERA_RAW</option>
              <option>AUDIO</option>
              <option>PROXY</option>
            </select>
          </div>
        </section>

        {assets.length === 0 ? (
          <div className="glass-panel" style={{ padding: 'var(--spacing-16)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)' }}>No Media Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Use the Ingest Station to import camera cards.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
            {assets.map(asset => (
              <div key={asset.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  height: '160px', 
                  backgroundColor: 'var(--bg-elevated)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  {/* Placeholder for thumbnail */}
                  <span style={{ color: 'var(--text-muted)', fontSize: '2rem' }}>🎬</span>
                </div>
                <div style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, wordBreak: 'break-all' }}>{asset.originalFilename}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Type: {asset.assetType}</span>
                    <span>Size: {(Number(asset.fileSize) / (1024*1024*1024)).toFixed(2)} GB</span>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: asset.status === 'VERIFIED' ? 'var(--status-success)' : 'var(--status-warning)'
                      }}>
                        ● {asset.status}
                    </span>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
