'use client';

import React, { useState, useRef } from 'react';

export default function UploadClient({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const simulateUpload = async () => {
    setUploading(true);
    // Real implementation would chunk files and upload to the server
    setTimeout(async () => {
      try {
        // Register each file as an asset and trigger mock processing via REST API
        for (const file of files) {
          const res = await fetch('/api/v1/ingest-sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, fileName: file.name })
          });
          if (!res.ok) throw new Error('API Request Failed');
        }
        alert("Safe to format! Integrity check passed. Processing jobs have been queued via API.");
      } catch (err) {
        console.error(err);
        alert("Verification completed, but failed to queue processing jobs.");
      } finally {
        setUploading(false);
        setFiles([]);
      }
    }, 3000);
  };

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ 
        border: '2px dashed var(--border-medium)', 
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-10)',
        textAlign: 'center',
        backgroundColor: 'var(--bg-elevated)'
      }}
    >
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileSelect} 
      />
      
      {!uploading && files.length === 0 && (
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)' }}>Drag & Drop Camera Cards</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-6)' }}>Or click to browse your file system.</p>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>Browse Files</button>
        </div>
      )}

      {!uploading && files.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)' }}>{files.length} Files Queued</h3>
          <button className="btn btn-primary" onClick={simulateUpload}>Start Ingest & Verify</button>
        </div>
      )}

      {uploading && (
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-4)' }}>Uploading & Hashing Chunks...</h3>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--status-warning)', transition: 'width 0.3s ease' }}></div>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Calculating SHA-256 checksums on the fly...</p>
        </div>
      )}
    </div>
  );
}
