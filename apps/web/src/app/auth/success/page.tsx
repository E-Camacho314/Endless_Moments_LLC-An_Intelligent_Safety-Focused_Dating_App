'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const name = params.get('name');
  const email = params.get('email');
  const picture = params.get('picture');

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a33, #1b1441)',
        color: 'white',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.4)',
        }}
      >
        {picture && (
          <img
            src={picture}
            alt="User"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              marginBottom: '20px',
            }}
          />
        )}
        <h1>Welcome, {name || 'User'}!</h1>
        <p>{email}</p>
        <p style={{ marginTop: '12px' }}>You’ve successfully signed in with Google 🎉</p>

        {/* ✅ New Create Profile button */}
        <button
          onClick={() => router.push('/profile-setup')}
          style={{
            marginTop: '24px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #936d14, #ffffff)',
            color: '#290f5a',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Create My Profile
        </button>
      </div>
    </div>
  );
}
