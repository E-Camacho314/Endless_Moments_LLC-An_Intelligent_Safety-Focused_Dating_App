'use client';

import { useEffect, useState } from 'react';
import './events.css';

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
  const [theme, setTheme] = useState<'gold' | 'blue'>('gold'); // theme state

  useEffect(() => {
    fetch(`${base}/events`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [base]);

  // For demonstration: toggle theme every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTheme((prev) => (prev === 'gold' ? 'blue' : 'gold'));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`events-page ${theme}`}>
      <main>
        <h1>
          🎉 <span>Upcoming Lyra Events</span>
        </h1>
        <p className="events-subtitle">
          Meet people in real life! Join local hangouts and community mixers.
        </p>

        {loading && <p className="event-details">Loading events...</p>}
        {!loading && events.length === 0 && (
          <p className="event-details">No events yet. Check back soon!</p>
        )}

        <div className="events-grid">
          {events.map((e) => (
            <div key={e.id} className="event-card">
              <h2 className="event-title">{e.title}</h2>
              <p className="event-details">
                {new Date(e.starts_at).toLocaleString()} @ {e.location}
              </p>
              {e.circle && <span className="event-circle">{e.circle}</span>}
            </div>
          ))}
        </div>
      </main>

      <footer className="events-footer">
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
