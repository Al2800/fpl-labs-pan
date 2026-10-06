import { getSeasonGameweeks } from '@/lib/data';
import type { GameweekDecision } from '@/types/fpl';

const BLANK_OPPONENTS = new Set(['', '-', 'n/a', '\u2014', '\u2013']);

export const REPLAY_SEASON_ID = '2025-26';
export const REPLAY_DOWNLOAD_PATH = '/seasons/2025-26/download';
export const REPLAY_CSV_PATH = '/seasons/2025-26/download/replay.csv';
export const REPLAY_JSON_PATH = '/seasons/2025-26/download/replay.json';

export const REPLAY_DATASET_NAME = 'FPL Replay 2025/26 reconstructive replay';
export const REPLAY_CITATION =
  'FPL Replay (2026). 2025/26 reconstructive replay dataset. https://www.fplreplay.com/seasons/2025-26/download. Licensed under CC BY 4.0.';

export interface ReplayWeekRecord {
  gw: number;
  captain: string;
  captainPoints: number | null;
  captainExpectedPoints: number;
  viceCaptain: string;
  formation: string;
  optimiserPoints: number | null;
  templatePoints: number | null;
  evidencePoints: number | null;
  projectedXP: number;
  transfers: number;
  freeTransfersAvailable: number;
  hitCost: number;
  benchPoints: number;
  playersWithoutFixture: number;
  chip: string;
}

export interface NamedSquadPlayer {
  webName: string;
  where: 'starting XI' | 'bench';
}

export interface BlankWeekRecord {
  gw: number;
  squadSize: number;
  withoutFixture: NamedSquadPlayer[];
  freeTransfersAvailable: number;
  transfers: number;
  hitCost: number;
  optimiserPoints: number | null;
  templatePoints: number | null;
}

export interface CaptainCount {
  name: string;
  gameweeks: number;
}

export interface CaptainHaul {
  gw: number;
  captain: string;
  points: number;
}

export interface BenchWeek {
  gw: number;
  points: number;
}

export interface ReplayDigest {
  weeks: ReplayWeekRecord[];
  captains: CaptainCount[];
  hauls: CaptainHaul[];
  benchByWeek: BenchWeek[];
  benchTotal: number;
  blanks: BlankWeekRecord[];
  transferCount: number;
  chipsPlayed: number;
}

export const REPLAY_FIELDS: Array<{ field: keyof ReplayWeekRecord; meaning: string }> = [
  { field: 'gw', meaning: 'Gameweek number, from 1 to 38.' },
  { field: 'captain', meaning: 'Captain on the optimiser plan, as the web name stored in the file.' },
  {
    field: 'captainPoints',
    meaning: 'That captain’s official points before the captain multiplier. The replay doubled this score. It is not a Triple Captain result.',
  },
  {
    field: 'captainExpectedPoints',
    meaning: 'Locked forecast xP for the captain. Gameweek 1 is 0 because no locked objective was stored.',
  },
  { field: 'viceCaptain', meaning: 'Vice-captain web name.' },
  { field: 'formation', meaning: 'Starting formation, such as 3-5-2.' },
  { field: 'optimiserPoints', meaning: 'Optimiser net points after any hit.' },
  { field: 'templatePoints', meaning: 'Template arm net points. The template rolls transfers.' },
  {
    field: 'evidencePoints',
    meaning: 'Same-state evidence arm net points. In this season it matches the optimiser every week.',
  },
  {
    field: 'projectedXP',
    meaning: 'Squad expected points on the optimiser plan. 0 means the locked objective was not stored.',
  },
  { field: 'transfers', meaning: 'Number of players transferred in.' },
  {
    field: 'freeTransfersAvailable',
    meaning: 'Free transfers available before those transfers were made.',
  },
  { field: 'hitCost', meaning: 'Points deducted for transfers beyond the free ones. 0 means no hit.' },
  {
    field: 'benchPoints',
    meaning:
      'Sum of the four listed bench scores. A Bench Boost would have added this many points by arithmetic. The replay did not play Bench Boost.',
  },
  {
    field: 'playersWithoutFixture',
    meaning:
      'How many of the 15 squad players have a blank opponent in the file. The opponent field stores one fixture only, so this is not a double-gameweek marker.',
  },
  {
    field: 'chip',
    meaning: 'Chip on the plan. Every row is none. No chip was played.',
  },
];

