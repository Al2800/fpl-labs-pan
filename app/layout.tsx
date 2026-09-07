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
    default: 'FPL Labs Pan | Pre-deadline FPL decisions',
    template: '%s | FPL Labs Pan',
  },
  description:
    'Frozen FPL gameweek teams, captains, transfers and chip timing. Each plan is locked two hours before the deadline and published as a checkable JSON snapshot.',
  keywords: [
    'FPL',
    'Fantasy Premier League',
    'FPL team',
    'FPL captain',
    'FPL transfers',
    'Triple Captain',
    'Wildcard',
    'FPL Labs Pan',
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
    url: siteUrl,
    title: 'FPL Labs Pan | Pre-deadline FPL decisions',
    description:
      'Frozen FPL gameweek teams, captains, transfers and chip timing, published before the deadline.',
    siteName: 'FPL Labs Pan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPL Labs Pan | Pre-deadline FPL decisions',
    description:
      'Frozen FPL gameweek teams, captains, transfers and chip timing, published before the deadline.',
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
    url: siteUrl,
    description:
      'Frozen FPL gameweek teams, captains, transfers and chip timing. Each plan is locked two hours before the deadline.',
    publisher: {
      '@type': 'Organization',
      name: 'FPL Labs Pan',
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
