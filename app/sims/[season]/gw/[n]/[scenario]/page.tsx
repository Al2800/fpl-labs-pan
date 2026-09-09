import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSimById, getAllSims, getGameweekDecision } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { TrustStrip } from '@/components/TrustStrip';
import {
  absoluteUrl,
  breadcrumbList,
  gameweekPath,
  jsonAlternate,
  seasonLabel,
  simAnswer,
  simPath,
  simSnapshotPath,
  verifyCopy,
} from '@/lib/present';

interface PageProps {
  params: Promise<{
    season: string;
    n: string;
    scenario: string;
  }>;
}

export function generateStaticParams() {
  return getAllSims().map((sim) => ({
    season: sim.season,
    n: sim.gw.toString(),
    scenario: sim.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season, n, scenario } = await params;
  const sim = getSimById(season, parseInt(n, 10), scenario);

  if (!sim) {
    return { title: 'What-if not found' };
  }

  const title = `${sim.title} | FPL Gameweek ${sim.gw} what-if`;
  const description = simAnswer(sim);

  return {
    title,
    description,
    alternates: jsonAlternate(
      simPath(season, sim.gw, scenario),
      simSnapshotPath(season, sim.gw, scenario)
    ),
    openGraph: { title, description },
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
  const controlArm = sim.arms.find((arm) => arm.isControl);
  const snapshotHref = simSnapshotPath(season, gwNum, scenario);
  const answer = simAnswer(sim);

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: sim.title,
    description: sim.hypothesis,
    url: absoluteUrl(simPath(season, gwNum, scenario)),
    identifier: sim.provenance.snapshotHash,
    version: sim.provenance.modelVersion,
    datePublished: sim.provenance.frozenAt,
    creator: {
      '@type': 'Organization',
      name: 'FPL Replay',
      url: absoluteUrl('/'),
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: absoluteUrl(snapshotHref),
    },
  };

  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          datasetJsonLd,
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'What-ifs', path: '/sims' },
            { name: sim.title, path: simPath(season, gwNum, scenario) },
          ]),
        ]}
      />

      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <Link href="/sims" className="underline underline-offset-2">
          All what-ifs
        </Link>
        {relatedGw ? (
          <Link href={gameweekPath(sim.season, sim.gw)} className="underline underline-offset-2">
            Gameweek {sim.gw} decision
          </Link>
        ) : null}
      </nav>

      <header className="space-y-3">
        <p className="text-sm text-neutral-500">
          Gameweek {sim.gw} · {seasonLabel(sim.season)}
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{sim.title}</h1>
        <p className="text-neutral-800 leading-relaxed">{answer}</p>
      </header>

      <TrustStrip provenance={sim.provenance} snapshotHref={snapshotHref} kind="illustrative-sample" />

      <section className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Control vs alternative</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Path
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Formation
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Captain
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Chip
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Projected
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  vs control
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Points
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Payoff
                </th>
              </tr>
            </thead>
            <tbody>
              {sim.arms.map((arm) => {
                const realisedDelta =
                  arm.realisedPoints !== null &&
                  controlArm?.realisedPoints !== null &&
                  controlArm?.realisedPoints !== undefined
                    ? arm.realisedPoints - controlArm.realisedPoints
                    : null;
                return (
                  <tr key={arm.id} className="border-t border-neutral-200">
                    <td className="py-3 px-3">
                      <div className="font-medium">
                        {arm.name} {arm.isControl ? '(control)' : '(alternative)'}
                      </div>
                      <div className="text-neutral-600">{arm.tacticalShiftNotes}</div>
                    </td>
                    <td className="py-3 px-3">{arm.planSummary.formation}</td>
                    <td className="py-3 px-3">{arm.planSummary.captain}</td>
                    <td className="py-3 px-3">
                      {arm.planSummary.chip === 'none' ? 'None' : arm.planSummary.chip.toUpperCase()}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {arm.projectedEP.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {arm.isControl
                        ? '—'
                        : `${arm.deltaVsControl >= 0 ? '+' : ''}${arm.deltaVsControl.toFixed(1)}`}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {arm.realisedPoints !== null ? arm.realisedPoints : 'Pending'}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {arm.isControl
                        ? '—'
                        : realisedDelta !== null
                          ? `${realisedDelta >= 0 ? '+' : ''}${realisedDelta}`
                          : 'Pending'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Squad differences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sim.arms.map((arm) => (
            <div key={arm.id} className="border border-neutral-200 bg-white p-4 space-y-2">
              <h3 className="font-medium">
                {arm.name} {arm.isControl ? '(control)' : '(alternative)'}
              </h3>
              <p className="text-sm text-neutral-600">
                Bank £{arm.planSummary.bank.toFixed(1)}m · {arm.planSummary.formation}
              </p>
              <p className="text-sm">{arm.planSummary.keyPlayers.join(', ')}</p>
              <p className="text-sm text-neutral-600">{arm.tacticalShiftNotes}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What happened</h2>
        <p className="text-neutral-800 leading-relaxed">{sim.counterfactualFindings}</p>
        <ul className="list-disc pl-5 space-y-2 text-neutral-800">
          {sim.takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How to verify</h2>
        <p className="text-neutral-800 leading-relaxed">
          {verifyCopy(sim.provenance.frozenAt, sim.provenance.snapshotHash, sim.title)}
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
