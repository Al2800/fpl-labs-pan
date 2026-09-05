import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSimById, getAllSims, getGameweekDecision } from '@/lib/data';
import { ProvenanceCard } from '@/components/ProvenanceCard';
import { JsonLd } from '@/components/JsonLd';
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    season: string;
    n: string;
    scenario: string;
  }>;
}

export async function generateStaticParams() {
  const sims = getAllSims();
  return sims.map((sim) => ({
    season: sim.season,
    n: sim.gw.toString(),
    scenario: sim.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season, n, scenario } = await params;
  const gwNum = parseInt(n, 10);
  const sim = getSimById(season, gwNum, scenario);

  if (!sim) {
    return {
      title: 'Simulation Not Found',
    };
  }

  return {
    title: `${sim.title} | GW${gwNum} Historical Simulation (${season})`,
    description: `Labelled historical simulation replay: ${sim.hypothesis} Inputs frozen at ${sim.provenance.frozenAt}. SHA-256 verified.`,
  };
}

export default async function SimulationDetailPage({ params }: PageProps) {
  const { season, n, scenario } = await params;
  const gwNum = parseInt(n, 10);
  const sim = getSimById(season, gwNum, scenario);

  if (!sim) {
    notFound();
  }

  const relatedGw = getGameweekDecision(sim.gw);
  const controlArm = sim.arms.find((a) => a.isControl);

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
        name: 'Simulations',
        item: 'https://fpl-labs-pan.vercel.app/sims',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: sim.title,
        item: `https://fpl-labs-pan.vercel.app/sims/${season}/gw/${gwNum}/${scenario}`,
      },
    ],
  };

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${sim.title} - Historical Simulation Replay`,
    description: sim.hypothesis,
    identifier: sim.provenance.snapshotHash,
    version: sim.provenance.modelVersion,
    datePublished: sim.provenance.frozenAt,
    creator: {
      '@type': 'Organization',
      name: 'FPL Labs Pan',
      url: 'https://x.com/FPLabsPan',
    },
    temporalCoverage: '2026-08/2026-09',
  };

  return (
    <div className="space-y-8">
      <JsonLd data={[breadcrumbsJsonLd, datasetJsonLd]} />

      {/* Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/sims" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Simulations Index</span>
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-mono font-medium">GW{gwNum}</span>
          <span>/</span>
          <span className="text-slate-400 font-mono">{scenario}</span>
        </div>

        <div className="flex items-center gap-2">
          {relatedGw && (
            <Link
              href={`/decisions/gw/${sim.gw}`}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <span>View Official GW{sim.gw} Plan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Prominent Labelled Sim Badge Header */}
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 sm:p-5 text-amber-200 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-300 bg-amber-900/50 px-2.5 py-1 rounded border border-amber-600/40">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>LABELLED HISTORICAL SIMULATION (DEMO)</span>
          </div>
          <span className="text-xs font-mono text-amber-400/80">
            Modality: Point-in-time Counterfactual
          </span>
        </div>
        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          This counterfactual replay isolates a single strategic hypothesis against frozen pre-deadline conditions at {sim.provenance.frozenAt}. All underlying odds and minutes projections are held strictly constant to test what would have occurred under alternative policy constraints.
        </p>
      </div>

      {/* Title & Hypothesis */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
            {sim.scenario}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Gameweek {sim.gw} • Season {sim.season}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {sim.title}
        </h1>
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
          <span className="font-mono text-cyan-400 text-xs uppercase block font-semibold">
            Hypothesis Under Evaluation:
          </span>
          <p className="leading-relaxed">
            {sim.hypothesis}
          </p>
        </div>
      </div>

      {/* Inputs Provenance Card */}
      <ProvenanceCard
        provenance={sim.provenance}
        gw={sim.gw}
        season={sim.season}
      />

      {/* Comparative Arm Table */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Counterfactual Policy Arm Comparison</span>
              <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Control vs Treatment
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side performance breakdown: pre-match model expectation vs realized match points.
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
                <th className="py-3 px-4">Chip Active</th>
                <th className="py-3 px-4 text-right">Projected EP</th>
                <th className="py-3 px-4 text-right">Delta vs Control</th>
                <th className="py-3 px-4 text-right">Realised Pts</th>
                <th className="py-3 px-4 text-right">Realised Payoff</th>
                <th className="py-3 px-4 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {sim.arms.map((arm) => {
                const isControl = arm.isControl;
                const realisedDelta =
                  arm.realisedPoints !== null && controlArm?.realisedPoints !== null && controlArm?.realisedPoints !== undefined
                    ? arm.realisedPoints - controlArm.realisedPoints
                    : null;

                return (
                  <tr
                    key={arm.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isControl ? 'bg-slate-950/40' : 'bg-cyan-950/20'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span>{arm.name}</span>
                        {isControl ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            CONTROL
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/40">
                            TREATMENT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {arm.tacticalShiftNotes}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {arm.planSummary.formation}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-200">
                      <span className="font-semibold">{arm.planSummary.captain}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 uppercase">
                      {arm.planSummary.chip === 'none' ? (
                        <span className="text-slate-500">None</span>
                      ) : (
                        <span className="font-bold text-cyan-400">{arm.planSummary.chip}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-100 font-bold">
                      {arm.projectedEP.toFixed(1)} xP
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums">
                      {isControl ? (
                        <span className="text-slate-500">Baseline</span>
                      ) : arm.deltaVsControl >= 0 ? (
                        <span className="text-emerald-400 font-bold">+{arm.deltaVsControl.toFixed(1)} xP</span>
                      ) : (
                        <span className="text-rose-400 font-bold">{arm.deltaVsControl.toFixed(1)} xP</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums">
                      {arm.realisedPoints !== null ? (
                        <span className="font-bold text-slate-100">{arm.realisedPoints} pts</span>
                      ) : (
                        <span className="text-amber-400 text-[10px] font-sans">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums">
                      {isControl ? (
                        <span className="text-slate-500">—</span>
                      ) : realisedDelta !== null ? (
                        <span className={`font-bold ${realisedDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {realisedDelta >= 0 ? `+${realisedDelta}` : realisedDelta} pts
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[10px] font-sans">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-400">
                      {arm.varianceScore.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tactical Squads Side-by-Side Breakdown */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-100">
            Squad Composition & Structural Allocation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key roster differences and investment trade-offs between the two policy paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sim.arms.map((arm) => (
            <div
              key={arm.id}
              className={`p-4 rounded-lg border space-y-3 ${
                arm.isControl
                  ? 'bg-slate-950/70 border-slate-800'
                  : 'bg-cyan-950/20 border-cyan-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200">
                  {arm.name}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Bank: £{arm.planSummary.bank.toFixed(1)}m | Formation: {arm.planSummary.formation}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Key Assets Fielded:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {arm.planSummary.keyPlayers.map((player, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 italic">
                {arm.tacticalShiftNotes}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Findings & Strategic Takeaways */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-100">
          Simulation Findings & Counterfactual Analysis
        </h2>

        <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {sim.counterfactualFindings}
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Key Takeaways & Policy Lessons
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {sim.takeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80"
              >
                <span className="text-emerald-400 font-mono font-bold shrink-0">#{idx + 1}</span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cross Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
        <Link
          href={`/decisions/gw/${sim.gw}`}
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to GW{sim.gw} Decision Replay</span>
        </Link>
        <Link
          href="/sims"
          className="text-slate-400 hover:text-white flex items-center gap-1"
        >
          <span>Browse All Historical Sims</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
