'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/feed', label: 'Discover' },
  { href: '/chat', label: 'Chat' },
  { href: '/reports', label: 'Safety' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/admin/moderation', label: 'Admin' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/50 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500" />
          <span className="text-white font-semibold tracking-wide">Lyra</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {tabs.map((t) => {
            const active = pathname === t.href || (t.href !== '/' && pathname?.startsWith(t.href));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3 py-2 rounded-md text-sm transition
                  ${active
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            className="hidden sm:inline-flex px-3 py-2 text-xs rounded-md border border-white/15 text-white/80 hover:text-white hover:border-white/30"
            onClick={() => {
              // dev: toggle theme token on body
              document.documentElement.classList.toggle('lyra-dark');
            }}
          >
            Toggle Theme
          </button>
        <div className="h-7 w-7 rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20">
               <span className="text-[10px] font-semibold text-white/80">ME</span>
        </div>

        </div>
      </div>
    </header>
  );
}

