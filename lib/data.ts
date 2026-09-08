import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import gw1Data from '@/data/gameweeks/gw1.json';
import gw2Data from '@/data/gameweeks/gw2.json';
import gw3Data from '@/data/gameweeks/gw3.json';
import tcData from '@/data/chips/tc.json';
import bbData from '@/data/chips/bb.json';
import fhData from '@/data/chips/fh.json';
import wcData from '@/data/chips/wc.json';
import calibrationData from '@/data/calibration.json';
import simHaaland from '@/data/sims/haaland-vs-no-haaland.json';
import simChip from '@/data/sims/chip-vs-no-chip.json';
import simBaseline from '@/data/sims/baseline-vs-optimiser.json';
import forkNotesData from '@/data/seasons/2025-26/fork-notes.json';

import {
  GameweekDecision,
  ArmId,
  ArmDetailFull,
  ChipType,
  ChipScenarioData,
  PositionCalibrationMetric,
  HistoricalSim,
  SeasonIndex,
  ReplayForkNotes,
  SquadCalibration,
} from '@/types/fpl';

export const DEMO_SEASON = '2026-27';
export const REPLAY_SEASON = '2025-26';

const HISTORICAL_SIMS: HistoricalSim[] = [
  simHaaland as unknown as HistoricalSim,
  simChip as unknown as HistoricalSim,
  simBaseline as unknown as HistoricalSim,
];

const DEMO_GAMEWEEKS: GameweekDecision[] = [
  gw1Data as unknown as GameweekDecision,
  gw2Data as unknown as GameweekDecision,
  gw3Data as unknown as GameweekDecision,
].map((gw) => ({
  ...gw,
  datasetKind: gw.datasetKind ?? 'illustrative-sample',
  provenance: {
    ...gw.provenance,
    datasetKind: gw.provenance.datasetKind ?? 'illustrative-sample',
  },
}));

const CHIP_DATA_MAP: Record<ChipType, ChipScenarioData> = {
  none: tcData as unknown as ChipScenarioData,
  tc: tcData as unknown as ChipScenarioData,
  bb: bbData as unknown as ChipScenarioData,
  fh: fhData as unknown as ChipScenarioData,
  wc: wcData as unknown as ChipScenarioData,
};

let replayCache: GameweekDecision[] | null = null;
let replayIndexCache: SeasonIndex | null = null;

function seasonDir(season: string): string {
  return join(process.cwd(), 'data', 'seasons', season);
}

function loadReplayGameweeks(): GameweekDecision[] {
  if (replayCache) return replayCache;
  const dir = seasonDir(REPLAY_SEASON);
  const files = readdirSync(dir)
    .filter((name) => /^gw-\d+\.json$/.test(name))
    .sort();
  replayCache = files.map((name) =>
    JSON.parse(readFileSync(join(dir, name), 'utf8')) as GameweekDecision
  );
  return replayCache;
}

export function getReplayForkNotes(): ReplayForkNotes {
  return forkNotesData as ReplayForkNotes;
}

