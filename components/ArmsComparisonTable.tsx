import Link from 'next/link';
import { DatasetKind, PolicyArmSummary } from '@/types/fpl';
import { armLabel, replayPath } from '@/lib/present';

interface ArmsComparisonTableProps {
  arms: PolicyArmSummary[];
  season: string;
  gw: number;
  compact?: boolean;
  kind?: DatasetKind;
}

export function ArmsComparisonTable({
  arms,
  season,
  gw,
  compact = false,
  kind,
}: ArmsComparisonTableProps) {
  const showDetail = kind !== 'historical-replay';
  const intro =
    kind === 'historical-replay'
      ? 'Template (roll transfers), optimiser (selected plan), and same-state evidence. In this ingest, evidence matched the optimiser every week.'
      : 'Template (hold transfers), optimiser (selected plan), and high-ceiling (more risk).';

  return (
    <div className="border border-neutral-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h2 className="text-lg font-semibold">Three approaches compared</h2>
        <p className="text-sm text-neutral-600 mt-1">{intro}</p>
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
              {showDetail ? (
                <th scope="col" className="py-2 px-3 font-medium">
                  Detail
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {arms.map((arm) => {
              const selected = arm.id === 'optimiser';
              const label = armLabel(arm, kind);
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
                    {kind === 'historical-replay' && arm.objectiveEP === 0
                      ? '—'
                      : arm.objectiveEP.toFixed(1)}
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
                  {showDetail ? (
                    <td className="py-3 px-3">
                      <Link
                        href={replayPath(season, gw, arm.id)}
                        className="underline underline-offset-2"
                      >
                        Detail
                      </Link>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
