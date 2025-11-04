'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import './chat.css';

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
  const { theme } = useTheme();

  const [text, setText] = useState('');
  const [nudge, setNudge] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [confirmReport, setConfirmReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);

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
  };

  return (
    <div className={`chat-demo ${theme}`}>
      <main className="chat-main">
        <h1 className="chat-title">Chat (Guardian Demo)</h1>

        <p className="chat-description">
          Chat safely using Guardian. This page mirrors your profile and home page style.
        </p>

        <div className="chat-box">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="chat-input"
          />

          {nudge && (
            <div className={`chat-nudge ${blocked ? 'blocked' : 'allowed'}`}>
              {nudge}
            </div>
          )}

          <div className="chat-actions">
            <button className="btn-send" onClick={send}>
              Send
            </button>
            <button
              className="btn-clear"
              onClick={() => {
                setText('');
                setNudge(null);
                setBlocked(false);
              }}
            >
              Clear
            </button>
          </div>

          <div className="report-user">
            {!confirmReport ? (
              <button className="btn-report" onClick={() => setConfirmReport(true)}>
                Report User
              </button>
            ) : (
              <div className="report-confirm">
                <span>Are you sure?</span>
                <button className="btn-report-yes" onClick={sendReport}>
                  Yes
                </button>
                <button className="btn-report-cancel" onClick={() => setConfirmReport(false)}>
                  Cancel
                </button>
              </div>
            )}

            {reportSent && <div className="report-sent">Report sent ✅</div>}
          </div>

          <p className="chat-footer-info">
            Guardian: Tone B (friendly), Mode 2, Always ON.
          </p>
        </div>

        <Link href="/feed" className="back-link">
          ← Back to Discover
        </Link>
      </main>

      <footer className="chat-footer">
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
