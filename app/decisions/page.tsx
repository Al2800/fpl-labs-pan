import Link from 'next/link';
import { Metadata } from 'next';
import { getAllGameweeks } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import {
  breadcrumbList,
  gameweekPath,
  seasonLabel,
  shortHash,
  statusLabel,
} from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL gameweek decisions',
  description:
    'Archive of pre-deadline FPL gameweek teams, captains, transfers and realised points. Each entry is frozen two hours before the deadline.',
};

export default function DecisionsIndexPage() {
  const gameweeks = getAllGameweeks();
  const completed = gameweeks.filter(
    (gw) => gw.validatedPlan.realisedSquadTotalPoints !== null
  );
  const realisedTotal = completed.reduce(
    (sum, gw) => sum + (gw.validatedPlan.realisedSquadTotalPoints || 0),
    0
  );
  const optimiserDeltas = gameweeks
    .map((gw) => gw.arms.find((arm) => arm.id === 'optimiser')?.decisionDeltaVsBaseline)
    .filter((value): value is number => typeof value === 'number');
  const meanDelta =
    optimiserDeltas.length > 0
      ? optimiserDeltas.reduce((sum, value) => sum + value, 0) / optimiserDeltas.length
      : 0;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Decisions', path: '/decisions' },
        ])}
      />

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          FPL gameweek decisions
        </h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          Every gameweek team, captain and transfer list, locked two hours before the deadline. No
          retroactive edits.
        </p>
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-3 border border-neutral-200 bg-white">
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Gameweeks</dt>
          <dd className="mt-1 text-xl font-semibold">{gameweeks.length}</dd>
        </div>
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Optimiser vs template</dt>
          <dd className="mt-1 text-xl font-semibold">
            {meanDelta >= 0 ? '+' : ''}
            {meanDelta.toFixed(1)} xP
          </dd>
        </div>
        <div className="p-4 border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Settled points</dt>
          <dd className="mt-1 text-xl font-semibold">
            {completed.length > 0 ? `${realisedTotal} pts` : 'Pending'}
          </dd>
        </div>
      </dl>

      <div className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold">Season {seasonLabel(gameweeks[0]?.season ?? '')}</h2>
          <span className="text-sm text-neutral-500">Newest first</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Gameweek
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Status
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Plan
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Captain
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Projected
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Points
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Hash
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Open
                </th>
              </tr>
            </thead>
            <tbody>
              {[...gameweeks].reverse().map((gw) => (
                <tr key={gw.gw} className="border-t border-neutral-200">
                  <td className="py-3 px-3">
                    <Link href={gameweekPath(gw.gw)} className="font-medium underline underline-offset-2">
                      GW{gw.gw}
                    </Link>
                  </td>
                  <td className="py-3 px-3">{statusLabel(gw.status)}</td>
                  <td className="py-3 px-3">
                    {gw.validatedPlan.formation}
                    {gw.validatedPlan.transfersIn.length > 0
                      ? ` · ${gw.validatedPlan.transfersIn.map((player) => player.webName).join(', ')} in`
                      : ' · Hold'}
                  </td>
                  <td className="py-3 px-3">{gw.validatedPlan.captain.webName}</td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {gw.validatedPlan.projectedSquadTotalXP.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {gw.validatedPlan.realisedSquadTotalPoints !== null
                      ? gw.validatedPlan.realisedSquadTotalPoints
                      : 'Pending'}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-neutral-600">
                    {shortHash(gw.provenance.snapshotHash)}
                  </td>
                  <td className="py-3 px-3">
                    <Link href={gameweekPath(gw.gw)} className="underline underline-offset-2">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
