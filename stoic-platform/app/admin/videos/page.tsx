'use client';
// app/admin/videos/page.tsx
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Upload, Video, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVideosPage() {
  const [profile, setProfile] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', topic: 'SAT Math',
    day_number: '', duration_minutes: '', order_index: '1'
  });
  const [file, setFile] = useState<File | null>(null);
  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { data: vids } = await supabase.from('lesson_videos').select('*').order('day_number').order('order_index');
    setVideos(vids || []);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a video file'); return; }
    setUploading(true);

    try {
      // Upload to Supabase Storage
      const ext = file.name.split('.').pop();
      const filename = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('lessons').upload(filename, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('lessons').getPublicUrl(filename);

      await supabase.from('lesson_videos').insert({
        ...form,
        video_url: publicUrl,
        day_number: form.day_number ? parseInt(form.day_number) : null,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        order_index: parseInt(form.order_index),
      });

      toast.success('Video uploaded successfully!');
      setForm({ title: '', description: '', topic: 'SAT Math', day_number: '', duration_minutes: '', order_index: '1' });
      setFile(null);
      setShowForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteVideo = async (id: string, videoUrl: string) => {
    if (!confirm('Delete this video?')) return;
    await supabase.from('lesson_videos').delete().eq('id', id);
    // Optionally delete from storage
    toast.success('Video deleted');
    loadData();
  };

  const TOPICS = ['SAT Math', 'SAT Reading', 'SAT Writing', 'IELTS Listening', 'IELTS Reading', 'IELTS Writing', 'IELTS Speaking', 'General'];

  return (
    <div className="flex min-h-screen bg-stoic-gray">
      <DashboardSidebar role={profile?.role} userName={profile?.full_name} />
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-display-sm font-black text-stoic-navy mb-2">Lesson Videos</h1>
            <p className="text-body-lg text-stoic-gray-mid">{videos.length} videos uploaded</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} /> Upload Video
          </button>
        </div>

        {showForm && (
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-black text-stoic-navy mb-6">Upload New Lesson Video</h2>
            <form onSubmit={handleUpload} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Video Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    className="input" placeholder="e.g. SAT Math — Day 1: Algebra Basics" required />
                </div>
                <div>
                  <label className="label">Topic *</label>
                  <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="input">
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Day Number (1-50)</label>
                  <input type="number" min="1" max="50" value={form.day_number} onChange={e => setForm({...form, day_number: e.target.value})}
                    className="input" placeholder="e.g. 1" />
                </div>
                <div>
                  <label className="label">Duration (minutes)</label>
                  <input type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})}
                    className="input" placeholder="e.g. 45" />
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="input" rows={3} placeholder="What students will learn in this lesson..." />
              </div>
              <div>
                <label className="label">Video File *</label>
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  file ? 'border-stoic-gold bg-stoic-gold/5' : 'border-stoic-border hover:border-stoic-navy/40'
                }`} onClick={() => document.getElementById('video-input')?.click()}>
                  <input id="video-input" type="file" accept="video/*" className="hidden"
                    onChange={e => setFile(e.target.files?.[0] || null)} />
                  <Upload size={32} className="mx-auto mb-3 text-stoic-gray-mid" />
                  {file ? (
                    <div>
                      <p className="font-bold text-stoic-navy">{file.name}</p>
                      <p className="text-stoic-gray-mid text-sm mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-stoic-navy mb-1">Click to select video file</p>
                      <p className="text-stoic-gray-mid text-sm">MP4, MOV, or WebM — max 500MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Uploading...</>
                  ) : <><Upload size={18} />Upload Video</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Videos list */}
        {videos.length === 0 ? (
          <div className="card p-16 text-center">
            <Video size={48} className="text-stoic-gray-mid mx-auto mb-4" />
            <p className="text-xl font-bold text-stoic-navy mb-2">No videos yet</p>
            <p className="text-stoic-gray-mid mb-6">Upload your first lesson video to get started.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
              <Upload size={18} /> Upload First Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map(vid => (
              <div key={vid.id} className="card group overflow-hidden">
                <div className="aspect-video bg-stoic-navy flex items-center justify-center relative">
                  <Video size={32} className="text-white/30" />
                  {vid.day_number && (
                    <div className="absolute top-3 left-3 badge bg-stoic-gold text-stoic-navy border-0">Day {vid.day_number}</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stoic-navy mb-1 truncate">{vid.title}</p>
                      <p className="text-xs text-stoic-gray-mid">{vid.topic} · {vid.duration_minutes || '?'} min</p>
                    </div>
                    <button onClick={() => deleteVideo(vid.id, vid.video_url)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {vid.description && <p className="text-sm text-stoic-gray-mid mt-2 line-clamp-2 leading-relaxed">{vid.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
