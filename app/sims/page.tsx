import Link from 'next/link';
import { Metadata } from 'next';
import { getAllSims } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Cpu,
  Scale,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Labelled Historical Simulations & Counterfactuals | FPL Labs Pan',
  description:
    'Labelled historical counterfactual simulations: Haaland anchor vs quad-midfield, chip timing, and heuristic vs MILP formulation replays. Grounded in point-in-time frozen inputs.',
};

export default function SimsIndexPage() {
  const sims = getAllSims();

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'structural-tradeoff':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
            <Scale className="w-3 h-3" />
            <span>Structural Tradeoff</span>
          </span>
        );
      case 'chip-counterfactual':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
            <Cpu className="w-3 h-3" />
            <span>Chip Timing</span>
          </span>
        );
      case 'policy-comparison':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 font-mono text-[11px]">
            <Zap className="w-3 h-3" />
            <span>Policy Comparison</span>
          </span>
        );
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
        name: 'Simulations',
        item: 'https://fpl-labs-pan.vercel.app/sims',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <FlaskConical className="w-4 h-4" />
            <span>Counterfactual Laboratory</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold">
            LABELLED HISTORICAL SIMULATION (DEMO)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Labelled Historical Simulations & Counterfactual Replays
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          First-class historical simulation replays grounded in verified point-in-time data. Rather than inventing pure synthetic seasons, we hold pre-deadline odds and priors fixed at T-120min while varying strategic decision variables to test counterfactual hypotheses.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-sans">Active Sim Packs</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {sims.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Point-in-time grounded</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-sans">Simulation Modality</div>
          <div className="text-lg font-bold text-cyan-400 mt-1">
            Counterfactual
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Not synthetic / ungrounded</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-sans">Peak Model Delta</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            +10.5 xP
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Triple Captain vs Baseline</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-sans">Digest Anchor</div>
          <div className="text-2xl font-bold text-slate-100 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>SHA-256</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pre-deadline auditability</div>
        </div>
      </div>

      {/* Sims Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">
            Catalog of Controlled Counterfactuals
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {sims.length} scenarios available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {sims.map((sim) => {
            const controlArm = sim.arms.find((a) => a.isControl);
            const treatmentArm = sim.arms.find((a) => !a.isControl);
            const modelDelta = treatmentArm ? treatmentArm.deltaVsControl : 0;
            const realisedDelta =
              treatmentArm && controlArm && treatmentArm.realisedPoints !== null && controlArm.realisedPoints !== null
                ? treatmentArm.realisedPoints - controlArm.realisedPoints
                : null;

            return (
              <div
                key={sim.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-colors shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      GW{sim.gw} ({sim.season})
                    </span>
                    {getCategoryBadge(sim.category)}
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Hash: {sim.provenance.snapshotHash.substring(0, 16)}…
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-100 hover:text-emerald-400 transition-colors">
                    <Link href={`/sims/${sim.season}/gw/${sim.gw}/${sim.slug}`}>
                      {sim.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Hypothesis:</strong> {sim.hypothesis}
                  </p>
                </div>

                {/* Comparative Arms Summary Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Control Arm</span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {controlArm?.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {controlArm?.projectedEP.toFixed(1)} xP | {controlArm?.realisedPoints !== null ? `${controlArm?.realisedPoints} pts` : 'Pending'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Counterfactual Arm</span>
                    <span className="font-semibold text-cyan-300 truncate block">
                      {treatmentArm?.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {treatmentArm?.projectedEP.toFixed(1)} xP | {treatmentArm?.realisedPoints !== null ? `${treatmentArm?.realisedPoints} pts` : 'Pending'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Model Delta</span>
                    <span className={`text-base font-bold ${modelDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {modelDelta >= 0 ? `+${modelDelta.toFixed(1)}` : modelDelta.toFixed(1)} xP
                    </span>
                    <span className="text-[10px] text-slate-500 block font-sans">Pre-kickoff expectation</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Realised Payoff</span>
                    {realisedDelta !== null ? (
                      <span className={`text-base font-bold ${realisedDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {realisedDelta >= 0 ? `+${realisedDelta}` : realisedDelta} pts
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs font-sans block pt-1">Settlement Pending</span>
                    )}
                    <span className="text-[10px] text-slate-500 block font-sans">Official match return</span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Related Decision: <Link href={`/decisions/gw/${sim.gw}`} className="text-emerald-400 hover:underline">GW{sim.gw} Template D Page →</Link>
                  </div>
                  <Link
                    href={`/sims/${sim.season}/gw/${sim.gw}/${sim.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors"
                  >
                    <span>View Counterfactual Replay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
