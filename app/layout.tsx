import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DemoNoticeBanner } from '@/components/DemoNoticeBanner';
import { JsonLd } from '@/components/JsonLd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fpl-labs-pan.vercel.app'),
  title: {
    default: 'FPL Labs Pan | Decision Lab Data Product',
    template: '%s | FPL Labs Pan',
  },
  description:
    'Entity × time decision lab data product for Fantasy Premier League. Pre-deadline frozen policy arms, mixed-integer linear programming replays, and chip horizon scenarios.',
  keywords: [
    'FPL',
    'Fantasy Premier League',
    'Decision Lab',
    'FPL Solver',
    'Mixed Integer Linear Programming',
    'Policy Arms',
    'Chip Scenarios',
    'FPL Labs Pan',
    'Expected Points',
    'Programmatic SEO',
  ],
  authors: [{ name: 'FPL Labs Pan', url: 'https://x.com/FPLabsPan' }],
  creator: 'FPL Labs Pan',
  publisher: 'FPL Labs Pan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://fpl-labs-pan.vercel.app',
    title: 'FPL Labs Pan | Decision Lab Data Product',
    description:
      'Neutral, lab-native FPL decision replays, policy arms comparison, and chip optimization matrix.',
    siteName: 'FPL Labs Pan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPL Labs Pan | Decision Lab Data Product',
    description:
      'Pre-deadline frozen policy arms, mixed-integer linear programming replays, and chip horizon scenarios.',
    creator: '@FPLabsPan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FPL Labs Pan',
    alternateName: 'FPL Decision Lab',
    url: 'https://fpl-labs-pan.vercel.app',
    description:
      'Entity × time data product generating pre-deadline frozen policy arms, mixed-integer solver replays, and chip horizon scenarios for Fantasy Premier League.',
    publisher: {
      '@type': 'Organization',
      name: 'FPL Labs Pan',
      url: 'https://x.com/FPLabsPan',
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-200">
        <JsonLd data={websiteJsonLd} />
        <DemoNoticeBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
