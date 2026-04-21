'use client';
// app/courses/sat-prep/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { STUDY_PLAN_LEVELS } from '@/lib/constants';
import { Play, CheckCircle2, Lock, BookOpen, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SATPage() {
  const [profile, setProfile] = useState<any>(null);
  const [studentPlan, setStudentPlan] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [dailyTasks, setDailyTasks] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'videos' | 'calendar'>('plan');
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { data: plan } = await supabase.from('student_plans').select('*').eq('user_id', user.id).single();
    setStudentPlan(plan);
    const { data: vids } = await supabase.from('lesson_videos').select('*').order('day_number').order('order_index');
    setVideos(vids || []);
    const { data: tasks } = await supabase.from('daily_task_completions').select('*').eq('user_id', user.id);
    setDailyTasks(tasks || []);
  };

  const choosePlan = async (level: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('student_plans').upsert({ user_id: user.id, plan_level: level, started_at: new Date().toISOString() });
    toast.success(`${STUDY_PLAN_LEVELS[level as keyof typeof STUDY_PLAN_LEVELS].label} plan activated!`);
    loadData();
  };

  const toggleDayTask = async (day: number, task: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const existing = dailyTasks.find(t => t.day_number === day && t.task_key === task);
    if (existing) {
      await supabase.from('daily_task_completions').delete().eq('id', existing.id);
      setDailyTasks(dailyTasks.filter(t => t.id !== existing.id));
    } else {
      const { data } = await supabase.from('daily_task_completions').insert({ user_id: user!.id, day_number: day, task_key: task, completed_at: new Date().toISOString() }).select().single();
      setDailyTasks([...dailyTasks, data]);
    }
  };

  const isDayDone = (day: number) => {
    const dayTasks = dailyTasks.filter(t => t.day_number === day);
    return dayTasks.length >= 3;
  };

  const today = Math.min(50, Math.max(1, studentPlan
    ? Math.ceil((Date.now() - new Date(studentPlan.started_at).getTime()) / (1000 * 60 * 60 * 24))
    : 1));

  const tabs = [
    { key: 'plan', label: 'Study Plan' },
    { key: 'videos', label: 'Video Lessons' },
    { key: 'calendar', label: '50-Day Calendar' },
  ];

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-display-sm font-black text-stoic-navy mb-2">SAT + IELTS Prep</h1>
          <p className="text-body-lg text-stoic-gray-mid">50-day structured program with video lessons and practice.</p>
        </div>

        {/* Choose plan if not selected */}
        {!studentPlan && (
          <div className="mb-8">
            <div className="card p-8 border-2 border-stoic-gold/30">
              <h2 className="text-xl font-black text-stoic-navy mb-2">Choose Your Study Plan</h2>
              <p className="text-stoic-gray-mid mb-8 text-body-md">Select the intensity that matches your schedule and goal.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {Object.entries(STUDY_PLAN_LEVELS).map(([key, plan]) => (
                  <div key={key} className={`rounded-3xl border-2 p-7 cursor-pointer hover:scale-[1.02] transition-all ${plan.color}`}
                    onClick={() => choosePlan(key)}>
                    <p className="text-xl font-black mb-2">{plan.label}</p>
                    <p className="text-sm mb-4 leading-relaxed opacity-90">{plan.description}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${plan.badge}`}>
                      {plan.hours}
                    </div>
                    <button className="mt-5 w-full bg-current/20 rounded-xl py-3 font-bold text-sm">
                      Choose {plan.label} <ChevronRight size={14} className="inline" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active plan banner */}
        {studentPlan && (
          <div className="bg-stoic-navy rounded-3xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-stoic-gold text-sm font-bold uppercase tracking-widest mb-1">Active Plan</p>
              <p className="text-white text-xl font-black">{STUDY_PLAN_LEVELS[studentPlan.plan_level as keyof typeof STUDY_PLAN_LEVELS]?.label} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-sm">Day</p>
              <p className="text-stoic-gold text-3xl font-black">{today}/50</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-stoic-gray rounded-2xl p-1.5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.key ? 'bg-white text-stoic-navy shadow-stoic' : 'text-stoic-gray-mid hover:text-stoic-navy'
              }`}>{t.label}</button>
          ))}
        </div>

        {/* PLAN TAB */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {studentPlan && (
              <div className="card p-8">
                <h2 className="text-xl font-black text-stoic-navy mb-6">Today's Study Tasks — Day {today}</h2>
                <div className="space-y-4">
                  {[
                    { key: 'watch', label: 'Watch today\'s lesson video', icon: '📺' },
                    { key: 'practice', label: 'Complete 20 practice questions', icon: '📝' },
                    { key: 'review', label: 'Review yesterday\'s mistakes', icon: '🔍' },
                    { key: 'vocab', label: 'Add 5 new vocabulary words', icon: '📚' },
                  ].map(task => {
                    const done = dailyTasks.some(t => t.day_number === today && t.task_key === task.key);
                    return (
                      <div key={task.key} onClick={() => toggleDayTask(today, task.key)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          done ? 'border-stoic-gold bg-stoic-gold/8' : 'border-stoic-border bg-white hover:border-stoic-navy/30'
                        }`}>
                        <span className="text-2xl">{task.icon}</span>
                        <p className={`flex-1 font-medium text-body-md ${done ? 'line-through text-stoic-gray-mid' : 'text-stoic-navy'}`}>
                          {task.label}
                        </p>
                        {done && <CheckCircle2 size={22} className="text-stoic-gold" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {currentVideo ? (
                <div className="card overflow-hidden">
                  <div className="aspect-video bg-stoic-navy relative">
                    <video src={currentVideo.video_url} controls className="w-full h-full" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      {currentVideo.day_number && <span className="badge-navy">Day {currentVideo.day_number}</span>}
                      {currentVideo.topic && <span className="badge-gold">{currentVideo.topic}</span>}
                    </div>
                    <h2 className="text-xl font-black text-stoic-navy mb-2">{currentVideo.title}</h2>
                    {currentVideo.description && <p className="text-stoic-gray-mid text-body-md leading-relaxed">{currentVideo.description}</p>}
                  </div>
                </div>
              ) : (
                <div className="card p-16 text-center">
                  <Play size={48} className="text-stoic-gray-mid mx-auto mb-4" />
                  <p className="text-xl font-bold text-stoic-navy mb-2">Select a video to watch</p>
                  <p className="text-stoic-gray-mid">Choose a lesson from the list on the right.</p>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {videos.length === 0 ? (
                <div className="card p-8 text-center">
                  <BookOpen size={32} className="text-stoic-gray-mid mx-auto mb-3" />
                  <p className="font-bold text-stoic-navy">Videos coming soon</p>
                  <p className="text-stoic-gray-mid text-sm mt-1">Your teacher is uploading lessons.</p>
                </div>
              ) : videos.map((vid, i) => {
                const locked = studentPlan && vid.day_number > today;
                return (
                  <button key={vid.id} disabled={locked} onClick={() => setCurrentVideo(vid)}
                    className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      currentVideo?.id === vid.id ? 'border-stoic-navy bg-stoic-navy/5' :
                      locked ? 'border-stoic-border bg-stoic-gray/50 opacity-60 cursor-not-allowed' :
                      'border-stoic-border bg-white hover:border-stoic-navy/40'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      locked ? 'bg-stoic-gray' : 'bg-stoic-navy'}`}>
                      {locked ? <Lock size={14} className="text-stoic-gray-mid" /> : <Play size={14} className="text-white" fill="white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stoic-navy text-sm truncate">{vid.title}</p>
                      {vid.day_number && <p className="text-xs text-stoic-gray-mid mt-0.5">Day {vid.day_number} · {vid.duration_minutes || '?'} min</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="card p-8">
            <h2 className="text-xl font-black text-stoic-navy mb-6">50-Day Calendar</h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {Array.from({ length: 50 }, (_, i) => i + 1).map(day => {
                const done = isDayDone(day);
                const isToday = day === today;
                const isFuture = day > today;
                return (
                  <div key={day} className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-bold border-2 transition-all ${
                    done ? 'bg-stoic-gold border-stoic-gold text-stoic-navy' :
                    isToday ? 'bg-stoic-navy border-stoic-navy text-white scale-110 shadow-stoic' :
                    isFuture ? 'bg-stoic-gray border-stoic-border text-stoic-gray-mid' :
                    'bg-red-50 border-red-200 text-red-500'
                  }`}>
                    <span>{day}</span>
                    {done && <span className="text-xs">✓</span>}
                    {isToday && <span className="text-xs opacity-70">today</span>}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-6 flex-wrap">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-stoic-gold" /><span className="text-sm text-stoic-gray-mid">Completed</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-stoic-navy" /><span className="text-sm text-stoic-gray-mid">Today</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100 border border-red-200" /><span className="text-sm text-stoic-gray-mid">Missed</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-stoic-gray border border-stoic-border" /><span className="text-sm text-stoic-gray-mid">Upcoming</span></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
