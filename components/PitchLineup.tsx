import { PlayerSelection, ValidatedPlan } from '@/types/fpl';

interface PitchLineupProps {
  plan: ValidatedPlan;
}

function PlayerCard({ player }: { player: PlayerSelection }) {
  const isCap = player.isCaptain;
  const isVC = player.isViceCaptain;
  const realised =
    player.realisedPoints === null
      ? '—'
      : String(player.realisedPoints * (isCap ? player.multiplier || 2 : 1));

  return (
    <div className="border border-neutral-200 bg-white p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium">{player.webName}</div>
          <div className="text-neutral-600">
            {player.team} · {player.position}
          </div>
        </div>
        <div className="text-right text-neutral-600">
          <div>£{player.cost.toFixed(1)}m</div>
          {isCap ? <div>Captain</div> : null}
          {isVC ? <div>Vice</div> : null}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-neutral-600">
        <span>{player.opponent}</span>
        <span>FDR {player.fixtureDifficulty}</span>
      </div>
      <div className="mt-2 flex justify-between tabular-nums">
        <span>xP {player.expectedPoints.toFixed(1)}</span>
        <span>Pts {realised}</span>
      </div>
    </div>
  );
}

export function PitchLineup({ plan }: PitchLineupProps) {
  const gkp = plan.startingXI.filter((player) => player.position === 'GKP');
  const def = plan.startingXI.filter((player) => player.position === 'DEF');
  const mid = plan.startingXI.filter((player) => player.position === 'MID');
  const fwd = plan.startingXI.filter((player) => player.position === 'FWD');

  return (
    <div className="space-y-6">
      <div className="border border-neutral-200 bg-white p-4 space-y-4">
        <p className="text-sm text-neutral-600">
          Formation {plan.formation}. Bank £{plan.bank.toFixed(1)}m remaining.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Goalkeeper</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-sm">
              {gkp.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Defenders ({def.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {def.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Midfielders ({mid.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {mid.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Forwards ({fwd.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {fwd.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Bench (auto-sub order)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {plan.bench.map((player) => (
            <div key={player.id}>
              <div className="text-xs text-neutral-500 mb-1">Sub #{player.benchOrder}</div>
              <PlayerCard player={player} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
