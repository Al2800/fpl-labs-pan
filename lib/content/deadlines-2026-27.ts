/**
 * 2026/27 FPL gameweek deadlines.
 * Checked on 23 November 2026 from
 * https://fantasy.premierleague.com/api/bootstrap-static/
 * (events[].id and events[].deadline_time).
 * Fixtures were checked the same day from
 * https://fantasy.premierleague.com/api/fixtures/.
 * This file is a static snapshot. Do not fetch the FPL API at build or request time.
 *
 * Fixture check that day: 380 fixtures. Every fixture had an event id and a
 * kickoff_time, so none were unscheduled. Each gameweek from 1 to 38 had 10
 * fixtures and 20 clubs. Gameweeks 12 to 15 were not blanks or doubles.
 * For every gameweek, deadline_time was exactly 90 minutes before the earliest
 * kickoff_time. The earliest Gameweek 19 kickoff was 2027-01-01T20:00:00Z.
 *
 * UK labels use Europe/London. GMT is UTC+0. BST is one hour ahead of UTC.
 * A deadline before 2026-11-23T00:00:00Z is Passed. The first deadline after
 * that instant is Next (Gameweek 12).
 */

export const DEADLINES_CHECKED_ON = '2026-11-23';
export const DEADLINES_CHECKED_ON_LABEL = '23 November 2026';
export const DEADLINE_OFFSET_MINUTES = 90;
export const GW19_FIRST_KICKOFF = '2027-01-01T20:00:00Z';

const gw19KickoffMs = Date.parse(GW19_FIRST_KICKOFF);
const gw19DeadlineMs = Date.parse('2027-01-01T18:30:00Z');
if (gw19KickoffMs - gw19DeadlineMs !== DEADLINE_OFFSET_MINUTES * 60 * 1000) {
  throw new Error('Gameweek 19 kickoff is not 90 minutes after the deadline');
}

export function utcClock(iso: string): string {
  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
  return `${clock} UTC`;
}

export const FIXTURE_CHECK = {
  totalFixtures: 380,
  unscheduledFixtures: 0,
  fixturesPerGameweek: 10,
  clubsPerGameweek: 20,
} as const;

if (FIXTURE_CHECK.unscheduledFixtures !== 0) {
  throw new Error('Fixture copy assumes no unscheduled fixtures');
}

if (utcClock(GW19_FIRST_KICKOFF) !== '20:00 UTC') {
  throw new Error(`Gameweek 19 kickoff label mismatch: ${utcClock(GW19_FIRST_KICKOFF)}`);
}

export const DEADLINES_GUIDE_PATH = '/guides/fpl-deadlines-2026-27';
export const DEADLINES_GUIDE_TITLE =
  'FPL deadlines 2026/27: every gameweek deadline in GMT and UTC';

export interface FplEventDeadline {
  id: number;
  /** Official deadline_time from bootstrap-static. */
  deadline_time: string;
}

export const DEADLINES_2026_27: readonly FplEventDeadline[] = [
  { id: 1, deadline_time: '2026-08-21T17:30:00Z' },
  { id: 2, deadline_time: '2026-08-28T17:30:00Z' },
  { id: 3, deadline_time: '2026-09-04T17:30:00Z' },
  { id: 4, deadline_time: '2026-09-12T12:30:00Z' },
  { id: 5, deadline_time: '2026-09-18T17:30:00Z' },
  { id: 6, deadline_time: '2026-10-10T10:00:00Z' },
  { id: 7, deadline_time: '2026-10-17T10:00:00Z' },
  { id: 8, deadline_time: '2026-10-23T17:30:00Z' },
  { id: 9, deadline_time: '2026-10-31T11:00:00Z' },
  { id: 10, deadline_time: '2026-11-06T18:30:00Z' },
  { id: 11, deadline_time: '2026-11-21T11:00:00Z' },
  { id: 12, deadline_time: '2026-11-27T18:30:00Z' },
  { id: 13, deadline_time: '2026-12-01T18:30:00Z' },
  { id: 14, deadline_time: '2026-12-05T11:00:00Z' },
  { id: 15, deadline_time: '2026-12-12T13:30:00Z' },
  { id: 16, deadline_time: '2026-12-19T11:00:00Z' },
  { id: 17, deadline_time: '2026-12-26T11:00:00Z' },
  { id: 18, deadline_time: '2026-12-29T18:00:00Z' },
  { id: 19, deadline_time: '2027-01-01T18:30:00Z' },
  { id: 20, deadline_time: '2027-01-05T18:00:00Z' },
  { id: 21, deadline_time: '2027-01-16T11:00:00Z' },
  { id: 22, deadline_time: '2027-01-23T13:30:00Z' },
  { id: 23, deadline_time: '2027-01-30T11:00:00Z' },
  { id: 24, deadline_time: '2027-02-06T13:30:00Z' },
  { id: 25, deadline_time: '2027-02-10T18:30:00Z' },
  { id: 26, deadline_time: '2027-02-20T13:30:00Z' },
  { id: 27, deadline_time: '2027-02-27T13:30:00Z' },
  { id: 28, deadline_time: '2027-03-03T18:30:00Z' },
  { id: 29, deadline_time: '2027-03-13T13:30:00Z' },
  { id: 30, deadline_time: '2027-03-20T13:30:00Z' },
  { id: 31, deadline_time: '2027-04-10T12:30:00Z' },
  { id: 32, deadline_time: '2027-04-17T12:30:00Z' },
  { id: 33, deadline_time: '2027-04-24T12:30:00Z' },
  { id: 34, deadline_time: '2027-05-01T12:30:00Z' },
  { id: 35, deadline_time: '2027-05-08T12:30:00Z' },
  { id: 36, deadline_time: '2027-05-15T12:30:00Z' },
  { id: 37, deadline_time: '2027-05-23T12:30:00Z' },
  { id: 38, deadline_time: '2027-05-30T13:30:00Z' },
];

