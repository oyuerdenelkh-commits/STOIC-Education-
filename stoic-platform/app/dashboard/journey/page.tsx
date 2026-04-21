'use client';
// app/dashboard/journey/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { JOURNEY_CATEGORIES, COUNTRIES, STOIC_QUOTES } from '@/lib/constants';
import { CheckCircle2, Circle, Plus, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JourneyPage() {
  const [profile, setProfile] = useState<any>(null);
  const [journeySetup, setJourneySetup] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>('essays');
  const [setupMode, setSetupMode] = useState(false);
  const [setupForm, setSetupForm] = useState({ country: '', university: '', program: '' });
  const [newTask, setNewTask] = useState<{cat: string, text: string} | null>(null);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { data: setup } = await supabase.from('journey_setup').select('*').eq('user_id', user.id).single();
    setJourneySetup(setup);
    if (!setup) { setSetupMode(true); return; }
    const { data: journeyItems } = await supabase.from('journey_items').select('*').eq('user_id', user.id).order('created_at');
    setItems(journeyItems || []);
  };

  const saveSetup = async () => {
    if (!setupForm.country || !setupForm.university) { toast.error('Please fill in country and university'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('journey_setup').upsert({ user_id: user!.id, ...setupForm });

    // Seed default tasks for each category
    const defaultTasks = JOURNEY_CATEGORIES.flatMap(cat => [
      { user_id: user!.id, category: cat.key, task: `Start ${cat.label}`, completed: false, deadline: null, notes: '' },
    ]);
    await supabase.from('journey_items').insert(defaultTasks);
    toast.success('Journey started! Your tracker is ready.');
    setSetupMode(false);
    loadData();
  };

  const toggleItem = async (item: any) => {
    const updated = { ...item, completed: !item.completed };
    await supabase.from('journey_items').update({ completed: updated.completed }).eq('id', item.id);
    setItems(items.map(i => i.id === item.id ? updated : i));
  };

  const addTask = async (category: string) => {
    if (!newTask?.text?.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('journey_items').insert({
      user_id: user!.id, category, task: newTask.text, completed: false,
    }).select().single();
    setItems([...items, data]);
    setNewTask(null);
    toast.success('Task added!');
  };

  const totalDone = items.filter(i => i.completed).length;
  const totalTasks = items.length;
  const pct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  const quote = STOIC_QUOTES[2];

  // Setup mode
  if (setupMode) {
    return (
      <div className="flex min-h-screen bg-stoic-gray">
        <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
        <main className="flex-1 md:ml-72 p-6 md:p-10 flex items-center justify-center">
          <div className="card p-12 max-w-xl w-full">
            <div className="text-center mb-10">
              <Globe size={48} className="text-stoic-gold mx-auto mb-4" />
              <h1 className="text-display-sm font-black text-stoic-navy mb-3">Start Your Journey</h1>
              <p className="text-body-lg text-stoic-gray-mid">Tell us about your study abroad goal and we'll build your personal tracker.</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="label">Target Country</label>
                <select value={setupForm.country} onChange={e => setSetupForm({...setupForm, country: e.target.value})} className="input">
                  <option value="">Choose a country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Dream University</label>
                <input type="text" value={setupForm.university} onChange={e => setSetupForm({...setupForm, university: e.target.value})}
                  className="input" placeholder="e.g. UCLA, University of Melbourne..." />
              </div>
              <div>
                <label className="label">Program / Major</label>
                <input type="text" value={setupForm.program} onChange={e => setSetupForm({...setupForm, program: e.target.value})}
                  className="input" placeholder="e.g. Computer Science, Business..." />
              </div>
              <button onClick={saveSetup} className="btn-gold w-full justify-center text-lg py-5">
                Build My Tracker →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-display-sm font-black text-stoic-navy mb-2">My Study Abroad Journey</h1>
          {journeySetup && (
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="badge-gold">{journeySetup.country}</span>
              <span className="badge-navy">{journeySetup.university}</span>
              {journeySetup.program && <span className="badge bg-stoic-gray text-stoic-gray-mid border border-stoic-border">{journeySetup.program}</span>}
            </div>
          )}
        </div>

        {/* Overall progress */}
        <div className="card p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-black text-stoic-navy">{pct}%</p>
              <p className="text-stoic-gray-mid text-sm">{totalDone} of {totalTasks} tasks completed</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-1">Overall Progress</p>
              <p className="text-stoic-gray-mid text-xs italic">"{quote.text.slice(0,60)}..."</p>
            </div>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-fill-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Category checklist */}
        <div className="space-y-4">
          {JOURNEY_CATEGORIES.map(cat => {
            const catItems = items.filter(i => i.category === cat.key);
            const catDone = catItems.filter(i => i.completed).length;
            const catPct = catItems.length > 0 ? Math.round((catDone / catItems.length) * 100) : 0;
            const isOpen = expandedCat === cat.key;

            return (
              <div key={cat.key} className="card overflow-hidden">
                <button onClick={() => setExpandedCat(isOpen ? null : cat.key)}
                  className="w-full flex items-center gap-4 p-6 hover:bg-stoic-gray/50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}15` }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-stoic-navy text-lg">{cat.label}</p>
                      <span className="text-sm text-stoic-gray-mid">{catDone}/{catItems.length}</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${catPct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={18} className="text-stoic-gray-mid flex-shrink-0" /> : <ChevronDown size={18} className="text-stoic-gray-mid flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="border-t border-stoic-border px-6 pb-6">
                    <div className="pt-4 space-y-3">
                      {catItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 group">
                          <button onClick={() => toggleItem(item)} className="mt-0.5 flex-shrink-0">
                            {item.completed
                              ? <CheckCircle2 size={22} className="text-stoic-gold" />
                              : <Circle size={22} className="text-stoic-gray-mid group-hover:text-stoic-navy transition-colors" />}
                          </button>
                          <div className="flex-1">
                            <p className={`text-body-md font-medium transition-all ${item.completed ? 'line-through text-stoic-gray-mid' : 'text-stoic-navy'}`}>
                              {item.task}
                            </p>
                            {item.deadline && <p className="text-xs text-stoic-gray-mid mt-1">Due: {item.deadline}</p>}
                          </div>
                        </div>
                      ))}

                      {/* Add task inline */}
                      {newTask?.cat === cat.key ? (
                        <div className="flex gap-2 mt-2">
                          <input type="text" value={newTask.text} autoFocus
                            onChange={e => setNewTask({ cat: cat.key, text: e.target.value })}
                            onKeyDown={e => { if (e.key === 'Enter') addTask(cat.key); if (e.key === 'Escape') setNewTask(null); }}
                            className="input flex-1 py-2.5 text-sm" placeholder="Task description... (Enter to save)" />
                          <button onClick={() => addTask(cat.key)} className="btn-primary px-4 py-2.5 text-sm">Save</button>
                          <button onClick={() => setNewTask(null)} className="btn-ghost px-4 py-2.5 text-sm">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setNewTask({ cat: cat.key, text: '' })}
                          className="flex items-center gap-2 text-stoic-gray-mid hover:text-stoic-navy text-sm font-medium mt-2 transition-colors">
                          <Plus size={16} /> Add task
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
