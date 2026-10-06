import Link from 'next/link';
import type { ChipType } from '@/types/fpl';
import {
  getReplayDigest,
  joinNames,
  REPLAY_DOWNLOAD_PATH,
  type BlankWeekRecord,
  type ReplayDigest,
} from '@/lib/replay-2025';
import { gameweekPath } from '@/lib/present';

function gwLink(gw: number) {
  return (
    <Link href={gameweekPath('2025-26', gw)} className="underline underline-offset-2">
      GW{gw}
    </Link>
  );
}

function BlankWeekCopy({ week }: { week: BlankWeekRecord }) {
  const xi = week.withoutFixture.filter((player) => player.where === 'starting XI').map((player) => player.webName);
  const bench = week.withoutFixture.filter((player) => player.where === 'bench').map((player) => player.webName);
  const hit =
    week.hitCost > 0
      ? `took a ${week.hitCost}-point hit`
      : 'did not take a hit';
  const places = [
    xi.length ? `${joinNames(xi)} in the starting XI` : '',
    bench.length ? `${joinNames(bench)} on the bench` : '',
  ]
    .filter(Boolean)
    .join(', and ');

  return (
    <p className="text-neutral-800 leading-relaxed">
      In {gwLink(week.gw)}, {week.withoutFixture.length} of {week.squadSize} squad players had no
      fixture stored: {places}. The optimiser made {week.transfers} transfers with{' '}
      {week.freeTransfersAvailable} free {week.freeTransfersAvailable === 1 ? 'transfer' : 'transfers'}{' '}
      available, {hit}, and scored {week.optimiserPoints} net. The template scored {week.templatePoints}.
    </p>
  );
}

function FreeHitCard({ digest }: { digest: ReplayDigest }) {
  const blanks = [...digest.blanks].sort((a, b) => a.gw - b.gw);
  return (
    <section className="border border-neutral-200 bg-neutral-50 p-5 space-y-3" aria-label="2025/26 blank weeks">
      <p className="text-sm font-medium text-neutral-600">
        2025/26 replay record. No Free Hit was played or scored.
      </p>
      <h2 className="text-lg font-semibold">Blank gameweeks in the 2025/26 replay</h2>
      <p className="text-neutral-800 leading-relaxed">
        The squad files mark a blank by storing no opponent. Two gameweeks have players like that.
        The replay made ordinary transfers. It did not play Free Hit, so there is no Free Hit squad
        to compare.
      </p>
      {blanks.map((week) => (
        <BlankWeekCopy key={week.gw} week={week} />
      ))}
      <p className="text-sm text-neutral-600">
        Source: data/seasons/2025-26/gw-31.json and gw-34.json. A blank opponent is the stored
        fixture field, which holds one fixture only and does not mark doubles.{' '}
        <Link href={REPLAY_DOWNLOAD_PATH} className="underline underline-offset-2">
          Download the season file
        </Link>
        .
      </p>
    </section>
  );
}

