import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DemoNoticeBanner } from '@/components/DemoNoticeBanner';
import { JsonLd } from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FPL Replay | Pre-deadline FPL decisions',
    template: '%s | FPL Replay',
  },
  description:
    'FPL gameweek teams, captains, transfers and chip timing. 2025/26 is a full reconstructive replay with downloadable JSON. Live seasons will freeze two hours before the deadline.',
  keywords: [
    'FPL',
    'Fantasy Premier League',
    'FPL team',
    'FPL captain',
    'FPL transfers',
    'Triple Captain',
    'Wildcard',
    'FPL Replay',
  ],
  authors: [{ name: 'FPL Replay', url: 'https://x.com/FPLabsPan' }],
  creator: 'FPL Replay',
  publisher: 'FPL Replay',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    title: 'FPL Replay | Pre-deadline FPL decisions',
    description:
      'FPL gameweek teams, captains, transfers and chip timing, with a reconstructive 2025/26 season and JSON snapshots.',
    siteName: 'FPL Replay',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPL Replay | Pre-deadline FPL decisions',
    description:
      'FPL gameweek teams, captains, transfers and chip timing, with a reconstructive 2025/26 season and JSON snapshots.',
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
    name: 'FPL Replay',
    alternateName: 'FPL Decision Lab',
    url: siteUrl,
    description:
      'FPL gameweek teams, captains and chip timing. 2025/26 is a reconstructive replay with JSON snapshots.',
    publisher: {
      '@type': 'Organization',
      name: 'FPL Replay',
      url: siteUrl,
      sameAs: ['https://x.com/FPLabsPan'],
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <JsonLd data={websiteJsonLd} />
        <DemoNoticeBanner />
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
