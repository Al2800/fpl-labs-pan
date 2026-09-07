import { getSiteUrl, absoluteUrl } from '@/lib/site';
import {
  ArmId,
  ChipScenarioData,
  ChipType,
  GameweekDecision,
  HistoricalSim,
  ValidatedPlan,
} from '@/types/fpl';

export function seasonLabel(season: string): string {
  return season.replace('-', '/');
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

export function gameweekAnswer(decision: GameweekDecision): string {
  const { validatedPlan: plan, provenance } = decision;
  const chipBit =
    plan.chipUsed === 'none' ? '' : ` It played ${chipLabel(plan.chipUsed)}.`;
  const realised =
    plan.realisedSquadTotalPoints !== null
      ? ` It scored ${plan.realisedSquadTotalPoints} points.`
      : ' Results are pending.';

  return `For FPL ${seasonLabel(decision.season)} Gameweek ${decision.gw} (deadline ${formatUtc(decision.deadline)}), the FPL Labs Pan optimiser picked ${plan.captain.webName} as captain and ${plan.viceCaptain.webName} as vice, a ${plan.formation}, and ${transferPhrase(plan)}, projecting ${plan.projectedSquadTotalXP.toFixed(1)} points.${chipBit} The plan was frozen at ${formatUtc(provenance.frozenAt)}, two hours before the deadline, and has not been edited since.${realised}`;
}

export function captainAnswer(decision: GameweekDecision): string {
  const plan = decision.validatedPlan;
  const agent = decision.arms.find((arm) => arm.id === 'agent');
  const agentBit = agent
    ? ` The high-ceiling approach instead captains ${agent.captain}.`
    : '';

  return `The selected plan captains ${plan.captain.webName} (${plan.captain.expectedPoints.toFixed(1)} projected points) against ${plan.captain.opponent}. Vice-captain is ${plan.viceCaptain.webName}.${agentBit}`;
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

export function verifyCopy(frozenAt: string, hash: string, entity: string): string {
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

export function gameweekPath(gw: number): string {
  return `/decisions/gw/${gw}`;
}

export function gameweekSnapshotPath(gw: number): string {
  return `/decisions/gw/${gw}/snapshot.json`;
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
