import React from 'react';
import QCQueueClient from '@/components/QCQueueClient';

export default function QCDashboard() {
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
            QC Queue
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem' }}>Worker Nodes: 4 Online (Polling)</button>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--spacing-8) 0', width: '100%' }}>
        {/* Filters */}
        <section style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
          <select className="input" style={{ width: 'auto', padding: 'var(--spacing-2)' }}>
            <option>All QC Statuses</option>
            <option>PASS</option>
            <option>WARNING</option>
            <option>FAILED</option>
            <option>REUPLOAD REQUIRED</option>
            <option>Awaiting Reviewer</option>
          </select>
          <button className="btn btn-secondary">Assign to Me</button>
        </section>

        {/* Dynamic Client Table */}
        <QCQueueClient />
      </main>
    </div>
  );
}
