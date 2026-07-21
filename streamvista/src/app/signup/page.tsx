import React from 'react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundImage: 'url(/login-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: 'var(--spacing-6)'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '540px', 
        padding: 'var(--spacing-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-6)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>
            Join StreamVista
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Register your studio or production house to access the creator cloud.
          </p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label htmlFor="firstName" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>First Name</label>
              <input type="text" id="firstName" className="input" placeholder="Jane" required style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label htmlFor="lastName" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Last Name</label>
              <input type="text" id="lastName" className="input" placeholder="Doe" required style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <label htmlFor="orgName" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Organization Name</label>
            <input type="text" id="orgName" className="input" placeholder="Acme Studios" required style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Work Email</label>
            <input type="email" id="email" className="input" placeholder="jane@acmestudios.com" required style={{ width: '100%' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Create Password</label>
            <input type="password" id="password" className="input" placeholder="••••••••" required style={{ width: '100%' }} />
          </div>

          <Link href="/" passHref style={{ display: 'block', marginTop: 'var(--spacing-4)' }}>
            <button type="button" className="btn btn-primary" style={{ width: '100%', padding: 'var(--spacing-3)' }}>
              Create Organization Workspace
            </button>
          </Link>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account? <a href="/login" style={{ fontWeight: 600 }}>Sign In</a>
          </p>
        </div>

      </div>
    </div>
  );
}
