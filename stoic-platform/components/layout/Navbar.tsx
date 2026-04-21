'use client';
// components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-stoic-white/95 backdrop-blur-md border-b border-stoic-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-stoic-navy rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="7" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="10" r="2.5" fill="#C9A84C"/>
              <path d="M8 19 L12 23 L16 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-stoic-navy">STOIC</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#courses" className="text-body-md font-medium text-stoic-gray-mid hover:text-stoic-navy transition-colors">Courses</Link>
          <Link href="/#success" className="text-body-md font-medium text-stoic-gray-mid hover:text-stoic-navy transition-colors">Success Stories</Link>
          <Link href="/dashboard/study-room" className="text-body-md font-medium text-stoic-gray-mid hover:text-stoic-navy transition-colors">Study Room</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
              <button onClick={handleSignOut} className="btn-outline text-sm px-5 py-2.5">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
              <Link href="/auth/signup" className="btn-primary text-sm px-6 py-3">
                Start Your Journey <ChevronRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-stoic-white border-t border-stoic-border px-6 py-6 flex flex-col gap-4">
          <Link href="/#courses" className="text-body-lg font-medium" onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link href="/#success" className="text-body-lg font-medium" onClick={() => setMenuOpen(false)}>Success Stories</Link>
          <Link href="/dashboard/study-room" className="text-body-lg font-medium" onClick={() => setMenuOpen(false)}>Study Room</Link>
          {user ? (
            <Link href="/dashboard" className="btn-primary mt-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          ) : (
            <Link href="/auth/signup" className="btn-primary mt-2" onClick={() => setMenuOpen(false)}>Start Your Journey</Link>
          )}
        </div>
      )}
    </nav>
  );
}
