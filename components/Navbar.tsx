import Link from 'next/link';
import { FlaskConical, Layers, Cpu, ShieldCheck, ExternalLink } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-base group-hover:text-emerald-400 transition-colors">
                  FPL Labs Pan
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold">
                  v2.4
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Entity × Time Decision Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <Link
            href="/decisions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Decisions</span>
          </Link>
          <Link
            href="/chips/tc/gw/3"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Chips</span>
          </Link>
          <Link
            href="/sims"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>Sims</span>
          </Link>
          <Link
            href="/methods"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span>Methods</span>
          </Link>
          <Link
            href="/about"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span>About</span>
          </Link>
        </nav>

        {/* External / Status Callout */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/decisions/gw/3"
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>GW3 LIVE PLAN</span>
          </Link>
          <a
            href="https://x.com/FPLabsPan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            <span>@FPLabsPan</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
