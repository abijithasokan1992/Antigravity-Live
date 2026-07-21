import React from 'react';
// import { prisma } from '@/lib/prisma'; // In a real app we'd fetch Review Sessions

export default async function ReviewDashboard() {
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
            Review Sessions
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
              <option>ACTIVE</option>
              <option>APPROVED</option>
              <option>EXPIRED</option>
            </select>
          </div>
          <button className="btn btn-primary">Create Review Link</button>
        </section>

        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: 'var(--spacing-16)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)' }}>No Active Review Sessions</h3>
          <p style={{ color: 'var(--text-muted)' }}>Generate proxies from the Processing Queue to create secure, watermarked review links.</p>
        </div>
      </main>
    </div>
  );
}
