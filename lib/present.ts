import { getSiteUrl, absoluteUrl } from '@/lib/site';
import {
  ArmId,
  ChipScenarioData,
  ChipType,
  DatasetKind,
  GameweekDecision,
  HistoricalSim,
  PolicyArmSummary,
  ValidatedPlan,
} from '@/types/fpl';

export function seasonLabel(season: string): string {
  return season.replace('-', '/');
}

export function datasetKindOf(decision: GameweekDecision): DatasetKind {
  return (
    decision.datasetKind ||
    decision.provenance.datasetKind ||
    (decision.provenance.isDemoSample ? 'illustrative-sample' : 'live-freeze')
  );
}

export function formatUtc(iso: string): string {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date(iso));
  return `${formatted} UTC`;
}

export function shortHash(hash: string): string {
  const value = hash.replace(/^sha256:/i, '');
  if (value.length <= 12) {
    return hash.startsWith('sha256:') ? hash : `sha256:${hash}`;
  }
  return `sha256:${value.slice(0, 8)}…${value.slice(-4)}`;
}

export const ARM_LABELS: Record<ArmId, string> = {
  baseline: 'Template',
  optimiser: 'Optimiser',
  agent: 'High-ceiling',
};

export function armLabel(arm: PolicyArmSummary, kind?: DatasetKind): string {
  if (kind === 'historical-replay') {
    return arm.shortLabel || ARM_LABELS[arm.id];
  }
  return ARM_LABELS[arm.id] ?? arm.shortLabel;
}

export const CHIP_HUBS: Array<{
  id: Exclude<ChipType, 'none'>;
  slug: string;
  name: string;
}> = [
  { id: 'tc', slug: 'triple-captain', name: 'Triple Captain' },
  { id: 'bb', slug: 'bench-boost', name: 'Bench Boost' },
  { id: 'fh', slug: 'free-hit', name: 'Free Hit' },
  { id: 'wc', slug: 'wildcard', name: 'Wildcard' },
];

export function chipHubBySlug(slug: string) {
  return CHIP_HUBS.find((hub) => hub.slug === slug || hub.id === slug) ?? null;
}

export function chipHubPath(chip: string): string {
  const hub = CHIP_HUBS.find((item) => item.id === chip || item.slug === chip);
  return `/chips/${hub?.slug ?? chip}`;
}

export const CHIP_LABELS: Record<Exclude<ChipType, 'none'>, string> = {
  tc: 'Triple Captain',
  bb: 'Bench Boost',
  fh: 'Free Hit',
  wc: 'Wildcard',
};

export const CHIP_IDS: Array<Exclude<ChipType, 'none'>> = ['tc', 'bb', 'fh', 'wc'];
export const ARM_IDS: ArmId[] = ['baseline', 'optimiser', 'agent'];

export function chipLabel(chip: ChipType): string {
  if (chip === 'none') return 'None';
  return CHIP_LABELS[chip];
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'live':
      return 'Live';
    case 'completed':
      return 'Settled';
    case 'upcoming':
      return 'Upcoming';
    default:
      return status;
  }
}

export function chipVerdict(status: ChipScenarioData['status']): string {
  switch (status) {
    case 'recommended':
      return 'Play this week';
    case 'preserve':
      return 'Hold';
    case 'suboptimal':
      return 'Do not play this week';
    case 'viable':
      return 'Optional this week';
    default:
      return status;
  }
}

function transferPhrase(plan: ValidatedPlan): string {
  const actions = plan.transferActions;
  if (actions.length === 0) return 'no transfers';

  const pairs = actions
    .map((action) => `${action.playerOut.webName} out, ${action.playerIn.webName} in`)
    .join('; ');
  const hit = plan.hitCost > 0 ? ` taking a ${plan.hitCost}-point hit` : '';
  const n = actions.length;
  const free = plan.hitCost === 0;
  const count =
    n === 1
      ? free
        ? 'one free transfer'
        : 'one transfer'
      : free
        ? `${n} free transfers`
        : `${n} transfers`;

  return `${count}${hit} (${pairs})`;
}

