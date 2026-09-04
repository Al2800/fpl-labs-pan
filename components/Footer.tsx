import Link from 'next/link';
import { Shield, GitCommit, FileCode2, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#080c14] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Lab Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 tracking-tight text-base">
                FPL Labs Pan
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                PROD-READY
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Entity × time data product generating pre-deadline frozen policy arms, mixed-integer solver replays, and chip horizon scenarios for Fantasy Premier League.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <GitCommit className="w-3.5 h-3.5 text-slate-400" />
              <span>Pipeline: v2.4.1 (SHA-256 Verified)</span>
            </div>
          </div>

          {/* Column 2: Decision Replays */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Decisions & Policy Arms
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/decisions/gw/3" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>GW3: West Ham (A) Allocation</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1 rounded">LIVE</span>
                </Link>
              </li>
              <li>
                <Link href="/decisions/gw/2" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>GW2: Ipswich (H) Target</span>
                  <span className="text-[10px] font-mono text-slate-500">98 PTS</span>
                </Link>
              </li>
              <li>
                <Link href="/decisions/gw/1" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>GW1: Opening Squad Allocation</span>
                  <span className="text-[10px] font-mono text-slate-500">74 PTS</span>
                </Link>
              </li>
              <li>
                <Link href="/decisions" className="text-emerald-400 hover:underline">
                  Browse All Gameweeks →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chip Solver Scenarios */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Chip Horizon Solvers
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/chips/tc/gw/3" className="hover:text-cyan-400 transition-colors">
                  Triple Captain (TC) Horizon
                </Link>
              </li>
              <li>
                <Link href="/chips/bb/gw/3" className="hover:text-cyan-400 transition-colors">
                  Bench Boost (BB) Evaluation
                </Link>
              </li>
              <li>
                <Link href="/chips/fh/gw/3" className="hover:text-cyan-400 transition-colors">
                  Free Hit (FH) Variance Simulation
                </Link>
              </li>
              <li>
                <Link href="/chips/wc/gw/3" className="hover:text-cyan-400 transition-colors">
                  Wildcard (WC) Squad Restructure
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Laboratory Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Verification & Lab
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/methods" className="hover:text-violet-400 transition-colors">
                  Methodology & Mathematical Formulation
                </Link>
              </li>
              <li>
                <Link href="/methods#calibration" className="hover:text-violet-400 transition-colors">
                  Position Calibration (RMSE & MAE)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-violet-400 transition-colors">
                  About the Lab & Neutral Thesis
                </Link>
              </li>
              <li>
                <a
                  href="https://x.com/FPLabsPan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <span>X: @FPLabsPan</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Neutrality Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 text-xs text-slate-500 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500/80 shrink-0" />
              <span>
                <strong>Cryptographic Freeze Protocol:</strong> Every policy arm decision is mathematically resolved and locked with a SHA-256 fingerprint at T-120 minutes prior to the official FPL deadline. No retroactive model alterations.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/sitemap.xml" className="text-slate-400 hover:underline flex items-center gap-1">
                <FileCode2 className="w-3 h-3" />
                <span>Sitemap</span>
              </Link>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            <strong>Disclaimer:</strong> FPL Labs Pan is an independent open statistical decision intelligence project. This service is not affiliated with, sponsored by, or endorsed by the Football Association Premier League Ltd, Fantasy Premier League, or any Premier League club. All trademarks and club insignias remain the property of their respective owners. Statistical outputs and policy recommendations are strictly for research, benchmarking, and entertainment purposes — not financial, gambling, or betting advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
