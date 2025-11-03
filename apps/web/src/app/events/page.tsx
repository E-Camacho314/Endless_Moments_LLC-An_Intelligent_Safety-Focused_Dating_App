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

  const gradientText = {
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#f0f4f8',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
        padding: '3rem 1rem',
      }}
    >
      <main style={{ maxWidth: '1000px', width: '100%' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          🎉 <span style={gradientText}>Upcoming Lyra Events</span>
        </h1>
        <p
          style={{
            color: 'rgba(240,244,248,0.8)',
            fontSize: '1.125rem',
            marginBottom: '2.5rem',
          }}
        >
          Meet people in real life! Join local hangouts and community mixers.
        </p>

        {loading && (
          <p style={{ color: 'rgba(240,244,248,0.6)' }}>Loading events...</p>
        )}

        {!loading && events.length === 0 && (
          <p style={{ color: 'rgba(240,244,248,0.6)' }}>
            No events yet. Check back soon!
          </p>
        )}

        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {events.map((e) => (
            <div
              key={e.id}
              style={{
                padding: '1.5rem',
                borderRadius: '0.75rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'left',
                boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
                transition: 'transform 0.2s ease, background 0.3s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget.style.background = 'rgba(255,255,255,0.05)'),
                (e.currentTarget.style.transform = 'translateY(-2px)'))
              }
              onMouseLeave={(e) =>
                ((e.currentTarget.style.background = 'rgba(0,0,0,0.3)'),
                (e.currentTarget.style.transform = 'translateY(0)'))
              }
            >
              <h2
                style={{
                  fontWeight: 500,
                  fontSize: '1.25rem',
                  marginBottom: '0.25rem',
                  ...gradientText,
                }}
              >
                {e.title}
              </h2>
              <p
                style={{
                  color: 'rgba(240,244,248,0.7)',
                  fontSize: '0.95rem',
                  marginBottom: e.circle ? '0.75rem' : 0,
                }}
              >
                {new Date(e.starts_at).toLocaleString()} @ {e.location}
              </p>
              {e.circle && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    background: 'rgba(147, 109, 20, 0.2)',
                    color: '#e5c067',
                    border: '1px solid rgba(147, 109, 20, 0.4)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {e.circle}
                </span>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer
        style={{
          textAlign: 'center',
          color: 'rgba(240,244,248,0.5)',
          fontSize: '0.875rem',
          padding: '2rem 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          marginTop: '4rem',
        }}
      >
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
