'use client';

import { useState } from 'react';
import Link from 'next/link';

const api = async (path: string, body: any) => {
  const res = await fetch(`/api/backend?path=${encodeURIComponent(path)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return res.json();
};

export default function ChatDemo() {
  const [text, setText] = useState('');
  const [nudge, setNudge] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [confirmReport, setConfirmReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const gradientText = {
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const send = async () => {
    setNudge(null);
    setBlocked(false);

    const resp = await api('/guardian/check', {
      text,
      tone: 'friendly',
      mode: 2,
    });

    if (!resp.allowed) {
      setBlocked(true);
      setNudge(resp.tip || 'That might be risky—want to rephrase?');
      return;
    }

    setText('');
    setNudge('Sent ✅ (demo)');
  };

  const sendReport = () => {
    setConfirmReport(false);
    setReportSent(true);
    setTimeout(() => setReportSent(false), 2000);
    // Actual report API call could go here
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 1rem',
        color: '#f0f4f8',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
      }}
    >
      <main style={{ maxWidth: '800px', width: '100%', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1rem', ...gradientText }}>
          Chat (Guardian Demo)
        </h1>

        <p style={{ color: 'rgba(240,244,248,0.8)', marginBottom: '2rem' }}>
          Chat safely using Guardian. This page mirrors your profile and home page style.
        </p>

        {/* Chat box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            marginBottom: '2rem',
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            style={{
              width: '100%',
              height: '100px',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.4)',
              color: '#f0f4f8',
              outline: 'none',
              resize: 'none',
            }}
          />

          {nudge && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                backgroundColor: blocked ? 'rgba(255,191,0,0.1)' : 'rgba(0,255,128,0.1)',
                color: blocked ? '#FFBF00' : '#00FF80',
                border: blocked ? '1px solid rgba(255,191,0,0.3)' : '1px solid rgba(0,255,128,0.3)',
              }}
            >
              {nudge}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={send}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(90deg, #936d14, #ffffff)',
                color: 'black',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Send
            </button>
            <button
              onClick={() => {
                setText('');
                setNudge(null);
                setBlocked(false);
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#f0f4f8',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>

          {/* Report User */}
          <div style={{ marginTop: '1rem', position: 'relative' }}>
            {!confirmReport ? (
              <button
                onClick={() => setConfirmReport(true)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,0,0,0.1)',
                  color: '#FF5555',
                  cursor: 'pointer',
                }}
              >
                Report User
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                }}
              >
                <span>Are you sure?</span>
                <button
                  onClick={sendReport}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,0,0,0.2)',
                    color: '#FF5555',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmReport(false)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#f0f4f8',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            {reportSent && (
              <div
                style={{
                  position: 'absolute',
                  top: '-2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#f0f4f8',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                }}
              >
                Report sent ✅
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(240,244,248,0.5)', marginTop: '1rem' }}>
            Guardian: Tone B (friendly), Mode 2, Always ON.
          </p>
        </div>

        <Link
          href="/feed"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            color: '#f0f4f8',
            textDecoration: 'underline',
            fontSize: '0.9rem',
          }}
        >
          ← Back to Discover
        </Link>
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
