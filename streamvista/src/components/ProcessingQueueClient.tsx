"use client";

import React, { useEffect, useState } from 'react';

export default function ProcessingQueueClient() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Poll every 3 seconds
    const intervalId = setInterval(fetchJobs, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/v1/processing-jobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-medium)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>JOB ID</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>TYPE</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>ASSET</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>PROJECT</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>STATUS</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>PROGRESS</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>ATTEMPTS</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>QUEUED AT</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading && jobs.length === 0 ? (
             <tr>
               <td colSpan={9} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                 Loading processing queue...
               </td>
             </tr>
          ) : jobs.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                No processing jobs currently in the queue. 
              </td>
            </tr>
          ) : (
            jobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{job.id.substring(0,8)}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>
                  <span style={{ backgroundColor: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px' }}>{job.jobType}</span>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{job.asset?.originalFilename}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{job.project?.title}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>
                  <span style={{ 
                    color: job.status === 'FAILED' ? 'var(--status-error)' : 
                           job.status === 'RUNNING' ? 'var(--status-warning)' : 
                           job.status === 'COMPLETED' ? 'var(--status-success)' : 'var(--text-muted)'
                  }}>● {job.status}</span>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>
                  <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--bg-base)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${job.progress}%`, height: '100%', backgroundColor: 'var(--accent-primary)', transition: 'width 0.3s ease' }}></div>
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{job.attemptCount}/{job.maxAttempts}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem' }}>{new Date(job.queuedAt).toLocaleTimeString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                    {job.status === 'FAILED' && <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Retry</button>}
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Logs</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