export function gameweekHeading(decision: GameweekDecision): string {
  return `FPL Gameweek ${decision.gw} (${seasonLabel(decision.season)}): Team, Captain and Transfers`;
}

export function formatProjected(value: number, kind: DatasetKind): string {
  if (kind === 'historical-replay' && value === 0) return 'Unavailable';
  return `${value.toFixed(1)} xP`;
}

export function gameweekAnswer(decision: GameweekDecision): string {
  const { validatedPlan: plan, provenance } = decision;
  const kind = datasetKindOf(decision);
  const chipBit =
    plan.chipUsed === 'none' ? '' : ` It played ${chipLabel(plan.chipUsed)}.`;
  const realised =
    plan.realisedSquadTotalPoints !== null
      ? ` It scored ${plan.realisedSquadTotalPoints} net points after hits.`
      : ' Results are pending.';
  const projected =
    kind === 'historical-replay' && plan.projectedSquadTotalXP === 0
      ? ' No locked expected-points objective was available for this week.'
      : ` Projected squad total was ${plan.projectedSquadTotalXP.toFixed(1)}.`;

  if (kind === 'historical-replay') {
    return `For FPL ${seasonLabel(decision.season)} Gameweek ${decision.gw} (reconstructed cutoff ${formatUtc(decision.deadline)}), the optimiser picked ${plan.captain.webName} as captain and ${plan.viceCaptain.webName} as vice, a ${plan.formation}, and ${transferPhrase(plan)}.${projected}${chipBit}${realised} This is a reconstructive replay: the cutoff is first kickoff minus 90 minutes, not a live two-hour freeze.`;
  }

  const freezeBit =
    kind === 'illustrative-sample'
      ? ` The plan is an illustrative sample frozen at ${formatUtc(provenance.frozenAt)} in the live-product format.`
      : ` The plan was frozen at ${formatUtc(provenance.frozenAt)}, two hours before the deadline, and has not been edited since.`;

  return `For FPL ${seasonLabel(decision.season)} Gameweek ${decision.gw} (deadline ${formatUtc(decision.deadline)}), the FPL Labs Pan optimiser picked ${plan.captain.webName} as captain and ${plan.viceCaptain.webName} as vice, a ${plan.formation}, and ${transferPhrase(plan)}, projecting ${plan.projectedSquadTotalXP.toFixed(1)} points.${chipBit}${freezeBit}${realised}`;
}

export function captainAnswer(decision: GameweekDecision): string {
  const plan = decision.validatedPlan;
  const kind = datasetKindOf(decision);
  const agent = decision.arms.find((arm) => arm.id === 'agent');
  const otherLabel = kind === 'historical-replay' ? 'evidence-informed' : 'high-ceiling';
  const agentBit =
    agent && agent.captain !== plan.captain.webName
      ? ` The ${otherLabel} approach instead captains ${agent.captain}.`
      : kind === 'historical-replay'
        ? ' Same-state evidence matched this captain.'
        : '';
  const xp =
    kind === 'historical-replay' && plan.captain.expectedPoints === 0
      ? `against ${plan.captain.opponent}`
      : `(${plan.captain.expectedPoints.toFixed(1)} projected points) against ${plan.captain.opponent}`;

  return `The selected plan captains ${plan.captain.webName} ${xp}. Vice-captain is ${plan.viceCaptain.webName}.${agentBit}`;
}

export function chipOneLiner(chip: ChipScenarioData): string {
  const windows = chip.windowAnalysis
    .filter((row) => row.isRecommendedWindow)
    .map((row) => `GW${row.gw}`);
  const windowBit = windows.length
    ? ` Best projected window: ${windows.join(' and ')}.`
    : '';
  return `${chip.chipName}: ${chipVerdict(chip.status)}.${windowBit}`;
}

