'use client';

import React from 'react';

export default function ProfilePage() {
  const gradientText = {
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  interface Profile {
    name: string;
    bio: string;
    email: string;
    joined: string;
    avatarUrl?: string;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '-4rem 1rem',
        color: '#f0f4f8',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
      }}
    >
      <main style={{ maxWidth: '1000px', width: '100%', marginTop: '6rem' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            ...gradientText,
          }}
        >
          My Profile
        </h1>

        <p
          style={{
            color: 'rgba(240,244,248,0.8)',
            fontSize: '1.125rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.6,
          }}
        >
          Review and manage your information. This page shows your public and private details as they
          appear on your Lyra account.
        </p>

        {/* Profile Info Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '3rem',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <img
            src="/default-avatar.png"
            alt="Profile Picture"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.2)',
              marginBottom: '1rem',
            }}
          />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.25rem', ...gradientText }}>
            John Doe
          </h2>
          <p style={{ color: 'rgba(240,244,248,0.7)', marginBottom: '0.5rem' }}>
            Software Engineer · San Francisco, CA
          </p>
          <p style={{ color: 'rgba(240,244,248,0.6)', fontSize: '0.95rem', maxWidth: '500px' }}>
            “Building technology that connects people meaningfully. Traveler, pianist, and cat dad.”
          </p>
        </div>

        {/* Profile Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          {[
            { label: 'Age', value: '27' },
            { label: 'Pronouns', value: 'He/Him' },
            { label: 'Gender', value: 'Male' },
            { label: 'Preference', value: 'Female' },
            { label: 'Interests', value: 'Hiking, AI, Music, Travel' },
            { label: 'Relationship Goals', value: 'Long-term connection' },
            { label: 'Member Since', value: 'March 2025' },
            { label: 'Verification Status', value: '✅ ID Verified' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <h3 style={{ ...gradientText, fontWeight: 500, marginBottom: '0.5rem' }}>{item.label}</h3>
              <p style={{ color: 'rgba(240,244,248,0.8)' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Other Pictures Section */}
        <div
          style={{
            marginTop: '4rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
          }}
        >
          <h3
            style={{
              ...gradientText,
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            Other Pictures
          </h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {['/p1.png', '/p2.png', '/p3.png'].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Gallery ${i + 1}`}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>
        </div>
      </main>

      <footer
        style={{
          textAlign: 'center',
          color: 'rgba(240,244,248,0.5)',
          fontSize: '0.875rem',
          padding: '2rem 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          marginTop: '4rem',
        }}
      >
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
