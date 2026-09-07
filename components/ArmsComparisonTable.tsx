import Link from 'next/link';
import { PolicyArmSummary } from '@/types/fpl';
import { ARM_LABELS, replayPath } from '@/lib/present';

interface ArmsComparisonTableProps {
  arms: PolicyArmSummary[];
  season: string;
  gw: number;
  compact?: boolean;
}

export function ArmsComparisonTable({
  arms,
  season,
  gw,
  compact = false,
}: ArmsComparisonTableProps) {
  return (
    <div className="border border-neutral-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h2 className="text-lg font-semibold">Three approaches compared</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Template (hold transfers), optimiser (selected plan), and high-ceiling (more risk).
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-100 text-neutral-600">
            <tr>
              <th scope="col" className="py-2 px-3 font-medium">
                Approach
              </th>
              <th scope="col" className="py-2 px-3 font-medium">
                Formation
              </th>
              <th scope="col" className="py-2 px-3 font-medium">
                Captain
              </th>
              <th scope="col" className="py-2 px-3 font-medium">
                Transfers
              </th>
              <th scope="col" className="py-2 px-3 font-medium text-right">
                Projected
              </th>
              <th scope="col" className="py-2 px-3 font-medium text-right">
                vs Template
              </th>
              <th scope="col" className="py-2 px-3 font-medium text-right">
                Points
              </th>
              <th scope="col" className="py-2 px-3 font-medium">
                Note
              </th>
              <th scope="col" className="py-2 px-3 font-medium">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {arms.map((arm) => {
              const selected = arm.id === 'optimiser';
              const label = ARM_LABELS[arm.id] ?? arm.shortLabel;
              return (
                <tr key={arm.id} className="border-t border-neutral-200">
                  <td className="py-3 px-3">
                    <div className="font-medium">
                      {label}
                      {selected ? ' (selected)' : ''}
                    </div>
                    {compact ? null : (
                      <div className="text-neutral-600">{arm.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-3">{arm.formation}</td>
                  <td className="py-3 px-3">
                    {arm.captain}
                    <span className="text-neutral-500"> ({arm.viceCaptain})</span>
                  </td>
                  <td className="py-3 px-3">
                    {arm.transfersCount}
                    {arm.hits > 0 ? ` (−${arm.hits * 4} hit)` : ''}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {arm.objectiveEP.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {arm.decisionDeltaVsBaseline === 0
                      ? '—'
                      : `${arm.decisionDeltaVsBaseline > 0 ? '+' : ''}${arm.decisionDeltaVsBaseline.toFixed(1)}`}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    {arm.realisedPoints !== null ? arm.realisedPoints : 'Pending'}
                  </td>
                  <td className="py-3 px-3 text-neutral-600">
                    {arm.realisedRankEffect || 'Settlement in progress'}
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={replayPath(season, gw, arm.id)}
                      className="underline underline-offset-2"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
