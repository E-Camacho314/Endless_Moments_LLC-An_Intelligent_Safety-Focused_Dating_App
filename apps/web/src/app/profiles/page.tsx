'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, useParams } from 'next/navigation';
import './ProfilePage.css';

const API = (path: string, init?: RequestInit) =>
  fetch(`/api/backend?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });

type ProfileData = {
  name: string;
  occupation: string;
  location: string;
  bio: string;
  age?: string;
  pronouns?: string;
  gender?: string;
  preference?: string;
  interests?: string;
  relationshipGoals?: string;
  memberSince?: string;
  verified?: boolean;
  galleryImages?: string[];
};

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams(); // grabs URL params
  const profileId = params?.id; // assuming URL is /profile/[id]

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const path = profileId
      ? `/profiles?current_user_id=${encodeURIComponent(String(profileId))}`
      : '/profiles';

    console.log("Viewing profile ID:", profileId);

    // Fetch profile data from backend
    API(path)
      .then(res => res.json())
      .then((data) => {
        setProfile({
          name: data.display_name || 'Unknown',
          occupation: data.occupation || '',
          location: data.location || '',
          bio: data.bio || '',
          age: data.age ? String(data.age) : '',
          pronouns: data.pronouns || '',
          gender: data.gender || '',
          preference: data.preference || '',
          interests: data.interests || '',
          relationshipGoals: data.relationshipGoals || '',
          memberSince: data.memberSince || '',
          verified: data.verified || false,
          galleryImages: data.photos?.map((p: any) => p.url) || ['/default-avatar.png'],
        });
      })
      .catch(() => {
        setProfile(null);
      });
  }, [profileId]);

  const findValue = (label: string) => {
    if (!profile) return '';
    switch (label) {
      case 'Name': return profile.name;
      case 'Occupation': return profile.occupation;
      case 'Location': return profile.location;
      case 'Bio': return profile.bio;
      case 'Age': return profile.age;
      case 'Pronouns': return profile.pronouns;
      case 'Gender': return profile.gender;
      case 'Preference': return profile.preference;
      case 'Interests': return profile.interests;
      case 'Relationship Goals': return profile.relationshipGoals;
      case 'Member Since': return profile.memberSince;
      case 'Verification Status': return profile.verified ? '✅ Verified' : '';
      default: return '';
    }
  };

  const saveEdit = (label: string) => {
    if (!profile) return;

    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      switch (label) {
        case 'Name': updated.name = editValue; break;
        case 'Occupation': updated.occupation = editValue; break;
        case 'Location': updated.location = editValue; break;
        case 'Bio': updated.bio = editValue; break;
        case 'Age': updated.age = editValue; break;
        case 'Pronouns': updated.pronouns = editValue; break;
        case 'Gender': updated.gender = editValue; break;
        case 'Preference': updated.preference = editValue; break;
        case 'Interests': updated.interests = editValue; break;
        case 'Relationship Goals': updated.relationshipGoals = editValue; break;
        case 'Member Since': updated.memberSince = editValue; break;
      }
      return updated;
    });

    setEditing(null);
  };

  if (!profile) return <p>Loading profile...</p>;

  const details = [
    { label: 'Age', value: profile.age },
    { label: 'Pronouns', value: profile.pronouns },
    { label: 'Gender', value: profile.gender },
    { label: 'Preference', value: profile.preference },
    { label: 'Interests', value: profile.interests },
    { label: 'Relationship Goals', value: profile.relationshipGoals },
    { label: 'Member Since', value: profile.memberSince },
    { label: 'Verification Status', value: profile.verified ? '✅ Verified' : '' },
  ];

  return (
    <div className={`profile-page ${theme}`}>
      <main className="profile-main">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Review and manage your information.</p>

        {/* PROFILE CARD */}
        <div className="profile-info-card">
          <img src={profile.galleryImages?.[0] || '/default-avatar.png'} className="profile-avatar" />

          {/* Name */}
          <div className="editable-row">
            {editing === 'Name' ? (
              <>
                <input className="edit-input" value={editValue} onChange={e => setEditValue(e.target.value)} />
                <button className="save-btn" onClick={() => saveEdit('Name')}>✓</button>
                <button className="cancel-btn" onClick={() => setEditing(null)}>✕</button>
              </>
            ) : (
              <h3 className="profile-name">
                {findValue('Name')}
                <span className="edit-icon" onClick={() => setEditing('Name')}>✏️</span>
              </h3>
            )}
          </div>

          {/* Occupation */}
          <div className="editable-row">
            {editing === 'Occupation' ? (
              <>
                <input className="edit-input" value={editValue} onChange={e => setEditValue(e.target.value)} />
                <button className="save-btn" onClick={() => saveEdit('Occupation')}>✓</button>
                <button className="cancel-btn" onClick={() => setEditing(null)}>✕</button>
              </>
            ) : (
              <p className="profile-bio">
                {findValue('Occupation')}
                <span className="edit-icon" onClick={() => setEditing('Occupation')}>✏️</span>
              </p>
            )}
          </div>

          {/* Location */}
          <div className="editable-row">
            {editing === 'Location' ? (
              <>
                <input className="edit-input" value={editValue} onChange={e => setEditValue(e.target.value)} />
                <button className="save-btn" onClick={() => saveEdit('Location')}>✓</button>
                <button className="cancel-btn" onClick={() => setEditing(null)}>✕</button>
              </>
            ) : (
              <p className="profile-bio">
                {findValue('Location')}
                <span className="edit-icon" onClick={() => setEditing('Location')}>✏️</span>
              </p>
            )}
          </div>

          {/* BIO */}
          <div className="editable-row">
            {editing === 'Bio' ? (
              <>
                <textarea className="edit-input" value={editValue} onChange={e => setEditValue(e.target.value)} />
                <button className="save-btn" onClick={() => saveEdit('Bio')}>✓</button>
                <button className="cancel-btn" onClick={() => setEditing(null)}>✕</button>
              </>
            ) : (
              <p className="profile-description">
                {findValue('Bio')}
                <span className="edit-icon" onClick={() => setEditing('Bio')}>✏️</span>
              </p>
            )}
          </div>

          <button
                    className="login-btn"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: theme === 'gold'
                        ? 'linear-gradient(90deg, #936d14, #ffffff)'
                        : 'linear-gradient(90deg, #93c5fd, #3b82f6)',
                      color: theme === 'gold' ? '#290f5a' : 'white',
                    }}
                    onClick={() => router.push('/settings')}
                  >
                    Settings
            </button>
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

        {/* DETAILS GRID */}
        <div className="profile-details-grid">
          {details.map((item, i) => (
            <div key={i} className="profile-detail-card">
              <h3>
                {item.label}
                {item.label !== 'Verification Status' && (
                  <span className="edit-icon" onClick={() => setEditing(item.label)}>✏️</span>
                )}
              </h3>

              {item.label === 'Verification Status' ? (
                item.value ? (
                  <p>✅ Verified</p>
                ) : (
                  <button
                    className="login-btn"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: theme === 'gold'
                        ? 'linear-gradient(90deg, #936d14, #ffffff)'
                        : 'linear-gradient(90deg, #93c5fd, #3b82f6)',
                      color: theme === 'gold' ? '#290f5a' : 'white',
                    }}
                    onClick={() => router.push('/verify')}
                  >
                    Verify Account
                  </button>
                )
              ) : editing === item.label ? (
                <div className="edit-row">
                  <input value={editValue} onChange={e => setEditValue(e.target.value)} className="edit-input" />
                  <button className="save-btn" onClick={() => saveEdit(item.label)}>✓</button>
                  <button className="cancel-btn" onClick={() => setEditing(null)}>✕</button>
                </div>
              ) : (
                <p>{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div className="profile-gallery-section">
          <h3>Other Pictures</h3>
          <div className="profile-gallery">
            {profile.galleryImages?.map((src, i) => (
              <img key={i} src={src} className="profile-gallery-img" />
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
