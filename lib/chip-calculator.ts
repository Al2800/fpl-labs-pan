import { getSeasonGameweeks } from '@/lib/data';
import { REPLAY_SEASON_ID } from '@/lib/replay-2025';

export const CHIP_CALCULATOR_PATH = '/chips/calculator';

export interface BenchPlayerScore {
  name: string;
  points: number;
}

export interface ChipWeek {
  gw: number;
  captain: string;
  captainPoints: number;
  viceCaptain: string;
  bench: BenchPlayerScore[];
  benchPoints: number;
  recorded: number;
  hitCost: number;
  /** Extra points from counting the captain a third time. Null when the captain scored 0. */
  tcAdded: number | null;
  /** Bench points not already inside the recorded score. Null when the captain scored 0. */
  bbAdded: number | null;
  /** How far the recorded score sits above the starting XI with the captain doubled. */
  aboveXi: number | null;
}

export interface ChipCalculatorData {
  weeks: ChipWeek[];
  scoredCount: number;
}

function byPoints(a: BenchPlayerScore, b: BenchPlayerScore): number {
  return b.points - a.points || a.name.localeCompare(b.name);
}

export function getChipCalculator(): ChipCalculatorData {
  const weeks: ChipWeek[] = getSeasonGameweeks(REPLAY_SEASON_ID).map((gw) => {
    const plan = gw.validatedPlan;
    const captain = plan.captain;
    if (plan.chipUsed !== 'none') {
      throw new Error(`GW${gw.gw} played a chip, so the calculator assumptions do not hold`);
    }
    if (captain.realisedPoints === null || plan.realisedSquadTotalPoints === null) {
      throw new Error(`GW${gw.gw} is missing a recorded score`);
    }
    const xiWithCaptain = plan.startingXI.reduce((sum, player) => {
      const points = player.realisedPoints ?? 0;
      return sum + points * (player.id === captain.id ? 2 : 1);
    }, 0);
    const bench = plan.bench
      .map((player) => ({ name: player.webName, points: player.realisedPoints ?? 0 }))
      .sort(byPoints);
    const benchPoints = bench.reduce((sum, player) => sum + player.points, 0);
    const recorded = plan.realisedSquadTotalPoints;
    const gross = recorded + plan.hitCost;
    const captainPoints = captain.realisedPoints;
    const aboveXi = gross - xiWithCaptain;
    const scored = captainPoints > 0;
    return {
      gw: gw.gw,
      captain: captain.webName,
      captainPoints,
      viceCaptain: plan.viceCaptain.webName,
      bench,
      benchPoints,
      recorded,
      hitCost: plan.hitCost,
      tcAdded: scored ? captainPoints : null,
      bbAdded: scored ? benchPoints - aboveXi : null,
      aboveXi: scored ? aboveXi : null,
    };
  });

  assertChipCalculator(weeks);
  return {
    weeks,
    scoredCount: weeks.filter((week) => week.tcAdded !== null).length,
  };
}

