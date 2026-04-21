'use client';
// app/admin/universities/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { COUNTRIES } from '@/lib/constants';
import { Plus, Trash2, BookOpen, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUniversitiesPage() {
  const [profile, setProfile] = useState<any>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState('all');
  const [form, setForm] = useState({
    name: '', country: 'USA', location: '', ranking: '',
    deadlines: '', requirements: '', notes: '', website_url: '',
  });
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { data: unis } = await supabase.from('universities').select('*, programs(*)').order('country').order('name');
    setUniversities(unis || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('universities').insert({
      ...form,
      ranking: form.ranking ? parseInt(form.ranking) : null,
    });
    toast.success(`${form.name} added!`);
    setForm({ name: '', country: 'USA', location: '', ranking: '', deadlines: '', requirements: '', notes: '', website_url: '' });
    setShowForm(false);
    loadData();
  };

  const deleteUni = async (id: string) => {
    if (!confirm('Delete this university?')) return;
    await supabase.from('universities').delete().eq('id', id);
    setUniversities(universities.filter(u => u.id !== id));
    toast.success('University removed');
  };

  const filtered = filterCountry === 'all' ? universities : universities.filter(u => u.country === filterCountry);

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-display-sm font-black text-stoic-navy mb-2">Universities</h1>
            <p className="text-body-lg text-stoic-gray-mid">{universities.length} universities listed</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} /> Add University
          </button>
        </div>

        {showForm && (
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-black text-stoic-navy mb-6">Add New University</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label">University Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="input" placeholder="e.g. UCLA" required />
                </div>
                <div>
                  <label className="label">Country *</label>
                  <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="input">
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Location / City</label>
                  <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                    className="input" placeholder="e.g. Los Angeles, California" />
                </div>
                <div>
                  <label className="label">World Ranking</label>
                  <input type="number" value={form.ranking} onChange={e => setForm({...form, ranking: e.target.value})}
                    className="input" placeholder="e.g. 15" />
                </div>
                <div>
                  <label className="label">Website URL</label>
                  <input type="url" value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})}
                    className="input" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="label">Application Deadlines</label>
                <textarea value={form.deadlines} onChange={e => setForm({...form, deadlines: e.target.value})}
                  className="input" rows={3} placeholder="Early Decision: Nov 1&#10;Regular Decision: Jan 1&#10;..." />
              </div>
              <div>
                <label className="label">Requirements</label>
                <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})}
                  className="input" rows={3} placeholder="SAT: 1400+&#10;IELTS: 7.0+&#10;GPA: 3.8+&#10;..." />
              </div>
              <div>
                <label className="label">Notes for Students</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  className="input" rows={2} placeholder="Any special tips or important notes..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Save University</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setFilterCountry('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterCountry === 'all' ? 'bg-stoic-navy text-white' : 'bg-white border border-stoic-border text-stoic-gray-mid hover:border-stoic-navy/40'}`}>
            All ({universities.length})
          </button>
          {COUNTRIES.map(c => {
            const count = universities.filter(u => u.country === c).length;
            return count > 0 ? (
              <button key={c} onClick={() => setFilterCountry(c)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterCountry === c ? 'bg-stoic-navy text-white' : 'bg-white border border-stoic-border text-stoic-gray-mid hover:border-stoic-navy/40'}`}>
                {c} ({count})
              </button>
            ) : null;
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <BookOpen size={48} className="text-stoic-gray-mid mx-auto mb-4" />
            <p className="text-xl font-bold text-stoic-navy mb-2">No universities yet</p>
            <p className="text-stoic-gray-mid mb-6">Add universities that students can browse by country.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mx-auto"><Plus size={18} /> Add First University</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(uni => (
              <div key={uni.id} className="card overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 bg-stoic-navy/8 rounded-2xl flex items-center justify-center font-black text-stoic-navy flex-shrink-0">
                    {uni.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-stoic-navy">{uni.name}</p>
                      {uni.ranking && <span className="badge-gold">#{uni.ranking}</span>}
                      <span className="badge-navy">{uni.country}</span>
                    </div>
                    {uni.location && <p className="text-sm text-stoic-gray-mid mt-1">{uni.location}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setExpandedId(expandedId === uni.id ? null : uni.id)} className="btn-ghost text-sm px-3 py-2">
                      <ChevronDown size={16} className={`transition-transform ${expandedId === uni.id ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => deleteUni(uni.id)} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-stoic-gray-mid">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {expandedId === uni.id && (
                  <div className="border-t border-stoic-border p-6 bg-stoic-gray/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {uni.deadlines && <div><p className="font-bold text-stoic-navy mb-2">Deadlines</p><p className="text-stoic-gray-mid whitespace-pre-line">{uni.deadlines}</p></div>}
                    {uni.requirements && <div><p className="font-bold text-stoic-navy mb-2">Requirements</p><p className="text-stoic-gray-mid whitespace-pre-line">{uni.requirements}</p></div>}
                    {uni.notes && <div><p className="font-bold text-stoic-navy mb-2">Notes</p><p className="text-stoic-gray-mid whitespace-pre-line">{uni.notes}</p></div>}
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