function isBlankOpponent(opponent: string | null | undefined): boolean {
  if (!opponent) return true;
  return BLANK_OPPONENTS.has(opponent.trim());
}

function armPoints(gw: GameweekDecision, id: 'baseline' | 'agent'): number | null {
  return gw.arms.find((arm) => arm.id === id)?.realisedPoints ?? null;
}

export function listReplayWeeks(): ReplayWeekRecord[] {
  return getSeasonGameweeks(REPLAY_SEASON_ID).map((gw) => {
    const plan = gw.validatedPlan;
    const squad = [...plan.startingXI, ...plan.bench];
    const benchPoints = plan.bench.reduce((sum, player) => sum + (player.realisedPoints ?? 0), 0);
    return {
      gw: gw.gw,
      captain: plan.captain.webName,
      captainPoints: plan.captain.realisedPoints,
      captainExpectedPoints: plan.captain.expectedPoints,
      viceCaptain: plan.viceCaptain.webName,
      formation: plan.formation,
      optimiserPoints: plan.realisedSquadTotalPoints,
      templatePoints: armPoints(gw, 'baseline'),
      evidencePoints: armPoints(gw, 'agent'),
      projectedXP: plan.projectedSquadTotalXP,
      transfers: plan.transfersIn.length,
      freeTransfersAvailable: plan.freeTransfersAvailable,
      hitCost: plan.hitCost,
      benchPoints,
      playersWithoutFixture: squad.filter((player) => isBlankOpponent(player.opponent)).length,
      chip: plan.chipUsed,
    };
  });
}

export function getReplayDigest(): ReplayDigest {
  const gameweeks = getSeasonGameweeks(REPLAY_SEASON_ID);
  const weeks = listReplayWeeks();
  const counts = new Map<string, number>();
  const hauls: CaptainHaul[] = [];

  for (const gw of gameweeks) {
    const captain = gw.validatedPlan.captain;
    counts.set(captain.webName, (counts.get(captain.webName) ?? 0) + 1);
    if (captain.realisedPoints !== null) {
      hauls.push({ gw: gw.gw, captain: captain.webName, points: captain.realisedPoints });
    }
  }

  hauls.sort((a, b) => b.points - a.points || a.gw - b.gw);

  const blanks: BlankWeekRecord[] = gameweeks.flatMap((gw) => {
    const plan = gw.validatedPlan;
    const squad = [...plan.startingXI, ...plan.bench];
    const xiIds = new Set(plan.startingXI.map((player) => player.id));
    const withoutFixture = squad
      .filter((player) => isBlankOpponent(player.opponent))
      .map((player) => ({
        webName: player.webName,
        where: (xiIds.has(player.id) ? 'starting XI' : 'bench') as NamedSquadPlayer['where'],
      }));
    if (withoutFixture.length === 0) return [];
    return [
      {
        gw: gw.gw,
        squadSize: squad.length,
        withoutFixture,
        freeTransfersAvailable: plan.freeTransfersAvailable,
        transfers: plan.transfersIn.length,
        hitCost: plan.hitCost,
        optimiserPoints: plan.realisedSquadTotalPoints,
        templatePoints: armPoints(gw, 'baseline'),
      },
    ];
  });

  const benchByWeek = weeks.map((week) => ({ gw: week.gw, points: week.benchPoints }));
  const benchTotal = benchByWeek.reduce((sum, week) => sum + week.points, 0);
  const transferCount = weeks.reduce((sum, week) => sum + week.transfers, 0);
  const chipsPlayed = weeks.filter((week) => week.chip !== 'none').length;

  const digest: ReplayDigest = {
    weeks,
    captains: [...counts.entries()]
      .map(([name, gameweeksPlayed]) => ({ name, gameweeks: gameweeksPlayed }))
      .sort((a, b) => b.gameweeks - a.gameweeks || a.name.localeCompare(b.name)),
    hauls,
    benchByWeek,
    benchTotal,
    blanks,
    transferCount,
    chipsPlayed,
  };
  assertCitedReplayFacts(digest);
  return digest;
}

