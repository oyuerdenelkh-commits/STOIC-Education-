'use client';
// app/admin/questions/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Plus, Trash2, HelpCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const TOPICS = ['SAT Math', 'SAT Reading', 'SAT Writing', 'IELTS Listening', 'IELTS Reading', 'IELTS Writing', 'General'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function AdminQuestionsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    question_text: '', topic: 'SAT Math', difficulty: 'medium', explanation: '',
    choice_a: '', choice_b: '', choice_c: '', choice_d: '', correct_answer: '',
  });
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { data: qs } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
    setQuestions(qs || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const choices = [form.choice_a, form.choice_b, form.choice_c, form.choice_d].filter(Boolean);
    if (choices.length < 2) { toast.error('Add at least 2 answer choices'); return; }
    if (!form.correct_answer) { toast.error('Select the correct answer'); return; }

    await supabase.from('questions').insert({
      question_text: form.question_text,
      choices,
      correct_answer: form.correct_answer,
      explanation: form.explanation,
      topic: form.topic,
      difficulty: form.difficulty,
    });

    toast.success('Question added!');
    setForm({ question_text: '', topic: 'SAT Math', difficulty: 'medium', explanation: '', choice_a: '', choice_b: '', choice_c: '', choice_d: '', correct_answer: '' });
    setShowForm(false);
    loadData();
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    await supabase.from('questions').delete().eq('id', id);
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Question deleted');
  };

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-display-sm font-black text-stoic-navy mb-2">Practice Questions</h1>
            <p className="text-body-lg text-stoic-gray-mid">{questions.length} questions in bank</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} /> Add Question
          </button>
        </div>

        {showForm && (
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-black text-stoic-navy mb-6">New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Question *</label>
                <textarea value={form.question_text} onChange={e => setForm({...form, question_text: e.target.value})}
                  className="input" rows={3} placeholder="Enter the question text..." required />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="label">Topic</label>
                  <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="input">
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="input">
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Answer Choices *</label>
                <p className="text-xs text-stoic-gray-mid mb-3">Fill in the choices and select which one is correct below</p>
                <div className="grid grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => {
                    const key = `choice_${letter.toLowerCase()}` as keyof typeof form;
                    return (
                      <div key={letter} className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-stoic-navy text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">{letter}</span>
                        <input type="text" value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                          className="input flex-1" placeholder={`Choice ${letter}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="label">Correct Answer *</label>
                <select value={form.correct_answer} onChange={e => setForm({...form, correct_answer: e.target.value})} className="input" required>
                  <option value="">Select correct answer</option>
                  {['A', 'B', 'C', 'D'].map(l => {
                    const val = form[`choice_${l.toLowerCase()}` as keyof typeof form];
                    return val ? <option key={l} value={val}>{l}: {val}</option> : null;
                  })}
                </select>
              </div>

              <div>
                <label className="label">Explanation</label>
                <textarea value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})}
                  className="input" rows={2} placeholder="Explain why the correct answer is right..." />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Save Question</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="card p-16 text-center">
            <HelpCircle size={48} className="text-stoic-gray-mid mx-auto mb-4" />
            <p className="text-xl font-bold text-stoic-navy mb-2">No questions yet</p>
            <p className="text-stoic-gray-mid mb-6">Add your first practice question to get started.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mx-auto"><Plus size={18} /> Add First Question</button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={q.id} className="card overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <span className="text-2xl font-black text-stoic-border w-8 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stoic-navy truncate">{q.question_text}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="badge-navy text-xs">{q.topic}</span>
                      <span className={`badge text-xs ${
                        q.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                        q.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'}`}>{q.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setExpandedId(expandedId === q.id ? null : q.id)} className="btn-ghost text-sm px-3 py-2">
                      <ChevronDown size={16} className={`transition-transform ${expandedId === q.id ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => deleteQuestion(q.id)} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-stoic-gray-mid">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {expandedId === q.id && (
                  <div className="border-t border-stoic-border p-6 bg-stoic-gray/30">
                    <p className="font-medium text-stoic-navy mb-4">{q.question_text}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {(q.choices || []).map((c: string, ci: number) => (
                        <div key={ci} className={`flex items-center gap-2 p-3 rounded-xl text-sm ${c === q.correct_answer ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border border-stoic-border'}`}>
                          <span className="font-mono font-bold">{['A','B','C','D'][ci]}.</span> {c}
                          {c === q.correct_answer && <span className="ml-auto">✓</span>}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="bg-stoic-gold/8 border border-stoic-gold/20 rounded-xl p-4">
                        <p className="text-sm font-semibold text-stoic-navy mb-1">Explanation:</p>
                        <p className="text-sm text-stoic-navy/80">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
