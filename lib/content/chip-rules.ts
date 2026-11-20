/**
 * Chip rules checked on 20 Nov 2026.
 *
 * Counts and windows follow the live Fantasy app copy at
 * https://fantasy.premierleague.com/help/rules
 * and https://fantasy.premierleague.com/api/bootstrap-static/.
 * Two of each chip (eight in the season), one chip per gameweek.
 * The first Wildcard and Free Hit run from Gameweek 2 through Gameweek 19.
 * The first Bench Boost and Triple Captain run from Gameweek 1 through 19.
 * The second of each chip runs from Gameweek 20 through Gameweek 38.
 * Nothing carries over. The first chip is lost after the Gameweek 19 deadline.
 * Free Hit cannot be played in consecutive gameweeks. A Free Hit in
 * Gameweek 19 cannot be active again until Gameweek 21.
 * Saved free transfers are kept after Wildcard and Free Hit.
 * Bench Boost and Triple Captain can be cancelled before the deadline.
 * Wildcard and Free Hit cannot be cancelled once confirmed.
 *
 * Gameweek 19 deadline_time: 2027-01-01T18:30:00Z.
 * That is 18:30 UTC on Friday 1 January 2027. The UK is on GMT that day
 * (GMT is UTC+0), so the same instant is 18:30 GMT (18:30 UTC).
 * The first fixture that gameweek is Leeds v Everton at 2027-01-01T20:00:00Z,
 * 90 minutes after the deadline.
 *
 * The 20 July 2026 news article still says 13:30 GMT on Saturday 2 January:
 * https://www.premierleague.com/en/news/4679879/whats-happening-with-fpl-chips-in-202627
 * The live API deadline replaces that time. Do not use the July clock time.
 */
export const CHIP_RESET_CLOCK = '18:30 GMT (18:30 UTC) on Friday 1 January 2027';

export const CHIP_HALF_DEADLINE = `the Gameweek 19 deadline, ${CHIP_RESET_CLOCK}`;

export const CHIP_RESET_ANSWER = `FPL chips reset at ${CHIP_RESET_CLOCK}, the Gameweek 19 deadline. The first Wildcard, Free Hit, Bench Boost and Triple Captain do not carry over. A new set of four is available from Gameweek 20. That is eight chips in the season, two of each.`;

export const CHIP_RESET_PATH = '/chips#when-do-fpl-chips-reset';

export const SAVED_TRANSFERS_KEPT =
  'Yes. Saved free transfers are kept. If you had two saved free transfers, you still have two in the gameweek after a Wildcard or a Free Hit.';
