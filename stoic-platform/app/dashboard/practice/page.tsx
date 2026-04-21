'use client';
// app/dashboard/practice/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { CheckCircle2, XCircle, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

type Question = {
  id: string; question_text: string; choices: string[];
  correct_answer: string; explanation: string; topic: string;
  difficulty: string; tags: string[];
};

export default function PracticePage() {
  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showMistake, setShowMistake] = useState(false);
  const [mistakeReason, setMistakeReason] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [filter, setFilter] = useState({ topic: 'all', difficulty: 'all' });
  const [sessionDone, setSessionDone] = useState(false);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    let query = supabase.from('questions').select('*').limit(10);
    if (filter.topic !== 'all') query = query.eq('topic', filter.topic);
    if (filter.difficulty !== 'all') query = query.eq('difficulty', filter.difficulty);
    const { data: qs } = await query;
    setQuestions(qs || []);
  };

  const submit = async () => {
    if (!selected) return;
    const q = questions[current];
    const isCorrect = selected === q.correct_answer;
    setSubmitted(true);
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('question_attempts').insert({
      user_id: user.id,
      question_id: q.id,
      selected_answer: selected,
      is_correct: isCorrect,
    });

    if (!isCorrect) setShowMistake(true);
  };

  const saveMistakeReason = async () => {
    if (!mistakeReason.trim()) { setShowMistake(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const q = questions[current];
    await supabase.from('mistake_notes').insert({
      user_id: user!.id,
      question_id: q.id,
      reason: mistakeReason,
    });
    setShowMistake(false);
    setMistakeReason('');
    toast.success('Mistake noted — you\'ll learn from this!');
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
      setShowMistake(false);
    } else {
      setSessionDone(true);
    }
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setSubmitted(false);
    setScore({ correct: 0, total: 0 }); setSessionDone(false);
    loadData();
  };

  if (sessionDone) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="flex min-h-screen bg-stoic-gray">
        <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
        <main className="flex-1 md:ml-72 p-6 md:p-10 flex items-center justify-center">
          <div className="card p-12 max-w-md w-full text-center">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${pct >= 70 ? 'bg-stoic-gold/15' : 'bg-stoic-gray'}`}>
              <span className="text-4xl font-black text-stoic-navy">{pct}%</span>
            </div>
            <h2 className="text-display-sm font-black text-stoic-navy mb-2">Session Complete</h2>
            <p className="text-body-lg text-stoic-gray-mid mb-2">{score.correct} out of {score.total} correct</p>
            <p className="text-stoic-gray-mid italic text-sm mb-8">
              {pct >= 80 ? '"Well done is better than well said." — Benjamin Franklin' :
               pct >= 60 ? '"The obstacle is the way." — Marcus Aurelius' :
               '"We suffer more in imagination than in reality." — Seneca'}
            </p>
            <button onClick={restart} className="btn-primary w-full justify-center">
              <RefreshCw size={18} /> Practice Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-display-sm font-black text-stoic-navy mb-2">Practice Questions</h1>
            <p className="text-body-lg text-stoic-gray-mid">SAT & IELTS question bank</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="badge-gold">{score.correct}/{score.total} correct</div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="card p-16 text-center">
            <BookOpen size={48} className="text-stoic-gray-mid mx-auto mb-4" />
            <p className="text-xl font-bold text-stoic-navy mb-2">Questions coming soon</p>
            <p className="text-stoic-gray-mid">Your teacher is uploading questions. Check back soon!</p>
          </div>
        ) : (
          <div className="max-w-3xl">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div key={i} className={`h-2 rounded-full transition-all ${
                    i < current ? 'w-6 bg-stoic-gold' : i === current ? 'w-8 bg-stoic-navy' : 'w-6 bg-stoic-border'
                  }`} />
                ))}
              </div>
              <span className="text-sm text-stoic-gray-mid font-medium">{current + 1} / {questions.length}</span>
            </div>

            {/* Question card */}
            <div className="card p-10 mb-6">
              <div className="flex items-center gap-3 mb-6">
                {q.topic && <span className="badge-navy">{q.topic}</span>}
                {q.difficulty && <span className={`badge ${
                  q.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                  q.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'}`}>{q.difficulty}</span>}
              </div>
              <p className="text-xl font-bold text-stoic-navy mb-8 leading-relaxed">{q.question_text}</p>

              <div className="space-y-3">
                {(q.choices || []).map((choice, i) => {
                  const label = ['A', 'B', 'C', 'D'][i];
                  const isCorrect = choice === q.correct_answer;
                  const isSelected = selected === choice;
                  return (
                    <button key={i} disabled={submitted} onClick={() => setSelected(choice)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        submitted
                          ? isCorrect ? 'border-emerald-400 bg-emerald-50'
                          : isSelected ? 'border-red-300 bg-red-50'
                          : 'border-stoic-border bg-stoic-gray opacity-50'
                          : isSelected ? 'border-stoic-navy bg-stoic-navy/5'
                          : 'border-stoic-border bg-white hover:border-stoic-navy/40 hover:bg-stoic-gray/50'
                      }`}>
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        submitted && isCorrect ? 'bg-emerald-500 text-white' :
                        submitted && isSelected && !isCorrect ? 'bg-red-400 text-white' :
                        isSelected ? 'bg-stoic-navy text-white' :
                        'bg-stoic-gray text-stoic-gray-mid'}`}>
                        {label}
                      </span>
                      <span className={`text-body-md font-medium ${
                        submitted && isCorrect ? 'text-emerald-800' :
                        submitted && isSelected && !isCorrect ? 'text-red-700' :
                        'text-stoic-navy'}`}>{choice}</span>
                      {submitted && isCorrect && <CheckCircle2 size={20} className="ml-auto text-emerald-500" />}
                      {submitted && isSelected && !isCorrect && <XCircle size={20} className="ml-auto text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            {submitted && (
              <div className={`card p-6 mb-6 border-2 ${selected === q.correct_answer ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {selected === q.correct_answer
                    ? <><CheckCircle2 className="text-emerald-500" size={22} /><p className="font-bold text-emerald-800 text-lg">Correct!</p></>
                    : <><XCircle className="text-red-400" size={22} /><p className="font-bold text-red-700 text-lg">Incorrect</p></>}
                </div>
                {q.explanation && <p className="text-body-md text-stoic-navy/80 leading-relaxed">{q.explanation}</p>}
              </div>
            )}

            {/* Mistake reason */}
            {showMistake && (
              <div className="card p-6 mb-6 border border-stoic-gold/30 bg-stoic-gold/5">
                <p className="font-bold text-stoic-navy mb-3">Why did you miss this? <span className="text-stoic-gray-mid font-normal text-sm">(optional — skip if you prefer)</span></p>
                <textarea value={mistakeReason} onChange={e => setMistakeReason(e.target.value)}
                  className="input mb-3" rows={2} placeholder="e.g. I confused the vocabulary, I didn't read carefully..." />
                <div className="flex gap-3">
                  <button onClick={saveMistakeReason} className="btn-primary text-sm px-5 py-2.5">Save & Continue</button>
                  <button onClick={() => setShowMistake(false)} className="btn-ghost text-sm">Skip</button>
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex items-center justify-between">
              <div />
              {!submitted ? (
                <button onClick={submit} disabled={!selected}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-lg px-10 py-4">
                  Check Answer
                </button>
              ) : !showMistake ? (
                <button onClick={next} className="btn-gold text-lg px-10 py-4">
                  {current < questions.length - 1 ? 'Next Question' : 'Finish Session'} <ChevronRight size={20} />
                </button>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
