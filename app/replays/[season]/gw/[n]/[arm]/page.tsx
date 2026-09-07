import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArmDetail, getAllGameweeks } from '@/lib/data';
import { ArmId } from '@/types/fpl';
import { JsonLd } from '@/components/JsonLd';
import { TrustStrip } from '@/components/TrustStrip';
import {
  ARM_IDS,
  ARM_LABELS,
  approachHeading,
  breadcrumbList,
  gameweekPath,
  jsonAlternate,
  replayPath,
  replaySnapshotPath,
  seasonLabel,
  verifyCopy,
} from '@/lib/present';

interface PageProps {
  params: Promise<{
    season: string;
    n: string;
    arm: string;
  }>;
}

export function generateStaticParams() {
  const params: Array<{ season: string; n: string; arm: string }> = [];
  for (const gw of getAllGameweeks()) {
    for (const arm of ARM_IDS) {
      params.push({ season: gw.season, n: gw.gw.toString(), arm });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season, n, arm } = await params;
  const gwNum = parseInt(n, 10);
  const armDetail = getArmDetail(season, gwNum, arm as ArmId);

  if (!armDetail) {
    return { title: 'Approach not found' };
  }

  const title = approachHeading(gwNum, season, arm as ArmId);
  const description = `${ARM_LABELS[arm as ArmId]} for FPL ${seasonLabel(season)} Gameweek ${gwNum}: ${armDetail.armMeta.description} Projected ${armDetail.armMeta.objectiveEP.toFixed(1)} points.`;

  return {
    title,
    description,
    alternates: jsonAlternate(
      replayPath(season, gwNum, arm),
      replaySnapshotPath(season, gwNum, arm)
    ),
    openGraph: { title, description },
  };
}

export default async function ArmDetailPage({ params }: PageProps) {
  const { season, n, arm } = await params;
  const gwNum = parseInt(n, 10);

  if (!ARM_IDS.includes(arm as ArmId)) {
    notFound();
  }

  const armDetail = getArmDetail(season, gwNum, arm as ArmId);
  if (!armDetail) {
    notFound();
  }

  const { armMeta, provenance, captainSelection, solverConstraints, sensitivityAnalysis } =
    armDetail;
  const snapshotHref = replaySnapshotPath(season, gwNum, arm);
  const heading = approachHeading(gwNum, season, arm as ArmId);
  const delta =
    armMeta.decisionDeltaVsBaseline === 0
      ? 'in line with the template'
      : `${armMeta.decisionDeltaVsBaseline > 0 ? '+' : ''}${armMeta.decisionDeltaVsBaseline.toFixed(1)} projected points versus the template`;
  const realised =
    armMeta.realisedPoints !== null
      ? ` It scored ${armMeta.realisedPoints} points.`
      : ' Results are pending.';
  const answer = `${ARM_LABELS[arm as ArmId]} for FPL ${seasonLabel(season)} Gameweek ${gwNum} projected ${armMeta.objectiveEP.toFixed(1)} points, ${delta}. Captain: ${armMeta.captain}. Formation: ${armDetail.formation}.${realised}`;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Decisions', path: '/decisions' },
          { name: `GW${gwNum}`, path: gameweekPath(gwNum) },
          { name: ARM_LABELS[arm as ArmId], path: replayPath(season, gwNum, arm) },
        ])}
      />

      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <Link href={gameweekPath(gwNum)} className="underline underline-offset-2">
          Back to Gameweek {gwNum}
        </Link>
        <p className="flex flex-wrap gap-3">
          {ARM_IDS.map((id) => (
            <Link
              key={id}
              href={replayPath(season, gwNum, id)}
              className={id === arm ? 'text-neutral-900 font-medium' : 'underline underline-offset-2'}
            >
              {ARM_LABELS[id]}
            </Link>
          ))}
        </p>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-neutral-800 leading-relaxed">{answer}</p>
        <p className="text-sm text-neutral-600">{armMeta.description}</p>
      </header>

      <TrustStrip provenance={provenance} snapshotHref={snapshotHref} />

      <dl className="grid grid-cols-2 sm:grid-cols-4 border border-neutral-200 bg-white">
        <div className="p-3 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Projected</dt>
          <dd className="mt-1 font-medium">{armMeta.objectiveEP.toFixed(1)} xP</dd>
        </div>
        <div className="p-3 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">vs Template</dt>
          <dd className="mt-1 font-medium">
            {armMeta.decisionDeltaVsBaseline === 0
              ? '—'
              : `${armMeta.decisionDeltaVsBaseline > 0 ? '+' : ''}${armMeta.decisionDeltaVsBaseline.toFixed(1)}`}
          </dd>
        </div>
        <div className="p-3 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Points</dt>
          <dd className="mt-1 font-medium">
            {armMeta.realisedPoints !== null ? armMeta.realisedPoints : 'Pending'}
          </dd>
        </div>
        <div className="p-3 border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Risk (spread of simulated points)</dt>
          <dd className="mt-1 font-medium">{armMeta.varianceScore.toFixed(1)}</dd>
        </div>
      </dl>

      <section className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Captain candidates</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Selected: {captainSelection.player.webName}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Candidate
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Fixture
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Mean xP
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  90th percentile
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Points
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {captainSelection.candidateComparison.map((cand) => {
                const selected = cand.player === captainSelection.player.webName;
                return (
                  <tr key={cand.player} className="border-t border-neutral-200">
                    <td className="py-3 px-3 font-medium">
                      {cand.player} ({cand.team})
                      {selected ? ' · selected' : ''}
                    </td>
                    <td className="py-3 px-3">{cand.opponent}</td>
                    <td className="py-3 px-3 text-right tabular-nums">{cand.xP.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {cand.ceiling90th.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {cand.realised !== null ? cand.realised : 'Pending'}
                    </td>
                    <td className="py-3 px-3 text-neutral-600">{cand.selectionReason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Constraints</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Binding means the limit was tight; slack means there was room left.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Constraint
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Expression
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Value
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Slack
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {solverConstraints.map((constraint) => (
                <tr key={constraint.name} className="border-t border-neutral-200">
                  <td className="py-3 px-3">{constraint.name}</td>
                  <td className="py-3 px-3 font-mono text-xs text-neutral-600">
                    {constraint.expression}
                  </td>
                  <td className="py-3 px-3">{constraint.value}</td>
                  <td className="py-3 px-3">{constraint.slack}</td>
                  <td className="py-3 px-3">{constraint.binding ? 'Binding' : 'Slack'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What would change the plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sensitivityAnalysis.map((scenario) => (
            <div key={scenario.scenario} className="border border-neutral-200 bg-white p-4 space-y-2">
              <h3 className="font-medium">{scenario.scenario}</h3>
              <p className="text-sm text-neutral-600">{scenario.condition}</p>
              <p className="text-sm">{scenario.optimalArmShift}</p>
              <p className="text-sm tabular-nums">
                {scenario.expectedPointsDelta >= 0 ? '+' : ''}
                {scenario.expectedPointsDelta.toFixed(2)} xP
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How to verify</h2>
        <p className="text-neutral-800 leading-relaxed">
          {verifyCopy(provenance.frozenAt, provenance.snapshotHash, heading)}
        </p>
        <p className="text-sm">
          <a href={snapshotHref} className="underline underline-offset-2">
            Download the JSON snapshot
          </a>
        </p>
      </section>
    </div>
  );
}