export function getSeasonIndex(season: string): SeasonIndex | null {
  if (season === REPLAY_SEASON) {
    if (!replayIndexCache) {
      replayIndexCache = JSON.parse(
        readFileSync(join(seasonDir(REPLAY_SEASON), 'index.json'), 'utf8')
      ) as SeasonIndex;
    }
    return replayIndexCache;
  }
  if (season === DEMO_SEASON) {
    const completed = DEMO_GAMEWEEKS.filter(
      (gw) => gw.validatedPlan.realisedSquadTotalPoints !== null
    );
    return {
      id: DEMO_SEASON,
      kind: 'illustrative-sample',
      title: 'FPL 2026/27 illustrative sample',
      summary:
        'Three illustrative gameweeks showing the live-product page format. Plans, hashes and scores are fixtures, not a live freeze.',
      gameweeks: DEMO_GAMEWEEKS.length,
      optimiserPoints: completed.reduce(
        (sum, gw) => sum + (gw.validatedPlan.realisedSquadTotalPoints || 0),
        0
      ),
      templatePoints: 0,
      evidencePoints: 0,
      chipsPlayed: [],
      rows: DEMO_GAMEWEEKS.map((gw) => ({
        gw: gw.gw,
        captain: gw.validatedPlan.captain.webName,
        formation: gw.validatedPlan.formation,
        projected: gw.validatedPlan.projectedSquadTotalXP,
        points: gw.validatedPlan.realisedSquadTotalPoints,
        templatePoints: gw.arms.find((arm) => arm.id === 'baseline')?.realisedPoints ?? null,
        evidencePoints: gw.arms.find((arm) => arm.id === 'agent')?.realisedPoints ?? null,
        transfers: gw.validatedPlan.transferActions.length,
        hits: gw.validatedPlan.hitCost,
        chip: gw.validatedPlan.chipUsed,
        hash: gw.provenance.snapshotHash.replace(/^sha256:/, ''),
      })),
    };
  }
  return null;
}

export function getSeasons(): SeasonIndex[] {
  return [getSeasonIndex(REPLAY_SEASON), getSeasonIndex(DEMO_SEASON)].filter(
    (season): season is SeasonIndex => season !== null
  );
}

export function getDemoGameweeks(): GameweekDecision[] {
  return DEMO_GAMEWEEKS;
}

export function getSeasonGameweeks(season: string): GameweekDecision[] {
  if (season === REPLAY_SEASON) return loadReplayGameweeks();
  if (season === DEMO_SEASON) return DEMO_GAMEWEEKS;
  return [];
}

export function getAllGameweeks(): GameweekDecision[] {
  return [...loadReplayGameweeks(), ...DEMO_GAMEWEEKS];
}

export function getGameweekDecision(gw: number): GameweekDecision | null {
  return DEMO_GAMEWEEKS.find((item) => item.gw === gw) ?? null;
}

export function getSeasonGameweek(season: string, gw: number): GameweekDecision | null {
  return getSeasonGameweeks(season).find((item) => item.gw === gw) ?? null;
}

export function getLatestDemoGameweek(): GameweekDecision {
  const ordered = [...DEMO_GAMEWEEKS].sort((a, b) => a.gw - b.gw);
  return ordered[ordered.length - 1];
}

export function getFeaturedGameweek(): GameweekDecision {
  const replay = loadReplayGameweeks();
  return replay[replay.length - 1];
}

export function getLatestGameweekDecision(): GameweekDecision {
  return getFeaturedGameweek();
}

export function getAdjacentGameweeks(
  season: string,
  gw: number
): {
  prev: GameweekDecision | null;
  next: GameweekDecision | null;
} {
  const ordered = getSeasonGameweeks(season);
  const index = ordered.findIndex((item) => item.gw === gw);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
  };
}

export function getCalibrationMetrics(): PositionCalibrationMetric[] {
  return calibrationData as PositionCalibrationMetric[];
}

export function getReplayCalibration(season = REPLAY_SEASON): SquadCalibration | null {
  const weeks = getSeasonGameweeks(season).filter(
    (gw) =>
      gw.validatedPlan.projectedSquadTotalXP > 0 &&
      gw.validatedPlan.realisedSquadTotalPoints !== null
  );
  if (weeks.length === 0) return null;

  const squadErrors = weeks.map(
    (gw) => gw.validatedPlan.realisedSquadTotalPoints! - gw.validatedPlan.projectedSquadTotalXP
  );
  const players = weeks.flatMap((gw) =>
    gw.validatedPlan.startingXI.filter(
      (player) => player.expectedPoints > 0 && player.realisedPoints !== null
    )
  );
  const playerErrors = players.map(
    (player) => (player.realisedPoints as number) - player.expectedPoints
  );
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const mae = (values: number[]) => mean(values.map(Math.abs));

  return {
    season,
    gameweeks: weeks.length,
    playerRounds: players.length,
    squadMae: mae(squadErrors),
    squadBias: mean(squadErrors),
    playerMae: players.length ? mae(playerErrors) : 0,
    playerBias: players.length ? mean(playerErrors) : 0,
    note: 'Computed from this reconstructive replay (GW2–GW38). GW1 had no locked expected-points objective. Player errors compare unmultiplied starting-XI points to the locked forecast.',
  };
}

