'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const tabs = [
  { href: '/feed', label: 'Discover' },
  { href: '/chat', label: 'Chats' },
  { href: '/events', label: 'Events' },
  { href: '/reports', label: 'Safety' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/admin/moderation', label: 'Admin' },
  { href: '/verify', label: 'Verification' },
];

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #936d14, #ffffff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#0a0a33',
    padding: '12px 32px',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '64px',
    zIndex: 100,
    boxSizing: 'border-box',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const logoNavStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'background 0.2s ease, color 0.2s ease',
  };

  const navLinkActiveStyle: React.CSSProperties = {
    ...navLinkStyle,
    backgroundColor: '#290f5a',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    color: '#0a0a33',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '15px',
  };

  return (
    <header style={headerStyle}>
      <div style={logoNavStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'black',
              borderRadius: '6px',
            }}
          />
          <span
            style={{ fontWeight: 600, fontSize: '18px', ...gradientText, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            Lyra
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '18px' }}>
          {tabs.map((t) => {
            const isActive = pathname === t.href || pathname?.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                style={isActive ? { ...navLinkActiveStyle, ...gradientText } : { ...navLinkStyle, ...gradientText }}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Log In / Sign Up button - aligned perfectly */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          style={buttonStyle}
          onClick={() => router.push('/login')}
        >
          Log In / Sign Up
        </button>
      </div>
    </header>
  );
}
