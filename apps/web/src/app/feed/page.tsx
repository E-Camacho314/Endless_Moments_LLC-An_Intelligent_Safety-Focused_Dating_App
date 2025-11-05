'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import './feed.css';
import ProfileCard from '@/components/ProfileCard';
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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { celebrate } = useMatchFX();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('lyra_mode') as 'open' | 'blind';
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    const readUser = () => {
      try {
        const raw = localStorage.getItem('currentUserId');
        setCurrentUserId(raw ? Number(raw) : null);
      } catch (e) {
        // ignore
      }
    };
    readUser();
    const handler = () => readUser();
    if (typeof window !== 'undefined') {
      window.addEventListener('lyra:user:update', handler);
      window.addEventListener('storage', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('lyra:user:update', handler);
        window.removeEventListener('storage', handler);
      }
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const path = currentUserId
      ? `/feed/recommendations?current_user_id=${encodeURIComponent(String(currentUserId))}`
      : '/feed/recommendations';
    API(path)
      .then((r) => r.json())
      .then((data: Profile[]) => alive && setProfiles(data))
      .catch(() => setProfiles([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (mounted) localStorage.setItem('lyra_mode', mode);
  }, [mode, mounted]);

  const like = async (targetId: number) => {
    const actor = currentUserId ?? 999;
    const res = await API('/matches/like', {
      method: 'POST',
      body: JSON.stringify({ actor_id: actor, target_id: targetId }),
    });
    const json = await res.json();
    if (json?.matched) {
      celebrate();
      toast.success(`It’s a match with ${targetId}!`);
    } else {
      toast.message('Liked ✔');
    }
  };

  const pass = async (targetId?: number) => {
    const actor = currentUserId ?? 999;
    if (typeof targetId === 'number') {
      await API('/matches/pass', {
        method: 'POST',
        body: JSON.stringify({ actor_id: actor, target_id: targetId }),
      }).catch(() => {});
    }
    toast.message('Passed');
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className={`feed-page ${theme}`}>
      <main>
        <h1>
          Discover <span>Profiles</span>
        </h1>
        <p className="feed-subtitle">
          Explore profiles in <span>{mode === 'blind' ? 'Blind' : 'Open'}</span> mode.
        </p>

        <div className="mode-toggle" style={{ marginBottom: '48px' }}>
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
          <div className={`deck-container${expandedId ? ' expanded' : ''}`}>
            {profiles
              .slice()
              .reverse()
              .map((p, idx) => (
                <div className={`card-slot`} key={p.id} style={{ zIndex: 10 + idx }}>
                  <ProfileCard
                    p={p}
                    isTop={idx === 0}
                    mode={mode}
                    expanded={expandedId === p.id}
                    onExpand={() => setExpandedId(p.id)}
                    onCollapse={() => setExpandedId(null)}
                    onLike={async (id) => {
                      await like(id);
                      setProfiles((prev) => (prev ? prev.filter((x) => x.id !== id) : prev));
                      setExpandedId(null);
                    }}
                    onPass={async (id) => {
                      await pass(id);
                      setProfiles((prev) => (prev ? prev.filter((x) => x.id !== id) : prev));
                      setExpandedId(null);
                    }}
                  />
                </div>
              ))}
          </div>
        ) : (
          <p>No more recommendations</p>
        )}
      </main>
    </div>
  );
}

