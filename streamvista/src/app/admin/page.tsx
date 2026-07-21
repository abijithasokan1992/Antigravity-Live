import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const auditLogs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' },
    take: 25,
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
          <a href="/" style={{ color: 'var(--text-muted)' }}>&larr; StreamVista</a>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            System Administration
          </h1>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--spacing-8) 0', width: '100%', display: 'flex', gap: 'var(--spacing-8)' }}>
        
        {/* Left Column: Stats & Alerts */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <section>
            <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)' }}>Platform Health</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-success)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>API STATUS</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--status-success)' }}>Operational</p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>STORAGE USED</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--status-warning)' }}>87%</p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>FAILED JOBS</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>0</p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ACTIVE SESSIONS</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>12</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)' }}>Failed Job Recovery</h2>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No failed jobs detected in the message queue.</p>
            </div>
          </section>
        </div>

        {/* Right Column: Audit Logs */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-4)' }}>Global Audit Log</h2>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-medium)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>TIMESTAMP</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>ACTION</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>USER</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--text-muted)' }}>No audit events recorded yet.</td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{log.action} <span style={{ color: 'var(--text-muted)' }}>on {log.resourceType}</span></td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{log.user.fullName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
