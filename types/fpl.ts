export type Position = 'GKP' | 'DEF' | 'MID' | 'FWD';
export type ChipType = 'none' | 'tc' | 'bb' | 'fh' | 'wc';
export type ArmId = 'baseline' | 'optimiser' | 'agent';
export type GameweekStatus = 'completed' | 'live' | 'upcoming';
export type DatasetKind = 'historical-replay' | 'illustrative-sample' | 'live-freeze';

export interface PlayerSelection {
  id: string;
  webName: string;
  fullName: string;
  team: string;
  position: Position;
  cost: number;
  projectedMinutes: number;
  expectedPoints: number;
  realisedPoints: number | null;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  multiplier?: number; // 1, 2, or 3 (for TC)
  opponent: string;
  isHome: boolean;
  fixtureDifficulty: number; // 1 to 5
  xGI?: number; // expected goal involvement
  cleanSheetProbability?: number; // 0 to 1
  selectedByPercent?: number;
}

export interface TransferAction {
  playerIn: {
    id: string;
    webName: string;
    team: string;
    position: Position;
    cost: number;
    expectedPoints: number;
  };
  playerOut: {
    id: string;
    webName: string;
    team: string;
    position: Position;
    sellPrice: number;
    expectedPoints: number;
  };
  netCostDelta: number;
  netXPDelta3GW: number;
  rationale: string;
}

export interface ValidatedPlan {
  armId: ArmId;
  armName: string;
  formation: string; // e.g. "3-5-2"
  bank: number;
  hitCost: number;
  freeTransfersAvailable: number;
  chipUsed: ChipType;
  captain: PlayerSelection;
  viceCaptain: PlayerSelection;
  startingXI: PlayerSelection[];
  bench: (PlayerSelection & { benchOrder: number })[];
  transfersIn: PlayerSelection[];
  transfersOut: PlayerSelection[];
  transferActions: TransferAction[];
  projectedSquadTotalXP: number;
  realisedSquadTotalPoints: number | null;
}

export interface SolverParameters {
  horizonWeeks: number;
  decayRate: number;
  hitPenalty: number;
  riskAversion: number;
  freeTransferConservationWeight: number;
  maxPlayersPerClub: number;
  teamBudgetCap: number;
}

export interface ProvenanceMetadata {
  modelVersion: string;
  frozenAt: string; // ISO 8601 UTC
  snapshotHash: string; // SHA-256
  datasetId: string;
  solverEngine: string;
  executionTimestamp: string;
  solverParameters: SolverParameters;
  isDemoSample: boolean;
  datasetKind?: DatasetKind;
  limitations?: string[];
}

export interface PolicyArmSummary {
  id: ArmId;
  name: string;
  shortLabel: string;
  category: 'Heuristic' | 'Mixed-Integer Linear (ILP)' | 'Multi-Objective Agent';
  description: string;
  objectiveEP: number;
  realisedPoints: number | null;
  varianceScore: number;
  transfersCount: number;
  hits: number;
  captain: string;
  viceCaptain: string;
  chip: ChipType;
  formation: string;
  decisionDeltaVsBaseline: number;
  realisedRankEffect: string | null;
  solverRuntimeMs: number;
}

export interface GameweekDecision {
  season: string; // e.g. "2026-27"
  gw: number;
  title: string;
  deadline: string; // ISO 8601
  status: GameweekStatus;
  datasetKind?: DatasetKind;
  provenance: ProvenanceMetadata;
  validatedPlan: ValidatedPlan;
  arms: PolicyArmSummary[];
  summaryAnalysis: {
    executiveSummary: string;
    keyTradeoffs: string[];
    shadowPrices: {
      budgetPerMillionXP: number;
      transferMarginalValueXP: number;
      benchPointsExpectancy: number;
    };
    divergenceNotes: string;
  };
}

export interface SeasonWeekRow {
  gw: number;
  captain: string;
  formation: string;
  projected: number;
  points: number | null;
  templatePoints: number | null;
  evidencePoints: number | null;
  transfers: number;
  hits: number;
  chip: ChipType;
  hash: string;
}

