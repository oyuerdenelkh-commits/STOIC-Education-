'use client';
// app/dashboard/study-room/page.tsx
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Play, Square, Clock, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudyRoomPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myTotal, setMyTotal] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - seconds * 1000;
      intervalRef.current = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);

    const { data: mysessions } = await supabase.from('study_sessions').select('duration_minutes').eq('user_id', user.id);
    const total = mysessions?.reduce((a, s) => a + (s.duration_minutes || 0), 0) || 0;
    setMyTotal(total);

    // Leaderboard: aggregate study minutes per user
    const { data: lb } = await supabase.rpc('get_study_leaderboard').limit(20);
    setLeaderboard(lb || []);
  };

  const startSession = () => {
    setIsRunning(true);
    setSeconds(0);
    toast.success('Study session started! Stay focused.');
  };

  const stopSession = async () => {
    setIsRunning(false);
    const mins = Math.round(seconds / 60);
    if (mins < 1) { toast('Session too short to record.'); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('study_sessions').insert({
      user_id: user.id,
      duration_minutes: mins,
      started_at: new Date(Date.now() - seconds * 1000).toISOString(),
      ended_at: new Date().toISOString(),
    });

    setSeconds(0);
    toast.success(`Great session! ${mins} minutes logged.`);
    loadData();
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-display-sm font-black text-stoic-navy mb-2">Study Room</h1>
          <p className="text-body-lg text-stoic-gray-mid">Track your study time. See the community studying.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer */}
          <div className="card-dark p-10 text-center">
            <p className="text-stoic-gold text-sm font-bold uppercase tracking-widest mb-8">Session Timer</p>
            <div className="text-8xl font-black text-white mb-10 tabular-nums tracking-tight">
              {formatTime(seconds)}
            </div>
            <div className="mb-8">
              <div className="progress-bar h-1.5 bg-white/10">
                <div className="h-full bg-stoic-gold rounded-full transition-all" style={{ width: isRunning ? '100%' : '0%', transition: isRunning ? 'width 0.5s linear' : 'none' }} />
              </div>
            </div>
            {!isRunning ? (
              <button onClick={startSession} className="btn-gold text-xl px-12 py-5 w-full justify-center">
                <Play size={24} fill="currentColor" /> Start Studying
              </button>
            ) : (
              <button onClick={stopSession} className="w-full flex items-center justify-center gap-3 bg-red-500 text-white text-xl font-bold px-12 py-5 rounded-2xl hover:bg-red-600 transition-all">
                <Square size={24} fill="currentColor" /> Stop & Save
              </button>
            )}
            <div className="mt-8 bg-white/5 rounded-2xl p-5">
              <p className="text-white/50 text-sm mb-1">My Total Study Time</p>
              <p className="text-3xl font-black text-stoic-gold">{Math.round(myTotal / 60)}h {myTotal % 60}m</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-8">
              <Trophy size={22} className="text-stoic-gold" />
              <h2 className="text-xl font-black text-stoic-navy">Today's Leaders</h2>
            </div>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stoic-gray-mid text-body-lg">No sessions today yet.</p>
                <p className="text-stoic-gray-mid text-sm mt-2">Be the first to study!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry: any, i: number) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl ${
                    entry.user_id === profile?.id ? 'bg-stoic-gold/10 border border-stoic-gold/30' : 'bg-stoic-gray'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      i === 0 ? 'bg-stoic-gold text-stoic-navy' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-amber-600 text-white' :
                      'bg-stoic-gray-mid/20 text-stoic-gray-mid'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-stoic-navy text-sm">
                        {entry.full_name || 'Student'}
                        {entry.user_id === profile?.id && <span className="text-stoic-gold ml-2">(you)</span>}
                      </p>
                      <p className="text-xs text-stoic-gray-mid">{entry.grade || ''}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-stoic-navy font-bold">
                      <Clock size={14} className="text-stoic-gold" />
                      <span>{Math.round(entry.total_minutes / 60)}h {entry.total_minutes % 60}m</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stoic motivator */}
        <div className="mt-8 bg-stoic-navy/5 border border-stoic-navy/10 rounded-3xl p-8 text-center">
          <p className="text-stoic-navy text-xl italic font-medium mb-3">
            "No person has the power to have everything they want, but it is in their power not to want what they don't have."
          </p>
          <p className="text-stoic-gold text-sm font-bold uppercase tracking-widest">— Seneca</p>
        </div>
      </main>
    </div>
  );
}
