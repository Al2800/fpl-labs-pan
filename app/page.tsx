import Link from 'next/link';
import { getAllGameweeks, getLatestGameweekDecision } from '@/lib/data';
import { ArmsComparisonTable } from '@/components/ArmsComparisonTable';
import {
  CHIP_IDS,
  CHIP_LABELS,
  chipPath,
  gameweekAnswer,
  gameweekHeading,
  gameweekPath,
  seasonLabel,
  statusLabel,
} from '@/lib/present';

export default function HomePage() {
  const latest = getLatestGameweekDecision();
  const allGws = getAllGameweeks();
  const answer = gameweekAnswer(latest);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          FPL decisions, frozen before the deadline
        </h1>
        <p className="text-neutral-700 leading-relaxed max-w-3xl">
          FPL Labs Pan publishes the team, captain, transfers and chip call for each gameweek two
          hours before the deadline. The same inputs are run through three approaches, then scored
          against official points. Nothing is edited after the freeze.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500">This week · {statusLabel(latest.status)}</p>
            <h2 className="text-xl font-semibold">{gameweekHeading(latest)}</h2>
          </div>
          <Link href={gameweekPath(latest.gw)} className="underline underline-offset-2 text-sm">
            Full gameweek page
          </Link>
        </div>
        <p className="text-neutral-800 leading-relaxed">{answer}</p>
        <dl className="grid grid-cols-2 sm:grid-cols-4 border border-neutral-200 bg-white">
          <div className="p-3 border-r border-b border-neutral-200">
            <dt className="text-sm text-neutral-500">Captain</dt>
            <dd className="mt-1 font-medium">{latest.validatedPlan.captain.webName}</dd>
          </div>
          <div className="p-3 border-r border-b border-neutral-200">
            <dt className="text-sm text-neutral-500">Formation</dt>
            <dd className="mt-1 font-medium">{latest.validatedPlan.formation}</dd>
          </div>
          <div className="p-3 border-r border-b border-neutral-200">
            <dt className="text-sm text-neutral-500">Projected</dt>
            <dd className="mt-1 font-medium">
              {latest.validatedPlan.projectedSquadTotalXP.toFixed(1)} xP
            </dd>
          </div>
          <div className="p-3 border-b border-neutral-200">
            <dt className="text-sm text-neutral-500">Points</dt>
            <dd className="mt-1 font-medium">
              {latest.validatedPlan.realisedSquadTotalPoints ?? 'Pending'}
            </dd>
          </div>
        </dl>
        <ArmsComparisonTable compact arms={latest.arms} season={latest.season} gw={latest.gw} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="list-decimal pl-5 space-y-2 text-neutral-800">
          <li>Inputs lock two hours before the official FPL deadline.</li>
          <li>Three approaches run on that freeze: template, optimiser, and high-ceiling.</li>
          <li>Chip timing and what-ifs are published against the same snapshot, then scored.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Gameweeks ({seasonLabel(latest.season)})</h2>
        <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
          {[...allGws].reverse().map((gw) => (
            <li key={gw.gw} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <Link href={gameweekPath(gw.gw)} className="font-medium underline underline-offset-2">
                Gameweek {gw.gw}
              </Link>
              <span className="text-sm text-neutral-600">
                {gw.validatedPlan.captain.webName} · {gw.validatedPlan.formation} ·{' '}
                {gw.validatedPlan.realisedSquadTotalPoints !== null
                  ? `${gw.validatedPlan.realisedSquadTotalPoints} pts`
                  : `${gw.validatedPlan.projectedSquadTotalXP.toFixed(1)} xP`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip timing</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {CHIP_IDS.map((chip) => (
            <li key={chip}>
              <Link href={chipPath(chip, latest.gw)} className="underline underline-offset-2">
                {CHIP_LABELS[chip]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-neutral-600">
        <Link href="/methods" className="underline underline-offset-2">
          Methods and error metrics
        </Link>
        {' · '}
        <Link href="/sims" className="underline underline-offset-2">
          What-ifs
        </Link>
      </p>
    </div>
  );
}
