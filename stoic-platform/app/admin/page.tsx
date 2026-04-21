// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Users, BookOpen, Video, HelpCircle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || !['admin', 'teacher'].includes(profile.role)) redirect('/dashboard');

  const [
    { count: studentCount },
    { count: videoCount },
    { count: questionCount },
    { data: recentStudents },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('lesson_videos').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile.role} userName={profile.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="mb-10">
          <p className="text-stoic-gray-mid text-lg mb-1">Admin Panel</p>
          <h1 className="text-display-sm font-black text-stoic-navy">STOIC Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Students', value: studentCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/students' },
            { label: 'Lesson Videos', value: videoCount || 0, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/videos' },
            { label: 'Questions', value: questionCount || 0, icon: HelpCircle, color: 'text-stoic-gold', bg: 'bg-stoic-gold/10', href: '/admin/questions' },
            { label: 'Universities', value: '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/universities' },
          ].map(s => (
            <Link key={s.label} href={s.href} className="card p-6 hover:border-stoic-navy/30 group">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-black text-stoic-navy mb-1">{s.value}</p>
              <p className="text-sm text-stoic-gray-mid font-medium">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent students */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-stoic-navy">Recent Students</h2>
              <Link href="/admin/students" className="text-sm text-stoic-gold font-bold hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {(recentStudents || []).map((s: any) => (
                <div key={s.id} className="flex items-center gap-4 p-4 bg-stoic-gray rounded-2xl">
                  <div className="w-10 h-10 bg-stoic-navy rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {s.full_name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stoic-navy text-sm truncate">{s.full_name || 'Unknown'}</p>
                    <p className="text-xs text-stoic-gray-mid truncate">{s.email}</p>
                  </div>
                  <span className="badge-navy text-xs">{s.grade || 'N/A'}</span>
                </div>
              ))}
              {(!recentStudents || recentStudents.length === 0) && (
                <p className="text-stoic-gray-mid text-center py-8">No students yet</p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-8">
            <h2 className="text-xl font-black text-stoic-navy mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { href: '/admin/videos', label: 'Upload a new lesson video', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
                { href: '/admin/questions', label: 'Add practice questions', icon: HelpCircle, color: 'text-stoic-gold', bg: 'bg-stoic-gold/10' },
                { href: '/admin/universities', label: 'Add a university', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                { href: '/admin/students', label: 'View student progress', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-stoic-border hover:border-stoic-navy/30 bg-white transition-all group">
                  <div className={`w-10 h-10 ${a.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <a.icon size={18} className={a.color} />
                  </div>
                  <span className="font-semibold text-stoic-navy group-hover:text-stoic-gold transition-colors">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
