import React from 'react';
import { PlayerSelection, ValidatedPlan } from '@/types/fpl';

interface PitchLineupProps {
  plan: ValidatedPlan;
}

export function PitchLineup({ plan }: PitchLineupProps) {
  const gkp = plan.startingXI.filter((p) => p.position === 'GKP');
  const def = plan.startingXI.filter((p) => p.position === 'DEF');
  const mid = plan.startingXI.filter((p) => p.position === 'MID');
  const fwd = plan.startingXI.filter((p) => p.position === 'FWD');

  const getFdrColor = (fdr: number) => {
    switch (fdr) {
      case 1:
      case 2:
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
      case 3:
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 4:
        return 'bg-amber-950 text-amber-300 border-amber-500/30';
      case 5:
        return 'bg-rose-950 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const renderPlayerCard = (player: PlayerSelection) => {
    const isCap = player.isCaptain;
    const isVC = player.isViceCaptain;

    return (
      <div
        key={player.id}
        className={`relative flex flex-col justify-between p-2.5 rounded-lg border transition-all text-xs ${
          isCap
            ? 'bg-amber-950/20 border-amber-500/50 shadow-sm shadow-amber-500/10'
            : isVC
            ? 'bg-cyan-950/20 border-cyan-500/40'
            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Armband Badges */}
        {isCap && (
          <div className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[10px] shadow">
            C (2x)
          </div>
        )}
        {isVC && (
          <div className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded bg-cyan-600 text-slate-100 font-bold text-[10px]">
            VC
          </div>
        )}

        {/* Player Name and Team */}
        <div className="mb-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="font-semibold text-slate-100 truncate text-[13px]">
              {player.webName}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              £{player.cost.toFixed(1)}m
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-mono font-medium text-slate-300">{player.team}</span>
            <span>•</span>
            <span>{player.position}</span>
          </div>
        </div>

        {/* Matchup and FDR */}
        <div className="flex items-center justify-between text-[11px] py-1 border-t border-slate-800/80 mb-1.5">
          <span className="text-slate-300 font-mono truncate" title={player.opponent}>
            {player.opponent}
          </span>
          <span
            className={`text-[9px] font-mono px-1 py-0.2 rounded border ${getFdrColor(
              player.fixtureDifficulty
            )}`}
          >
            FDR {player.fixtureDifficulty}
          </span>
        </div>

        {/* Expected vs Realised */}
        <div className="flex items-center justify-between text-[11px] font-mono bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
          <div>
            <span className="text-[10px] text-slate-500 block leading-none">Proj</span>
            <span className="font-semibold text-slate-200">
              {player.expectedPoints.toFixed(1)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block leading-none">Real</span>
            {player.realisedPoints !== null ? (
              <span className="font-bold text-emerald-400">
                {player.realisedPoints * (isCap ? 2 : 1)}
              </span>
            ) : (
              <span className="text-amber-400/80 text-[10px]">—</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Starting XI Pitch Area */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100">
                Starting XI Tactical Roster
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Formation {plan.formation}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimiser-selected roster satisfying cardinality, budget (£{plan.bank.toFixed(1)}m bank remaining), and club caps.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500">Projected:</span>{' '}
              <span className="text-slate-200 font-bold">{plan.projectedSquadTotalXP.toFixed(1)} xP</span>
            </div>
            <div>
              <span className="text-slate-500">Realised:</span>{' '}
              {plan.realisedSquadTotalPoints !== null ? (
                <span className="text-emerald-400 font-bold">{plan.realisedSquadTotalPoints} pts</span>
              ) : (
                <span className="text-amber-400 font-medium">Pending</span>
              )}
            </div>
          </div>
        </div>

        {/* Lines */}
        <div className="space-y-4">
          {/* Goalkeeper */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <span>Goalkeeper</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-sm">
              {gkp.map((p) => renderPlayerCard(p))}
            </div>
          </div>

          {/* Defenders */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
              Defenders ({def.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {def.map((p) => renderPlayerCard(p))}
            </div>
          </div>

          {/* Midfielders */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
              Midfielders ({mid.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {mid.map((p) => renderPlayerCard(p))}
            </div>
          </div>

          {/* Forwards */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
              Forwards ({fwd.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {fwd.map((p) => renderPlayerCard(p))}
            </div>
          </div>
        </div>
      </div>

      {/* Bench Strip */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/60">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
            Substitutes & Auto-Sub Priority
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Bench Order 1 → 4
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {plan.bench.map((player) => (
            <div key={player.id} className="relative">
              <div className="absolute -top-2 left-2 z-10 font-mono text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                Sub #{player.benchOrder}
              </div>
              {renderPlayerCard(player)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
