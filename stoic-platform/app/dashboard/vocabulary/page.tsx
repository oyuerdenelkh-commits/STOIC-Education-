'use client';
// app/dashboard/vocabulary/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Plus, BookMarked, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function VocabularyPage() {
  const [words, setWords] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ word: '', meaning: '', example: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { data: vocab } = await supabase.from('vocabulary').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setWords(vocab || []);
  };

  const addWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim() || !form.meaning.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('vocabulary').insert({ user_id: user!.id, ...form });
    toast.success(`"${form.word}" added to your notebook!`);
    setForm({ word: '', meaning: '', example: '' });
    setShowForm(false);
    setLoading(false);
    loadData();
  };

  const deleteWord = async (id: string) => {
    await supabase.from('vocabulary').delete().eq('id', id);
    setWords(words.filter(w => w.id !== id));
    toast.success('Word removed');
  };

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-display-sm font-black text-stoic-navy mb-2">Vocabulary Notebook</h1>
            <div className="flex items-center gap-3">
              <div className="badge-gold">
                <BookMarked size={12} className="mr-1" />
                {words.length} words collected
              </div>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} /> Add Word
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-black text-stoic-navy mb-6">Add New Word</h2>
            <form onSubmit={addWord} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Word *</label>
                  <input type="text" value={form.word} onChange={e => setForm({...form, word: e.target.value})}
                    className="input" placeholder="e.g. Ubiquitous" required />
                </div>
                <div>
                  <label className="label">Meaning *</label>
                  <input type="text" value={form.meaning} onChange={e => setForm({...form, meaning: e.target.value})}
                    className="input" placeholder="e.g. Present everywhere" required />
                </div>
              </div>
              <div>
                <label className="label">Example Sentence (optional)</label>
                <input type="text" value={form.example} onChange={e => setForm({...form, example: e.target.value})}
                  className="input" placeholder="e.g. Smartphones have become ubiquitous in modern life." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Word'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stoic-gray-mid" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-12" placeholder="Search your vocabulary..." />
        </div>

        {/* Words grid */}
        {filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <BookMarked size={48} className="text-stoic-gray-mid mx-auto mb-4" />
            <p className="text-xl font-bold text-stoic-navy mb-2">No words yet</p>
            <p className="text-stoic-gray-mid mb-6">Start building your vocabulary notebook. Add words you encounter during SAT or IELTS prep.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
              <Plus size={18} /> Add Your First Word
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(word => (
              <div key={word.id} className="card p-6 group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-black text-stoic-navy">{word.word}</h3>
                  <button onClick={() => deleteWord(word.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-body-md text-stoic-navy/80 font-medium mb-3">{word.meaning}</p>
                {word.example && (
                  <p className="text-sm text-stoic-gray-mid italic border-l-2 border-stoic-gold/40 pl-3 leading-relaxed">
                    "{word.example}"
                  </p>
                )}
                <p className="text-xs text-stoic-gray-mid mt-4">
                  {format(new Date(word.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
