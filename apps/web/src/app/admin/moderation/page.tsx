'use client';

import React from 'react';

export default function AdminModeration() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>
        🛡️ Admin Moderation Panel
      </h1>
      <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '600px' }}>
        Review reports, flagged profiles, and safety feedback here.
      </p>
      <div
        style={{
          marginTop: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          borderRadius: '1rem',
          width: '80%',
          maxWidth: '600px',
        }}
      >
        <p>No active reports yet. Everything looks good ✅</p>
      </div>
    </div>
  );
}
