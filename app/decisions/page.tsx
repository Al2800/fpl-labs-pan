import Link from 'next/link';
import { Metadata } from 'next';
import { getAllGameweeks } from '@/lib/data';
import { Layers, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Gameweek Decisions Index | Policy Arms Archive',
  description:
    'Comprehensive archive of pre-deadline frozen FPL gameweek decisions, policy arms comparison, and realised performance across the 2026/27 campaign.',
};

export default function DecisionsIndexPage() {
  const gameweeks = getAllGameweeks();

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fpl-labs-pan.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Decisions',
        item: 'https://fpl-labs-pan.vercel.app/decisions',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Entity × Time Archival</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Gameweek Decisions & Policy Arms Archive
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Permanent records of all pre-deadline frozen lineups, transfer decisions, and parallel policy arms. No retroactive revisions: every entry is hashed and locked at T-120min.
        </p>
      </div>

      {/* Season Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium">Cataloged Gameweeks</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
            {gameweeks.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">2026/27 Season (Sample)</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium">Optimiser Mean Delta</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            +3.7 xP
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Vs Template Baseline</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium">Realised Total (GW1–2)</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            172 pts
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Top 3.2% Overall Rank</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium">Freeze Integrity</div>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>100%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">SHA-256 Anchored</div>
        </div>
      </div>

      {/* Gameweeks Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-slate-100">
            Gameweek Index (Season 2026/27)
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Sorted Newest First
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Gameweek</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Plan Summary</th>
                <th className="py-3 px-4">Captain</th>
                <th className="py-3 px-4 text-right">Projected xP</th>
                <th className="py-3 px-4 text-right">Realised Pts</th>
                <th className="py-3 px-4">Snapshot Digest</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {gameweeks
                .slice()
                .reverse()
                .map((gw) => {
                  const isLive = gw.status === 'live';

                  return (
                    <tr
                      key={gw.gw}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Gameweek */}
                      <td className="py-4 px-4 font-sans">
                        <Link
                          href={`/decisions/gw/${gw.gw}`}
                          className="font-bold text-slate-100 hover:text-emerald-400 text-sm block"
                        >
                          GW{gw.gw}
                        </Link>
                        <span className="text-[11px] text-slate-400 block truncate max-w-xs font-normal">
                          {gw.title}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>Live / Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        )}
                      </td>

                      {/* Plan Summary */}
                      <td className="py-4 px-4 text-slate-300 font-sans">
                        <div className="font-mono text-xs text-slate-200">
                          {gw.validatedPlan.formation} • Bank £{gw.validatedPlan.bank.toFixed(1)}m
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {gw.validatedPlan.transfersIn.length > 0 ? (
                            <span>{gw.validatedPlan.transfersIn.map((t) => t.webName).join(', ')} In</span>
                          ) : (
                            <span>0 Transfers (Hold / Init)</span>
                          )}
                        </div>
                      </td>

                      {/* Captain */}
                      <td className="py-4 px-4 text-slate-200">
                        <span className="font-semibold text-slate-100">
                          {gw.validatedPlan.captain.webName}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          (VC: {gw.validatedPlan.viceCaptain.webName})
                        </span>
                      </td>

                      {/* Projected xP */}
                      <td className="py-4 px-4 text-right tabular-nums">
                        <span className="font-bold text-slate-100">
                          {gw.validatedPlan.projectedSquadTotalXP.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">xP</span>
                      </td>

                      {/* Realised Pts */}
                      <td className="py-4 px-4 text-right tabular-nums">
                        {gw.validatedPlan.realisedSquadTotalPoints !== null ? (
                          <span className="font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            {gw.validatedPlan.realisedSquadTotalPoints} pts
                          </span>
                        ) : (
                          <span className="text-amber-400/80 italic font-sans text-[11px]">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Snapshot Digest */}
                      <td className="py-4 px-4 text-slate-400">
                        <span
                          className="font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800"
                          title={gw.provenance.snapshotHash}
                        >
                          {gw.provenance.snapshotHash.substring(0, 16)}…
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/decisions/gw/${gw.gw}`}
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-sans font-medium px-2 py-1 rounded hover:bg-slate-800"
                        >
                          <span>Template D</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