function assertCitedReplayFacts(digest: ReplayDigest): void {
  const gw34 = digest.blanks.find((week) => week.gw === 34);
  const gw31 = digest.blanks.find((week) => week.gw === 31);
  const names = (week: BlankWeekRecord | undefined) =>
    week?.withoutFixture.map((player) => `${player.webName}/${player.where}`).join('|');
  const problems: string[] = [];
  if (digest.chipsPlayed !== 0) problems.push('chips were played');
  if (digest.transferCount !== 39) problems.push(`transfers ${digest.transferCount}`);
  if (digest.benchTotal !== 323) problems.push(`bench ${digest.benchTotal}`);
  if (digest.weeks.length !== 38) problems.push(`weeks ${digest.weeks.length}`);
  if (digest.captains[0]?.name !== 'Haaland' || digest.captains[0]?.gameweeks !== 17) {
    problems.push('captain counts');
  }
  if (digest.hauls[0]?.captain !== 'Haaland' || digest.hauls[0]?.points !== 16 || digest.hauls[0]?.gw !== 17) {
    problems.push('best haul');
  }
  if (!gw34 || gw34.withoutFixture.length !== 7 || gw34.hitCost !== 8 || gw34.optimiserPoints !== 28 || gw34.templatePoints !== 33) {
    problems.push('gw34 totals');
  }
  if (names(gw34) !== 'Groß/starting XI|João Pedro/starting XI|Marc Guiu/starting XI|Dúbravka/bench|Guéhi/bench|Rodon/bench|Semenyo/bench') {
    problems.push(`gw34 names ${names(gw34)}`);
  }
  if (!gw31 || gw31.withoutFixture.length !== 3 || gw31.hitCost !== 0 || gw31.freeTransfersAvailable !== 5 || gw31.optimiserPoints !== 63 || gw31.templatePoints !== 68) {
    problems.push('gw31 totals');
  }
  if (names(gw31) !== 'Guéhi/starting XI|Gabriel/bench|J.Timber/bench') {
    problems.push(`gw31 names ${names(gw31)}`);
  }
  const hitWeeks = digest.weeks.filter((week) => week.hitCost > 0);
  if (hitWeeks.length !== 1 || hitWeeks[0]?.gw !== 34) problems.push('hit weeks');
  if (problems.length > 0) {
    throw new Error(`2025/26 replay facts no longer match the published copy: ${problems.join('; ')}`);
  }
}

export function replayDatasetJson(): string {
  const weeks = listReplayWeeks();
  return JSON.stringify(
    {
      name: REPLAY_DATASET_NAME,
      season: REPLAY_SEASON_ID,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      citation: REPLAY_CITATION,
      description:
        'One row per gameweek from the 2025/26 reconstructive replay. Built from data/seasons/2025-26/gw-01.json to gw-38.json. No chip was played. Weekly ownership and double gameweeks are not included: the ownership figure does not change by week, and the opponent field stores one fixture only.',
      rows: weeks,
    },
    null,
    2
  );
}

function csvCell(value: string | number | null): string {
  const text = value === null ? '' : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function replayDatasetCsv(): string {
  const weeks = listReplayWeeks();
  const fields = REPLAY_FIELDS.map((item) => item.field);
  const lines = [
    fields.join(','),
    ...weeks.map((week) => fields.map((field) => csvCell(week[field])).join(',')),
  ];
  return `${lines.join('\n')}\n`;
}

export function joinNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
