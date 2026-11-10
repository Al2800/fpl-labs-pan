/**
 * Chip rules checked on 10 Nov 2026.
 *
 * Counts and effects follow the live rules:
 * https://fantasy.premierleague.com/help/rules
 * Two of each chip (eight in the season), one chip per gameweek.
 * Free Hit cannot be played in consecutive gameweeks.
 * Saved free transfers are kept after Wildcard and Free Hit.
 * Bench Boost and Triple Captain can be cancelled before the deadline.
 * Wildcard and Free Hit cannot be cancelled once confirmed.
 *
 * Gameweek 19 deadline: 18:30 GMT on Friday 1 January 2027.
 * The rules page lists Gameweek 19 as Friday 1 January and says the deadline
 * is 90 minutes before the first kick-off. The Premier League fixture list has
 * Leeds v Everton at 20:00 that Friday:
 * https://www.premierleague.com/en/news/4675097/all-380-fixtures-released-for-2026-27-premier-league-season
 * 20:00 minus 90 minutes is 18:30 GMT.
 *
 * The 20 July 2026 news article still says 13:30 GMT on Saturday 2 January:
 * https://www.premierleague.com/en/news/4679879/whats-happening-with-fpl-chips-in-202627
 * That predates the Friday night game being the first match of Gameweek 19.
 */
export const CHIP_HALF_DEADLINE =
  'the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027';

export const CHIP_RESET_ANSWER =
  'FPL chips reset at the Gameweek 19 deadline. In 2026/27 that is 18:30 GMT on Friday 1 January 2027. The first Wildcard, Free Hit, Bench Boost and Triple Captain do not carry over. A new set of four is available from Gameweek 20. That is eight chips in the season, two of each.';

export const SAVED_TRANSFERS_KEPT =
  'Yes. Saved free transfers are kept. If you had two saved free transfers, you still have two in the gameweek after a Wildcard or a Free Hit.';
