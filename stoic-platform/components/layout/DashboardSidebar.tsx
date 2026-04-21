'use client';
// components/layout/DashboardSidebar.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, BookOpen, Map, Clock, BookMarked,
  Target, LogOut, Settings, Users, Video, HelpCircle, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const studentNav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/journey', label: 'My Journey', icon: Map },
  { href: '/courses/sat-prep', label: 'SAT / IELTS Prep', icon: BookOpen },
  { href: '/courses/college-app', label: 'College Application', icon: Target },
  { href: '/dashboard/practice', label: 'Practice Questions', icon: HelpCircle },
  { href: '/dashboard/vocabulary', label: 'Vocabulary Notebook', icon: BookMarked },
  { href: '/dashboard/study-room', label: 'Study Room', icon: Clock },
];

const adminNav = [
  { href: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/universities', label: 'Universities', icon: Map },
  { href: '/admin/videos', label: 'Lesson Videos', icon: Video },
  { href: '/admin/questions', label: 'Questions', icon: HelpCircle },
];

interface Props {
  role?: string;
  userName?: string;
}

export default function DashboardSidebar({ role = 'student', userName = '' }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();
  const navItems = role === 'admin' || role === 'teacher' ? adminNav : studentNav;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-stoic-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-stoic-navy rounded-xl flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="7" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="10" r="2.5" fill="#C9A84C"/>
              <path d="M8 19 L12 23 L16 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-stoic-navy">STOIC</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-stoic-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stoic-gold rounded-full flex items-center justify-center text-stoic-navy font-bold text-sm">
            {userName ? userName[0].toUpperCase() : 'S'}
          </div>
          <div>
            <p className="font-semibold text-stoic-black text-sm">{userName || 'Student'}</p>
            <p className="text-xs text-stoic-gray-mid capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-stoic-navy text-white'
                  : 'text-stoic-gray-mid hover:text-stoic-black hover:bg-stoic-gray'
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-stoic-border space-y-1">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stoic-gray-mid hover:text-stoic-black hover:bg-stoic-gray transition-all">
          <Settings size={18} /> Settings
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-stoic-border rounded-xl p-2.5 shadow-stoic"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={clsx(
        'md:hidden fixed left-0 top-0 bottom-0 z-40 w-72 bg-white border-r border-stoic-border transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-72 min-h-screen bg-white border-r border-stoic-border fixed left-0 top-0 bottom-0">
        <SidebarContent />
      </div>
    </>
  );
}