export type DeadlineStatus = 'Passed' | 'Next' | 'Later';

export interface DeadlineRow {
  id: number;
  deadlineTime: string;
  dayAndDate: string;
  ukTime: string;
  utcTime: string;
  paired: string;
  status: DeadlineStatus;
}

const CHECKED_AT_MS = Date.parse(`${DEADLINES_CHECKED_ON}T00:00:00Z`);

function part(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
): string {
  const value = parts.find((item) => item.type === type)?.value;
  if (!value) {
    throw new Error(`Missing ${type} in formatted deadline`);
  }
  return value;
}

function formatInstant(iso: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).formatToParts(new Date(iso));
  const hour = part(parts, 'hour').padStart(2, '0');
  const minute = part(parts, 'minute').padStart(2, '0');
  return {
    dayAndDate: `${part(parts, 'weekday')} ${part(parts, 'day')} ${part(parts, 'month')} ${part(parts, 'year')}`,
    clock: `${hour}:${minute}`,
    zone: part(parts, 'timeZoneName'),
  };
}

function clockMinutes(clock: string): number {
  const [hour, minute] = clock.split(':').map((value) => Number(value));
  return hour * 60 + minute;
}

function buildRows(): DeadlineRow[] {
  if (DEADLINES_2026_27.length !== 38) {
    throw new Error(`Expected 38 deadlines, found ${DEADLINES_2026_27.length}`);
  }

  const rows: DeadlineRow[] = DEADLINES_2026_27.map((event) => {
    const uk = formatInstant(event.deadline_time, 'Europe/London');
    const utc = formatInstant(event.deadline_time, 'UTC');
    if (uk.zone !== 'GMT' && uk.zone !== 'BST') {
      throw new Error(`Gameweek ${event.id} UK zone was ${uk.zone}`);
    }
    if (utc.zone !== 'UTC') {
      throw new Error(`Gameweek ${event.id} UTC zone was ${utc.zone}`);
    }
    if (uk.dayAndDate !== utc.dayAndDate) {
      throw new Error(`Gameweek ${event.id} UK and UTC dates differ`);
    }
    const gap = (clockMinutes(uk.clock) - clockMinutes(utc.clock) + 24 * 60) % (24 * 60);
    if (uk.zone === 'GMT' && gap !== 0) {
      throw new Error(`Gameweek ${event.id} GMT did not match UTC`);
    }
    if (uk.zone === 'BST' && gap !== 60) {
      throw new Error(`Gameweek ${event.id} BST was not one hour ahead of UTC`);
    }
    const ukTime = `${uk.clock} ${uk.zone}`;
    const utcTime = `${utc.clock} UTC`;
    const status: DeadlineStatus =
      Date.parse(event.deadline_time) < CHECKED_AT_MS ? 'Passed' : 'Later';
    return {
      id: event.id,
      deadlineTime: event.deadline_time,
      dayAndDate: uk.dayAndDate,
      ukTime,
      utcTime,
      paired: `${ukTime} (${utcTime})`,
      status,
    };
  });

  const next = rows.find((row) => row.status === 'Later');
  if (!next) {
    throw new Error('No upcoming deadline in the snapshot');
  }
  next.status = 'Next';
  if (
    next.id !== 12 ||
    next.dayAndDate !== 'Friday 27 November 2026' ||
    next.paired !== '18:30 GMT (18:30 UTC)' ||
    next.deadlineTime !== '2026-11-27T18:30:00Z'
  ) {
    throw new Error(`Gameweek 12 snapshot mismatch: ${next.paired} ${next.dayAndDate}`);
  }

  const gw19 = rows.find((row) => row.id === 19);
  if (
    !gw19 ||
    gw19.dayAndDate !== 'Friday 1 January 2027' ||
    gw19.paired !== '18:30 GMT (18:30 UTC)' ||
    gw19.deadlineTime !== '2027-01-01T18:30:00Z'
  ) {
    throw new Error('Gameweek 19 snapshot mismatch');
  }

  const ids = rows.map((row) => row.id);
  if (ids.some((id, index) => id !== index + 1)) {
    throw new Error('Deadline ids must run from 1 to 38');
  }
  return rows;
}

export const DEADLINE_ROWS: readonly DeadlineRow[] = buildRows();

export function nextDeadline(): DeadlineRow {
  const row = DEADLINE_ROWS.find((item) => item.status === 'Next');
  if (!row) {
    throw new Error('Next deadline missing');
  }
  return row;
}

const NEXT_DEADLINE = nextDeadline();

export const DEADLINES_META_TITLE = `GW${NEXT_DEADLINE.id} FPL deadline: ${NEXT_DEADLINE.paired}, 27 Nov 2026`;

export const DEADLINES_META_DESCRIPTION = `The next FPL deadline is Gameweek ${NEXT_DEADLINE.id}, ${NEXT_DEADLINE.dayAndDate}, ${NEXT_DEADLINE.paired}. Every 2026/27 gameweek deadline is listed in GMT or BST and in UTC.`;
