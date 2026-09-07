import { Metadata } from 'next';
import Link from 'next/link';
import { getCalibrationMetrics } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/present';

export const metadata: Metadata = {
  title: 'Methods and calibration',
  description:
    'How FPL Labs Pan builds a gameweek plan: mixed-integer solver, two-hour freeze, SHA-256 snapshots, and position-by-position error metrics.',
};

export default function MethodsPage() {
  const metrics = getCalibrationMetrics();

  return (
    <div className="space-y-10">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Methods', path: '/methods' },
        ])}
      />

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Methods and calibration
        </h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          The optimiser maximises discounted expected points over a five-week window, subject to
          FPL squad rules. Inputs freeze two hours before the deadline. Error is reported by
          position.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Solver</h2>
        <p className="text-neutral-800 leading-relaxed">
          The core optimiser is a rolling-horizon mixed-integer linear programme over an H-week
          window (default H = 5). The objective maximises the discounted sum of starting XI expected
          points less transfer-hit penalties:
        </p>
        <pre className="border border-neutral-200 bg-white p-4 text-xs sm:text-sm overflow-x-auto font-mono text-neutral-800">
{`maximise
  Σ_{t=1..H} γ^(t-1) * [ Σ_{i ∈ XI_t} ( E[P_{i,t}] * (1 + 1_{i = captain_t}) ) - 4.0 * max(0, Transfers_t - FreeTransfers_t) ]

subject to
  1. Roster size: Σ x_{i,t} = 15
  2. Budget: Σ cost_{i,t} * x_{i,t} + bank_t ≤ Budget_t
  3. Club limit: Σ_{i ∈ Club_k} x_{i,t} ≤ 3
  4. Formation: 1 GKP, 3–5 DEF, 2–5 MID, 1–3 FWD
  5. One captain, who must start`}
        </pre>
        <dl className="grid grid-cols-1 sm:grid-cols-3 border border-neutral-200 bg-white text-sm">
          <div className="p-4 border-r border-b border-neutral-200">
            <dt className="font-medium">Discount γ = 0.85</dt>
            <dd className="text-neutral-600 mt-1">
              Later weeks count for less because fixtures and minutes are less certain.
            </dd>
          </div>
          <div className="p-4 border-r border-b border-neutral-200">
            <dt className="font-medium">Hit penalty = 4.0 pts</dt>
            <dd className="text-neutral-600 mt-1">
              Official FPL deduction for transfers beyond free transfers.
            </dd>
          </div>
          <div className="p-4 border-b border-neutral-200">
            <dt className="font-medium">Solver: HiGHS MILP v1.7.2</dt>
            <dd className="text-neutral-600 mt-1">Branch-and-bound mixed-integer solver.</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. Freeze protocol</h2>
        <p className="text-neutral-800 leading-relaxed">
          Conventional FPL write-ups are easy to edit after results. This lab does not:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-neutral-800">
          <li>
            Two hours before the official deadline, player odds, projected minutes and injury flags
            lock.
          </li>
          <li>
            A JSON snapshot of inputs, parameters and the generated plan is hashed with SHA-256 and
            published on the gameweek page.
          </li>
          <li>After the freeze, projections are not revised. Pending fixtures stay pending.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. What-ifs</h2>
        <p className="text-neutral-800 leading-relaxed">
          What-ifs are not invented seasons. They change one decision while holding the same frozen
          inputs, then score both paths against official match points.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-neutral-800">
          <li>Freeze exogenous inputs at T-120 minutes.</li>
          <li>Run a control path and an alternative path.</li>
          <li>Settle both against official FPL scores.</li>
        </ol>
      </section>

      <section id="calibration" className="space-y-3">
        <h2 className="text-lg font-semibold">4. Position-by-position error</h2>
        <p className="text-neutral-700 text-sm">
          Out-of-sample evaluation across 5,520 player-round observations.
        </p>
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Position
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  N
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Mean projected
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Mean realised
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  MAE
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  RMSE
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  R²
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Bias
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((row) => {
                const isAll = row.position === 'ALL';
                return (
                  <tr
                    key={row.position}
                    className={`border-t border-neutral-200 ${isAll ? 'font-medium bg-neutral-50' : ''}`}
                  >
                    <td className="py-2 px-3">{isAll ? 'All positions' : row.position}</td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {row.sampleCount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {row.meanProjectedXP.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {row.meanRealisedPoints.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">{row.mae.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{row.rmse.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{row.rSquared.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {row.bias > 0 ? `+${row.bias.toFixed(2)}` : row.bias.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-neutral-600">
          MAE is average miss per player-round. RMSE penalises large outliers. Overall bias of
          −0.02 means the model is close to neutral, not systematically high or low.
        </p>
      </section>

      <p className="text-sm">
        <Link href="/decisions" className="underline underline-offset-2">
          Gameweek decisions
        </Link>
        {' · '}
        <Link href="/about" className="underline underline-offset-2">
          About
        </Link>
      </p>
    </div>
  );
}