function assertChipCalculator(weeks: ChipWeek[]): void {
  const byGw = new Map(weeks.map((week) => [week.gw, week]));
  const gw17 = byGw.get(17);
  const gw9 = byGw.get(9);
  const gw3 = byGw.get(3);
  const gw23 = byGw.get(23);
  const gw37 = byGw.get(37);
  const problems: string[] = [];
  if (weeks.length !== 38) problems.push('week count');
  if (!gw17 || gw17.captain !== 'Haaland' || gw17.captainPoints !== 16 || gw17.tcAdded !== 16 || gw17.recorded !== 88) {
    problems.push('gw17');
  }
  if (!gw9 || gw9.bbAdded !== 28 || gw9.benchPoints !== 28 || gw9.recorded !== 53 || gw9.aboveXi !== 0) {
    problems.push('gw9');
  }
  if (!gw3 || gw3.benchPoints !== 24 || gw3.bbAdded !== 10 || gw3.recorded !== 59 || gw3.aboveXi !== 14) {
    problems.push('gw3');
  }
  if (!gw23 || gw23.tcAdded !== 1) problems.push('gw23');
  if (!gw37 || gw37.tcAdded !== 6 || gw37.bbAdded !== 6 || gw37.recorded !== 70) problems.push('gw37');
  const blank = [13, 28, 38];
  if (blank.some((gw) => byGw.get(gw)?.tcAdded !== null || byGw.get(gw)?.bbAdded !== null)) {
    problems.push('unscored');
  }
  const scored = weeks.filter((week) => week.bbAdded !== null);
  if (scored.length !== 35) problems.push('scored count');
  if (scored.some((week) => week.bbAdded === null || week.bbAdded < 0 || week.bbAdded > week.benchPoints)) {
    problems.push('bb range');
  }
  if (problems.length > 0) {
    throw new Error(`Chip calculator no longer matches the 2025/26 files: ${problems.join('; ')}`);
  }
}

export function bestWeek(weeks: ChipWeek[], chip: 'tc' | 'bb'): ChipWeek {
  const key = chip === 'tc' ? 'tcAdded' : 'bbAdded';
  const scored = weeks.filter((week) => week[key] !== null);
  return [...scored].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0) || a.gw - b.gw)[0];
}

export function worstWeek(weeks: ChipWeek[], chip: 'tc' | 'bb'): ChipWeek {
  const key = chip === 'tc' ? 'tcAdded' : 'bbAdded';
  const scored = weeks.filter((week) => week[key] !== null);
  return [...scored].sort((a, b) => (a[key] ?? 0) - (b[key] ?? 0) || a.gw - b.gw)[0];
}

export function chipFaqs(data: ChipCalculatorData): Array<{ q: string; a: string }> {
  const tcBest = bestWeek(data.weeks, 'tc');
  const tcWorst = worstWeek(data.weeks, 'tc');
  const bbBest = bestWeek(data.weeks, 'bb');
  const zeros = data.weeks.filter((week) => week.bbAdded === 0).map((week) => `Gameweek ${week.gw}`);
  const zeroList =
    zeros.length === 0
      ? 'no scored week'
      : zeros.length === 1
        ? zeros[0]
        : `${zeros.slice(0, -1).join(', ')} and ${zeros[zeros.length - 1]}`;
  return [
    {
      q: 'How much does Triple Captain add?',
      a: `On the 2025/26 replay, Triple Captain adds the most in Gameweek ${tcBest.gw}: ${tcBest.captain} scored ${tcBest.captainPoints}, so the chip adds ${tcBest.tcAdded} and the week would have been ${tcBest.recorded + (tcBest.tcAdded ?? 0)} instead of ${tcBest.recorded}. The smallest add, among weeks where the captain scored, is ${tcWorst.tcAdded} in Gameweek ${tcWorst.gw}.`,
    },
    {
      q: 'When is the best week to Bench Boost?',
      a: `On this replay, the best Bench Boost week is Gameweek ${bbBest.gw}. The four substitutes scored ${bbBest.benchPoints}, and ${
        bbBest.aboveXi === 0
          ? `the recorded ${bbBest.recorded} does not already include them, so the chip adds ${bbBest.bbAdded}`
          : `the recorded ${bbBest.recorded} is already ${bbBest.aboveXi} above the starting XI, so the chip adds ${bbBest.bbAdded}, not the full bench`
      }. It adds nothing in ${zeroList}.`,
    },
    {
      q: 'How does Triple Captain work in FPL?',
      a: 'Triple Captain counts your captain three times instead of twice. On a team that already doubled the captain, it adds one extra copy of that score. That is the figure in the table.',
    },
    {
      q: 'Why is there no Free Hit or Wildcard score?',
      a: 'There is no Free Hit or Wildcard score because these files only contain the squad that was used. They do not contain the squad either chip would have built. The page does not invent one.',
    },
  ];
}
