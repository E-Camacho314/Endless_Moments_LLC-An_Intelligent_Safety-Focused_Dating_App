
import './globals.css';
import './fonts.css';
import './tailwind.css';
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar'; // ✅ Keep
// import RouteTransition from '@/components/RouteTransition'; // ❌ Disable for now

export const metadata: Metadata = {
  title: 'Lyra',
  description: 'Premium dating for campus & young pros',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="min-h-screen">
        {/* ✅ Global Nav */}
        <NavBar />

        {/* ✅ Page container */}
        <main className="mx-auto max-w-6xl px-4 py-6">
          {/* <RouteTransition>{children}</RouteTransition> */}
          {children}
        </main>
      </body>
    </html>
  );
}

