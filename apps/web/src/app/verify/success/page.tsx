'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function VerifySuccess() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>
        ✅ Verification Submitted!
      </h1>
      <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>
        Thank you for completing the verification process.
      </p>
      <button
        onClick={() => router.push('/profile')}
        style={{
          padding: '10px 20px',
          borderRadius: '6px',
          border: 'none',
          background: 'linear-gradient(90deg, #936d14, #ffffff)',
          color: '#290f5a',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Go to Profile
      </button>
    </div>
  );
}