export interface SeasonIndex {
  id: string;
  kind: DatasetKind;
  title: string;
  summary: string;
  gameweeks: number;
  optimiserPoints: number;
  templatePoints: number;
  evidencePoints: number;
  chipsPlayed: SeasonWeekRow[];
  rows: SeasonWeekRow[];
}

export interface ReplayForkNotes {
  kind: 'exploratory-fork';
  disclaimer: string;
  canonicalNet: number;
  forkHybridNet: number;
  forkDeltaGw12to38: number;
  sameStateEvidenceDelta: number;
  chipsPlayed: ChipType[];
  gw34: {
    hitCost: number;
    transfers: number;
    freeTransfers: number;
    blank: boolean;
    optimiserNet: number;
    templateNet: number;
  };
}

export interface SquadCalibration {
  season: string;
  gameweeks: number;
  playerRounds: number;
  squadMae: number;
  squadBias: number;
  playerMae: number;
  playerBias: number;
  note: string;
}

export interface ArmDetailFull {
  season: string;
  gw: number;
  arm: ArmId;
  armMeta: PolicyArmSummary;
  provenance: ProvenanceMetadata;
  formation: string;
  bankRemaining: number;
  hitCost: number;
  captainSelection: {
    player: PlayerSelection;
    candidateComparison: Array<{
      player: string;
      team: string;
      opponent: string;
      xP: number;
      ceiling90th: number;
      realised: number | null;
      selectionReason: string;
    }>;
  };
  startingXI: PlayerSelection[];
  bench: (PlayerSelection & { benchOrder: number })[];
  transfers: TransferAction[];
  solverConstraints: Array<{
    name: string;
    expression: string;
    value: string;
    slack: string;
    binding: boolean;
  }>;
  sensitivityAnalysis: Array<{
    scenario: string;
    condition: string;
    optimalArmShift: string;
    expectedPointsDelta: number;
  }>;
}

export interface ChipWindowAnalysis {
  gw: number;
  opponentContext: string;
  projectedChipEV: number;
  projectedBaselineEV: number;
  netDelta: number;
  isRecommendedWindow: boolean;
  dgwStatus: boolean;
}

export interface ChipScenarioData {
  chip: ChipType;
  chipName: string;
  gw: number;
  season: string;
  status: 'recommended' | 'viable' | 'suboptimal' | 'preserve';
  headline: string;
  summary: string;
  projectedGainXP: number;
  historicalAverageGain: number;
  opportunityCostAssessment: string;
  windowAnalysis: ChipWindowAnalysis[];
  optimalRosterSample: PlayerSelection[];
  solverSettings: {
    model: string;
    decayFactor: number;
    horizon: number;
    frozenAt: string;
    snapshotHash: string;
  };
}

export interface PositionCalibrationMetric {
  position: Position | 'ALL';
  sampleCount: number;
  meanProjectedXP: number;
  meanRealisedPoints: number;
  mae: number;
  rmse: number;
  rSquared: number;
  bias: number;
}

export type SimCategory = 'structural-tradeoff' | 'chip-counterfactual' | 'policy-comparison';

export interface SimArm {
  id: string;
  name: string;
  label: string;
  isControl: boolean;
  planSummary: {
    formation: string;
    captain: string;
    viceCaptain: string;
    keyPlayers: string[];
    bank: number;
    hitCost: number;
    chip: string;
  };
  projectedEP: number;
  realisedPoints: number | null;
  deltaVsControl: number;
  varianceScore: number;
  tacticalShiftNotes: string;
}

export interface HistoricalSim {
  id: string;
  slug: string;
  season: string;
  gw: number;
  title: string;
  scenario: string;
  category: SimCategory;
  hypothesis: string;
  methodologyNote: string;
  provenance: ProvenanceMetadata;
  controlArmName: string;
  treatmentArmName: string;
  arms: SimArm[];
  counterfactualFindings: string;
  takeaways: string[];
  relatedGw: number;
}
