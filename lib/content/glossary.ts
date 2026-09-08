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
    term: 'Illustrative sample',
    id: 'illustrative-sample',
    definition:
      '2026/27 Gameweeks 1–3 on this site. They show the live page format. They are not a live freeze.',
  },
];
