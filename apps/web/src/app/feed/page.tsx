'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from '@/components/ui/Toast';
import useMatchFX from '@/hooks/useMatchFX';

const API = (path: string, init?: RequestInit) =>
  fetch(`/api/backend?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
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
  const [mode, setMode] = useState<'open' | 'blind'>(() => {
    if (typeof window === 'undefined') return 'open';
    return (localStorage.getItem('lyra_mode') as 'open' | 'blind') || 'open';
  });

  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { celebrate } = useMatchFX();

  const gradientText = {
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    API('/feed/recommendations')
      .then((r) => r.json())
      .then((data: Profile[]) => {
        if (!alive) return;
        setProfiles(data);
      })
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lyra_mode', mode);
    }
  }, [mode]);

  const currentUserId = 999;

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

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '4rem 1rem',
        color: '#f0f4f8',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
      }}
    >
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '1rem',
            ...gradientText,
          }}
        >
          Discover Profiles
        </h1>

        <p
          style={{
            color: 'rgba(240,244,248,0.8)',
            fontSize: '1rem',
            marginBottom: '2rem',
          }}
        >
          Explore profiles in{' '}
          <span style={gradientText}>
            {mode === 'blind' ? 'Blind' : 'Open'}
          </span>{' '}
          mode.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <button
            onClick={() => setMode('open')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '0.5rem',
              border: mode === 'open' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              background:
                mode === 'open'
                  ? 'linear-gradient(90deg, #936d14, #ffffff)'
                  : 'transparent',
              color: mode === 'open' ? 'black' : '#f0f4f8',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Open Mode
          </button>
          <button
            onClick={() => setMode('blind')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '0.5rem',
              border: mode === 'blind' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              background:
                mode === 'blind'
                  ? 'linear-gradient(90deg, #936d14, #ffffff)'
                  : 'transparent',
              color: mode === 'blind' ? 'black' : '#f0f4f8',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Blind Mode
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#aaa' }}>Loading profiles...</p>
        ) : profiles?.length ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {profiles.map((p) => (
              <ProfileCard
                key={p.id}
                p={p}
                mode={mode}
                onLike={() => like(p.id)}
                onPass={() => pass()}
              />
            ))}
          </div>
        ) : (
          <div style={{ marginTop: '5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              No more recommendations
            </h3>
            <p style={{ color: 'rgba(240,244,248,0.6)' }}>
              Check back later or expand your preferences.
            </p>
          </div>
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
  p: any;
  mode: 'open' | 'blind';
  onLike: () => void;
  onPass: () => void;
}) {
  const blur = mode === 'blind' ? 'blur(10px) brightness(0.6)' : 'none';
  const gradientText = {
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div
      style={{
        borderRadius: '1rem',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '1rem',
        textAlign: 'left',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget.style.transform = 'translateY(-5px)'),
        (e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 217, 91, 0.15)'))
      }
      onMouseLeave={(e) =>
        ((e.currentTarget.style.transform = 'translateY(0)'),
        (e.currentTarget.style.boxShadow = 'none'))
      }
    >
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}>
        <img
          src={p.photos?.[0]?.url || '/lyra-fallback.jpg'}
          alt={p.display_name}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            filter: blur,
            borderRadius: '0.75rem',
          }}
        />
      </div>

      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginTop: '1rem',
          ...gradientText,
        }}
      >
        {p.display_name} {p.age && <span style={{ color: '#ccc' }}>• {p.age}</span>}
      </h3>

      {p.bio && (
        <p
          style={{
            color: 'rgba(240,244,248,0.75)',
            fontSize: '0.9rem',
            marginTop: '0.5rem',
          }}
        >
          {p.bio}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '1rem',
        }}
      >
        <button
          onClick={onPass}
          style={{
            flex: 1,
            padding: '0.5rem 0',
            borderRadius: '0.5rem',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          ✕ Pass
        </button>
        <button
          onClick={onLike}
          style={{
            flex: 1,
            padding: '0.5rem 0',
            borderRadius: '0.5rem',
            background: 'linear-gradient(90deg, #936d14, #ffffff)',
            color: 'black',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ♥ Like
        </button>
      </div>
    </div>
  );
}
