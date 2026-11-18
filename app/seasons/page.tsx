import Link from 'next/link';
import { Metadata } from 'next';
import { getSeasons } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, seasonLabel, seasonPath } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL seasons',
  description:
    'FPL Replay seasons. 2026/27 is the current season. 2025/26 is the settled reconstructive replay. Both have a CSV and JSON download.',
  alternates: {
    canonical: '/seasons',
  },
  openGraph: {
    title: 'FPL seasons',
    description:
      'FPL Replay seasons. 2026/27 is the current season. 2025/26 is the settled reconstructive replay. Both have a CSV and JSON download.',
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
          2026/27 is the current season: Gameweeks 1 to 10 were rebuilt after the matches, and later
          weeks are frozen before the deadline. 2025/26 is the settled reconstructive replay.
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
              {season.kind === 'historical-replay'
                ? ` · ${season.optimiserPoints} pts`
                : ` · ${season.optimiserPoints} pts so far`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
