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
    if (!profileId) return;
  
    const path = `/profiles/${encodeURIComponent(String(profileId))}`;
    console.log("Viewing profile ID:", profileId);
    console.log("Fetching from API path:", path);
  
    API(path)
      .then(async (res) => {
        if (!res.ok) {
          console.error(`Failed to fetch profile: ${res.status} ${res.statusText}`);
          setProfile(null);
          return;
        }
  
        try {
          const resData = await res.json();
          const data = resData; // <-- replace the old 'data' usage with this

          if (!data) {
            console.warn('Profile data is null');
            setProfile(null);
            return;
          }

          console.log("Profile photo URL:", data.photo_url);
  
          console.log("Fetched profile data:", data);

          const gallery = data.galleryImages && data.galleryImages.length
          ? [data.photo_url, ...data.galleryImages.filter(img => img !== data.photo_url)]
          : [data.photo_url || '/default-avatar.png'];
  
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
            relationshipGoals: data.relationship_goals || '',
            memberSince: data.member_since || '',
            verified: data.verified || false,
            galleryImages: gallery || ['/default-avatar.png'], // use galleryImages
          });

        } catch (err) {
          console.error("Error parsing profile JSON:", err);
          setProfile(null);
        }
      })
      .catch((err) => {
        console.error("Network or fetch error while getting profile:", err);
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

  const saveEdit = async (label: string) => {
    if (!profile || !profileId) return;
  
    const labelToField: Record<string, string> = {
      'Name': 'display_name',
      'Occupation': 'occupation',
      'Location': 'location',
      'Bio': 'bio',
      'Age': 'age',
      'Pronouns': 'pronouns',
      'Gender': 'gender',
      'Preference': 'preference',
      'Interests': 'interests',
      'Relationship Goals': 'relationship_goals',
      'Member Since': 'member_since',
    };
  
    const field = labelToField[label];
    if (!field) {
      console.warn('No mapping found for label:', label);
      return;
    }
  
    const oldValue = profile[field as keyof ProfileData];
    const payload = { [field]: editValue };
  
    console.log('Attempting to update profile field:', field);
    console.log('Old value:', oldValue);
    console.log('New value:', editValue);
    console.log('Payload being sent:', payload);
    console.log('PUT URL:', `/profiles/${profileId}`);
  
    try {
      // Optimistic local update
      setProfile(prev => {
        console.log('Optimistic update, previous profile:', prev);
        return prev ? { ...prev, [label]: editValue } : prev;
      });
  
      const res = await fetch(`/api/backend?path=/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });      
      
      const text = await res.text();  // get raw response
      console.log("Raw response from fetch:", text);
      
      try {
        const data = JSON.parse(text); // parse JSON manually
        console.log("Parsed JSON:", data);
      } catch (err) {
        console.error("Error caught during profile update:", err);
      }        
  
      if (!res.ok) {
        const text = await res.text();
        console.error(`Failed to update profile: ${res.status} ${res.statusText}`);
        console.error('Response text:', text);
        return;
      }
  
      const resData = await res.json();
      console.log('Parsed JSON response:', resData);
  
      const updated = resData.profile;
      console.log('Backend updated profile data:', updated);
  
      // Map backend fields to frontend fields
      const mappedProfile: Partial<ProfileData> = {
        name: updated.display_name ?? profile.name,
        occupation: updated.occupation ?? profile.occupation,
        location: updated.location ?? profile.location,
        bio: updated.bio ?? profile.bio,
        age: updated.age !== undefined ? String(updated.age) : profile.age,
        pronouns: updated.pronouns ?? profile.pronouns,
        gender: updated.gender ?? profile.gender,
        preference: updated.preference ?? profile.preference,
        interests: updated.interests ?? profile.interests,
        relationshipGoals: updated.relationship_goals ?? profile.relationshipGoals,
        memberSince: updated.member_since ?? profile.memberSince,
        verified: updated.verified ?? profile.verified,
        galleryImages: updated.galleryImages ?? profile.galleryImages,
      };
  
      console.log('Mapped frontend profile after update:', mappedProfile);
  
      setProfile(prev => ({ ...prev!, ...mappedProfile }));
      setEditing(null);
    } catch (err) {
      console.error('Error caught during profile update:', err);
      setProfile(prev => prev ? { ...prev, [label]: oldValue } : prev);
    }
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
          <img src={ profile?.galleryImages[0] || '/default-avatar.png'} className="profile-avatar" />

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
          <div>
            <button
                      className="login-btn"
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: theme === 'gold'
                          ? 'linear-gradient(90deg, #936d14, #ffffff)'
                          : 'linear-gradient(90deg, #93c5fd, #3b82f6)',
                        color: theme === 'gold' ? '#290f5a' : 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '13px',
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
