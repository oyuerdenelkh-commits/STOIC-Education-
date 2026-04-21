-- ============================================
-- STOIC EDUCATION PLATFORM — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  grade TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Service can insert profiles" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'student'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── UNIVERSITIES ───────────────────────────────────────────────────────
CREATE TABLE universities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  location TEXT,
  ranking INTEGER,
  logo_url TEXT,
  website_url TEXT,
  deadlines TEXT,
  requirements TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Admins can manage universities" ON universities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── PROGRAMS ──────────────────────────────────────────────────────────
CREATE TABLE programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage programs" ON programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── SUCCESS STORIES ────────────────────────────────────────────────────
CREATE TABLE success_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  university TEXT NOT NULL,
  country TEXT NOT NULL,
  major TEXT,
  photo_url TEXT,
  testimonial TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published stories" ON success_stories FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage stories" ON success_stories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── LESSON VIDEOS ──────────────────────────────────────────────────────
CREATE TABLE lesson_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  topic TEXT NOT NULL,
  day_number INTEGER,
  order_index INTEGER DEFAULT 1,
  duration_minutes INTEGER,
  plan_levels TEXT[] DEFAULT ARRAY['hardcore','mid','light'],
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lesson_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logged in can view videos" ON lesson_videos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage videos" ON lesson_videos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── QUESTIONS ──────────────────────────────────────────────────────────
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_text TEXT NOT NULL,
  choices TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  topic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logged in can view questions" ON questions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage questions" ON questions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── QUESTION ATTEMPTS ──────────────────────────────────────────────────
CREATE TABLE question_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own attempts" ON question_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all attempts" ON question_attempts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── MISTAKE NOTES ──────────────────────────────────────────────────────
CREATE TABLE mistake_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE mistake_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own mistake notes" ON mistake_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all mistake notes" ON mistake_notes FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── VOCABULARY ─────────────────────────────────────────────────────────
CREATE TABLE vocabulary (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own vocabulary" ON vocabulary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all vocabulary" ON vocabulary FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── STUDY SESSIONS ─────────────────────────────────────────────────────
CREATE TABLE study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view sessions for leaderboard" ON study_sessions FOR SELECT USING (auth.uid() IS NOT NULL);

-- Leaderboard function
CREATE OR REPLACE FUNCTION get_study_leaderboard()
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  grade TEXT,
  total_minutes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ss.user_id,
    p.full_name,
    p.grade,
    SUM(ss.duration_minutes) AS total_minutes
  FROM study_sessions ss
  JOIN profiles p ON p.id = ss.user_id
  WHERE ss.started_at >= CURRENT_DATE
  GROUP BY ss.user_id, p.full_name, p.grade
  ORDER BY total_minutes DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── STUDENT PLANS ──────────────────────────────────────────────────────
CREATE TABLE student_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  plan_level TEXT NOT NULL CHECK (plan_level IN ('hardcore', 'mid', 'light')),
  started_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE student_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own plans" ON student_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all plans" ON student_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── DAILY TASK COMPLETIONS ─────────────────────────────────────────────
CREATE TABLE daily_task_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  task_key TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, day_number, task_key)
);

ALTER TABLE daily_task_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own completions" ON daily_task_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all completions" ON daily_task_completions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── JOURNEY SETUP ──────────────────────────────────────────────────────
CREATE TABLE journey_setup (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  country TEXT NOT NULL,
  university TEXT NOT NULL,
  program TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE journey_setup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own journey setup" ON journey_setup FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all setups" ON journey_setup FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── JOURNEY ITEMS ──────────────────────────────────────────────────────
CREATE TABLE journey_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  deadline DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE journey_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own journey items" ON journey_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all journey items" ON journey_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- ── TEACHER FEEDBACK ───────────────────────────────────────────────────
CREATE TABLE teacher_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE teacher_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage feedback" ON teacher_feedback FOR ALL USING (
  auth.uid() = teacher_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Students can view own feedback" ON teacher_feedback FOR SELECT USING (auth.uid() = student_id);

-- ── SUPABASE STORAGE BUCKETS ───────────────────────────────────────────
-- Run these in Supabase Dashboard > Storage > Create Bucket:
-- Bucket name: "lessons"   (public: true)
-- Bucket name: "avatars"   (public: true)
-- Bucket name: "logos"     (public: true)

-- Storage policies (run after creating buckets):
CREATE POLICY "Anyone can view lessons" ON storage.objects FOR SELECT USING (bucket_id = 'lessons');
CREATE POLICY "Admins can upload lessons" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'lessons' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ── INITIAL ADMIN SETUP ────────────────────────────────────────────────
-- After creating your admin account via signup, run this to grant admin role:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
