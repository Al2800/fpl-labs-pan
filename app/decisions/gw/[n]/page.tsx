import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getAdjacentGameweeks,
  getAllGameweeks,
  getChipScenario,
  getGameweekDecision,
  getSimsForGameweek,
} from '@/lib/data';
import { ChipScenarioData } from '@/types/fpl';
import { ArmsComparisonTable } from '@/components/ArmsComparisonTable';
import { JsonLd } from '@/components/JsonLd';
import { SquadView } from '@/components/SquadView';
import { TrustStrip } from '@/components/TrustStrip';
import {
  CHIP_IDS,
  absoluteUrl,
  breadcrumbList,
  captainAnswer,
  chipCheckAnswer,
  chipOneLiner,
  chipPath,
  gameweekAnswer,
  gameweekHeading,
  gameweekPath,
  gameweekSnapshotPath,
  jsonAlternate,
  seasonLabel,
  simPath,
  statusLabel,
  verifyCopy,
} from '@/lib/present';

interface PageProps {
  params: Promise<{ n: string }>;
}

export function generateStaticParams() {
  return getAllGameweeks().map((gw) => ({ n: gw.gw.toString() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { n } = await params;
  const decision = getGameweekDecision(parseInt(n, 10));

  if (!decision) {
    return { title: 'Gameweek not found' };
  }

  const title = gameweekHeading(decision);
  const description = gameweekAnswer(decision);

  return {
    title,
    description,
    alternates: jsonAlternate(gameweekPath(decision.gw), gameweekSnapshotPath(decision.gw)),
    openGraph: {
      title,
      description,
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
  const { prev, next } = getAdjacentGameweeks(decision.gw);
  const sims = getSimsForGameweek(decision.gw);
  const chips = CHIP_IDS.map((chip) => getChipScenario(chip, decision.gw)).filter(
    (chip): chip is ChipScenarioData => chip !== null
  );
  const answer = gameweekAnswer(decision);
  const snapshotHref = gameweekSnapshotPath(decision.gw);

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: gameweekHeading(decision),
    description: answer,
    url: absoluteUrl(gameweekPath(decision.gw)),
    identifier: provenance.snapshotHash,
    version: provenance.modelVersion,
    datePublished: provenance.frozenAt,
    creator: {
      '@type': 'Organization',
      name: 'FPL Labs Pan',
      url: absoluteUrl('/'),
    },
    temporalCoverage: decision.deadline,
    variableMeasured: ['expected_points', 'realised_points', 'captain', 'formation'],
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: absoluteUrl(snapshotHref),
    },
  };

  const facts = [
    { label: 'Captain', value: `${validatedPlan.captain.webName} (${validatedPlan.captain.expectedPoints.toFixed(1)} xP)` },
    { label: 'Vice-captain', value: validatedPlan.viceCaptain.webName },
    { label: 'Formation', value: validatedPlan.formation },
    {
      label: 'Transfers',
      value:
        validatedPlan.transferActions.length === 0
          ? 'None'
          : validatedPlan.transferActions
              .map((action) => `${action.playerOut.webName} → ${action.playerIn.webName}`)
              .join(', '),
    },
    { label: 'Bank', value: `£${validatedPlan.bank.toFixed(1)}m` },
    { label: 'Hits', value: validatedPlan.hitCost === 0 ? 'None' : `${validatedPlan.hitCost} pts` },
    { label: 'Chip', value: validatedPlan.chipUsed === 'none' ? 'None' : validatedPlan.chipUsed.toUpperCase() },
    {
      label: 'Projected',
      value: `${validatedPlan.projectedSquadTotalXP.toFixed(1)} xP`,
    },
    {
      label: 'Points',
      value:
        validatedPlan.realisedSquadTotalPoints !== null
          ? `${validatedPlan.realisedSquadTotalPoints}`
          : 'Pending',
    },
    { label: 'Status', value: statusLabel(decision.status) },
  ];

  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          datasetJsonLd,
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Decisions', path: '/decisions' },
            { name: `Gameweek ${decision.gw}`, path: gameweekPath(decision.gw) },
          ]),
        ]}
      />

      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <p>
          <Link href="/decisions" className="underline underline-offset-2">
            Decisions
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-neutral-900">
            GW{decision.gw} ({seasonLabel(decision.season)})
          </span>
        </p>
        <p className="flex gap-3">
          {prev ? (
            <Link href={gameweekPath(prev.gw)} className="underline underline-offset-2">
              Previous: GW{prev.gw}
            </Link>
          ) : null}
          {next ? (
            <Link href={gameweekPath(next.gw)} className="underline underline-offset-2">
              Next: GW{next.gw}
            </Link>
          ) : null}
        </p>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {gameweekHeading(decision)}
        </h1>
        <p className="text-base leading-relaxed text-neutral-800">{answer}</p>
      </header>

      <TrustStrip
        provenance={provenance}
        snapshotHref={snapshotHref}
        status={decision.status}
      />

      <section>
        <h2 className="text-lg font-semibold mb-3">Key facts</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-neutral-200 bg-white">
          {facts.map((fact) => (
            <div key={fact.label} className="p-3 border-b border-r border-neutral-200">
              <dt className="text-sm text-neutral-500">{fact.label}</dt>
              <dd className="mt-1 font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SquadView plan={validatedPlan} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Why this plan</h2>
        <p className="text-neutral-800 leading-relaxed">{summaryAnalysis.executiveSummary}</p>

        {validatedPlan.transferActions.length > 0 ? (
          <div className="border border-neutral-200 bg-white p-4 space-y-2">
            <h3 className="font-medium">Transfers</h3>
            {validatedPlan.transferActions.map((action, index) => (
              <p key={index} className="text-sm text-neutral-700">
                {action.playerOut.webName} out (£{action.playerOut.sellPrice.toFixed(1)}m) →{' '}
                {action.playerIn.webName} in (£{action.playerIn.cost.toFixed(1)}m). {action.rationale}
              </p>
            ))}
          </div>
        ) : null}

        <ul className="space-y-2">
          {summaryAnalysis.keyTradeoffs.map((item, index) => (
            <li key={index} className="text-neutral-800 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>

        <div className="border border-neutral-200 bg-white p-4 space-y-2 text-sm">
          <h3 className="font-medium">What extra resources were worth</h3>
          <p>
            An extra £1.0m was worth +{summaryAnalysis.shadowPrices.budgetPerMillionXP.toFixed(2)}{' '}
            projected points.
          </p>
          <p>
            An extra free transfer was worth +
            {summaryAnalysis.shadowPrices.transferMarginalValueXP.toFixed(2)} projected points.
          </p>
          <p>
            Expected points from auto-subs:{' '}
            {summaryAnalysis.shadowPrices.benchPointsExpectancy.toFixed(2)}.
          </p>
        </div>

        <p className="text-sm text-neutral-600">{summaryAnalysis.divergenceNotes}</p>
      </section>

      <ArmsComparisonTable arms={arms} season={decision.season} gw={decision.gw} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip check</h2>
        <ul className="space-y-2">
          {chips.map((chip) => (
            <li key={chip.chip}>
              <Link href={chipPath(chip.chip, decision.gw)} className="underline underline-offset-2">
                {chip.chipName}
              </Link>
              {': '}
              {chipOneLiner(chip).replace(`${chip.chipName}: `, '')}
            </li>
          ))}
        </ul>
      </section>

      {sims.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">What-ifs for this gameweek</h2>
          <ul className="space-y-3">
            {sims.map((sim) => {
              const control = sim.arms.find((arm) => arm.isControl);
              const treatment = sim.arms.find((arm) => !arm.isControl);
              return (
                <li key={sim.id} className="border border-neutral-200 bg-white p-4 space-y-1">
                  <p className="font-medium">
                    <Link
                      href={simPath(sim.season, sim.gw, sim.slug)}
                      className="underline underline-offset-2"
                    >
                      {sim.title}
                    </Link>
                  </p>
                  <p className="text-sm text-neutral-700">{sim.hypothesis}</p>
                  {treatment && control ? (
                    <p className="text-sm text-neutral-600">
                      Control {control.projectedEP.toFixed(1)} xP · Alternative{' '}
                      {treatment.projectedEP.toFixed(1)} xP · Delta{' '}
                      {treatment.deltaVsControl >= 0 ? '+' : ''}
                      {treatment.deltaVsControl.toFixed(1)} xP
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How to verify</h2>
        <p className="text-neutral-800 leading-relaxed">
          {verifyCopy(
            provenance.frozenAt,
            provenance.snapshotHash,
            `This Gameweek ${decision.gw} plan`
          )}
        </p>
        <p className="text-sm">
          <a href={snapshotHref} className="underline underline-offset-2">
            Download the JSON snapshot
          </a>
          {' · '}
          <Link href="/methods" className="underline underline-offset-2">
            Methods
          </Link>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Who should I captain in Gameweek {decision.gw}?
        </h2>
        <p className="text-neutral-800 leading-relaxed">{captainAnswer(decision)}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Should I use a chip in Gameweek {decision.gw}?
        </h2>
        <p className="text-neutral-800 leading-relaxed">{chipCheckAnswer(decision, chips)}</p>
      </section>
    </div>
  );
}
