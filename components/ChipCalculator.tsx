'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ChipWeek } from '@/lib/chip-calculator';
import { gameweekPath } from '@/lib/present';

type ChipChoice = 'tc' | 'bb' | 'fh' | 'wc';
type SortKey = 'gw' | 'added' | 'recorded';

const CHIPS: Array<{ id: ChipChoice; label: string }> = [
  { id: 'tc', label: 'Triple Captain' },
  { id: 'bb', label: 'Bench Boost' },
  { id: 'fh', label: 'Free Hit' },
  { id: 'wc', label: 'Wildcard' },
];

function addedOf(week: ChipWeek, chip: 'tc' | 'bb'): number | null {
  return chip === 'tc' ? week.tcAdded : week.bbAdded;
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
}

function benchLine(week: ChipWeek): string {
  return week.bench.map((player) => `${player.name} ${player.points}`).join(', ');
}

export function ChipCalculator({ weeks, initialGw }: { weeks: ChipWeek[]; initialGw: number }) {
  const [chip, setChip] = useState<ChipChoice>('tc');
  const [gw, setGw] = useState(initialGw);
  const [sortKey, setSortKey] = useState<SortKey>('added');
  const [sortDesc, setSortDesc] = useState(true);

  const scoredChip = chip === 'bb' ? 'bb' : 'tc';
  const week = weeks.find((item) => item.gw === gw) ?? weeks[0];
  const added = week ? addedOf(week, scoredChip) : null;

  const ranked = useMemo(() => {
    return weeks
      .filter((item) => addedOf(item, scoredChip) !== null)
      .sort((a, b) => (addedOf(b, scoredChip) ?? 0) - (addedOf(a, scoredChip) ?? 0) || a.gw - b.gw);
  }, [weeks, scoredChip]);

  const sorted = useMemo(() => {
    const copy = [...weeks];
    copy.sort((a, b) => {
      const dir = sortDesc ? -1 : 1;
      if (sortKey === 'gw') return (a.gw - b.gw) * dir;
      if (sortKey === 'recorded') return (a.recorded - b.recorded) * dir || a.gw - b.gw;
      const aAdded = addedOf(a, scoredChip);
      const bAdded = addedOf(b, scoredChip);
      if (aAdded === null && bAdded === null) return a.gw - b.gw;
      if (aAdded === null) return 1;
      if (bAdded === null) return -1;
      return (aAdded - bAdded) * dir || a.gw - b.gw;
    });
    return copy;
  }, [weeks, sortKey, sortDesc, scoredChip]);

  function chooseSort(next: SortKey) {
    if (sortKey === next) {
      setSortDesc((value) => !value);
      return;
    }
    setSortKey(next);
    setSortDesc(next !== 'gw');
  }

  const rank = added === null || !week ? null : ranked.findIndex((item) => item.gw === week.gw) + 1;
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHIPS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={chip === item.id}
            onClick={() => {
              setChip(item.id);
              if (item.id === 'tc' || item.id === 'bb') setSortKey('added');
            }}
            className={`min-h-11 rounded-sm border px-3 py-2 text-sm font-medium ${
              chip === item.id
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {chip === 'fh' || chip === 'wc' ? (
        <section className="border border-neutral-200 bg-neutral-50 p-5 space-y-2">
          <h2 className="text-lg font-semibold">
            {chip === 'fh' ? 'Free Hit has no number here' : 'Wildcard has no number here'}
          </h2>
          <p className="text-neutral-800 leading-relaxed">
            {chip === 'fh' ? 'Free Hit' : 'Wildcard'} would have meant a different 15 players. The
            2025/26 files only contain the squad that was used, and no chip was played in any week. A
            points total for that other squad is not in the data, so this page does not invent one.
          </p>
          <p className="text-sm">
            <Link
              href={chip === 'fh' ? '/chips/free-hit' : '/chips/wildcard'}
              className="underline underline-offset-2"
            >
              {chip === 'fh' ? 'Free Hit rules' : 'Wildcard rules'}
            </Link>
          </p>
        </section>
      ) : (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-800">2025/26 gameweek</span>
            <select
              value={gw}
              onChange={(event) => setGw(Number(event.target.value))}
              className="w-full min-h-11 border border-neutral-300 bg-white px-3 text-base"
            >
              {weeks.map((item) => (
                <option key={item.gw} value={item.gw}>
                  GW{item.gw}
                  {addedOf(item, scoredChip) === null
                    ? ', not scored'
                    : `, adds ${addedOf(item, scoredChip)}`}
                </option>
              ))}
            </select>
          </label>

          {week && added === null ? (
            <section className="border border-neutral-200 bg-neutral-50 p-5 space-y-2">
              <h2 className="text-lg font-semibold">Gameweek {week.gw} is not scored</h2>
              <p className="text-neutral-800 leading-relaxed">
                {week.captain} recorded {week.captainPoints}. The file has no minutes played, only a
                pre-deadline minutes forecast. If {week.captain} did not play at all, the armband would
                have moved to {week.viceCaptain}, and neither chip can be totalled from this file.
              </p>
            </section>
          ) : null}

          {week && added !== null && rank !== null && best && worst ? (
            <section className="border border-neutral-200 bg-white p-5 space-y-3" id="chip-result">
              <p className="text-sm font-medium text-neutral-600">
                Arithmetic on the replay team. {chip === 'tc' ? 'Triple Captain' : 'Bench Boost'} was
                not played.
              </p>
              <h2 className="text-lg font-semibold">
                Gameweek {week.gw}: {chip === 'tc' ? 'Triple Captain' : 'Bench Boost'} adds {added}
              </h2>
              <p className="text-4xl font-semibold tabular-nums tracking-tight">+{added}</p>
              {chip === 'tc' ? (
                <p className="text-neutral-800 leading-relaxed">
                  {week.captain} scored {week.captainPoints}. The replay already counted that twice, which
                  is {week.captainPoints * 2}. Triple Captain would have counted it three times, which is{' '}
                  {week.captainPoints * 3}, so the chip adds {added}. The week would have been{' '}
                  {week.recorded + added} instead of {week.recorded}
                  {week.hitCost > 0 ? `. That ${week.recorded} is after the ${week.hitCost}-point hit` : ''}.
                </p>
              ) : (
                <p className="text-neutral-800 leading-relaxed">
                  The substitutes scored {week.benchPoints}: {benchLine(week)}. The recorded score is{' '}
                  {week.recorded}
                  {(week.aboveXi ?? 0) === 0
                    ? ', the same as the starting XI with the captain already doubled. None of the bench is in that score, so Bench Boost adds the full '
                    : `, which is ${week.aboveXi} above the starting XI with the captain doubled. Bench Boost adds `}
                  {added}
                  {(week.aboveXi ?? 0) > 0 ? `, not the full ${week.benchPoints}` : ''}. The week would
                  have been {week.recorded + added} instead of {week.recorded}
                  {week.hitCost > 0 ? `. That ${week.recorded} is after the ${week.hitCost}-point hit` : ''}.
                </p>
              )}
              <p className="text-neutral-800 leading-relaxed">
                {rank === 1
                  ? `Best ${chip === 'tc' ? 'Triple Captain' : 'Bench Boost'} week on this replay.`
                  : `${ordinal(rank)} of ${ranked.length} scored weeks. The best is Gameweek ${best.gw}, which adds ${addedOf(best, scoredChip)}.`}{' '}
                The smallest add is {addedOf(worst, scoredChip)} in Gameweek {worst.gw}.
              </p>
              <p className="text-sm">
                <Link
                  href={gameweekPath('2025-26', week.gw)}
                  className="underline underline-offset-2"
                >
                  Open Gameweek {week.gw}
                </Link>
              </p>
            </section>
          ) : null}

          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full text-sm text-left">
              <caption className="sr-only">
                {chip === 'tc' ? 'Triple Captain' : 'Bench Boost'} added by gameweek, 2025/26 replay
              </caption>
              <thead className="bg-neutral-100 text-neutral-700">
                <tr>
                  <SortHeader label="GW" active={sortKey === 'gw'} desc={sortDesc} onClick={() => chooseSort('gw')} />
                  <SortHeader
                    label="Added"
                    active={sortKey === 'added'}
                    desc={sortDesc}
                    onClick={() => chooseSort('added')}
                  />
                  <th scope="col" className="py-2 px-3 font-medium">
                    On the replay
                  </th>
                  <SortHeader
                    label="Score"
                    active={sortKey === 'recorded'}
                    desc={sortDesc}
                    onClick={() => chooseSort('recorded')}
                  />
                </tr>
              </thead>
              <tbody>
                {sorted.map((item) => {
                  const value = addedOf(item, scoredChip);
                  const selected = item.gw === gw;
                  return (
                    <tr
                      key={item.gw}
                      className={`border-t border-neutral-200 ${selected ? 'bg-neutral-50' : ''}`}
                    >
                      <td className="py-2 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            setGw(item.gw);
                            document.getElementById('chip-result')?.scrollIntoView({ block: 'nearest' });
                          }}
                          className="underline underline-offset-2 font-medium"
                        >
                          {item.gw}
                        </button>
                      </td>
                      <td className="py-2 px-3 tabular-nums">{value === null ? 'n/a' : value}</td>
                      <td className="py-2 px-3 text-neutral-800">
                        {chip === 'tc'
                          ? `${item.captain} ${item.captainPoints}`
                          : `Bench ${item.benchPoints}`}
                      </td>
                      <td className="py-2 px-3 tabular-nums">{item.recorded}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-neutral-600">
            n/a means the captain recorded 0, so the armband might have moved. Those three weeks are
            not ranked. Tap a gameweek to load it above.
          </p>
        </>
      )}
    </div>
  );
}

function SortHeader({
  label,
  active,
  desc,
  onClick,
}: {
  label: string;
  active: boolean;
  desc: boolean;
  onClick: () => void;
}) {
  return (
    <th scope="col" aria-sort={active ? (desc ? 'descending' : 'ascending') : 'none'} className="py-2 px-3 font-medium">
      <button
        type="button"
        onClick={onClick}
        className="underline underline-offset-2"
        aria-label={active ? `${label}, sorted ${desc ? 'high to low' : 'low to high'}` : `Sort by ${label}`}
      >
        {label}
      </button>
    </th>
  );
}
