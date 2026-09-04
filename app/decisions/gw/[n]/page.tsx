import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getGameweekDecision, getAllGameweeks } from '@/lib/data';
import { ProvenanceCard } from '@/components/ProvenanceCard';
import { ArmsComparisonTable } from '@/components/ArmsComparisonTable';
import { PitchLineup } from '@/components/PitchLineup';
import { JsonLd } from '@/components/JsonLd';
import {
  ArrowLeft,
  ArrowRight,
  Repeat,
  CheckCircle2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ n: string }>;
}

export async function generateStaticParams() {
  const gws = getAllGameweeks();
  return gws.map((g) => ({
    n: g.gw.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { n } = await params;
  const gwNum = parseInt(n, 10);
  const decision = getGameweekDecision(gwNum);

  if (!decision) {
    return {
      title: 'Gameweek Decision Not Found',
    };
  }

  return {
    title: `GW${decision.gw} Decision Replay & Policy Arms | ${decision.season}`,
    description: `Pre-deadline frozen lineup and policy arms comparison for 2026/27 GW${decision.gw}. Captain: ${decision.validatedPlan.captain.webName}, Formation: ${decision.validatedPlan.formation}, Projected: ${decision.validatedPlan.projectedSquadTotalXP.toFixed(1)} xP. Verified SHA-256 snapshot.`,
    openGraph: {
      title: `GW${decision.gw} FPL Decision Replay & Policy Arms | FPL Labs Pan`,
      description: `Validated plan and parallel arms for GW${decision.gw} (${decision.season}). Frozen at ${decision.provenance.frozenAt}.`,
    },
  };
}

export default async function GameweekDecisionPage({ params }: PageProps) {
  const { n } = await params;
  const gwNum = parseInt(n, 10);
  const decision = getGameweekDecision(gwNum);

  if (!decision) {
    notFound();
  }

  const { provenance, validatedPlan, arms, summaryAnalysis } = decision;
  const isLive = decision.status === 'live';

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `FPL 2026/27 Gameweek ${decision.gw} Decision Replay & Policy Arms Snapshot`,
    description: `Pre-deadline locked mathematical programming policy arms for Fantasy Premier League 2026/27 Gameweek ${decision.gw}.`,
    identifier: provenance.snapshotHash,
    version: provenance.modelVersion,
    datePublished: provenance.frozenAt,
    creator: {
      '@type': 'Organization',
      name: 'FPL Labs Pan',
      url: 'https://x.com/FPLabsPan',
    },
    temporalCoverage: '2026-08/2026-09',
    variableMeasured: ['expected_points', 'realised_points', 'policy_delta', 'formation'],
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
        name: `Gameweek ${decision.gw}`,
        item: `https://fpl-labs-pan.vercel.app/decisions/gw/${decision.gw}`,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={[datasetJsonLd, breadcrumbsJsonLd]} />

      {/* Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/decisions" className="hover:text-emerald-400 transition-colors">
            Decisions
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-mono font-medium">GW{decision.gw}</span>
          <span className="text-slate-500">({decision.season})</span>
        </div>

        <div className="flex items-center gap-2">
          {decision.gw > 1 && (
            <Link
              href={`/decisions/gw/${decision.gw - 1}`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>GW{decision.gw - 1}</span>
            </Link>
          )}
          {decision.gw < 3 && (
            <Link
              href={`/decisions/gw/${decision.gw + 1}`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <span>GW{decision.gw + 1}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
            TEMPLATE D ARTEFACT
          </span>
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>LIVE ROUND (SETTLEMENT PENDING)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ROUND COMPLETED</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          GW{decision.gw} Decision Replay:{' '}
          <span className="text-slate-300 font-semibold">{decision.title}</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Full audit trail of the selected execution arm and parallel policy comparisons. Frozen at T-120min prior to the official deadline of {decision.deadline}.
        </p>
      </div>

      {/* Provenance Card */}
      <ProvenanceCard
        provenance={provenance}
        gw={decision.gw}
        season={decision.season}
      />

      {/* Validated Plan Summary Dashboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Validated Plan Summary</span>
            <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {validatedPlan.armName}
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Bank: £{validatedPlan.bank.toFixed(1)}m | Hits: -{validatedPlan.hitCost} pts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Formation */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Formation</div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {validatedPlan.formation}
            </div>
            <div className="text-[10px] text-slate-500">1 GKP, 3–5 DEF, 2–5 MID, 1–3 FWD</div>
          </div>

          {/* Captain */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 font-mono uppercase flex items-center gap-1">
              <span>Captain (2x)</span>
            </div>
            <div className="text-xl font-bold text-amber-400 truncate">
              {validatedPlan.captain.webName}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {validatedPlan.captain.expectedPoints.toFixed(1)} xP | VC: {validatedPlan.viceCaptain.webName}
            </div>
          </div>

          {/* Transfers Executed */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Transfers</div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {validatedPlan.transfersIn.length} FT
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {validatedPlan.transfersIn.length > 0
                ? `${validatedPlan.transfersIn[0].webName} in`
                : '0 transfers executed'}
            </div>
          </div>

          {/* Chip Status */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Chip Active</div>
            <div className="text-xl font-bold font-mono text-cyan-400 uppercase">
              {validatedPlan.chipUsed === 'none' ? 'None' : validatedPlan.chipUsed}
            </div>
            <div className="text-[10px] text-slate-500">
              <Link href={`/chips/tc/gw/${decision.gw}`} className="text-cyan-400 hover:underline">
                View chip solver →
              </Link>
            </div>
          </div>

          {/* Projected Total */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Projected Total</div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {validatedPlan.projectedSquadTotalXP.toFixed(1)}
              <span className="text-xs text-slate-400 font-normal ml-1">xP</span>
            </div>
            <div className="text-[10px] text-slate-500">Starting XI + C armband</div>
          </div>

          {/* Realised Total */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg space-y-1">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Realised Total</div>
            <div className="text-xl font-bold font-mono">
              {validatedPlan.realisedSquadTotalPoints !== null ? (
                <span className="text-emerald-400">{validatedPlan.realisedSquadTotalPoints} pts</span>
              ) : (
                <span className="text-amber-400 text-sm font-sans flex items-center gap-1 pt-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Pending</span>
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500">Official FPL points</div>
          </div>
        </div>

        {/* Transfer Action Details (if transfers occurred) */}
        {validatedPlan.transferActions.length > 0 && (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="font-mono text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-cyan-400" />
              <span>Executed Transfer Action Rationale</span>
            </div>
            {validatedPlan.transferActions.map((action, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-medium">OUT: {action.playerOut.webName} (£{action.playerOut.sellPrice.toFixed(1)}m)</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-emerald-400 font-medium">IN: {action.playerIn.webName} (£{action.playerIn.cost.toFixed(1)}m)</span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    Net: {action.netCostDelta >= 0 ? `+£${action.netCostDelta.toFixed(1)}m` : `-£${Math.abs(action.netCostDelta).toFixed(1)}m`}
                  </span>
                </div>
                <div className="text-slate-400 text-xs italic">
                  {action.rationale}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arms Comparison Matrix (Core Template D Requirement) */}
      <section className="space-y-3">
        <ArmsComparisonTable
          arms={arms}
          season={decision.season}
          gw={decision.gw}
        />
      </section>

      {/* Starting XI and Bench Tactical Pitch Layout */}
      <section className="space-y-3">
        <PitchLineup plan={validatedPlan} />
      </section>

      {/* Analytical Trade-offs & Shadow Prices */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Solver Trade-Off Analysis & Marginal Values</span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Convergence Report
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Objective value sensitivity, binding constraints, and shadow price evaluations.
          </p>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Executive Summary
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            {summaryAnalysis.executiveSummary}
          </p>
        </div>

        {/* Shadow Prices Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Marginal Value Shadow Prices
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400">Budget Shadow Price</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">
                +{summaryAnalysis.shadowPrices.budgetPerMillionXP.toFixed(2)} xP
              </div>
              <div className="text-[10px] text-slate-500">Expected points per additional £1.0m bank</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400">Transfer Marginal Value</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">
                +{summaryAnalysis.shadowPrices.transferMarginalValueXP.toFixed(2)} xP
              </div>
              <div className="text-[10px] text-slate-500">Value of rolling an extra Free Transfer into GW+1</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <div className="text-slate-400">Bench Expectancy</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">
                {summaryAnalysis.shadowPrices.benchPointsExpectancy.toFixed(2)} xP
              </div>
              <div className="text-[10px] text-slate-500">Effective points gained per auto-sub activation</div>
            </div>
          </div>
        </div>

        {/* Key Trade-offs List */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Resolved Mathematical Trade-Offs
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {summaryAnalysis.keyTradeoffs.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                <span className="text-emerald-400 font-mono font-bold shrink-0">#{idx + 1}</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divergence Notes */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-xs space-y-1">
          <span className="font-mono text-slate-400 text-[11px] uppercase">
            Policy Divergence & Out-of-Sample Performance
          </span>
          <p className="text-slate-300 leading-relaxed">
            {summaryAnalysis.divergenceNotes}
          </p>
        </div>
      </section>

      {/* Internal Cross-Linking: Chip Scenarios & Methods */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-slate-200 text-sm">
            Explore Chip Horizons for Gameweek {decision.gw}
          </div>
          <p className="text-slate-400">
            Review solver opportunity cost calculations for Triple Captain, Bench Boost, Free Hit, and Wildcard.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/chips/tc/gw/${decision.gw}`}
            className="px-3 py-2 rounded-md bg-cyan-950 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900 transition-colors font-mono"
          >
            TC Solver →
          </Link>
          <Link
            href="/methods"
            className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors font-medium"
          >
            Methods Spec →
          </Link>
        </div>
      </section>
    </div>
  );
}
