// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'STOIC — College Abroad Preparation Platform',
  description: 'Master your college application journey. SAT prep, IELTS, and study abroad guidance.',
  keywords: 'college application, SAT prep, IELTS, study abroad, Mongolia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: '500',
              borderRadius: '12px',
              padding: '14px 18px',
            },
            success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
