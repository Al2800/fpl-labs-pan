import React from 'react';
import Link from 'next/link';
import { PolicyArmSummary } from '@/types/fpl';
import { ArrowRight, Zap, Compass, Calculator } from 'lucide-react';

interface ArmsComparisonTableProps {
  arms: PolicyArmSummary[];
  season: string;
  gw: number;
}

export function ArmsComparisonTable({ arms, season, gw }: ArmsComparisonTableProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Heuristic':
        return <Compass className="w-4 h-4 text-slate-400" />;
      case 'Mixed-Integer Linear (ILP)':
        return <Calculator className="w-4 h-4 text-cyan-400" />;
      case 'Multi-Objective Agent':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      default:
        return <Compass className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Policy Arms Evaluation Matrix</span>
            <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Template D Matrix
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparative analysis between template heuristic, mixed-integer linear programming (MILP), and multi-objective agent arms.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Policy Arm</th>
              <th className="py-3 px-4">Formation</th>
              <th className="py-3 px-4">Captain</th>
              <th className="py-3 px-4">Transfers (Hits)</th>
              <th className="py-3 px-4 text-right">Projected EP</th>
              <th className="py-3 px-4 text-right">Model Delta</th>
              <th className="py-3 px-4 text-right">Realised Pts</th>
              <th className="py-3 px-4">Performance Note</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
            {arms.map((arm) => {
              const isOptimiser = arm.id === 'optimiser';

              return (
                <tr
                  key={arm.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isOptimiser ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  {/* Policy Arm */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">{getCategoryIcon(arm.category)}</div>
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <span>{arm.shortLabel}</span>
                          {isOptimiser && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/40">
                              Selected Plan
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                          {arm.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Formation */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {arm.formation}
                    </span>
                  </td>

                  {/* Captain */}
                  <td className="py-3.5 px-4 text-slate-200">
                    <span className="font-medium text-slate-100">{arm.captain}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({arm.viceCaptain})</span>
                  </td>

                  {/* Transfers & Hits */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <span>{arm.transfersCount} FT</span>
                    {arm.hits > 0 ? (
                      <span className="ml-1 text-rose-400 font-medium">(-{arm.hits * 4} pts)</span>
                    ) : (
                      <span className="ml-1 text-slate-500">(0 hit)</span>
                    )}
                  </td>

                  {/* Projected EP */}
                  <td className="py-3.5 px-4 text-right tabular-nums">
                    <span className="text-sm font-bold text-slate-100">
                      {arm.objectiveEP.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">xP</span>
                  </td>

                  {/* Model Delta */}
                  <td className="py-3.5 px-4 text-right tabular-nums">
                    {arm.decisionDeltaVsBaseline === 0 ? (
                      <span className="text-slate-500">0.0</span>
                    ) : arm.decisionDeltaVsBaseline > 0 ? (
                      <span className="text-emerald-400 font-semibold">
                        +{arm.decisionDeltaVsBaseline.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold">
                        {arm.decisionDeltaVsBaseline.toFixed(1)}
                      </span>
                    )}
                  </td>

                  {/* Realised Points */}
                  <td className="py-3.5 px-4 text-right tabular-nums">
                    {arm.realisedPoints !== null ? (
                      <span className="text-sm font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        {arm.realisedPoints} pts
                      </span>
                    ) : (
                      <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>Pending</span>
                      </span>
                    )}
                  </td>

                  {/* Performance Note */}
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-400">
                    {arm.realisedRankEffect || (
                      <span className="text-slate-500 italic">Settlement in progress</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/replays/${season}/gw/${gw}/${arm.id}`}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-sans font-medium"
                    >
                      <span>Replay</span>
                      <ArrowRight className="w-3 h-3" />
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
