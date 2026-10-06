import Link from 'next/link';
import { Metadata } from 'next';
import { getSeasons } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, seasonLabel, seasonPath } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL seasons',
  description:
    'FPL Replay seasons. The published record is the 2025/26 reconstructive replay, with a CSV and JSON download.',
  alternates: {
    canonical: '/seasons',
  },
  openGraph: {
    title: 'FPL seasons',
    description:
      'FPL Replay seasons. The published record is the 2025/26 reconstructive replay, with a CSV and JSON download.',
    url: '/seasons',
  },
};

export default function SeasonsIndexPage() {
  const seasons = getSeasons();

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Seasons', path: '/seasons' },
        ])}
      />
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">FPL seasons</h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          Open 2025/26 for the gameweek list, the captain and transfer record, and the season
          download. Sample 2026/27 pages are not published.
        </p>
      </header>
      <ul className="space-y-4">
        {seasons.map((season) => (
          <li key={season.id} className="border border-neutral-200 bg-white p-5 space-y-2">
            <h2 className="text-lg font-semibold">
              <Link href={seasonPath(season.id)} className="underline underline-offset-2">
                {season.title}
              </Link>
            </h2>
            <p className="text-neutral-700">{season.summary}</p>
            <p className="text-sm text-neutral-600">
              {seasonLabel(season.id)} · {season.gameweeks} gameweeks
              {season.kind === 'historical-replay' ? ` · ${season.optimiserPoints} pts` : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
