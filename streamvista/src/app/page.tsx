import React from 'react';
import './globals.css';
import { getProjects, createProject } from './actions';

export default async function DITDashboard() {
  const projects = await getProjects();

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      
      {/* Global Navigation Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--bg-elevated)', 
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: 'var(--spacing-6)', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '-0.02em' }}>StreamVista</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Crayons Creator Cloud</p>
        </div>
        
        <nav style={{ flex: 1, padding: 'var(--spacing-4)' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <li><a href="#" style={{ display: 'block', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontWeight: 500 }}>Dashboard</a></li>
            <li><a href="#" style={{ display: 'block', padding: 'var(--spacing-2) var(--spacing-3)', color: 'var(--text-secondary)' }}>Pipeline Board</a></li>
            <li><a href="#" style={{ display: 'block', padding: 'var(--spacing-2) var(--spacing-3)', color: 'var(--text-secondary)' }}>Rights Avails & Deals</a></li>
            <li><a href="#" style={{ display: 'block', padding: 'var(--spacing-2) var(--spacing-3)', color: 'var(--text-secondary)' }}>Message Threads</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ 
          padding: 'var(--spacing-4) var(--spacing-6)', 
          backgroundColor: 'var(--bg-surface)', 
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            My Projects
          </h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
            <a href="/processing" className="btn btn-secondary" style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem', textDecoration: 'none' }}>CloudStudio Processing</a>
            <a href="/qc" className="btn btn-secondary" style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem', textDecoration: 'none' }}>CloudStudio QC</a>
            <a href="/review" className="btn btn-secondary" style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem', textDecoration: 'none' }}>CloudStudio Review</a>
            <a href="/deliveries" className="btn btn-secondary" style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem', textDecoration: 'none' }}>CloudStudio Deliveries</a>
            <a href="/admin" className="btn btn-secondary" style={{ padding: 'var(--spacing-1) var(--spacing-3)', fontSize: '0.75rem', textDecoration: 'none' }}>Admin</a>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>DIT Workspace</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border-medium)' }}></div>
          </div>
        </header>

        <main className="container" style={{ padding: 'var(--spacing-8) var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', width: '100%' }}>
          
          <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Crayons Bridge CRM Overview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track pipeline, manage deals, and communicate with partners.</p>
            </div>
          </section>

          {/* CRM Panels Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
            
            {/* Pipeline Board Panel */}
            <div className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Pipeline Board (API: /api/v1/phase1/pipeline)</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', overflowX: 'auto', paddingBottom: 'var(--spacing-2)' }}>
                {/* Mock columns */}
                {['Imported', 'Metadata Verified', 'Assets Received', 'QC Passed', 'Rights Structured', 'Docs Verified', 'Sellable'].map(col => (
                  <div key={col} style={{ minWidth: '200px', backgroundColor: 'var(--bg-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{col}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Rights & Deals Panel */}
            <div className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Rights Avails (API: /api/v1/phase1/titles/:id/rights)</h3>
              <div style={{ border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading structured rights and financial ledger...</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
