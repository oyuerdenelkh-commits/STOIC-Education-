// lib/constants.ts

export const STOIC_QUOTES = [
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "It is not things that disturb us, but our judgements about things.", author: "Epictetus" },
  { text: "First say to yourself what you would be, then do what you have to do.", author: "Epictetus" },
  { text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { text: "Confine yourself to the present.", author: "Marcus Aurelius" },
  { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius" },
  { text: "No person has the power to have everything they want, but it is in their power not to want what they don't have.", author: "Seneca" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
];

export const STUDY_PLAN_LEVELS = {
  hardcore: {
    label: 'Hardcore',
    description: 'Strict deadlines, heavy assignments. IELTS English + SAT Math & English daily.',
    hours: '4–6 hrs/day',
    color: 'bg-red-50 border-red-200 text-red-700',
    badge: 'bg-red-100 text-red-800',
  },
  mid: {
    label: 'Mid Intensity',
    description: 'Focus on mistakes and SAT improvement. Balanced and structured.',
    hours: '2–3 hrs/day',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  light: {
    label: 'Light',
    description: 'Review mistakes and weak areas. Perfect for maintaining momentum.',
    hours: '1–2 hrs/day',
    color: 'bg-green-50 border-green-200 text-green-700',
    badge: 'bg-green-100 text-green-800',
  },
};

export const JOURNEY_CATEGORIES = [
  { key: 'essays', label: 'Essays', icon: '✍️', color: '#6366F1' },
  { key: 'sat_prep', label: 'SAT Prep', icon: '📐', color: '#F59E0B' },
  { key: 'ielts_prep', label: 'IELTS Prep', icon: '🎧', color: '#10B981' },
  { key: 'extracurriculars', label: 'Extracurriculars', icon: '⚡', color: '#EF4444' },
  { key: 'recommendation_letters', label: 'Rec. Letters', icon: '📬', color: '#8B5CF6' },
  { key: 'activities_list', label: 'Activities List', icon: '📋', color: '#06B6D4' },
  { key: 'resume_cv', label: 'Resume / CV', icon: '📄', color: '#F97316' },
  { key: 'portfolio', label: 'Portfolio', icon: '🎨', color: '#EC4899' },
  { key: 'submission', label: 'Application Submission', icon: '🚀', color: '#14B8A6' },
];

export const COUNTRIES = ['USA', 'UK', 'Australia', 'Asia', 'Mongolian Government Scholarships'];

export const SUCCESS_STUDENTS = [
  { name: 'Enkhjin B.', year: 2024, university: 'UCLA', country: '🇺🇸', major: 'Computer Science' },
  { name: 'Tsolmon D.', year: 2024, university: 'NYU', country: '🇺🇸', major: 'Business' },
  { name: 'Ariunaa G.', year: 2023, university: 'Vanderbilt', country: '🇺🇸', major: 'Pre-Med' },
  { name: 'Munkh-Erdene S.', year: 2023, university: 'University of Melbourne', country: '🇦🇺', major: 'Engineering' },
  { name: 'Solongo T.', year: 2022, university: 'King\'s College London', country: '🇬🇧', major: 'Law' },
  { name: 'Batmunkh O.', year: 2024, university: 'Toronto', country: '🇨🇦', major: 'Economics' },
  { name: 'Narantsetseg L.', year: 2023, university: 'KAIST', country: '🇰🇷', major: 'Data Science' },
  { name: 'Delgermaa P.', year: 2022, university: 'NUS Singapore', country: '🇸🇬', major: 'Finance' },
];
