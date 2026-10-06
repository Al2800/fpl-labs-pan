import { CHIP_HALF_DEADLINE, SAVED_TRANSFERS_KEPT } from '@/lib/content/chip-rules';

export const GLOSSARY = [
  {
    term: 'xP',
    id: 'xp',
    definition:
      'Expected points: the pre-cutoff forecast of FPL points for a player or squad. In the 2025/26 replay this comes from the locked forecast file, except Gameweek 1 which had none.',
  },
  {
    term: 'FDR',
    id: 'fdr',
    definition:
      'Fixture Difficulty Rating from the FPL fixture export, 1 (easier) to 5 (harder). Reconstructive pages use the final-season export, so mid-season revisions may not match what managers saw live.',
  },
  {
    term: 'T-120 freeze',
    id: 't-120',
    definition:
      'Live product rule: lock odds, minutes and the plan two hours before the official FPL deadline, hash the JSON, and do not edit after results. Not used for the 2025/26 reconstructive pages.',
  },
  {
    term: 'Reconstructed cutoff',
    id: 'reconstructed-cutoff',
    definition:
      'Historical rule used for 2025/26: first kickoff minus 90 minutes, rebuilt after the season. Honest for “what the artifacts contain”, not a live freeze.',
  },
  {
    term: 'Approach / arm',
    id: 'approach',
    definition:
      'One policy run on the same cutoff. Template rolls transfers. Optimiser is the selected forecast plan. Evidence is the same-state evidence arm (identical to the optimiser in every 2025/26 gameweek folder).',
  },
  {
    term: 'Hit',
    id: 'hit',
    definition:
      'Four points deducted per transfer beyond free transfers. Gameweek 34’s 8-point hit means two extra transfers.',
  },
  {
    term: 'Net points',
    id: 'net-points',
    definition:
      'Official FPL points for the starting XI (captain multiplied) minus hit cost. Bench scores only with Bench Boost or auto-subs.',
  },
  {
    term: 'JSON snapshot',
    id: 'snapshot',
    definition:
      'The downloadable twin of a page, at the same path plus /snapshot.json, with a SHA-256 digest in the trust strip and X-Snapshot-Hash header.',
  },
  {
    term: 'FPL chips',
    id: 'chips',
    definition:
      'Triple Captain, Bench Boost, Free Hit and Wildcard. In 2026/27 you get two of each, eight in total, and only one chip in a gameweek. The first set must be used by ' +
      CHIP_HALF_DEADLINE +
      '. It does not carry over. A new set is available from Gameweek 20.',
  },
  {
    term: 'Free Hit',
    id: 'free-hit',
    definition:
      'A one-week squad. Unlimited transfers for that gameweek, then your previous 15 return. You get two. It cannot be played in Gameweek 1, and the two Free Hits cannot be played in consecutive gameweeks, so Gameweek 19 and Gameweek 20 is not allowed. ' +
      SAVED_TRANSFERS_KEPT,
  },
  {
    term: 'Wildcard',
    id: 'wildcard',
    definition:
      'Unlimited free transfers for one gameweek, and the new squad stays. You get two. The first must be used by ' +
      CHIP_HALF_DEADLINE +
      ', and it cannot be played in Gameweek 1. ' +
      SAVED_TRANSFERS_KEPT,
  },
  {
    term: 'Bench Boost',
    id: 'bench-boost',
    definition:
      'Adds the points from your four substitutes for one gameweek. You get two, one in each half. The first can be used from Gameweek 1 and must be used by ' +
      CHIP_HALF_DEADLINE +
      '. Automatic substitutions do not apply while it is active.',
  },
  {
    term: 'Triple Captain',
    id: 'triple-captain',
    definition:
      'Triples your captain’s points for one gameweek instead of doubling them. You get two, one in each half. The first must be used by ' +
      CHIP_HALF_DEADLINE +
      '. You can cancel it before the deadline.',
  },
  {
    term: 'Illustrative sample',
    id: 'illustrative-sample',
    definition:
      'Hand-built 2026/27 fixtures that used to sit on this site, including squads that were not a real freeze. Those pages have been removed. The published record is the 2025/26 reconstructive replay.',
  },
];
