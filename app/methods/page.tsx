import { Metadata } from 'next';
import Link from 'next/link';
import { getCalibrationMetrics } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import {
  ShieldCheck,
  Calculator,
  Clock,
  Hash,
  ArrowRight,
  CheckCircle2,
  Table,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Methodology, Formulations & Calibration | FPL Labs Pan',
  description:
    'Mathematical programming formulation, exponential horizon decay, freeze protocol, and position-by-position RMSE/MAE calibration metrics for FPL Labs Pan.',
};

export default function MethodsPage() {
  const metrics = getCalibrationMetrics();

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
        name: 'Methods',
        item: 'https://fpl-labs-pan.vercel.app/methods',
      },
    ],
  };

  return (
    <div className="space-y-10">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Specification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Methodology, Solver Formulation & Calibration
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Open technical documentation describing the Mixed-Integer Linear Programming (MILP) model, pre-deadline freeze protocol, cryptographic verification, and out-of-sample error calibration.
        </p>
      </div>

      {/* Mathematical Formulation */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">
            1. Mathematical Program Formulation
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The core optimiser solves a rolling-horizon mixed-integer linear optimization problem over an <em>H</em>-week planning window (default <em>H</em> = 5). The objective maximizes the discounted sum of starting XI expected points less transfer hit penalties:
        </p>

        {/* Math Block */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto space-y-2">
          <div className="text-emerald-400 font-semibold">
            maximize:
          </div>
          <div className="pl-4 text-emerald-300">
            {`Σ_{t=1..H} γ^(t-1) * [ Σ_{i ∈ XI_t} ( E[P_{i,t}] * (1 + 1_{i = captain_t}) ) - 4.0 * max(0, Transfers_t - FreeTransfers_t) ]`}
          </div>
          <div className="text-cyan-400 font-semibold pt-2">
            subject to:
          </div>
          <div className="pl-4 space-y-1 text-slate-400 text-xs">
            <div>1. Total Roster Cardinality: {`Σ_{i=1..N} x_{i,t} = 15  ∀ t ∈ {1..H}`}</div>
            <div>2. Budget Feasibility: {`Σ_{i=1..N} cost_{i,t} * x_{i,t} + bank_t ≤ Budget_t`}</div>
            <div>3. Club Limit: {`Σ_{i ∈ Club_k} x_{i,t} ≤ 3  ∀ k ∈ Clubs`}</div>
            <div>4. Formation Bounds: {`1 GKP, 3 ≤ DEF ≤ 5, 2 ≤ MID ≤ 5, 1 ≤ FWD ≤ 3`}</div>
            <div>5. Captaincy Selection: {`Σ_{i ∈ XI_t} c_{i,t} = 1,  c_{i,t} ≤ starting_{i,t}`}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
            <span className="font-mono text-cyan-400 font-semibold block">Discount Factor γ = 0.85</span>
            <span className="text-slate-400 text-[11px]">Penalizes fixture horizon uncertainty exponentially into future weeks.</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
            <span className="font-mono text-emerald-400 font-semibold block">Transfer Hit Penalty = 4.0 pts</span>
            <span className="text-slate-400 text-[11px]">Rigid point deduction enforced on transfers beyond accumulated Free Transfers.</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
            <span className="font-mono text-violet-400 font-semibold block">Solver Engine: HiGHS MILP</span>
            <span className="text-slate-400 text-[11px]">High-performance dual simplex and branch-and-bound solver (v1.7.2).</span>
          </div>
        </div>
      </section>

      {/* Freeze Protocol */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">
            2. The Pre-Deadline Freeze Protocol
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The primary failure of conventional fantasy content is retroactive rationalisation and hindsight distortion. FPL Labs Pan enforces an immutable cryptographic freeze protocol:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>T-120min Execution</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Exactly two hours prior to the official Premier League deadline, the data ingestion pipeline locks all player odds, projected minutes, and injury statuses.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span>SHA-256 Digesting</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              A canonical JSON snapshot containing all solver inputs, parameters, and generated plans is passed through SHA-256 and committed to the public ledger.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Retroactive Edits</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Once frozen, model weights and expected points are never revised, ensuring transparent tracking of genuine pre-match decision intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Position Calibration & Error Metrics (Core MVP Requirement) */}
      <section id="calibration" className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-0">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">
              3. Position-by-Position Calibration & Error Metrics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical out-of-sample evaluation across 5,520 player-round observations. Realised vs projected performance calibration by position.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/90 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4 text-right">Sample (N)</th>
                <th className="py-3 px-4 text-right">Mean Projected</th>
                <th className="py-3 px-4 text-right">Mean Realised</th>
                <th className="py-3 px-4 text-right">MAE</th>
                <th className="py-3 px-4 text-right">RMSE</th>
                <th className="py-3 px-4 text-right">R² Correlation</th>
                <th className="py-3 px-4 text-right">Model Bias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {metrics.map((row) => {
                const isAll = row.position === 'ALL';
                return (
                  <tr
                    key={row.position}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isAll ? 'bg-slate-950/80 font-bold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans text-slate-100 font-semibold">
                      {isAll ? 'Overall (All Positions)' : row.position}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">
                      {row.sampleCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-200 tabular-nums">
                      {row.meanProjectedXP.toFixed(2)} xP
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-200 tabular-nums">
                      {row.meanRealisedPoints.toFixed(2)} pts
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-amber-300">
                      {row.mae.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-rose-300">
                      {row.rmse.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-emerald-400">
                      {row.rSquared.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-400">
                      {row.bias > 0 ? `+${row.bias.toFixed(2)}` : row.bias.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 space-y-1">
          <p>
            <strong>Note on Evaluation Metrics:</strong> MAE (Mean Absolute Error) measures average magnitude of single-game deviations. RMSE (Root Mean Squared Error) penalizes large variance outliers (e.g. unexpected hat-tricks or red cards). Model bias of -0.02 overall indicates neutral calibration without systematic over-prediction.
          </p>
        </div>
      </section>

      {/* Internal Cross Links */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
        <Link
          href="/decisions"
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Browse Validated Decisions Archive</span>
        </Link>
        <Link
          href="/about"
          className="text-slate-400 hover:text-white flex items-center gap-1"
        >
          <span>About FPL Labs Pan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
