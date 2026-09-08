import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReplayForkNotes, getSeasonGameweeks, getSeasonIndex } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbList,
  gameweekPath,
  jsonAlternate,
  seasonLabel,
  seasonPath,
  seasonSnapshotPath,
  shortHash,
} from '@/lib/present';

interface PageProps {
  params: Promise<{ season: string }>;
}

export function generateStaticParams() {
  return [{ season: '2025-26' }, { season: '2026-27' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season } = await params;
  const index = getSeasonIndex(season);
  if (!index) {
    return { title: 'Season not found' };
  }
  return {
    title: index.title,
    description: index.summary,
    alternates: jsonAlternate(seasonPath(season), seasonSnapshotPath(season)),
  };
}

export default async function SeasonHubPage({ params }: PageProps) {
  const { season } = await params;
  const index = getSeasonIndex(season);
  if (!index) {
    notFound();
  }
  const weeks = getSeasonGameweeks(season);
  const fork = season === '2025-26' ? getReplayForkNotes() : null;
  const snapshotHref = seasonSnapshotPath(season);
  const isReplay = index.kind === 'historical-replay';

  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: index.title,
            description: index.summary,
            url: absoluteUrl(seasonPath(season)),
            distribution: {
              '@type': 'DataDownload',
              encodingFormat: 'application/json',
              contentUrl: absoluteUrl(snapshotHref),
            },
          },
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Seasons', path: '/seasons' },
            { name: seasonLabel(season), path: seasonPath(season) },
          ]),
        ]}
      />

      <nav className="text-sm text-neutral-600">
        <Link href="/seasons" className="underline underline-offset-2">
          Seasons
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-900">{seasonLabel(season)}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{index.title}</h1>
        <p className="text-neutral-800 leading-relaxed max-w-3xl">{index.summary}</p>
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-4 border border-neutral-200 bg-white">
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Optimiser</dt>
          <dd className="mt-1 text-xl font-semibold">{index.optimiserPoints} pts</dd>
        </div>
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Template</dt>
          <dd className="mt-1 text-xl font-semibold">{index.templatePoints} pts</dd>
        </div>
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Same-state evidence</dt>
          <dd className="mt-1 text-xl font-semibold">{index.evidencePoints} pts</dd>
        </div>
        <div className="p-4 border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Chips played</dt>
          <dd className="mt-1 text-xl font-semibold">
            {index.chipsPlayed.length === 0 ? 'None' : index.chipsPlayed.length}
          </dd>
        </div>
      </dl>

      {fork ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">What this season shows</h2>
          <p className="text-neutral-800 leading-relaxed">
            Same-state evidence copied the optimiser in all 38 gameweek folders, so the evidence
            column equals 2,010. An exploratory post-season fork that kept a different squad from
            Gameweek 12 finished {fork.forkHybridNet} hybrid net ({fork.forkDeltaGw12to38 >= 0 ? '+' : ''}
            {fork.forkDeltaGw12to38} from GW12–38). Direct same-state evidence contributed only +
            {fork.sameStateEvidenceDelta} points. {fork.disclaimer}
          </p>
          <p className="text-neutral-800 leading-relaxed">
            No chip was used. In Gameweek 34 both the optimiser ({fork.gw34.optimiserNet} net) and
            the template ({fork.gw34.templateNet} net) took an 8-point hit in a blank.{' '}
            <Link href="/guides/gw34-blank-and-hits" className="underline underline-offset-2">
              Read the case
            </Link>
            .
          </p>
        </section>
      ) : (
        <p className="text-neutral-700">
          These three gameweeks are fixtures for the live page format, not a live freeze.
        </p>
      )}

      <p className="text-sm">
        <a href={snapshotHref} className="underline underline-offset-2">
          Download season JSON
        </a>
        {isReplay ? (
          <>
            {' · '}
            <Link
              href="/guides/2025-26-season-review"
              className="underline underline-offset-2"
            >
              Season review
            </Link>
          </>
        ) : null}
      </p>

      <div className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold">Gameweeks</h2>
          <span className="text-sm text-neutral-500">{weeks.length} weeks</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  GW
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Captain
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Plan
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Projected
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Opt
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Template
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody>
              {index.rows.map((row) => (
                <tr key={row.gw} className="border-t border-neutral-200">
                  <td className="py-2 px-3">
                    <Link
                      href={gameweekPath(season, row.gw)}
                      className="font-medium underline underline-offset-2"
                    >
                      GW{row.gw}
                    </Link>
                  </td>
                  <td className="py-2 px-3">{row.captain}</td>
                  <td className="py-2 px-3">
                    {row.formation}
                    {row.hits > 0 ? ` · −${row.hits} hit` : ''}
                    {row.transfers === 0 ? ' · Hold' : ` · ${row.transfers} tr`}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {row.projected === 0 && isReplay ? '—' : row.projected.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">{row.points ?? 'Pending'}</td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {row.templatePoints ?? '—'}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-neutral-600">
                    {shortHash(row.hash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Did the evidence approach beat the optimiser in {seasonLabel(season)}?
        </h2>
        <p className="text-neutral-800 leading-relaxed">
          {isReplay
            ? 'Not on the published per-week plans. Same-state evidence matched the optimiser every week. The +65 figure is an exploratory forked squad path from Gameweek 12, recovered after outcomes were known.'
            : 'These sample weeks are illustrative and not a season result.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Were any chips played?</h2>
        <p className="text-neutral-800 leading-relaxed">
          {isReplay
            ? 'No. See the chip hubs and the Gameweek 34 hit case for what that gap means.'
            : 'Sample chip pages exist under the live format; they are not 2025/26 results.'}
        </p>
      </section>
    </div>
  );
}