export function getAllSims(): HistoricalSim[] {
  return HISTORICAL_SIMS;
}

export function getSimById(season: string, gw: number, scenario: string): HistoricalSim | null {
  const match = HISTORICAL_SIMS.find(
    (s) => s.season === season && s.gw === gw && s.slug === scenario
  );
  return match || null;
}

export function getSimsForGameweek(season: string, gw: number): HistoricalSim[] {
  if (season !== DEMO_SEASON) return [];
  return HISTORICAL_SIMS.filter((s) => s.gw === gw || s.relatedGw === gw);
}

export function getChipScenario(chip: ChipType, gw: number): ChipScenarioData | null {
  const base = CHIP_DATA_MAP[chip];
  if (!base) return null;
  return {
    ...base,
    gw: gw,
  };
}

export function getArmDetail(season: string, gw: number, armId: ArmId): ArmDetailFull | null {
  if (season !== DEMO_SEASON) return null;
  const gwDecision = getGameweekDecision(gw);
  if (!gwDecision) return null;

  const armSummary = gwDecision.arms.find((a) => a.id === armId);
  if (!armSummary) return null;

  // Derive squad modifications based on arm type
  const squadXI = [...gwDecision.validatedPlan.startingXI];
  const bench = [...gwDecision.validatedPlan.bench];
  let captain = { ...gwDecision.validatedPlan.captain };
  let bank = gwDecision.validatedPlan.bank;
  let hitCost = gwDecision.validatedPlan.hitCost;
  let formation = gwDecision.validatedPlan.formation;

  if (armId === 'baseline') {
    // Baseline heuristic: slightly more conventional template squad
    formation = '3-4-3';
    bank = 0.5;
    hitCost = 0;
    captain = {
      ...captain,
      multiplier: 2,
    };
  } else if (armId === 'agent') {
    // Multi-objective agent: differential captain or aggressive stance
    formation = '3-5-2';
    bank = 0.1;
    hitCost = gw === 2 ? 4 : 0;
    if (gw === 3) {
      const palmer = squadXI.find((p) => p.id === 'p_palmer_che');
      if (palmer) {
        captain = {
          ...palmer,
          isCaptain: true,
          multiplier: 2,
        };
      }
    } else if (gw === 1) {
      const saka = squadXI.find((p) => p.id === 'p_saka_ars');
      if (saka) {
        captain = {
          ...saka,
          isCaptain: true,
          multiplier: 2,
        };
      }
    }
  }

  const solverConstraints = [
    {
      name: 'Total Squad Budget',
      expression: 'Σ (c_i * x_i) ≤ B',
      value: `£${(100.0 - bank).toFixed(1)}m / £100.0m`,
      slack: `£${bank.toFixed(1)}m`,
      binding: bank === 0,
    },
    {
      name: 'Squad Roster Cardinality',
      expression: 'Σ x_i = 15',
      value: '15 players',
      slack: '0',
      binding: true,
    },
    {
      name: 'Starting XI Formation Min Defenders',
      expression: 'Σ (pos_DEF * s_i) ≥ 3',
      value: '3 defenders',
      slack: '0',
      binding: true,
    },
    {
      name: 'Club Roster Limit',
      expression: 'Σ (club_k * x_i) ≤ 3 ∀ k',
      value: 'ARS: 3, MCI: 2, CHE: 1',
      slack: 'ARS binding (3/3)',
      binding: true,
    },
    {
      name: 'Transfer Hit Boundary',
      expression: 'Penalty = 4.0 * max(0, T - FT)',
      value: `Hits: ${hitCost / 4}`,
      slack: hitCost === 0 ? '1 FT buffer' : '0',
      binding: hitCost > 0,
    },
    {
      name: 'Expected Minutes Filter',
      expression: 'E[min_i] ≥ 60 for Starting XI',
      value: 'Min starting: 75 min',
      slack: '15 min margin',
      binding: false,
    },
  ];

  const sensitivityAnalysis = [
    {
      scenario: 'Haaland Minutes Reduction (Down to 65 min)',
      condition: 'E[min] drops from 89 to 65',
      optimalArmShift: 'Shifts captaincy to Palmer; reallocates £2.0m to upgrade bench',
      expectedPointsDelta: -2.3,
    },
    {
      scenario: 'Arsenal Clean Sheet Probability Drift (-15%)',
      condition: 'Raya + Saliba CS expectation reduced to 34%',
      optimalArmShift: 'Downgrade Saliba to Robinson; upgrade Rogers to Semenyo',
      expectedPointsDelta: -1.1,
    },
    {
      scenario: 'Zero Bank Policy (Deploy All £0.5m Bank)',
      condition: 'Hard budget equality constraint B_used = 100.0',
      optimalArmShift: 'Upgrade Muñoz (£5.0m) to Porro (£5.5m)',
      expectedPointsDelta: +0.65,
    },
  ];

  return {
    season,
    gw,
    arm: armId,
    armMeta: armSummary,
    provenance: gwDecision.provenance,
    formation,
    bankRemaining: bank,
    hitCost,
    captainSelection: {
      player: captain,
      candidateComparison: [
        {
          player: 'Haaland',
          team: 'MCI',
          opponent: gw === 1 ? 'CHE (A)' : gw === 2 ? 'IPS (H)' : 'WHU (A)',
          xP: gw === 1 ? 8.72 : gw === 2 ? 10.45 : 8.85,
          ceiling90th: 15.4,
          realised: gw === 1 ? 13 : gw === 2 ? 17 : null,
          selectionReason: 'Dominant volume baseline, highest penalty equity in league (xGI > 0.90).',
        },
        {
          player: 'Palmer',
          team: 'CHE',
          opponent: gw === 1 ? 'MCI (H)' : gw === 2 ? 'WOL (A)' : 'CRY (H)',
          xP: gw === 1 ? 6.84 : gw === 2 ? 7.42 : 7.82,
          ceiling90th: 14.1,
          realised: gw === 1 ? 3 : gw === 2 ? 17 : null,
          selectionReason: 'Direct set-piece and penalty monopolist with high open-play assist conversion.',
        },
        {
          player: 'Saka',
          team: 'ARS',
          opponent: gw === 1 ? 'WOL (H)' : gw === 2 ? 'AVL (A)' : 'BHA (H)',
          xP: gw === 1 ? 7.15 : gw === 2 ? 6.15 : 7.35,
          ceiling90th: 13.8,
          realised: gw === 1 ? 12 : gw === 2 ? 6 : null,
          selectionReason: 'Elite home game metrics, corner duties, high conversion against low blocks.',
        },
        {
          player: 'Salah',
          team: 'LIV',
          opponent: gw === 1 ? 'IPS (A)' : gw === 2 ? 'BRE (H)' : 'MUN (A)',
          xP: gw === 1 ? 7.89 : gw === 2 ? 8.35 : 8.10,
          ceiling90th: 14.8,
          realised: gw === 1 ? 14 : gw === 2 ? 10 : null,
          selectionReason: 'Alternative premium anchor; excluded from base squad due to £12.5m structural trade-offs.',
        },
      ],
    },
    startingXI: squadXI,
    bench,
    transfers: gwDecision.validatedPlan.transferActions,
    solverConstraints,
    sensitivityAnalysis,
  };
}
