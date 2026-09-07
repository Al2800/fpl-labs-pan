import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getChipScenario, getAllGameweeks, getGameweekDecision } from '@/lib/data';
import { ChipType } from '@/types/fpl';
import { JsonLd } from '@/components/JsonLd';
import { TrustStrip } from '@/components/TrustStrip';
import {
  CHIP_IDS,
  CHIP_LABELS,
  breadcrumbList,
  chipOneLiner,
  chipPath,
  chipSnapshotPath,
  chipVerdict,
  gameweekPath,
  jsonAlternate,
  seasonLabel,
  verifyCopy,
} from '@/lib/present';

interface PageProps {
  params: Promise<{
    chip: string;
    n: string;
  }>;
}

export function generateStaticParams() {
  const params: Array<{ chip: string; n: string }> = [];
  for (const chip of CHIP_IDS) {
    for (const gw of getAllGameweeks()) {
      params.push({ chip, n: gw.gw.toString() });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chip, n } = await params;
  const gwNum = parseInt(n, 10);

  if (!CHIP_IDS.includes(chip as Exclude<ChipType, 'none'>)) {
    return { title: 'Chip not found' };
  }

  const chipData = getChipScenario(chip as ChipType, gwNum);
  if (!chipData) {
    return { title: 'Chip not found' };
  }

  const title = `${chipData.chipName} in FPL Gameweek ${gwNum} (${seasonLabel(chipData.season)})`;
  const description = chipOneLiner(chipData) + ' ' + chipData.summary;

  return {
    title,
    description,
    alternates: jsonAlternate(chipPath(chip, gwNum), chipSnapshotPath(chip, gwNum)),
    openGraph: { title, description },
  };
}

export default async function ChipScenarioPage({ params }: PageProps) {
  const { chip, n } = await params;
  const gwNum = parseInt(n, 10);

  if (!CHIP_IDS.includes(chip as Exclude<ChipType, 'none'>)) {
    notFound();
  }

  const chipData = getChipScenario(chip as ChipType, gwNum);
  const gwDecision = getGameweekDecision(gwNum);

  if (!chipData) {
    notFound();
  }

  const snapshotHref = chipSnapshotPath(chip, gwNum);
  const heading = `${chipData.chipName} in FPL Gameweek ${gwNum} (${seasonLabel(chipData.season)})`;
  const answer = `${chipOneLiner(chipData)} Playing it this week is worth +${chipData.projectedGainXP.toFixed(1)} projected points immediately, against a historical +${chipData.historicalAverageGain.toFixed(1)} in better windows.`;
  const opportunity = chipData.projectedGainXP - chipData.historicalAverageGain;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: `Gameweek ${gwNum}`, path: gameweekPath(gwNum) },
          { name: chipData.chipName, path: chipPath(chip, gwNum) },
        ])}
      />

      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <Link href={gameweekPath(gwNum)} className="underline underline-offset-2">
          Back to Gameweek {gwNum}
        </Link>
        <p className="flex flex-wrap gap-3">
          {CHIP_IDS.map((id) => (
            <Link
              key={id}
              href={chipPath(id, gwNum)}
              className={id === chip ? 'text-neutral-900 font-medium' : 'underline underline-offset-2'}
            >
              {CHIP_LABELS[id]}
            </Link>
          ))}
        </p>
      </nav>

      <header className="space-y-3">
        <p className="text-sm text-neutral-500">{chipVerdict(chipData.status)}</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-neutral-800 leading-relaxed">{answer}</p>
      </header>

      {gwDecision ? (
        <TrustStrip
          provenance={gwDecision.provenance}
          snapshotHref={snapshotHref}
          status={gwDecision.status}
        />
      ) : null}

      <dl className="grid grid-cols-1 sm:grid-cols-3 border border-neutral-200 bg-white">
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">If played this week</dt>
          <dd className="mt-1 font-medium">+{chipData.projectedGainXP.toFixed(1)} xP</dd>
        </div>
        <div className="p-4 border-r border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Typical good window</dt>
          <dd className="mt-1 font-medium">+{chipData.historicalAverageGain.toFixed(1)} xP</dd>
        </div>
        <div className="p-4 border-b border-neutral-200">
          <dt className="text-sm text-neutral-500">Cost of playing now</dt>
          <dd className="mt-1 font-medium">
            {opportunity >= 0 ? '+' : ''}
            {opportunity.toFixed(1)} xP
          </dd>
        </div>
      </dl>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Should I play {chipData.chipName} this week?</h2>
        <p className="text-neutral-800 leading-relaxed">{chipData.summary}</p>
        <p className="text-neutral-600 text-sm">{chipData.opportunityCostAssessment}</p>
      </section>

      <section className="border border-neutral-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">When to play it</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Projected value if {chipData.chipName} is used in each window.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Gameweek
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Context
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Double GW
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Chip EV
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  Net
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Call
                </th>
              </tr>
            </thead>
            <tbody>
              {chipData.windowAnalysis.map((row) => {
                const isCurrent = row.gw === gwNum;
                return (
                  <tr key={row.gw} className="border-t border-neutral-200">
                    <td className="py-3 px-3 font-medium">
                      GW{row.gw}
                      {isCurrent ? ' · this week' : ''}
                    </td>
                    <td className="py-3 px-3">{row.opponentContext}</td>
                    <td className="py-3 px-3">{row.dgwStatus ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {row.projectedChipEV.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      +{row.netDelta.toFixed(1)}
                    </td>
                    <td className="py-3 px-3">
                      {row.isRecommendedWindow
                        ? 'Best window'
                        : isCurrent
                          ? 'Hold'
                          : 'Weaker'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Players the solver prefers under {chipData.chipName}</h2>
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Player
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Club
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Pos
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Fixture
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  £m
                </th>
                <th scope="col" className="py-2 px-3 font-medium text-right">
                  xP
                </th>
              </tr>
            </thead>
            <tbody>
              {chipData.optimalRosterSample.map((player) => (
                <tr key={player.id} className="border-t border-neutral-200">
                  <td className="py-2 px-3 font-medium">{player.webName}</td>
                  <td className="py-2 px-3">{player.team}</td>
                  <td className="py-2 px-3">{player.position}</td>
                  <td className="py-2 px-3">{player.opponent}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{player.cost.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right tabular-nums">
                    {player.expectedPoints.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How to verify</h2>
        <p className="text-neutral-800 leading-relaxed">
          {verifyCopy(
            chipData.solverSettings.frozenAt,
            chipData.solverSettings.snapshotHash,
            heading
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
    </div>
  );
}
