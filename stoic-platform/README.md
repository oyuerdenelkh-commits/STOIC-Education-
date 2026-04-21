# STOIC Education Platform

> *"The obstacle is the way." — Marcus Aurelius*

Full-stack college abroad preparation platform for Mongolian students — with SAT/IELTS prep, study abroad journey tracking, a question bank, vocabulary notebook, and study room.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + Database + Storage)
- **Framer Motion**

---

## 🚀 Setup in 5 Steps

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `stoic-education`, choose a region near Mongolia
3. Wait for it to initialize (~2 minutes)

### Step 2 — Run Database Schema

1. In Supabase: **SQL Editor** → **New Query**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and click **Run**
4. All tables, policies, and functions are created

### Step 3 — Create Storage Buckets

In Supabase → **Storage**:
1. Create bucket: `lessons` (set to **Public**)
2. Create bucket: `avatars` (set to **Public**)

### Step 4 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from Supabase → **Settings** → **API**

### Step 5 — Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👑 Creating Your Admin Account

1. Go to your site → **Sign Up** with your email
2. Go to Supabase → **SQL Editor** → run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

3. Now you can access `/admin` with full control

---

## 🚢 Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "STOIC Platform initial commit"
git remote add origin https://github.com/YOUR_USERNAME/stoic-platform.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

---

## 📁 Project Structure

```
stoic-platform/
├── app/
│   ├── page.tsx                    # Homepage / Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles + Tailwind
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── dashboard/
│   │   ├── page.tsx                # Student dashboard overview
│   │   ├── journey/page.tsx        # Study abroad journey tracker
│   │   ├── study-room/page.tsx     # Study timer + leaderboard
│   │   ├── vocabulary/page.tsx     # Vocabulary notebook
│   │   └── practice/page.tsx       # Practice questions
│   ├── courses/
│   │   ├── college-app/page.tsx    # College application browser
│   │   └── sat-prep/page.tsx       # SAT/IELTS 50-day program
│   └── admin/
│       ├── page.tsx                # Admin overview
│       ├── videos/page.tsx         # Upload lesson videos
│       ├── questions/page.tsx      # Manage questions
│       └── universities/page.tsx   # Manage universities
├── components/
│   └── layout/
│       ├── Navbar.tsx              # Public navbar
│       └── DashboardSidebar.tsx    # Dashboard sidebar
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server client
│   └── constants.ts                # Stoic quotes, categories, etc.
├── middleware.ts                   # Route protection
├── supabase-schema.sql             # Full database schema
└── .env.example                    # Environment variables template
```

---

## 👩‍🏫 Admin Guide

### Upload a Video Lesson
1. Go to `/admin/videos`
2. Click **Upload Video**
3. Fill in title, topic, day number
4. Select your video file
5. Click Upload — it goes to Supabase Storage

### Add Practice Questions
1. Go to `/admin/questions`
2. Click **Add Question**
3. Enter question text, 4 choices, correct answer, explanation
4. Students see them immediately

### Add Universities
1. Go to `/admin/universities`
2. Click **Add University**
3. Fill in name, country, deadlines, requirements
4. Students browse by country on the College App page

### Create a Teacher Account
```sql
-- Run in Supabase SQL Editor after teacher signs up:
UPDATE profiles SET role = 'teacher' WHERE email = 'teacher@email.com';
```

---

## 🔑 Key Features

| Feature | Status |
|---------|--------|
| Student auth (email/password) | ✅ |
| Admin / Teacher / Student roles | ✅ |
| Study abroad journey tracker | ✅ |
| 50-day SAT calendar | ✅ |
| Video lesson player | ✅ |
| Practice questions + mistake tracker | ✅ |
| Vocabulary notebook | ✅ |
| Study room timer + leaderboard | ✅ |
| University browser by country | ✅ |
| Admin upload videos | ✅ |
| Admin manage questions | ✅ |
| Stoic philosophy integration | ✅ |
| Mobile responsive | ✅ |

---

## Stoic Philosophy

STOIC is named after the ancient school of philosophy. Marcus Aurelius, Epictetus, and Seneca teach the same thing college admissions demands: **discipline, focus, and resilience**.

Every page includes a Stoic quote — not as decoration, but as a reminder of why students are working.

> *"Luck is what happens when preparation meets opportunity."* — Seneca
