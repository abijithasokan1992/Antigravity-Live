import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function DeliveriesDashboard() {
  const deliveries = await prisma.delivery.findMany({
    include: {
      project: true,
      recipients: true
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

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
          <a href="/" style={{ color: 'var(--text-muted)' }}>&larr; CloudStudio</a>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Editor Deliveries
          </h1>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--spacing-8) 0', width: '100%' }}>
        <section style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <select className="input" style={{ width: 'auto', padding: 'var(--spacing-2)' }}>
              <option>All Projects</option>
            </select>
            <select className="input" style={{ width: 'auto', padding: 'var(--spacing-2)' }}>
              <option>All Statuses</option>
              <option>DRAFT</option>
              <option>READY</option>
              <option>DELIVERED</option>
              <option>EXPIRED</option>
            </select>
          </div>
          <button className="btn btn-primary">Create Package</button>
        </section>

        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-medium)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>PACKAGE NAME</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>PROJECT</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>RECIPIENTS</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>TOTAL SIZE</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>STATUS</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>CREATED</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No delivery packages generated yet. Select assets from the Media Library to create one.
                  </td>
                </tr>
              ) : (
                deliveries.map(delivery => (
                  <tr key={delivery.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{delivery.name}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{delivery.project.title}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{delivery.recipients.length}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{(Number(delivery.totalBytes) / (1024*1024*1024)).toFixed(2)} GB</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>
                      <span style={{ 
                        color: delivery.status === 'READY' ? 'var(--status-success)' : 'var(--text-muted)'
                      }}>● {delivery.status}</span>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{new Date(delivery.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
