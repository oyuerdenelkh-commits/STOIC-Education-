// app/page.tsx
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ChevronRight, Target, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import { SUCCESS_STUDENTS, STOIC_QUOTES } from '@/lib/constants';

export default function HomePage() {
  const featuredQuote = STOIC_QUOTES[0];

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-stoic-white pt-20">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#0A1628 1px, transparent 1px), linear-gradient(90deg, #0A1628 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

          {/* Gold accent */}
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-stoic-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-stoic-navy/5 blur-3xl pointer-events-none" />

          <div className="container relative z-10">
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-10 bg-stoic-gold" />
                <span className="badge-gold">Mongolia's #1 College Prep Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-display-xl font-black text-stoic-navy leading-none mb-8">
                Your path to the<br />
                <span className="text-stoic-gold">world's best</span><br />
                universities.
              </h1>

              {/* Subheadline */}
              <p className="text-body-xl text-stoic-gray-mid max-w-2xl mb-12 leading-relaxed">
                STOIC prepares Mongolian students for college abroad — with SAT prep,
                IELTS coaching, and a complete application system built for your success.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-20">
                <Link href="/auth/signup" className="btn-gold text-lg px-10 py-5">
                  Start Your Journey <ChevronRight size={20} />
                </Link>
                <Link href="/auth/login" className="btn-outline text-lg px-10 py-5">
                  Sign In
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-8 max-w-lg">
                {[
                  { value: '200+', label: 'Students placed' },
                  { value: '40+', label: 'Universities' },
                  { value: '2022', label: 'Since' },
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-display-sm font-black text-stoic-navy">{stat.value}</p>
                    <p className="text-body-md text-stoic-gray-mid">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-stoic-border to-transparent animate-pulse" />
            <p className="text-xs text-stoic-gray-mid uppercase tracking-widest">Scroll</p>
          </div>
        </section>

        {/* ── STOIC QUOTE ── */}
        <section className="py-20 bg-stoic-navy">
          <div className="container max-w-4xl text-center">
            <p className="text-3xl md:text-4xl font-bold text-white leading-relaxed mb-6 italic">
              "{featuredQuote.text}"
            </p>
            <p className="text-stoic-gold text-lg font-bold uppercase tracking-widest">— {featuredQuote.author}</p>
          </div>
        </section>

        {/* ── COURSES ── */}
        <section id="courses" className="section bg-white">
          <div className="container">
            <div className="mb-16">
              <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-4">What We Offer</p>
              <h2 className="text-display-md font-black text-stoic-navy">Choose your path</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Course 1 */}
              <div className="card p-10 group hover:border-stoic-navy/30 cursor-pointer">
                <div className="w-14 h-14 bg-stoic-navy/8 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-stoic-navy transition-colors duration-300">
                  <Target size={28} className="text-stoic-navy group-hover:text-white transition-colors" />
                </div>
                <span className="badge-navy mb-4 block w-fit">Beginner Friendly</span>
                <h3 className="text-display-sm font-black text-stoic-navy mb-4">College Application</h3>
                <p className="text-body-lg text-stoic-gray-mid mb-8 leading-relaxed">
                  Step-by-step guidance through your entire college application — from choosing universities to submitting your final application.
                </p>
                <ul className="space-y-3 mb-10">
                  {['University selection by country', 'Personal statement coaching', 'Application tracker & checklist', 'Visa & document guidance'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-body-md text-stoic-gray-mid">
                      <div className="w-5 h-5 rounded-full bg-stoic-gold/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-stoic-gold" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/courses/college-app" className="btn-primary w-full justify-center">
                  Start College Prep <ArrowRight size={18} />
                </Link>
              </div>

              {/* Course 2 */}
              <div className="card-dark p-10 group cursor-pointer">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <BookOpen size={28} className="text-stoic-gold" />
                </div>
                <span className="badge mb-4 block w-fit bg-stoic-gold/20 text-stoic-gold border border-stoic-gold/30">50-Day Program</span>
                <h3 className="text-display-sm font-black text-white mb-4">SAT + IELTS Prep</h3>
                <p className="text-body-lg text-white/60 mb-8 leading-relaxed">
                  A structured 50-day learning program with video lessons, practice questions, and a built-in study tracker.
                </p>
                <ul className="space-y-3 mb-10">
                  {['50-day study plan calendar', 'Video lessons by expert tutors', 'Practice question bank', 'Mistake tracker & vocabulary builder'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-body-md text-white/70">
                      <div className="w-5 h-5 rounded-full bg-stoic-gold/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-stoic-gold" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/courses/sat-prep" className="btn-gold w-full justify-center">
                  Start SAT Prep <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUCCESS STORIES ── */}
        <section id="success" className="section bg-stoic-gray">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-4">STOIC Success 2022–2026</p>
                <h2 className="text-display-md font-black text-stoic-navy">Our students got in.</h2>
              </div>
              <p className="text-body-lg text-stoic-gray-mid max-w-sm">
                Real students, real results. Every name here is a STOIC success story.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SUCCESS_STUDENTS.map((s, i) => (
                <div key={i} className="card p-6 text-center group hover:border-stoic-gold/40">
                  {/* Avatar placeholder */}
                  <div className="w-16 h-16 bg-stoic-navy rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{s.name[0]}</span>
                  </div>
                  <p className="font-bold text-stoic-navy text-base mb-1">{s.name}</p>
                  <p className="text-stoic-gray-mid text-sm mb-3">{s.year}</p>
                  <div className="bg-stoic-navy/5 rounded-xl px-3 py-2">
                    <p className="text-stoic-gold font-bold text-sm">{s.country} {s.university}</p>
                    <p className="text-stoic-gray-mid text-xs mt-0.5">{s.major}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STOIC PHILOSOPHY SECTION ── */}
        <section className="section bg-stoic-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%"><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/></svg>
          </div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-8">The Stoic Way</p>
              <h2 className="text-display-md font-black text-white mb-12">
                Built on ancient wisdom.<br />Designed for modern ambition.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    philosopher: 'Marcus Aurelius',
                    years: '121–180 AD',
                    quote: 'You have power over your mind — not outside events.',
                    principle: 'Focus on what you can control. Your preparation. Your effort. Your response.',
                  },
                  {
                    philosopher: 'Epictetus',
                    years: '50–135 AD',
                    quote: 'First say to yourself what you would be, then do what you have to do.',
                    principle: 'Define your target university. Build your plan. Execute without hesitation.',
                  },
                  {
                    philosopher: 'Seneca',
                    years: '4 BC–65 AD',
                    quote: 'Luck is what happens when preparation meets opportunity.',
                    principle: 'Admissions is not luck. It is the result of consistent, disciplined preparation.',
                  },
                ].map(p => (
                  <div key={p.philosopher} className="bg-white/5 rounded-3xl p-8 border border-white/10">
                    <div className="mb-6">
                      <p className="text-stoic-gold font-bold text-lg">{p.philosopher}</p>
                      <p className="text-white/40 text-sm">{p.years}</p>
                    </div>
                    <p className="text-white/80 text-lg italic font-medium mb-4 leading-relaxed">"{p.quote}"</p>
                    <div className="h-px bg-white/10 my-4" />
                    <p className="text-white/50 text-sm leading-relaxed">{p.principle}</p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/auth/signup" className="btn-gold text-lg px-12 py-5">
                  Begin Your Journey <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-4">The Process</p>
              <h2 className="text-display-md font-black text-stoic-navy">How STOIC works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Sign Up', desc: 'Create your free account in 60 seconds.' },
                { step: '02', title: 'Choose Your Path', desc: 'Select your target country and universities.' },
                { step: '03', title: 'Follow the Plan', desc: 'SAT prep, essays, applications — all tracked.' },
                { step: '04', title: 'Get Accepted', desc: 'Arrive at your dream university.' },
              ].map(s => (
                <div key={s.step} className="text-center">
                  <div className="text-6xl font-black text-stoic-gold/20 mb-4">{s.step}</div>
                  <h3 className="text-xl font-bold text-stoic-navy mb-3">{s.title}</h3>
                  <p className="text-body-md text-stoic-gray-mid">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="section bg-stoic-gray">
          <div className="container">
            <div className="mb-16">
              <p className="text-sm font-bold text-stoic-gold uppercase tracking-widest mb-4">Platform Features</p>
              <h2 className="text-display-md font-black text-stoic-navy">Everything you need</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: 'Study Abroad Journey', desc: 'Personal tracker from target school selection to submission.' },
                { icon: BookOpen, title: 'SAT & IELTS Video Lessons', desc: 'Watch expert lessons, track progress across 50 days.' },
                { icon: Clock, title: 'Study Room Timer', desc: 'Track your study hours. See how you rank against peers.' },
                { icon: Star, title: 'Vocabulary Notebook', desc: 'Build your word bank. Review anytime, anywhere.' },
                { icon: Target, title: 'Practice Questions', desc: 'SAT/IELTS questions with explanations and mistake tracking.' },
                { icon: BookOpen, title: 'Teacher Feedback', desc: 'Your STOIC teacher comments directly on your progress.' },
              ].map((f, i) => (
                <div key={i} className="card p-8">
                  <div className="w-12 h-12 bg-stoic-navy/8 rounded-xl flex items-center justify-center mb-6">
                    <f.icon size={22} className="text-stoic-navy" />
                  </div>
                  <h3 className="text-xl font-bold text-stoic-navy mb-3">{f.title}</h3>
                  <p className="text-body-md text-stoic-gray-mid leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-32 bg-stoic-navy text-center">
          <div className="container">
            <h2 className="text-display-lg font-black text-white mb-6">
              Your journey starts<br />with one decision.
            </h2>
            <p className="text-body-xl text-white/60 mb-12 max-w-xl mx-auto">
              Join hundreds of Mongolian students who chose discipline over doubt.
            </p>
            <Link href="/auth/signup" className="btn-gold text-xl px-14 py-6">
              Sign Up — It's Free <ChevronRight size={22} />
            </Link>
            <p className="text-white/30 text-sm mt-6">
              "The obstacle is the way." — Marcus Aurelius
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-stoic-black py-12">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stoic-gold/20 rounded-xl flex items-center justify-center">
                <span className="text-stoic-gold font-black text-xs">S</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight">STOIC</span>
            </div>
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} STOIC Education. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/auth/login" className="text-white/40 hover:text-white text-sm transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="text-white/40 hover:text-white text-sm transition-colors">Sign Up</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
