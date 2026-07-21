import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
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
        maxWidth: '440px', 
        padding: 'var(--spacing-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-6)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>
            StreamVista
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Enter your credentials to access your studio workspace.
          </p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Address</label>
            <input type="email" id="email" className="input" placeholder="you@studio.com" required style={{ width: '100%' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem' }}>Forgot password?</a>
            </div>
            <input type="password" id="password" className="input" placeholder="••••••••" required style={{ width: '100%' }} />
          </div>

          <Link href="/" passHref style={{ display: 'block', marginTop: 'var(--spacing-2)' }}>
            <button type="button" className="btn btn-primary" style={{ width: '100%', padding: 'var(--spacing-3)' }}>
              Sign In to Workspace
            </button>
          </Link>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account? <a href="/signup" style={{ fontWeight: 600 }}>Create Studio Account</a>
          </p>
        </div>

      </div>
    </div>
  );
}
