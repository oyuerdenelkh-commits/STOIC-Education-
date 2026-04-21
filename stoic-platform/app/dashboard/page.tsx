// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { BookOpen, Target, Clock, BookMarked, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { STOIC_QUOTES } from '@/lib/constants';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: studySessions } = await supabase.from('study_sessions').select('duration_minutes').eq('user_id', user.id);
  const { data: vocabWords } = await supabase.from('vocabulary').select('id').eq('user_id', user.id);
  const { data: journeyItems } = await supabase.from('journey_items').select('*').eq('user_id', user.id);

  const totalStudyHours = Math.round((studySessions?.reduce((a, s) => a + (s.duration_minutes || 0), 0) || 0) / 60);
  const vocabCount = vocabWords?.length || 0;
  const completedItems = journeyItems?.filter(i => i.completed).length || 0;
  const totalItems = journeyItems?.length || 0;
  const journeyProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const randomQuote = STOIC_QUOTES[new Date().getDay() % STOIC_QUOTES.length];
  const firstName = profile?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-stoic-gray-mid text-lg mb-2">Good {getTimeOfDay()},</p>
          <h1 className="text-display-sm font-black text-stoic-navy">{firstName} 👋</h1>
        </div>

        {/* Stoic quote of the day */}
        <div className="bg-stoic-navy rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-stoic-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-4">Quote of the Day</p>
          <p className="text-white text-xl font-medium italic leading-relaxed mb-4 max-w-2xl">
            "{randomQuote.text}"
          </p>
          <p className="text-stoic-gold text-sm font-bold uppercase tracking-widest">— {randomQuote.author}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Study Hours', value: totalStudyHours, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Journey Progress', value: `${journeyProgress}%`, icon: Target, color: 'text-stoic-gold', bg: 'bg-stoic-gold/10' },
            { label: 'Vocab Words', value: vocabCount, icon: BookMarked, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Tasks Done', value: `${completedItems}/${totalItems}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(s => (
            <div key={s.label} className="card p-6">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-black text-stoic-navy mb-1">{s.value}</p>
              <p className="text-sm text-stoic-gray-mid font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-8">
            <h2 className="text-xl font-black text-stoic-navy mb-2">My Study Abroad Journey</h2>
            <p className="text-stoic-gray-mid mb-6 text-body-md">Track your application checklist from start to acceptance.</p>
            <div className="progress-bar mb-3">
              <div className="progress-fill-gold" style={{ width: `${journeyProgress}%` }} />
            </div>
            <p className="text-sm text-stoic-gray-mid mb-6">{journeyProgress}% complete — {completedItems} of {totalItems} tasks done</p>
            <Link href="/dashboard/journey" className="btn-primary w-full justify-center">
              Continue Journey <ArrowRight size={18} />
            </Link>
          </div>

          <div className="card-dark p-8">
            <h2 className="text-xl font-black text-white mb-2">SAT + IELTS Prep</h2>
            <p className="text-white/60 mb-6 text-body-md">50-day structured program. Choose your intensity level.</p>
            <div className="flex items-center gap-3 mb-6">
              {['Hardcore', 'Mid', 'Light'].map(l => (
                <span key={l} className="badge bg-white/10 text-white border-white/20">{l}</span>
              ))}
            </div>
            <Link href="/courses/sat-prep" className="btn-gold w-full justify-center">
              Go to SAT Prep <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="card p-8">
          <h2 className="text-xl font-black text-stoic-navy mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/dashboard/practice', label: 'Practice Questions', icon: BookOpen },
              { href: '/dashboard/vocabulary', label: 'Vocabulary', icon: BookMarked },
              { href: '/dashboard/study-room', label: 'Study Room', icon: Clock },
              { href: '/courses/college-app', label: 'College App', icon: Target },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-stoic-gray hover:bg-stoic-navy hover:text-white transition-all duration-200 group text-center">
                <a.icon size={24} className="text-stoic-navy group-hover:text-stoic-gold transition-colors" />
                <span className="text-sm font-semibold text-stoic-navy group-hover:text-white transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
