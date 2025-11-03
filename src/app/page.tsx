'use client';

import Link from 'next/link';

export default function Home() {
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        color: '#f0f4f8',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, #0b0c2a, #1a1a4f, #3b2f7f)',
      }}
    >

      <div style={{ width: '100%', position: 'relative' }}>
        <img
          src="/pexels-josh-hild-1270765-4606770.jpg"
          alt="Night sky"
          style={{
            width: '100%',
            display: 'block',
            height: 'auto',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            maskRepeat: 'no-repeat',
            maskSize: 'cover',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'cover',
          }}
        />
      </div>

      <main style={{ maxWidth: '1200px', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Welcome to{' '}
          <span style={gradientText}>Lyra</span>
        </h1>

        <p style={{ color: 'rgba(240,244,248,0.8)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          The next-generation dating app built for authenticity, safety, and real human energy.
          Choose <span style={gradientText}>Blind Mode</span> for slow discovery or
          <span style={gradientText}> Open Mode</span> for instant chemistry.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link
            href="/feed"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(90deg, #936d14, #ffffff)',
              color: 'black',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 10px 15px -3px rgba(255,217,91,0.3)',
              transition: 'opacity 0.2s',
            }}
          >
            Start Exploring →
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { title: 'Blind Mode', desc: 'Build connection before visuals. Reveal gradually.' },
            { title: 'Guardian AI', desc: 'Safety checks + smart nudges inside chat.' },
            { title: 'Match Energy', desc: 'Confetti pops + Lottie flows that feel alive.' },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem',
                borderRadius: '0.75rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
                minWidth: '200px',
              }}
            >
              <h3 style={{ fontWeight: 500, fontSize: '1.125rem', marginBottom: '0.5rem', ...gradientText }}>
                {card.title}
              </h3>
              <p style={{ color: 'rgba(240,244,248,0.7)', fontSize: '0.875rem' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', color: 'rgba(240,244,248,0.5)', fontSize: '0.875rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
