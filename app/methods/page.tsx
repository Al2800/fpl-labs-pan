import { Metadata } from 'next';
import Link from 'next/link';
import { getReplayCalibration } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/present';

export const metadata: Metadata = {
  title: 'Methods and calibration',
  description:
    'How FPL Replay builds a gameweek plan, how a reconstructive replay differs from a two-hour freeze, and error metrics for the 2025/26 ingest.',
  alternates: {
    canonical: '/methods',
  },
  openGraph: {
    title: 'Methods and calibration',
    description:
      'How FPL Replay builds a gameweek plan, how a reconstructive replay differs from a two-hour freeze, and error metrics for the 2025/26 ingest.',
    url: '/methods',
  },
};

export default function MethodsPage() {
  const replay = getReplayCalibration();

  return (
    <div className="space-y-10">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Methods', path: '/methods' },
        ])}
      />

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Methods and calibration
        </h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          The 2025/26 optimiser maximises discounted expected points over a five-week window, subject
          to FPL squad rules. The 2026/27 pages use a different public solver, described below. A
          live week freezes about two hours before the deadline. A reconstructive week uses first
          kickoff minus 90 minutes, and was not frozen before the deadline.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Solver</h2>
        <p className="text-neutral-800 leading-relaxed">
          The core optimiser is a rolling-horizon mixed-integer linear programme over an H-week
          window (default H = 5). The objective maximises the discounted sum of starting XI expected
          points less transfer-hit penalties.
        </p>
        <pre className="border border-neutral-200 bg-white p-4 text-xs sm:text-sm overflow-x-auto font-mono text-neutral-800">
{`maximise
  Σ_{t=1..H} γ^(t-1) * [ Σ_{i ∈ XI_t} ( E[P_{i,t}] * (1 + 1_{i = captain_t}) ) - 4.0 * max(0, Transfers_t - FreeTransfers_t) ]

subject to
  1. Roster size: Σ x_{i,t} = 15
  2. Budget: Σ cost_{i,t} * x_{i,t} + bank_t ≤ Budget_t
  3. Club limit: Σ_{i ∈ Club_k} x_{i,t} ≤ 3
  4. Formation: 1 GKP, 3–5 DEF, 2–5 MID, 1–3 FWD
  5. One captain, who must start`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. Live freeze versus reconstructive replay</h2>
        <p className="text-neutral-800 leading-relaxed">
          A live week locks the plan about two hours before the official deadline, hashes the JSON,
          and does not edit the squad after that. Scoring only fills official points. The 2025/26
          pages, and 2026/27 Gameweeks 1 to 10, use a reconstructed cutoff (first kickoff minus 90
          minutes) built after the matches. They were not frozen before the deadline. Private bank,
          exact pre-deadline prices and timestamped odds were not archived for 2025/26.
          See{' '}
          <Link href="/guides/reconstructive-replay" className="underline underline-offset-2">
            reconstructive replay
          </Link>{' '}
          and{' '}
          <Link href="/guides/how-freeze-and-hash-work" className="underline underline-offset-2">
            freeze and hash
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2026/27 solver</h2>
        <p className="text-neutral-800 leading-relaxed">
          The 2026/27 pages use the public solver in the sibling lab (Al2800/FPL, WP-07 bounded
          search, version wp07-wc-fh-rebuild-v0.3). Gameweek 1 is that repo&apos;s six-week
          initial-squad search on the deterministic arm, using Gameweek 1 prices and the published
          2025/26 points-per-90 prior. Later weeks are a one-week search. The optimiser may take at
          most one paid transfer. The template makes at most one free transfer and never takes a
          hit. Evidence copies the optimiser, because no pre-deadline evidence ledger was available.
          Chips are not in the search.
        </p>
        <p className="text-neutral-800 leading-relaxed">
          The five-week mixed-integer programme above is the 2025/26 method. It was not run for
          2026/27. The lab&apos;s full live model, which uses odds, ratings and an evidence ledger,
          is not in the public repository, so this run does not pretend to use it. Expected points
          blend the prior with official minutes from earlier gameweeks only, then scale by official
          fixture difficulty. Selling prices follow the official half-profit rule from the stored
          purchase price.
        </p>
      </section>

      <section id="calibration" className="space-y-3">
        <h2 className="text-lg font-semibold">3. 2025/26 replay error</h2>
        {replay ? (
          <>
            <p className="text-neutral-800 leading-relaxed">{replay.note}</p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 border border-neutral-200 bg-white">
              <div className="p-4 border-r border-b border-neutral-200">
                <dt className="text-sm text-neutral-500">Squad weeks</dt>
                <dd className="mt-1 font-medium">{replay.gameweeks}</dd>
              </div>
              <div className="p-4 border-r border-b border-neutral-200">
                <dt className="text-sm text-neutral-500">Squad MAE</dt>
                <dd className="mt-1 font-medium">{replay.squadMae.toFixed(1)} pts</dd>
              </div>
              <div className="p-4 border-r border-b border-neutral-200">
                <dt className="text-sm text-neutral-500">Squad bias</dt>
                <dd className="mt-1 font-medium">
                  {replay.squadBias > 0 ? '+' : ''}
                  {replay.squadBias.toFixed(1)}
                </dd>
              </div>
              <div className="p-4 border-b border-neutral-200">
                <dt className="text-sm text-neutral-500">Player-round MAE</dt>
                <dd className="mt-1 font-medium">
                  {replay.playerMae.toFixed(2)} ({replay.playerRounds.toLocaleString()} XI rows)
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-neutral-700">No replay calibration is available.</p>
        )}
      </section>

      <p className="text-sm">
        <Link href="/seasons/2025-26" className="underline underline-offset-2">
          2025/26 season
        </Link>
        {' · '}
        <Link href="/glossary" className="underline underline-offset-2">
          Glossary
        </Link>
      </p>
    </div>
  );
}
