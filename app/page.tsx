import Link from 'next/link';
import { getFeaturedGameweek, getLatestDemoGameweek, getSeasonIndex } from '@/lib/data';
import { ArmsComparisonTable } from '@/components/ArmsComparisonTable';
import {
  CHIP_HUBS,
  chipHubPath,
  datasetKindOf,
  formatProjected,
  gameweekAnswer,
  gameweekHeading,
  gameweekPath,
  seasonLabel,
  statusLabel,
} from '@/lib/present';
import { GUIDES } from '@/lib/content/guides';

export default function HomePage() {
  const featured = getFeaturedGameweek();
  const demo = getLatestDemoGameweek();
  const replay = getSeasonIndex('2025-26');
  const answer = gameweekAnswer(featured);
  const kind = datasetKindOf(featured);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          FPL decisions you can check
        </h1>
        <p className="text-neutral-700 leading-relaxed max-w-3xl">
          FPL Replay publishes the team, captain, transfers and chip call for each gameweek, then
          scores them on official points. 2025/26 is a full reconstructive replay. 2026/27 pages
          show the live format as an illustrative sample.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500">
              Settled season · {seasonLabel(featured.season)} · {statusLabel(featured.status)}
            </p>
            <h2 className="text-xl font-semibold">{gameweekHeading(featured)}</h2>
          </div>
          <Link
            href={gameweekPath(featured.season, featured.gw)}
            className="underline underline-offset-2 text-sm"
          >
            Full gameweek page
          </Link>
        </div>
        <p className="text-neutral-800 leading-relaxed">{answer}</p>
        {replay ? (
          <dl className="grid grid-cols-2 sm:grid-cols-4 border border-neutral-200 bg-white">
            <div className="p-3 border-r border-b border-neutral-200">
              <dt className="text-sm text-neutral-500">Optimiser</dt>
              <dd className="mt-1 font-medium">{replay.optimiserPoints} pts</dd>
            </div>
            <div className="p-3 border-r border-b border-neutral-200">
              <dt className="text-sm text-neutral-500">Template</dt>
              <dd className="mt-1 font-medium">{replay.templatePoints} pts</dd>
            </div>
            <div className="p-3 border-r border-b border-neutral-200">
              <dt className="text-sm text-neutral-500">Chips played</dt>
              <dd className="mt-1 font-medium">None</dd>
            </div>
            <div className="p-3 border-b border-neutral-200">
              <dt className="text-sm text-neutral-500">Last week</dt>
              <dd className="mt-1 font-medium">
                {featured.validatedPlan.captain.webName} ·{' '}
                {featured.validatedPlan.realisedSquadTotalPoints} pts
              </dd>
            </div>
          </dl>
        ) : null}
        <ArmsComparisonTable
          compact
          arms={featured.arms}
          season={featured.season}
          gw={featured.gw}
          kind={kind}
        />
        <p className="text-sm">
          <Link href="/seasons/2025-26" className="underline underline-offset-2">
            Open the 2025/26 season
          </Link>
          {' · '}
          <Link href="/guides/2025-26-season-review" className="underline underline-offset-2">
            Season review
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How to read a page</h2>
        <ol className="list-decimal pl-5 space-y-2 text-neutral-800">
          <li>The first paragraph is the answer: captain, formation, transfers, points.</li>
          <li>The trust strip says whether this is a reconstructive replay or a live freeze.</li>
          <li>
            Download the JSON snapshot for the same object. Agents should start at{' '}
            <Link href="/llms.txt" className="underline underline-offset-2">
              /llms.txt
            </Link>
            .
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Guides for humans and agents</h2>
        <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
          {GUIDES.map((guide) => (
            <li key={guide.slug} className="px-4 py-3">
              <Link
                href={`/guides/${guide.slug}`}
                className="font-medium underline underline-offset-2"
              >
                {guide.title}
              </Link>
              <p className="text-sm text-neutral-600 mt-1">{guide.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip timing</h2>
        <p className="text-neutral-700">
          2025/26 never played a chip. These hubs are the evergreen rules, plus that finding.
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {CHIP_HUBS.map((chip) => (
            <li key={chip.id}>
              <Link href={chipHubPath(chip.slug)} className="underline underline-offset-2">
                {chip.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2026/27 illustrative sample</h2>
        <p className="text-neutral-700 leading-relaxed">
          Gameweek {demo.gw} shows the live-product layout. Captain {demo.validatedPlan.captain.webName},{' '}
          {demo.validatedPlan.formation}, {formatProjected(demo.validatedPlan.projectedSquadTotalXP, 'illustrative-sample')}.
          It is not a live freeze.
        </p>
        <p className="text-sm">
          <Link
            href={gameweekPath(demo.season, demo.gw)}
            className="underline underline-offset-2"
          >
            Open sample Gameweek {demo.gw}
          </Link>
        </p>
      </section>
    </div>
  );
}
