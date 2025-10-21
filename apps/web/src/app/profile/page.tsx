'use client';

import { useEffect, useState } from 'react';

function Badge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${
        active
          ? 'border-green-400 bg-green-900/40 text-green-200'
          : 'border-gray-600 bg-gray-800 text-gray-300'
      }`}
    >
      <span>{active ? '✅' : '⭕'}</span>
      {label}
    </span>
  );
}

export default function ProfilePage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const [badges, setBadges] = useState<any>(null);

  useEffect(() => {
    fetch(`${base}/safety/badges/1`)
      .then((r) => r.json())
      .then(setBadges)
      .catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-3xl py-10 text-white">
      <h1 className="text-3xl font-semibold mb-2">My Safety Badges</h1>
      <p className="text-white/60 mb-6">
        These badges show your safety progress. Complete more steps to boost trust on Lyra ✨
      </p>

      {!badges && <p className="text-white/50 text-sm">Loading...</p>}

      {badges && (
        <div className="flex flex-wrap gap-3">
          <Badge label="ID Verified" active={!!badges.verified_id} />
          <Badge label="Video Verified" active={!!badges.verified_video} />
          <Badge label="Event Attended" active={!!badges.attended_event} />
        </div>
      )}
    </div>
  );
}

