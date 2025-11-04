'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import './feed.css';
import { toast } from '@/components/ui/Toast';
import useMatchFX from '@/hooks/useMatchFX';

const API = (path: string, init?: RequestInit) =>
  fetch(`/api/backend?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });

type Photo = { url: string };
type Profile = {
  id: number;
  display_name: string;
  age?: number | null;
  bio?: string | null;
  badges: string[];
  circle?: string | null;
  photos: Photo[];
};

export default function FeedPage() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'open' | 'blind'>('open');
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { celebrate } = useMatchFX();
  const currentUserId = 999;
  const [mounted, setMounted] = useState(false); // <--- track client mount

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('lyra_mode') as 'open' | 'blind';
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    API('/feed/recommendations')
      .then((r) => r.json())
      .then((data: Profile[]) => alive && setProfiles(data))
      .catch(() => setProfiles([]))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('lyra_mode', mode);
  }, [mode, mounted]);

  const like = async (targetId: number) => {
    const res = await API('/matches/like', {
      method: 'POST',
      body: JSON.stringify({ actor_id: currentUserId, target_id: targetId }),
    });
    const json = await res.json();
    if (json?.matched) {
      celebrate();
      toast.success(`It’s a match with ${targetId}!`);
    } else {
      toast.message('Liked ✔');
    }
  };

  const pass = async () => toast.message('Passed');

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className={`feed-page ${theme}`}>
      <main>
        <h1>Discover <span>Profiles</span></h1>
        <p className="feed-subtitle">
          Explore profiles in <span>{mode === 'blind' ? 'Blind' : 'Open'}</span> mode.
        </p>

        <div className="mode-toggle">
          <button className={mode === 'open' ? 'active' : ''} onClick={() => setMode('open')}>
            Open Mode
          </button>
          <button className={mode === 'blind' ? 'active' : ''} onClick={() => setMode('blind')}>
            Blind Mode
          </button>
        </div>

        {loading ? (
          <p>Loading profiles...</p>
        ) : profiles?.length ? (
          <div className="profiles-grid">
            {profiles.map((p) => (
              <ProfileCard key={p.id} p={p} mode={mode} onLike={() => like(p.id)} onPass={pass} />
            ))}
          </div>
        ) : (
          <p>No more recommendations</p>
        )}
      </main>
    </div>
  );
}

function ProfileCard({
  p,
  mode,
  onLike,
  onPass,
}: {
  p: Profile;
  mode: 'open' | 'blind';
  onLike: () => void;
  onPass: () => void;
}) {
  const blur = mode === 'blind' ? 'var(--blur-blind)' : 'none';
  return (
    <div className="profile-card">
      <div>
        <img
          className="profile-image"
          src={p.photos?.[0]?.url || '/lyra-fallback.jpg'}
          alt={p.display_name}
          style={{ filter: blur }}
        />
      </div>
      <h3>{p.display_name} {p.age && <span>• {p.age}</span>}</h3>
      {p.bio && <p>{p.bio}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button className="button pass" onClick={onPass}>✕ Pass</button>
        <button className="button like" onClick={onLike}>♥ Like</button>
      </div>
    </div>
  );
}

