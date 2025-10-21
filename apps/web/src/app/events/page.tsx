'use client';

import { useEffect, useState } from 'react';

type Event = {
  id: number;
  title: string;
  starts_at: string;
  location: string;
  circle?: string;
};

export default function EventsPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${base}/events`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [base]);

  return (
    <div className="mx-auto max-w-4xl py-10 text-white">
      <h1 className="text-3xl font-semibold mb-2">🎉 Upcoming Lyra Events</h1>
      <p className="text-white/60 mb-6">
        Meet people in real life! Join local hangouts and community mixers.
      </p>

      {loading && <p className="text-white/50">Loading events...</p>}

      {!loading && events.length === 0 && (
        <p className="text-white/60">No events yet. Check back soon!</p>
      )}

      <div className="grid gap-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h2 className="text-lg font-medium">{e.title}</h2>
            <p className="text-white/70 text-sm">
              {new Date(e.starts_at).toLocaleString()} @ {e.location}
            </p>
            {e.circle && (
              <span className="mt-2 inline-block px-2 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {e.circle}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

