'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import './Footer.css';

export default function Footer() {
    const { theme } = useTheme();

    // Map theme to colors
    let footerVars = {};
    if (theme === 'gold') {
        footerVars = {
            '--footer-bg': '#0a0a33',
            '--footer-text': '#936d14',
            '--footer-border': '#374151',
            '--footer-subtext': '#9ca3af',
        };
    } else { // light
        footerVars = {
            '--footer-bg': '#99ccff',
            '--footer-text': '#003366',
            '--footer-border': '#d1d5db',
            '--footer-subtext': '#ffffff',
        };
    }

    return (
    <footer className="footer" style={footerVars}>
      {/* Top section */}
      <div className="topSection">
        <div className="columns">
          <div className="column">
            <h3 className={`heading ${theme === 'gold' ? 'gradient-text-gold' : 'gradient-text-blue'}`}>Legal</h3>
            <ul className="list">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Consumer Health Data Privacy Policy</Link></li>
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Cookie Policy</Link></li>
              <li><Link href="#">Intellectual Property</Link></li>
              <li><Link href="#">Accessibility Statement</Link></li>
            </ul>
          </div>

          <div className="column">
            <h3 className={`heading ${theme === 'gold' ? 'gradient-text-gold' : 'gradient-text-blue'}`}>Careers</h3>
            <ul className="list">
              <li><Link href="#">Careers Portal</Link></li>
              <li><Link href="#">Tech Blog</Link></li>
            </ul>
          </div>

          <div className="column">
            <h3 className={`heading ${theme === 'gold' ? 'gradient-text-gold' : 'gradient-text-blue'}`}>Social</h3>
          </div>

          <div className="column">
            <h3 className={`heading ${theme === 'gold' ? 'gradient-text-gold' : 'gradient-text-blue'}`}>FAQ</h3>
            <ul className="list">
              <li><Link href="#">Destinations</Link></li>
              <li><Link href="#">Press Room</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Promo Code</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* App download section */}
      <div className="appSection">
        <h3 className={`appHeading ${theme === 'gold' ? 'gradient-text-gold' : 'gradient-text-blue'}`}>Get the app!</h3>
        <div className="appLinks">
          <Link href="#">
            <Image src="/appstore.png" alt="App Store" width={135} height={40} />
          </Link>
          <Link href="#">
            <Image src="/googleplay.png" alt="Google Play" width={135} height={40} />
          </Link>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bottomSection">
        <div className="bottomLinks">
          <Link href="#">FAQ</Link>
          <span>/</span>
          <Link href="#">Safety Tips</Link>
          <span>/</span>
          <Link href="#">Terms</Link>
          <span>/</span>
          <Link href="#">Cookie Policy</Link>
          <span>/</span>
          <Link href="#">Privacy Settings</Link>
        </div>
        <div>© 2025 Endless Moments LLC, All Rights Reserved.</div>
      </div>
    </footer>
  );
}
