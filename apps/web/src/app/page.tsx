'use client';

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const cards = [
    { title: 'Blind Mode', desc: 'Build connection before visuals. Reveal gradually.' },
    { title: 'Guardian AI', desc: 'Safety checks + smart nudges inside chat.' },
    { title: 'Match Energy', desc: 'Confetti pops + Lottie flows that feel alive.' },
  ];

  const heroImage =
    theme === 'blue'
      ? '/light_mode_couple.jpg'
      : '/pexels-josh-hild-1270765-4606770.jpg';

  return (
    <div className="main-container">

      <div className="hero-img">
        <img src={heroImage} alt="Hero" />
      </div>

      <main style={{ maxWidth: '1200px', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Welcome to <span>Lyra</span>
        </h1>

        <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          The next-generation dating app built for authenticity, safety, and real human energy.
          Choose <span>Blind Mode</span> for slow discovery or <span>Open Mode</span> for instant chemistry.
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/feed" className="button-primary">
            Start Exploring →
          </Link>
        </div>

        <div className="cards-container">
          {cards.map((card, i) => (
            <div key={i} className="card">
              <h3><span>{card.title}</span></h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer>
        Made with ❤️ by Team Lyra — Student Launch Edition
      </footer>
    </div>
  );
}
