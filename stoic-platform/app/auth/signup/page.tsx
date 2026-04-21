'use client';
// app/auth/signup/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', grade: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, grade: form.grade } },
    });

    if (error) { toast.error(error.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: form.name,
        email: form.email,
        grade: form.grade,
        role: 'student',
      });
      toast.success('Account created! Welcome to STOIC.');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-stoic-gray flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-stoic-navy flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-stoic-gold font-black">S</span>
            </div>
            <span className="text-white font-black text-2xl tracking-tight">STOIC</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-display-md font-black text-white mb-6">
            Join 200+<br />students who<br />got accepted.
          </h2>
          <div className="border-l-2 border-stoic-gold/40 pl-5">
            <p className="text-white/70 text-lg italic">"First say to yourself what you would be, then do what you have to do."</p>
            <p className="text-stoic-gold text-sm font-bold mt-2 uppercase tracking-widest">— Epictetus</p>
          </div>
        </div>
        <p className="relative z-10 text-white/30 text-sm">© {new Date().getFullYear()} STOIC Education</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <span className="text-stoic-navy font-black text-xl">STOIC</span>
            </Link>
            <h1 className="text-display-sm font-black text-stoic-navy mb-3">Start your journey</h1>
            <p className="text-body-lg text-stoic-gray-mid">Free to join. No credit card required.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="input" placeholder="Your full name" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="label">Grade / Level</label>
              <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}
                className="input" required>
                <option value="">Select your grade</option>
                {['9th Grade', '10th Grade', '11th Grade', '12th Grade', 'Gap Year', 'College Student', 'Employed'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pr-12" placeholder="Min. 8 characters" required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stoic-gray-mid hover:text-stoic-navy">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-gold w-full justify-center text-lg py-5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : <>Create Free Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="text-center text-body-md text-stoic-gray-mid mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-stoic-navy font-bold hover:text-stoic-gold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
