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
  { href: '/verify', label: 'Verification' }, // ✅ Added verification tab
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
    padding: '12px 24px',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 50,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };

  const logoNavStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    color: 'white',
    transition: 'background 0.2s ease',
  };

  const navLinkActiveStyle: React.CSSProperties = {
    ...navLinkStyle,
    backgroundColor: '#290f5a',
  };

  const rightButtonsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: '1px solid black',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #936d14, #ffffff)',
    color: '#290f5a',
    fontWeight: 600,
    cursor: 'pointer',
  };

  const userCircleStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'black',
    color: 'white',
    display: 'grid',
    placeItems: 'center',
    fontSize: '10px',
    fontWeight: 600,
  };

  return (
    <header style={headerStyle}>
      {/* Left: Logo + Nav */}
      <div style={logoNavStyle}>
        <div style={logoStyle}>
          <div style={{ width: 40, height: 40, backgroundColor: 'black', borderRadius: '6px' }} />
          <span style={{ fontWeight: 600, fontSize: '18px', ...gradientText }} onClick={() => router.push('/')}>
            Lyra
          </span>
        </div>

        <nav style={navStyle}>
          {tabs.map((t) => {
            const isActive =
              pathname === t.href || (t.href !== '/' && pathname?.startsWith(t.href));
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

      {/* Right: Buttons */}
      <div style={rightButtonsStyle}>
        <button
          style={buttonStyle}
          onClick={() => router.push('/verify')}
        >
          Verify
        </button> {/* ✅ Added Verification button */}
        <button
          style={buttonStyle}
          onClick={() => router.push('/profile')}
        >
          Log In
        </button>
        <div style={userCircleStyle}>ME</div>
      </div>
    </header>
  );
}
