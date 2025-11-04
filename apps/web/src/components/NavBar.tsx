'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './NavBar.css';

const tabs = [
  { href: '/feed', label: 'Discover' },
  { href: '/chat', label: 'Chats' },
  { href: '/events', label: 'Events' },
  { href: '/reports', label: 'Safety' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/admin/moderation', label: 'Admin' },
  { href: '/verify', label: 'Verification' },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isGold = theme === 'gold';

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: isGold ? '#0a0a33' : '#e0f2ff',
    padding: '12px 24px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0, // ✅ ensures it stays within the viewport
    width: '100%',
    zIndex: 50,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: isGold ? 'white' : '#1e3a8a',
    boxSizing: 'border-box', // ✅ keeps padding from pushing content off-screen
    overflowX: 'auto', // ✅ allows scrolling if there are too many tabs
  };  

  const buttonStyle: React.CSSProperties = {
    padding: '4px 10px', // smaller button
    border: 'none',
    borderRadius: '4px',
    background: isGold
      ? 'linear-gradient(90deg, #936d14, #ffffff)'
      : 'linear-gradient(90deg, #93c5fd, #3b82f6)',
    color: isGold ? '#290f5a' : 'white',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '13px',
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'background 0.2s ease',
  };

  return (
    <header style={headerStyle}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          className={isGold ? 'gradient-text-gold' : 'gradient-text-blue'}
          style={{
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            lineHeight: '1',
          }}
          onClick={() => router.push('/')}
        >
          Lyra
        </span>

        <nav style={{ display: 'flex', gap: '10px' }}>
          {tabs.map((t) => {
            const isActive =
              pathname === t.href || (t.href !== '/' && pathname?.startsWith(t.href));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={isGold ? 'gradient-text-gold' : 'gradient-text-blue'}
                style={{
                  ...navLinkStyle,
                  backgroundColor: isActive
                    ? isGold
                      ? '#290f5a'
                      : '#bfdbfe'
                    : 'transparent',
                }}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={buttonStyle} onClick={toggleTheme}>
          Switch Theme
        </button>
        <button
        style={buttonStyle}
        onClick={() => router.push('/profile')}
      >
        Log In
      </button>
      </div>
    </header>
  );
}
