import Link from 'next/link';
import { ChipScenarioData, GameweekDecision, HistoricalSim } from '@/types/fpl';
import { ArmsComparisonTable } from '@/components/ArmsComparisonTable';
import { JsonLd } from '@/components/JsonLd';
import { SquadView } from '@/components/SquadView';
import { TrustStrip } from '@/components/TrustStrip';
import {
  CHIP_HUBS,
  absoluteUrl,
  breadcrumbList,
  captainAnswer,
  chipCheckAnswer,
  chipHubPath,
  chipOneLiner,
  datasetKindOf,
  formatProjected,
  gameweekAnswer,
  gameweekHeading,
  seasonLabel,
  simPath,
  statusLabel,
  verifyCopy,
} from '@/lib/present';

interface GameweekDecisionViewProps {
  decision: GameweekDecision;
  snapshotHref: string;
  indexHref: string;
  indexLabel: string;
  prevHref: string | null;
  nextHref: string | null;
  prevGw: number | null;
  nextGw: number | null;
  chips: ChipScenarioData[];
  sims: HistoricalSim[];
}

export function GameweekDecisionView({
  decision,
  snapshotHref,
  indexHref,
  indexLabel,
  prevHref,
  nextHref,
  prevGw,
  nextGw,
  chips,
  sims,
}: GameweekDecisionViewProps) {
  const { provenance, validatedPlan, arms, summaryAnalysis } = decision;
  const kind = datasetKindOf(decision);
  const answer = gameweekAnswer(decision);
  const heading = gameweekHeading(decision);
  const pagePath = snapshotHref.replace(/\/snapshot\.json$/, '');
  const shadow = summaryAnalysis.shadowPrices;
  const hasShadow =
    shadow.budgetPerMillionXP !== 0 ||
    shadow.transferMarginalValueXP !== 0 ||
    shadow.benchPointsExpectancy !== 0;

  const facts = [
    {
      label: 'Captain',
      value:
        kind === 'historical-replay' && validatedPlan.captain.expectedPoints === 0
          ? validatedPlan.captain.webName
          : `${validatedPlan.captain.webName} (${validatedPlan.captain.expectedPoints.toFixed(1)} xP)`,
    },
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
      value: formatProjected(validatedPlan.projectedSquadTotalXP, kind),
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

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: heading,
    description: answer,
    url: absoluteUrl(pagePath),
    identifier: provenance.snapshotHash,
    version: provenance.modelVersion,
    datePublished: provenance.frozenAt,
    creator: {
      '@type': 'Organization',
      name: 'FPL Replay',
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

  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          datasetJsonLd,
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: indexLabel, path: indexHref },
            { name: `Gameweek ${decision.gw}`, path: pagePath },
          ]),
        ]}
      />

      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <p>
          <Link href={indexHref} className="underline underline-offset-2">
            {indexLabel}
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-neutral-900">
            GW{decision.gw} ({seasonLabel(decision.season)})
          </span>
        </p>
        <p className="flex gap-3">
          {prevHref && prevGw !== null ? (
            <Link href={prevHref} className="underline underline-offset-2">
              Previous: GW{prevGw}
            </Link>
          ) : null}
          {nextHref && nextGw !== null ? (
            <Link href={nextHref} className="underline underline-offset-2">
              Next: GW{nextGw}
            </Link>
          ) : null}
        </p>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-base leading-relaxed text-neutral-800">{answer}</p>
      </header>

      <TrustStrip
        provenance={provenance}
        snapshotHref={snapshotHref}
        status={decision.status}
        kind={kind}
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

        {hasShadow ? (
          <div className="border border-neutral-200 bg-white p-4 space-y-2 text-sm">
            <h3 className="font-medium">What extra resources were worth</h3>
            <p>
              An extra £1.0m was worth +{shadow.budgetPerMillionXP.toFixed(2)} projected points.
            </p>
            <p>
              An extra free transfer was worth +{shadow.transferMarginalValueXP.toFixed(2)}{' '}
              projected points.
            </p>
            <p>Expected points from auto-subs: {shadow.benchPointsExpectancy.toFixed(2)}.</p>
          </div>
        ) : null}

        <p className="text-sm text-neutral-600">{summaryAnalysis.divergenceNotes}</p>
      </section>

      {provenance.limitations && provenance.limitations.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Limitations of this snapshot</h2>
          <ul className="list-disc pl-5 space-y-1 text-neutral-800">
            {provenance.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <ArmsComparisonTable arms={arms} season={decision.season} gw={decision.gw} kind={kind} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip check</h2>
        <p className="text-neutral-800 leading-relaxed">{chipCheckAnswer(decision, chips)}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {CHIP_HUBS.map((hub) => (
            <li key={hub.id}>
              <Link href={chipHubPath(hub.slug)} className="underline underline-offset-2">
                {hub.name}
              </Link>
            </li>
          ))}
        </ul>
        {kind !== 'historical-replay' && chips.length > 0 ? (
          <ul className="space-y-2">
            {chips.map((chip) => (
              <li key={chip.chip}>
                {chip.chipName}: {chipOneLiner(chip).replace(`${chip.chipName}: `, '')}
              </li>
            ))}
          </ul>
        ) : null}
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
            `This Gameweek ${decision.gw} plan`,
            kind
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
          {' · '}
          <Link href="/guides/how-freeze-and-hash-work" className="underline underline-offset-2">
            Freeze and hash
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Is Gameweek {decision.gw} a live freeze or a replay?
        </h2>
        <p className="text-neutral-800 leading-relaxed">
          {kind === 'historical-replay'
            ? 'A reconstructive replay. Inputs were rebuilt after the season. The cutoff is first kickoff minus 90 minutes.'
            : kind === 'illustrative-sample'
              ? 'An illustrative sample of the live page format, not a live two-hour freeze.'
              : 'A live two-hour freeze. The snapshot is not edited after the deadline.'}
        </p>
      </section>
    </div>
  );
}
