'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/components/ui/Toast';
import useMatchFX from '@/hooks/useMatchFX';

// ✅ Use the Next.js proxy route rather than localhost
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

  // ✅ Load recommendations from backend
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

  // Save mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lyra_mode', mode);
    }
  }, [mode]);

  // Demo user until auth is wired
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
    <div className="min-h-screen bg-[#0B0D12] text-white">
      {/* ✅ NavBar removed because layout.tsx already includes it */}

      <main className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Lyra — Discover</h1>
            <p className="text-white/60 text-sm">
              Choice Mode: switch between Blind and Open at any time.
            </p>
          </div>
          <div className="sm:ml-auto flex items-center gap-2 rounded-lg border border-white/10 p-1 bg-white/5">
            <button
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                mode === 'open' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
              }`}
              onClick={() => setMode('open')}
            >
              Open
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                mode === 'blind' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
              }`}
              onClick={() => setMode('blind')}
            >
              Blind
            </button>
          </div>
        </header>

        {loading ? (
          <SkeletonGrid />
        ) : profiles?.length ? (
          <ProfileGrid profiles={profiles} mode={mode} onLike={like} onPass={pass} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[420px] rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

function ProfileGrid({
  profiles,
  mode,
  onLike,
  onPass,
}: {
  profiles: Profile[];
  mode: 'open' | 'blind';
  onLike: (id: number) => void;
  onPass: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((p) => (
        <ProfileCard key={p.id} p={p} mode={mode} onLike={() => onLike(p.id)} onPass={() => onPass(p.id)} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl text-center mt-20">
      <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 mb-4" />
      <h2 className="text-xl font-semibold mb-1">No more recommendations</h2>
      <p className="text-white/60">Try again later or adjust your preferences.</p>
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
  const photo = p.photos?.[0]?.url || '/lyra-fallback.jpg';
  const blur = mode === 'blind' ? 'blur-lg brightness-[0.7]' : '';

  return (
    <div className="group relative rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
      <div className="relative h-[420px]">
        <img src={photo} alt={p.display_name} className={`h-full w-full object-cover transition group-hover:scale-105 ${blur}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 right-3 bottom-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <div>
              <div className="text-base font-semibold">
                {p.display_name} {p.age && <span className="text-white/70">• {p.age}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onPass} className="h-10 w-10 bg-black/70 rounded-full">✕</button>
              <button onClick={onLike} className="h-10 w-10 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full">♥</button>
            </div>
          </div>
          {p.bio && <p className="text-xs">{p.bio}</p>}
        </div>
      </div>
    </div>
  );
}

