import Link from 'next/link';
import { getAllGameweeks, getLatestGameweekDecision } from '@/lib/data';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { ProvenanceCard } from '@/components/ProvenanceCard';
import { ArmsComparisonTable } from '@/components/ArmsComparisonTable';

export default function HomePage() {
  const latestGw = getLatestGameweekDecision();
  const allGws = getAllGameweeks();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-8 pb-4 border-b border-slate-800/80">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Entity × Time Data Product</span>
            <span className="text-slate-500">|</span>
            <span>Pre-Deadline Freeze Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100">
            FPL Decision Lab{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Neutral, lab-native decision replay and policy-arm verification. We do not publish subjective tip blogs or commodity point hubs. Every decision is frozen before the official deadline with immutable SHA-256 fingerprints.
          </p>

          {/* Primary Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/decisions/gw/${latestGw.gw}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-sm shadow-emerald-500/20"
            >
              <span>Explore Latest GW{latestGw.gw} Decision</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/decisions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Gameweek Index</span>
            </Link>
            <Link
              href="/methods"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Methods & Calibration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Differentiation Matrix: Lab vs Tip Blogs vs Commodity xP */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Product Thesis & Comparative Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            How FPL Labs Pan differs from creator-led tip blogs and single-point projection tables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* FPL Labs Pan */}
          <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-lg p-4 space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-300">
                FPL Labs Pan (This Product)
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ACTIVE
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Policy-Arm Evaluation:</strong> Parallel comparison of Heuristic, MILP solver, and Agent arms.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Cryptographic Freeze:</strong> T-120min SHA-256 hashes eliminate retroactive bias.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Chip Horizon Solvers:</strong> Full 38-GW deployment timing vs immediate burn opportunity cost.</span>
              </li>
            </ul>
          </div>

          {/* Commodity xP Hubs */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-300">
                Commodity xP Hubs
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                Incumbents
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500">•</span>
                <span>Optimized around massive tabular player xP lookup screens (e.g. FPL Review).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500">•</span>
                <span>Focuses primarily on tool computation rather than programmatic entity-time archival.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500">•</span>
                <span>Users must manually configure constraints each run without archived audit trails.</span>
              </li>
            </ul>
          </div>

          {/* Narrative Tip Blogs */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-300">
                Tip Blogs & Personal Diaries
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                Legacy Media
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>First-person narrative bias (&quot;I feel like Haaland is due&quot;).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Selective memory and post-hoc rationalisation of bad calls.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>No verifiable timestamps or reproducible integer programming formulation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Primary Lab Artefact: Latest Gameweek Decision */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                Latest Active Cycle
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                Gameweek {latestGw.gw} Decision Replay (Template D)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {latestGw.title} — Frozen at {latestGw.provenance.frozenAt}
            </p>
          </div>
          <Link
            href={`/decisions/gw/${latestGw.gw}`}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Full Template D Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Provenance Card */}
        <ProvenanceCard
          provenance={latestGw.provenance}
          gw={latestGw.gw}
          season={latestGw.season}
        />

        {/* Policy Arms Table */}
        <ArmsComparisonTable
          arms={latestGw.arms}
          season={latestGw.season}
          gw={latestGw.gw}
        />
      </section>

      {/* Lab-Native Artefacts Grid: Template D & Template C */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Lab-Native Artefact Hubs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Dedicated programmatic entity routes designed for reproducible research and auditability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template D: Decision Replays */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Template D: Decision Replay Pages
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">Primary MVP Artefact</span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">{allGws.length} Rounds Cataloged</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every round captures validated starting XIs, substitute priorities, free transfer allocations, bank shadow prices, and arms comparison across heuristic, MILP, and agent policies.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {allGws.map((g) => (
                <Link
                  key={g.gw}
                  href={`/decisions/gw/${g.gw}`}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
                >
                  GW{g.gw} {g.status === 'live' ? '• Live' : `(${g.validatedPlan.realisedSquadTotalPoints} pts)`}
                </Link>
              ))}
              <Link
                href="/decisions"
                className="text-xs text-emerald-400 hover:underline px-2 py-1 font-medium"
              >
                Browse all →
              </Link>
            </div>
          </div>

          {/* Template C: Chip Horizon Solvers */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Template C: Chip Scenario Solvers
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400">Horizon Opportunity Cost</span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">4 Chips Tracked</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Solvers calculate whether deploying Triple Captain, Bench Boost, Free Hit, or Wildcard today maximizes season-long net equity compared to waiting for Double/Blank Gameweek windows.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                href="/chips/tc/gw/3"
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
              >
                TC (Triple Captain)
              </Link>
              <Link
                href="/chips/bb/gw/3"
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
              >
                BB (Bench Boost)
              </Link>
              <Link
                href="/chips/fh/gw/3"
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
              >
                FH (Free Hit)
              </Link>
              <Link
                href="/chips/wc/gw/3"
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
              >
                WC (Wildcard)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Methods & Calibration Teaser */}
      <section className="bg-gradient-to-r from-slate-900/80 to-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Mathematical Rigor & Verification</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">
            Open Methodology, Integer Formulations & Error Metrics
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Review the objective functions, position-by-position RMSE and MAE calibration metrics, shadow price formulations, and SHA-256 validation scripts powering FPL Labs Pan.
          </p>
        </div>
        <Link
          href="/methods"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs sm:text-sm transition-colors shrink-0"
        >
          <span>Inspect Methodology</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
