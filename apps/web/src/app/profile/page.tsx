'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import './ProfilePage.css';

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();

  const profileDetails = [
    { label: 'Age', value: '27' },
    { label: 'Pronouns', value: 'He/Him' },
    { label: 'Gender', value: 'Male' },
    { label: 'Preference', value: 'Female' },
    { label: 'Interests', value: 'Hiking, AI, Music, Travel' },
    { label: 'Relationship Goals', value: 'Long-term connection' },
    { label: 'Member Since', value: 'March 2025' },
    { label: 'Verification Status', value: '✅ ID Verified' },
  ];

  const galleryImages = ['/p1.png', '/p2.png', '/p3.png'];

  return (
    <div className={`profile-page ${theme}`}>
      <main className="profile-main">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">
          Review and manage your information. This page shows your public and private details as they
          appear on your Lyra account.
        </p>

        <div className="profile-info-card">
          <img src="/default-avatar.png" alt="Profile" className="profile-avatar" />
          <h2 className="profile-name">John Doe</h2>
          <p className="profile-bio">Software Engineer · San Francisco, CA</p>
          <p className="profile-description">
            “Building technology that connects people meaningfully. Traveler, pianist, and cat dad.”
          </p>
          <div style={{ marginTop: 12 }}>
            <button
              className="login-btn"
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                background:
                  theme === 'gold'
                    ? 'linear-gradient(90deg, #936d14, #ffffff)'
                    : 'linear-gradient(90deg, #93c5fd, #3b82f6)',
                color: theme === 'gold' ? '#290f5a' : 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
              }}
              onClick={() => {
                // Clear all login state
                localStorage.removeItem('currentUserId');
                localStorage.removeItem('currentUserName');
                localStorage.removeItem('currentUserAvatar');
                
                // Notify ALL tabs about the logout
                window.dispatchEvent(new Event('lyra:user:update'));
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'currentUserId',
                  oldValue: '999',
                  newValue: null
                }));
                
                router.push('/');
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="profile-details-grid">
          {profileDetails.map((item, i) => (
            <div key={i} className="profile-detail-card">
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="profile-gallery-section">
          <h3>Other Pictures</h3>
          <div className="profile-gallery">
            {galleryImages.map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`} className="profile-gallery-img" />
            ))}
          </div>
        </div>
      </main>

      <footer className="profile-footer">
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