export function chipCheckAnswer(
  decision: GameweekDecision,
  chips: ChipScenarioData[]
): string {
  const kind = datasetKindOf(decision);
  if (kind === 'historical-replay') {
    return 'No chip was played. The 2025/26 reconstructive path left Wildcard, Free Hit, Triple Captain and Bench Boost unused, including in Gameweek 34 when both the optimiser and the template took an 8-point hit in a blank.';
  }
  const planChip =
    decision.validatedPlan.chipUsed === 'none'
      ? 'No chip is in the selected plan this week.'
      : `The selected plan plays ${chipLabel(decision.validatedPlan.chipUsed)}.`;
  return `${planChip} ${chips.map((chip) => chipOneLiner(chip)).join(' ')}`;
}

export function approachHeading(gw: number, season: string, arm: ArmId): string {
  return `${ARM_LABELS[arm]} approach, FPL Gameweek ${gw} (${seasonLabel(season)})`;
}

export function simAnswer(sim: HistoricalSim): string {
  const control = sim.arms.find((arm) => arm.isControl);
  const treatment = sim.arms.find((arm) => !arm.isControl);
  if (!control || !treatment) return sim.hypothesis;

  const realised =
    control.realisedPoints !== null && treatment.realisedPoints !== null
      ? ` After the matches, the control scored ${control.realisedPoints} points and the alternative scored ${treatment.realisedPoints}.`
      : ' Match points are still pending.';
  const sign = treatment.deltaVsControl >= 0 ? '+' : '';

  return `What-if for FPL ${seasonLabel(sim.season)} Gameweek ${sim.gw}: ${sim.hypothesis} Before kick-off the alternative was ${sign}${treatment.deltaVsControl.toFixed(1)} projected points versus the control (${control.projectedEP.toFixed(1)} vs ${treatment.projectedEP.toFixed(1)}).${realised}`;
}

export function verifyCopy(
  frozenAt: string,
  hash: string,
  entity: string,
  kind?: DatasetKind
): string {
  if (kind === 'historical-replay') {
    return `${entity} is a reconstructive snapshot hashed with SHA-256 (${hash}), with cutoff ${formatUtc(frozenAt)} (first kickoff minus 90 minutes). Download the JSON to inspect the rebuilt inputs. This is not a live two-hour freeze.`;
  }
  return `${entity} was written to a JSON snapshot at ${formatUtc(frozenAt)} and hashed with SHA-256 (${hash}). Download the snapshot to inspect the frozen inputs. The freeze rule is described in Methods.`;
}

export function jsonAlternate(htmlPath: string, snapshotPath: string) {
  return {
    canonical: absoluteUrl(htmlPath),
    types: {
      'application/json': absoluteUrl(snapshotPath),
    },
  };
}

export function gameweekPath(season: string, gw: number): string {
  if (season === '2026-27') {
    return `/decisions/gw/${gw}`;
  }
  return `/seasons/${season}/gw/${gw}`;
}

export function gameweekSnapshotPath(season: string, gw: number): string {
  return `${gameweekPath(season, gw)}/snapshot.json`;
}

export function seasonPath(season: string): string {
  return `/seasons/${season}`;
}

export function seasonSnapshotPath(season: string): string {
  return `/seasons/${season}/snapshot.json`;
}

export function chipPath(chip: string, gw: number): string {
  return `/chips/${chip}/gw/${gw}`;
}

export function chipSnapshotPath(chip: string, gw: number): string {
  return `/chips/${chip}/gw/${gw}/snapshot.json`;
}

export function replayPath(season: string, gw: number, arm: string): string {
  return `/replays/${season}/gw/${gw}/${arm}`;
}

export function replaySnapshotPath(season: string, gw: number, arm: string): string {
  return `/replays/${season}/gw/${gw}/${arm}/snapshot.json`;
}

export function simPath(season: string, gw: number, slug: string): string {
  return `/sims/${season}/gw/${gw}/${slug}`;
}

export function simSnapshotPath(season: string, gw: number, slug: string): string {
  return `/sims/${season}/gw/${gw}/${slug}/snapshot.json`;
}

export function breadcrumbList(
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export { getSiteUrl, absoluteUrl };
