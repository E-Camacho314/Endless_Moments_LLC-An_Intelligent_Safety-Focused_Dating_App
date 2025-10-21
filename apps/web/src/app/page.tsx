'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-white">
      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Lyra</span>
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          The next-generation dating app built for authenticity, safety, and real human energy.
          Choose <span className="text-white font-medium">Blind Mode</span> for slow discovery or
          <span className="text-white font-medium"> Open Mode</span> for instant chemistry.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link
            href="/feed"
            className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:opacity-90 transition shadow-lg shadow-cyan-400/10"
          >
            Start Exploring →
          </Link>
          <Link
            href="/admin/login"
            className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
          >
            Admin Login
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-medium text-lg mb-2">🔥 Blind Mode</h3>
            <p className="text-white/70 text-sm">Build connection before visuals. Reveal gradually.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-medium text-lg mb-2">🛡️ Guardian AI</h3>
            <p className="text-white/70 text-sm">Safety checks + smart nudges inside chat.</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-medium text-lg mb-2">🎉 Match Energy</h3>
            <p className="text-white/70 text-sm">Confetti pops + Lottie flows that feel alive.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-white/50 text-sm py-8 border-t border-white/10">
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}

