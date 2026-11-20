import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReplayForkNotes, getSeasonGameweeks, getSeasons, getSeasonIndex } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import {
  DATASET_LICENSE_URL,
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

export const dynamicParams = false;

export function generateStaticParams() {
  return getSeasons().map((season) => ({ season: season.id }));
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
    openGraph: {
      title: index.title,
      description: index.summary,
      url: seasonPath(season),
    },
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
  const isLiveSeason = season === '2026-27';
  const scored = index.rows.filter((row) => row.points !== null).length;

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
            license: DATASET_LICENSE_URL,
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
          <dt className="text-sm text-neutral-500">{isLiveSeason ? 'Optimiser so far' : 'Optimiser'}</dt>
          <dd className="mt-1 text-xl font-semibold">{index.optimiserPoints} pts</dd>
        </div>
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">{isLiveSeason ? 'Template so far' : 'Template'}</dt>
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
            {fork.forkDeltaGw12to38} from GW12 to GW38). Direct same-state evidence contributed only +
            {fork.sameStateEvidenceDelta} points. {fork.disclaimer}
          </p>
          <p className="text-neutral-800 leading-relaxed">
            No chip was used. In Gameweek 34, the optimiser took an 8-point hit and scored
            {fork.gw34.optimiserNet} net. The template held and scored {fork.gw34.templateNet} net.{' '}
            <Link href="/guides/gw34-blank-and-hits" className="underline underline-offset-2">
              Read the case
            </Link>
            .
          </p>
          <p className="text-neutral-800 leading-relaxed">
            In Gameweek 37, the optimiser scored 70 points and the template scored 63. The optimiser
            made no transfers and used no chip.{' '}
            <Link href="/seasons/2025-26/gw/37" className="underline underline-offset-2">
              See the GW37 replay
            </Link>
            .
          </p>
        </section>
      ) : isLiveSeason ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">How to read this season</h2>
          <p className="text-neutral-800 leading-relaxed">
            Gameweeks 1 to 10 were rebuilt after the matches. The cutoff is first kickoff minus 90
            minutes, the same rule as the 2025/26 replay. Those pages are not a live freeze.
          </p>
          <p className="text-neutral-800 leading-relaxed">
            From Gameweek 11 the pick is frozen before the official deadline and hashed. The weekly
            job locks the next plan about two hours before the deadline, then fills official points
            once FPL marks the gameweek final. The totals above add the {scored} scored weeks. No
            chip is in the search.
          </p>
        </section>
      ) : (
        <p className="text-neutral-700">This season has no published notes yet.</p>
      )}

      <p className="text-sm">
        <a href={snapshotHref} className="underline underline-offset-2">
          Download season JSON
        </a>
        {isReplay || isLiveSeason ? (
          <>
            {' · '}
            <Link href={`/seasons/${season}/download`} className="underline underline-offset-2">
              Download CSV and JSON
            </Link>
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
                    {row.hits > 0 ? ` · ${row.hits}-pt hit` : ''}
                    {row.transfers === 0 ? ' · Hold' : ` · ${row.transfers} tr`}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {row.projected === 0 && isReplay ? 'n/a' : row.projected.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">{row.points ?? 'Pending'}</td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {row.templatePoints ?? 'n/a'}
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
            : 'No. Same-state evidence copies the optimiser, because no pre-deadline evidence ledger was available to move a rate.'}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Were any chips played?</h2>
        <p className="text-neutral-800 leading-relaxed">
          {isReplay
            ? 'No. See the chip hubs and the Gameweek 34 hit case for what that gap means.'
            : 'No. Wildcard, Free Hit, Triple Captain and Bench Boost are left out of the weekly search, on the replay weeks and on the live freeze.'}
        </p>
      </section>
    </div>
  );
}
