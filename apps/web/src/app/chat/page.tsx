'use client';

import { useState } from 'react';
import Link from 'next/link';

// Uses the proxy you already have: /api/backend?path=/guardian/check
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

  const send = async () => {
    setNudge(null);
    setBlocked(false);

    // 1) Ask Guardian first
    const resp = await api('/guardian/check', {
      text,
      tone: 'friendly',  // Tone B
      mode: 2,           // Mode 2
    });

    if (!resp.allowed) {
      setBlocked(true);
      setNudge(resp.tip || 'That might be risky—want to rephrase?');
      return;
    }

    // 2) If allowed, continue to your real /chat send (stubbed for now)
    // await api('/chat/send', { text });
    setText('');
    setNudge('Sent ✅ (demo)');
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-white">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Chat (Guardian Demo)</h1>
          <Link href="/feed" className="text-white/70 hover:text-white text-sm">← Back to Discover</Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="w-full h-28 rounded-lg bg-black/40 p-3 outline-none ring-1 ring-white/10"
          />

          {nudge && (
            <div
              className={`text-sm rounded-lg p-3 ${
                blocked ? 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/20' : 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20'
              }`}
            >
              {nudge}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={send}
              className="px-4 py-2 rounded-md bg-white text-black font-medium hover:opacity-90"
            >
              Send with Guardian
            </button>
            <button
              onClick={() => {
                setText('');
                setNudge(null);
                setBlocked(false);
              }}
              className="px-4 py-2 rounded-md border border-white/20 text-white/80 hover:text-white"
            >
              Clear
            </button>
          </div>

          <p className="text-xs text-white/50">
            Guardian: <span className="font-mono">Tone B (friendly)</span>, <span className="font-mono">Mode 2</span>, Always ON.
          </p>
        </div>
      </div>
    </div>
  );
}

