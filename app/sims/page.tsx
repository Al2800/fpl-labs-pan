import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL what-ifs',
  description:
    'Sample 2026/27 what-if pages have been taken down. The checkable record is the 2025/26 FPL replay, with captains, transfers and chip rules.',
  alternates: {
    canonical: '/sims',
  },
  openGraph: {
    title: 'FPL what-ifs',
    description:
      'Sample 2026/27 what-if pages have been taken down. The checkable record is the 2025/26 FPL replay, with captains, transfers and chip rules.',
    url: '/sims',
  },
};

export default function SimsIndexPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'What-ifs', path: '/sims' },
        ])}
      />

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">FPL what-ifs</h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          This section used to show sample 2026/27 what-ifs. The squads were made up, so the pages
          have been taken down. A what-if only belongs here once it is built from a real freeze.
        </p>
      </header>

      <p className="text-neutral-800 leading-relaxed max-w-3xl">
        The checkable record is the 2025/26 replay: 38 gameweeks, no chips played, and a download
        of the season file. Chip rules for 2026/27, including the two sets and the Gameweek 19
        deadline, are on the chip pages.
      </p>

      <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/seasons/2025-26" className="underline underline-offset-2">
          2025/26 season
        </Link>
        <Link href="/seasons/2025-26/download" className="underline underline-offset-2">
          Download the replay
        </Link>
        <Link href="/chips" className="underline underline-offset-2">
          Chip rules
        </Link>
      </p>
    </div>
  );
}
