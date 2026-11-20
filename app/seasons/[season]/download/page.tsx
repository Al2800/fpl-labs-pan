import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import {
  LIVE_CITATION,
  LIVE_CSV_PATH,
  LIVE_DATASET_NAME,
  LIVE_JSON_PATH,
  LIVE_SEASON_ID,
  REPLAY_CITATION,
  REPLAY_CSV_PATH,
  REPLAY_DATASET_NAME,
  REPLAY_JSON_PATH,
  REPLAY_SEASON_ID,
  fieldDictionary,
  getReplayDigest,
  listReplayWeeks,
} from '@/lib/replay-2025';
import { DATASET_LICENSE_URL, absoluteUrl, breadcrumbList, seasonLabel, seasonPath } from '@/lib/present';

interface PageProps {
  params: Promise<{ season: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ season: REPLAY_SEASON_ID }, { season: LIVE_SEASON_ID }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season } = await params;
  if (season !== REPLAY_SEASON_ID && season !== LIVE_SEASON_ID) return { title: 'Download not found' };
  const title =
    season === LIVE_SEASON_ID
      ? 'FPL 2026/27 season download'
      : 'FPL 2025/26 replay dataset download';
  const description =
    season === LIVE_SEASON_ID
      ? 'Download the FPL Replay 2026/27 season as CSV or JSON: captain, points, transfers and hits. Gameweeks 1 to 10 are a reconstructive replay. Later weeks are frozen before the deadline.'
      : 'Download the FPL Replay 2025/26 season as CSV or JSON: captain, points, transfers, hits and bench points for all 38 gameweeks.';
  const path = `/seasons/${season}/download`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function ReplayDownloadPage({ params }: PageProps) {
  const { season } = await params;
  if (season !== REPLAY_SEASON_ID && season !== LIVE_SEASON_ID) notFound();
  const live = season === LIVE_SEASON_ID;
  if (!live) getReplayDigest();
  const weeks = listReplayWeeks(season);
  const label = seasonLabel(season);
  const fields = fieldDictionary(season);
  const csvPath = live ? LIVE_CSV_PATH : REPLAY_CSV_PATH;
  const jsonPath = live ? LIVE_JSON_PATH : REPLAY_JSON_PATH;
  const datasetName = live ? LIVE_DATASET_NAME : REPLAY_DATASET_NAME;
  const citation = live ? LIVE_CITATION : REPLAY_CITATION;
  const optimiserTotal = weeks.reduce((sum, week) => sum + (week.optimiserPoints ?? 0), 0);
  const templateTotal = weeks.reduce((sum, week) => sum + (week.templatePoints ?? 0), 0);
  const downloadPath = `/seasons/${season}/download`;

  return (
    <div className="space-y-8 max-w-3xl">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: datasetName,
            description: live
              ? 'One row per published FPL Replay 2026/27 gameweek. Captains, points, transfers and hits. No chip was played.'
              : 'One row per gameweek from the FPL Replay 2025/26 reconstructive replay. Captains, points, transfers, hits and bench points. No chip was played.',
            url: absoluteUrl(downloadPath),
            license: DATASET_LICENSE_URL,
            citation,
            creator: {
              '@type': 'Organization',
              name: 'FPL Replay',
              url: absoluteUrl('/'),
            },
            temporalCoverage: live ? '2026/2027' : '2025/2026',
            keywords: ['Fantasy Premier League', 'FPL', live ? '2026/27' : '2025/26', 'replay'],
            distribution: [
              {
                '@type': 'DataDownload',
                encodingFormat: 'text/csv',
                contentUrl: absoluteUrl(csvPath),
              },
              {
                '@type': 'DataDownload',
                encodingFormat: 'application/json',
                contentUrl: absoluteUrl(jsonPath),
              },
            ],
          },
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Seasons', path: '/seasons' },
            { name: label, path: seasonPath(season) },
            { name: 'Download', path: downloadPath },
          ]),
        ]}
      />

      <nav className="text-sm text-neutral-600">
        <Link href="/seasons" className="underline underline-offset-2">
          Seasons
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href={seasonPath(season)} className="underline underline-offset-2">
          {label}
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-900">Download</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {live ? `Download the ${label} FPL season` : `Download the ${label} FPL replay`}
        </h1>
        <p className="text-neutral-800 leading-relaxed">
          {live
            ? `This file has ${weeks.length} gameweeks, one row each. Gameweeks 1 to 10 were rebuilt after the matches. Later rows are frozen before the deadline, and a blank points cell means that gameweek is not final. Scored weeks add to ${optimiserTotal} net points for the optimiser and ${templateTotal} for the template. No chip was played.`
            : `This is the full ${label} reconstructive replay in one file: ${weeks.length} gameweeks, one row each. The optimiser scored ${optimiserTotal} net points and the template scored ${templateTotal}. No chip was played. The files are built from the per-gameweek JSON already on this site.`}
        </p>
      </header>

      <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        <a href={csvPath} className="underline underline-offset-2">
          Download CSV
        </a>
        <a href={jsonPath} className="underline underline-offset-2">
          Download JSON
        </a>
        <Link href={seasonPath(season)} className="underline underline-offset-2">
          Season page
        </Link>
        <Link href="/chips" className="underline underline-offset-2">
          Chip pages
        </Link>
        <Link href="/chips/calculator" className="underline underline-offset-2">
          Chip calculator
        </Link>
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Field dictionary</h2>
        <p className="text-neutral-800 leading-relaxed">
          The same columns are in the CSV header and on each JSON row. Bench points are the sum of
          the four substitutes. A Bench Boost or Triple Captain figure you derive from these columns
          is arithmetic. The replay did not play either chip.
        </p>
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">Field</th>
                <th scope="col" className="py-2 px-3 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.field} className="border-t border-neutral-200">
                  <td className="py-2 px-3 font-mono text-xs">{field.field}</td>
                  <td className="py-2 px-3 text-neutral-800">{field.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What is left out</h2>
        <p className="text-neutral-800 leading-relaxed">
          Weekly ownership is not included. The ownership figure in the source files is the same
          every week for a given player, so it is not a weekly ownership series. Double gameweeks
          are not marked. The opponent field stores one fixture only. Chip outcomes are not
          included, because the chip column is none in every row.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Licence and citation</h2>
        <p className="text-neutral-800 leading-relaxed">
          Licence:{' '}
          <a href={DATASET_LICENSE_URL} className="underline underline-offset-2">
            Creative Commons Attribution 4.0 (CC BY 4.0)
          </a>
          . You can reuse the file with credit.
        </p>
        <p className="text-neutral-800 leading-relaxed">{citation}</p>
      </section>
    </div>
  );
}
