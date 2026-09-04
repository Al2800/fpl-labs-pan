import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getChipScenario, getAllGameweeks, getGameweekDecision } from '@/lib/data';
import { ChipType } from '@/types/fpl';
import { ProvenanceCard } from '@/components/ProvenanceCard';
import { JsonLd } from '@/components/JsonLd';
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    chip: string;
    n: string;
  }>;
}

const VALID_CHIPS: ChipType[] = ['tc', 'bb', 'fh', 'wc'];

export async function generateStaticParams() {
  const gws = getAllGameweeks();
  const paramsList: Array<{ chip: string; n: string }> = [];

  for (const chip of VALID_CHIPS) {
    for (const gw of gws) {
      paramsList.push({
        chip,
        n: gw.gw.toString(),
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chip, n } = await params;
  const gwNum = parseInt(n, 10);

  if (!VALID_CHIPS.includes(chip as ChipType)) {
    return {
      title: 'Chip Scenario Not Found',
    };
  }

  const chipData = getChipScenario(chip as ChipType, gwNum);
  if (!chipData) {
    return {
      title: 'Chip Scenario Not Found',
    };
  }

  return {
    title: `${chipData.chipName} GW${gwNum} Optimization Horizon | FPL Labs Pan`,
    description: `Template C Chip Solver for ${chipData.chipName} in GW${gwNum}. Projected immediate net gain: ${chipData.projectedGainXP.toFixed(1)} xP. Opportunity cost evaluation across 38 gameweek horizon.`,
  };
}

export default async function ChipScenarioPage({ params }: PageProps) {
  const { chip, n } = await params;
  const gwNum = parseInt(n, 10);

  if (!VALID_CHIPS.includes(chip as ChipType)) {
    notFound();
  }

  const chipData = getChipScenario(chip as ChipType, gwNum);
  const gwDecision = getGameweekDecision(gwNum);

  if (!chipData) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recommended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OPTIMAL DEPLOYMENT WINDOW</span>
          </span>
        );
      case 'preserve':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>PRESERVE FOR DGW WINDOW</span>
          </span>
        );
      case 'suboptimal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SUBOPTIMAL OPPORTUNITY COST</span>
          </span>
        );
      case 'viable':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIABLE ALTERNATIVE</span>
          </span>
        );
    }
  };

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
        name: 'Chips',
        item: 'https://fpl-labs-pan.vercel.app/chips/tc/gw/3',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${chipData.chipName} GW${gwNum}`,
        item: `https://fpl-labs-pan.vercel.app/chips/${chip}/gw/${gwNum}`,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={`/decisions/gw/${gwNum}`} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>GW{gwNum} Decision Replay</span>
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-mono font-medium">{chipData.chipName}</span>
          <span>/</span>
          <span className="text-slate-400 font-mono">GW{gwNum}</span>
        </div>

        {/* Chip Switcher Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Link
            href={`/chips/tc/gw/${gwNum}`}
            className={`px-2.5 py-1 rounded border transition-colors ${
              chip === 'tc' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            TC (Triple Cap)
          </Link>
          <Link
            href={`/chips/bb/gw/${gwNum}`}
            className={`px-2.5 py-1 rounded border transition-colors ${
              chip === 'bb' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            BB (Bench Boost)
          </Link>
          <Link
            href={`/chips/fh/gw/${gwNum}`}
            className={`px-2.5 py-1 rounded border transition-colors ${
              chip === 'fh' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            FH (Free Hit)
          </Link>
          <Link
            href={`/chips/wc/gw/${gwNum}`}
            className={`px-2.5 py-1 rounded border transition-colors ${
              chip === 'wc' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            WC (Wildcard)
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
            TEMPLATE C ARTEFACT
          </span>
          {getStatusBadge(chipData.status)}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {chipData.chipName} Deployment Horizon: Gameweek {gwNum}
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {chipData.headline}
        </p>
      </div>

      {/* Provenance Card */}
      {gwDecision && (
        <ProvenanceCard
          provenance={gwDecision.provenance}
          gw={gwNum}
          season={gwDecision.season}
        />
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400 font-mono">GW{gwNum} Projected Immediate Gain</div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            +{chipData.projectedGainXP.toFixed(1)} <span className="text-xs text-slate-400 font-normal">xP</span>
          </div>
          <div className="text-[11px] text-slate-500">Net delta over baseline plan this round</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400 font-mono">Historical Benchmark Value</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            +{chipData.historicalAverageGain.toFixed(1)} <span className="text-xs text-slate-400 font-normal">xP</span>
          </div>
          <div className="text-[11px] text-slate-500">Historical average in optimal DGW windows</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400 font-mono">Net Opportunity Cost</div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {(chipData.projectedGainXP - chipData.historicalAverageGain).toFixed(1)} <span className="text-xs text-slate-400 font-normal">xP</span>
          </div>
          <div className="text-[11px] text-slate-500">Expected points surrendered by burning today</div>
        </div>
      </div>

      {/* Opportunity Cost Assessment */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300">
          Opportunity Cost & Strategy Assessment
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {chipData.summary}
        </p>
        <p className="text-xs text-slate-400 italic">
          {chipData.opportunityCostAssessment}
        </p>
      </section>

      {/* Sample Solver Table (Core Template C Requirement) */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Chip Deployment Horizon Solver Matrix</span>
              <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Sample Solver Table
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated net point deltas if {chipData.chipName} is executed in each respective gameweek window.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Gameweek Window</th>
                <th className="py-3 px-4">Fixture / Slate Context</th>
                <th className="py-3 px-4 text-center">DGW Status</th>
                <th className="py-3 px-4 text-right">Chip EV</th>
                <th className="py-3 px-4 text-right">Baseline EV</th>
                <th className="py-3 px-4 text-right">Net Value Delta</th>
                <th className="py-3 px-4 text-center">Solver Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {chipData.windowAnalysis.map((row, idx) => {
                const isCurrent = row.gw === gwNum;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCurrent
                        ? 'bg-amber-950/20'
                        : row.isRecommendedWindow
                        ? 'bg-emerald-950/20'
                        : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>GW{row.gw}</span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                            Current Round
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                      {row.opponentContext}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.dgwStatus ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                          DOUBLE GW
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Single GW</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-200">
                      {row.projectedChipEV.toFixed(1)} xP
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-400">
                      {row.projectedBaselineEV.toFixed(1)} xP
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <span className="text-sm font-bold text-emerald-400">
                        +{row.netDelta.toFixed(1)} xP
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans">
                      {row.isRecommendedWindow ? (
                        <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
                          ★ Recommended Target
                        </span>
                      ) : isCurrent ? (
                        <span className="text-slate-400 text-xs">Hold / Preserve</span>
                      ) : (
                        <span className="text-slate-500 text-xs">Sub-optimal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Target Roster Sample under this Chip */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Optimal Squad Core under {chipData.chipName}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key personnel prioritized by the integer programming formulation when {chipData.chipName} is active.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {chipData.optimalRosterSample.map((player) => (
            <div
              key={player.id}
              className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">{player.webName}</span>
                <span className="font-mono text-[10px] text-slate-400">£{player.cost.toFixed(1)}m</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {player.team} • {player.position} vs {player.opponent}
              </div>
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between font-mono">
                <span className="text-slate-500 text-[10px]">Proj xP</span>
                <span className="text-emerald-400 font-bold">
                  {player.expectedPoints.toFixed(2)} xP
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Back Links */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
        <Link
          href={`/decisions/gw/${gwNum}`}
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to GW{gwNum} Decision Replay</span>
        </Link>
        <Link
          href="/methods"
          className="text-slate-400 hover:text-white flex items-center gap-1"
        >
          <span>Review Mathematical Formulations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