function TripleCaptainCard({ digest }: { digest: ReplayDigest }) {
  const best = digest.hauls[0];
  const top = digest.hauls.slice(0, 5);
  const added = best ? best.points : null;
  return (
    <section className="border border-neutral-200 bg-neutral-50 p-5 space-y-3" aria-label="2025/26 captain log">
      <p className="text-sm font-medium text-neutral-600">
        2025/26 captain log. Triple Captain was not played.
      </p>
      <h2 className="text-lg font-semibold">Who the replay captained</h2>
      <p className="text-neutral-800 leading-relaxed">
        Across 38 gameweeks the optimiser captained{' '}
        {digest.captains.map((row, index) => (
          <span key={row.name}>
            {index === 0 ? '' : index === digest.captains.length - 1 ? ' and ' : ', '}
            {row.name} {row.gameweeks} {row.gameweeks === 1 ? 'time' : 'times'}
          </span>
        ))}
        . Those are normal captain picks. No chip was played.
      </p>
      <table className="w-full text-sm text-left">
        <caption className="sr-only">Captain counts in the 2025/26 replay</caption>
        <thead className="text-neutral-600">
          <tr>
            <th scope="col" className="py-1 pr-3 font-medium">Captain</th>
            <th scope="col" className="py-1 font-medium text-right">Gameweeks</th>
          </tr>
        </thead>
        <tbody>
          {digest.captains.map((row) => (
            <tr key={row.name} className="border-t border-neutral-200">
              <td className="py-1 pr-3">{row.name}</td>
              <td className="py-1 text-right tabular-nums">{row.gameweeks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {best && added !== null ? (
        <p className="text-neutral-800 leading-relaxed">
          The highest captain score, before the multiplier, was {best.captain} on {best.points} in{' '}
          {gwLink(best.gw)}. Next were{' '}
          {top.slice(1).map((haul, index) => (
            <span key={`${haul.gw}-${haul.captain}`}>
              {index === 0 ? '' : index === top.length - 2 ? ' and ' : ', '}
              {haul.captain} {haul.points} in {gwLink(haul.gw)}
            </span>
          ))}
          . A Triple Captain in {gwLink(best.gw)} would have added {added} points: 3 times {added} is{' '}
          {added * 3}, the double already in the total is {added * 2}, and the difference is {added}.
          That {added} is arithmetic, not a chip that was played.
        </p>
      ) : null}
      <p className="text-sm text-neutral-600">
        Source: the captain on each file in data/seasons/2025-26/, and gw-{String(best?.gw).padStart(2, '0')}.json
        for the top score. Ownership percentages are not shown. The file stores one fixture per
        player, so this is not a double-gameweek table.{' '}
        <Link href={REPLAY_DOWNLOAD_PATH} className="underline underline-offset-2">
          Download the season file
        </Link>
        .
      </p>
    </section>
  );
}

function BenchBoostCard({ digest }: { digest: ReplayDigest }) {
  const ranked = [...digest.benchByWeek].sort((a, b) => b.points - a.points || a.gw - b.gw);
  const best = ranked.slice(0, 4);
  const zeros = digest.benchByWeek.filter((week) => week.points === 0);
  return (
    <section className="border border-neutral-200 bg-neutral-50 p-5 space-y-3" aria-label="2025/26 bench points">
      <p className="text-sm font-medium text-neutral-600">
        Arithmetic only. Bench Boost was not played.
      </p>
      <h2 className="text-lg font-semibold">2025/26 bench points by gameweek</h2>
      <p className="text-neutral-800 leading-relaxed">
        The four substitutes scored {digest.benchTotal} points across 38 gameweeks. The highest
        weeks were{' '}
        {best.map((week, index) => (
          <span key={week.gw}>
            {index === 0 ? '' : index === best.length - 1 ? ' and ' : ', '}
            {gwLink(week.gw)} ({week.points})
          </span>
        ))}
        . The bench scored zero in{' '}
        {zeros.map((week, index) => (
          <span key={week.gw}>
            {index === 0 ? '' : index === zeros.length - 1 ? ' and ' : ', '}
            {gwLink(week.gw)}
          </span>
        ))}
        , the two blank weeks. A Bench Boost would have added these bench points to the gameweek
        score. That is arithmetic. The replay did not play Bench Boost.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <caption className="sr-only">Bench points by gameweek, 2025/26 replay</caption>
          <thead className="text-neutral-600">
            <tr>
              <th scope="col" className="py-1 pr-3 font-medium">GW</th>
              <th scope="col" className="py-1 font-medium text-right">Bench points</th>
            </tr>
          </thead>
          <tbody>
            {digest.benchByWeek.map((week) => (
              <tr key={week.gw} className="border-t border-neutral-200">
                <td className="py-1 pr-3">{gwLink(week.gw)}</td>
                <td className="py-1 text-right tabular-nums">{week.points}</td>
              </tr>
            ))}
            <tr className="border-t border-neutral-300 font-medium">
              <td className="py-1 pr-3">Season</td>
              <td className="py-1 text-right tabular-nums">{digest.benchTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-neutral-600">
        Source: bench.realisedPoints on each file in data/seasons/2025-26/.{' '}
        <Link href={REPLAY_DOWNLOAD_PATH} className="underline underline-offset-2">
          Download the season file
        </Link>
        .
      </p>
    </section>
  );
}

function WildcardCard({ digest }: { digest: ReplayDigest }) {
  const gw31 = digest.blanks.find((week) => week.gw === 31);
  if (!gw31) return null;
  return (
    <section className="border border-neutral-200 bg-neutral-50 p-5 space-y-3" aria-label="2025/26 banked transfers">
      <p className="text-sm font-medium text-neutral-600">
        2025/26 replay record. Wildcard was not used.
      </p>
      <h2 className="text-lg font-semibold">GW31: banked transfers, no chip</h2>
      <p className="text-neutral-800 leading-relaxed">
        In {gwLink(31)} the optimiser had {gw31.freeTransfersAvailable} free transfers, used{' '}
        {gw31.transfers}, and did not take a hit. {gw31.withoutFixture.length} of {gw31.squadSize}{' '}
        players had no fixture. It scored {gw31.optimiserPoints} net. The template scored{' '}
        {gw31.templatePoints}. Wildcard was not played. The banked transfers covered that blank
        without a chip.
      </p>
      <p className="text-sm text-neutral-600">
        Source: data/seasons/2025-26/gw-31.json.{' '}
        <Link href={REPLAY_DOWNLOAD_PATH} className="underline underline-offset-2">
          Download the season file
        </Link>
        .
      </p>
    </section>
  );
}

export function ChipReplayCards({ chip }: { chip: Exclude<ChipType, 'none'> }) {
  const digest = getReplayDigest();
  if (chip === 'fh') return <FreeHitCard digest={digest} />;
  if (chip === 'tc') return <TripleCaptainCard digest={digest} />;
  if (chip === 'bb') return <BenchBoostCard digest={digest} />;
  return <WildcardCard digest={digest} />;
}

export function blankWeeksFaqAnswer(): string {
  const digest = getReplayDigest();
  const byGw = new Map(digest.blanks.map((week) => [week.gw, week]));
  const gw34 = byGw.get(34);
  const gw31 = byGw.get(31);
  if (!gw34 || !gw31) {
    return 'The 2025/26 replay did not play Free Hit. See the blank-week card for the squad file.';
  }
  const freeTransfers = (count: number) =>
    `${count} free ${count === 1 ? 'transfer' : 'transfers'}`;
  const gw31Hit = gw31.hitCost === 0 ? 'there was no hit' : `it took a ${gw31.hitCost}-point hit`;
  return `In GW34 the optimiser had ${gw34.withoutFixture.length} of ${gw34.squadSize} players without a fixture, made ${gw34.transfers} transfers on ${freeTransfers(gw34.freeTransfersAvailable)}, took a ${gw34.hitCost}-point hit and scored ${gw34.optimiserPoints} net. The template scored ${gw34.templatePoints}. In GW31, ${gw31.withoutFixture.length} of ${gw31.squadSize} had no fixture, ${freeTransfers(gw31.freeTransfersAvailable)} were available, ${gw31.transfers} were used, ${gw31Hit}, and the optimiser scored ${gw31.optimiserPoints}. Free Hit was not played in either week.`;
}
