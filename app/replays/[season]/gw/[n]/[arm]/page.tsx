import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArmDetail, getAllGameweeks } from '@/lib/data';
import { ArmId } from '@/types/fpl';
import { ProvenanceCard } from '@/components/ProvenanceCard';
import { JsonLd } from '@/components/JsonLd';
import {
  ArrowLeft,
  Sliders,
  FileCode,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    season: string;
    n: string;
    arm: string;
  }>;
}

export async function generateStaticParams() {
  const gws = getAllGameweeks();
  const arms: ArmId[] = ['baseline', 'optimiser', 'agent'];
  const paramsList: Array<{ season: string; n: string; arm: string }> = [];

  for (const gw of gws) {
    for (const arm of arms) {
      paramsList.push({
        season: gw.season,
        n: gw.gw.toString(),
        arm,
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season, n, arm } = await params;
  const gwNum = parseInt(n, 10);
  const armDetail = getArmDetail(season, gwNum, arm as ArmId);

  if (!armDetail) {
    return {
      title: 'Policy Arm Not Found',
    };
  }

  return {
    title: `${armDetail.armMeta.name} | GW${gwNum} Replay (${season})`,
    description: `Detailed mathematical solver replay for ${armDetail.armMeta.name} in GW${gwNum} (${season}). Objective: ${armDetail.armMeta.objectiveEP.toFixed(1)} xP, Formation: ${armDetail.formation}, Runtime: ${armDetail.armMeta.solverRuntimeMs}ms.`,
  };
}

export default async function ArmDetailPage({ params }: PageProps) {
  const { season, n, arm } = await params;
  const gwNum = parseInt(n, 10);
  const validArmIds: ArmId[] = ['baseline', 'optimiser', 'agent'];

  if (!validArmIds.includes(arm as ArmId)) {
    notFound();
  }

  const armDetail = getArmDetail(season, gwNum, arm as ArmId);
  if (!armDetail) {
    notFound();
  }

  const { armMeta, provenance, captainSelection, solverConstraints, sensitivityAnalysis } = armDetail;

  const getArmBadgeColor = (id: string) => {
    switch (id) {
      case 'optimiser':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'agent':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'baseline':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fpl-labs-pan.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Decisions',
        item: 'https://fpl-labs-pan.vercel.app/decisions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `GW${gwNum}`,
        item: `https://fpl-labs-pan.vercel.app/decisions/gw/${gwNum}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${armMeta.shortLabel} Replay`,
        item: `https://fpl-labs-pan.vercel.app/replays/${season}/gw/${gwNum}/${arm}`,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={`/decisions/gw/${gwNum}`} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to GW{gwNum} Decision</span>
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-mono font-medium">{armMeta.shortLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Link
            href={`/replays/${season}/gw/${gwNum}/baseline`}
            className={`px-2 py-1 rounded border transition-colors ${
              arm === 'baseline' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Baseline
          </Link>
          <Link
            href={`/replays/${season}/gw/${gwNum}/optimiser`}
            className={`px-2 py-1 rounded border transition-colors ${
              arm === 'optimiser' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Optimiser (MILP)
          </Link>
          <Link
            href={`/replays/${season}/gw/${gwNum}/agent`}
            className={`px-2 py-1 rounded border transition-colors ${
              arm === 'agent' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent (Multi-Obj)
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`font-mono text-xs px-2.5 py-0.5 rounded border font-semibold ${getArmBadgeColor(arm)}`}>
            {armMeta.category}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Runtime: {armMeta.solverRuntimeMs}ms
          </span>
          <span className="text-xs font-mono text-slate-400">
            • Bank: £{armDetail.bankRemaining.toFixed(1)}m
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {armMeta.name} Replay
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {armMeta.description}
        </p>
      </div>

      {/* Provenance Card */}
      <ProvenanceCard
        provenance={provenance}
        gw={gwNum}
        season={season}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-mono">Objective Value</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
            {armMeta.objectiveEP.toFixed(1)} <span className="text-xs text-slate-400 font-normal">xP</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rolling expected points</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-mono">Model Delta vs Baseline</div>
          <div className="text-2xl font-bold font-mono mt-1">
            {armMeta.decisionDeltaVsBaseline === 0 ? (
              <span className="text-slate-400">0.0 xP</span>
            ) : armMeta.decisionDeltaVsBaseline > 0 ? (
              <span className="text-emerald-400">+{armMeta.decisionDeltaVsBaseline.toFixed(1)} xP</span>
            ) : (
              <span className="text-rose-400">{armMeta.decisionDeltaVsBaseline.toFixed(1)} xP</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Comparative equity</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-mono">Realised Score</div>
          <div className="text-2xl font-bold font-mono mt-1">
            {armMeta.realisedPoints !== null ? (
              <span className="text-emerald-400">{armMeta.realisedPoints} pts</span>
            ) : (
              <span className="text-amber-400 text-base font-sans">Pending</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{armMeta.realisedRankEffect || 'Fixtures in-flight'}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-mono">Variance & Risk Score</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {armMeta.varianceScore.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Monte Carlo standard deviation</div>
        </div>
      </div>

      {/* Captaincy Decision Matrix */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Captain Armband Candidate Optimization</span>
            <span className="text-xs font-mono font-normal text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              Selected: {captainSelection.player.webName} (2x)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Expected point distribution and 90th percentile ceiling estimates for eligible captaincy candidates.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Fixture</th>
                <th className="py-3 px-4 text-right">Mean xP</th>
                <th className="py-3 px-4 text-right">90th Pct Ceiling</th>
                <th className="py-3 px-4 text-right">Realised Pts</th>
                <th className="py-3 px-4">Solver Selection Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {captainSelection.candidateComparison.map((cand, idx) => {
                const isArmSelected = cand.player === captainSelection.player.webName;
                return (
                  <tr key={idx} className={isArmSelected ? 'bg-amber-950/20' : 'hover:bg-slate-800/40'}>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-100 flex items-center gap-2">
                      <span>{cand.player}</span>
                      <span className="text-[10px] font-mono text-slate-400">({cand.team})</span>
                      {isArmSelected && (
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                          ARMBAND
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{cand.opponent}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-200">
                      {cand.xP.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-cyan-300">
                      {cand.ceiling90th.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {cand.realised !== null ? (
                        <span className="text-emerald-400 font-bold">{cand.realised}</span>
                      ) : (
                        <span className="text-amber-400/80 italic font-sans text-[10px]">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-400 max-w-sm">
                      {cand.selectionReason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Solver Constraint Satisfaction Matrix */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">
            Mathematical Constraint Satisfaction
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Integer programming dual variables, slack capacity, and binding limits for this policy arm.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Constraint Name</th>
                <th className="py-3 px-4">Mathematical Expression</th>
                <th className="py-3 px-4">Evaluated Value</th>
                <th className="py-3 px-4">Slack / Margin</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {solverConstraints.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-medium text-slate-200">{c.name}</td>
                  <td className="py-3 px-4 text-slate-400">{c.expression}</td>
                  <td className="py-3 px-4 text-slate-200">{c.value}</td>
                  <td className="py-3 px-4 text-slate-400">{c.slack}</td>
                  <td className="py-3 px-4">
                    {c.binding ? (
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px]">
                        BINDING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                        FEASIBLE (SLACK)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sensitivity / What-If Scenarios */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet-400" />
            <span>Sensitivity Analysis & Shadow Perturbations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            How the optimal arm shifts under simulated minute caps or expected goal involvement perturbations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {sensitivityAnalysis.map((scenario, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-slate-200 text-xs">
                {scenario.scenario}
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-1.5 rounded">
                Condition: {scenario.condition}
              </div>
              <div className="text-slate-300 text-xs">
                {scenario.optimalArmShift}
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono">
                <span className="text-slate-500 text-[10px]">Expected Impact</span>
                <span className={scenario.expectedPointsDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {scenario.expectedPointsDelta >= 0 ? `+${scenario.expectedPointsDelta.toFixed(2)}` : scenario.expectedPointsDelta.toFixed(2)} xP
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Raw Solver Data Payload */}
      <section className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Raw Arm Audit Payload (JSON)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Hash: {provenance.snapshotHash.substring(0, 16)}…
          </span>
        </div>
        <pre className="bg-slate-900/80 p-4 rounded-lg overflow-x-auto text-[11px] text-slate-300 max-h-56 leading-relaxed border border-slate-800">
          {JSON.stringify(
            {
              arm: armDetail.arm,
              season: armDetail.season,
              gw: armDetail.gw,
              objectiveEP: armMeta.objectiveEP,
              realisedPoints: armMeta.realisedPoints,
              bankRemaining: armDetail.bankRemaining,
              formation: armDetail.formation,
              captain: captainSelection.player.webName,
              provenance: {
                modelVersion: provenance.modelVersion,
                frozenAt: provenance.frozenAt,
                snapshotHash: provenance.snapshotHash,
              },
            },
            null,
            2
          )}
        </pre>
      </section>
    </div>
  );
}
