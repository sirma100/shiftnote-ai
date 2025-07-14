import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShiftNote AI - Professional Shift Note Formatter',
  description: 'AI-powered shift note formatter for Australian support workers in NDIS, aged care, SIL, and SDA services.',
  keywords: 'NDIS, aged care, shift notes, support workers, Australia, AI, formatting',
  authors: [{ name: 'ShiftNote AI Team' }],
  creator: 'ShiftNote AI',
  publisher: 'ShiftNote AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://shiftnote.ai',
    siteName: 'ShiftNote AI',
    title: 'ShiftNote AI - Professional Shift Note Formatter',
    description: 'Transform your raw shift notes into professional documentation with AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShiftNote AI - Professional Shift Note Formatter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShiftNote AI - Professional Shift Note Formatter',
    description: 'Transform your raw shift notes into professional documentation with AI',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
