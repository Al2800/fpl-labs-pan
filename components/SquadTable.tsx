import { PlayerSelection, ValidatedPlan } from '@/types/fpl';

interface SquadTableProps {
  plan: ValidatedPlan;
}

function roleLabel(player: PlayerSelection, benchOrder?: number): string {
  if (player.isCaptain) return 'Captain';
  if (player.isViceCaptain) return 'Vice-captain';
  if (typeof benchOrder === 'number') return `Sub #${benchOrder}`;
  return '—';
}

function pointsFor(player: PlayerSelection): string {
  if (player.realisedPoints === null) return '—';
  const multiplier = player.isCaptain ? player.multiplier || 2 : 1;
  return String(player.realisedPoints * multiplier);
}

function PlayerRow({
  player,
  benchOrder,
}: {
  player: PlayerSelection;
  benchOrder?: number;
}) {
  return (
    <tr>
      <td className="py-2 px-3">{player.position}</td>
      <td className="py-2 px-3 font-medium">{player.webName}</td>
      <td className="py-2 px-3">{player.team}</td>
      <td className="py-2 px-3">{player.opponent}</td>
      <td className="py-2 px-3 tabular-nums">{player.fixtureDifficulty}</td>
      <td className="py-2 px-3 tabular-nums">{player.cost.toFixed(1)}</td>
      <td className="py-2 px-3 tabular-nums">{player.expectedPoints.toFixed(1)}</td>
      <td className="py-2 px-3 tabular-nums">{pointsFor(player)}</td>
      <td className="py-2 px-3">{roleLabel(player, benchOrder)}</td>
    </tr>
  );
}

export function SquadTable({ plan }: SquadTableProps) {
  return (
    <div className="overflow-x-auto border border-neutral-200 bg-white">
      <table className="w-full text-sm text-left">
        <caption className="sr-only">Starting XI and bench with projected and realised points</caption>
        <thead className="bg-neutral-100 text-neutral-600">
          <tr>
            <th scope="col" className="py-2 px-3 font-medium">
              Pos
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              Player
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              Club
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              Fixture
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              FDR
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              £m
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              xP
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              Pts
            </th>
            <th scope="col" className="py-2 px-3 font-medium">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.startingXI.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
          <tr>
            <th
              scope="colgroup"
              colSpan={9}
              className="py-2 px-3 bg-neutral-50 font-medium text-neutral-700"
            >
              Bench
            </th>
          </tr>
          {plan.bench.map((player) => (
            <PlayerRow key={player.id} player={player} benchOrder={player.benchOrder} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
