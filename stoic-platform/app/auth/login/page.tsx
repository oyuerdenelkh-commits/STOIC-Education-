'use client';
// app/auth/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success('Welcome back!');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-stoic-gray flex">
      {/* Left panel */}
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
        <div className="relative z-10 max-w-md">
          <div className="space-y-8">
            {[
              { quote: "You have power over your mind — not outside events.", author: "Marcus Aurelius" },
              { quote: "The obstacle is the way.", author: "Marcus Aurelius" },
              { quote: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
            ].map((q, i) => (
              <div key={i} className="border-l-2 border-stoic-gold/40 pl-5">
                <p className="text-white/70 text-lg italic leading-relaxed">"{q.quote}"</p>
                <p className="text-stoic-gold text-sm font-bold mt-2 uppercase tracking-widest">— {q.author}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} STOIC Education</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <span className="text-stoic-navy font-black text-xl">STOIC</span>
            </Link>
            <h1 className="text-display-sm font-black text-stoic-navy mb-3">Welcome back</h1>
            <p className="text-body-lg text-stoic-gray-mid">Sign in to continue your journey.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-12" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stoic-gray-mid hover:text-stoic-navy transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-lg py-5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="text-center text-body-md text-stoic-gray-mid mt-8">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-stoic-navy font-bold hover:text-stoic-gold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
