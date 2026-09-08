import Link from 'next/link';
import { Metadata } from 'next';
import { getSeasons } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, seasonLabel, seasonPath } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL seasons',
  description:
    'FPL Labs Pan seasons: the 2025/26 reconstructive replay and the 2026/27 illustrative sample of the live format.',
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
          Each season is either a reconstructive replay or an illustrative sample. Open a season for
          the gameweek list, then download JSON from any page.
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
