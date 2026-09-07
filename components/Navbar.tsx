import Link from 'next/link';
import { getLatestGameweekDecision } from '@/lib/data';
import { chipPath, gameweekPath, statusLabel } from '@/lib/present';

export function Navbar() {
  const latest = getLatestGameweekDecision();
  const latestLabel = latest.status === 'live' ? `GW${latest.gw} live` : `GW${latest.gw}`;

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <span className="font-semibold tracking-tight">FPL Labs Pan</span>
          <span className="hidden sm:inline text-sm text-neutral-500 ml-2">
            Pre-deadline FPL decisions
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/decisions" className="hover:underline">
            Decisions
          </Link>
          <Link href={chipPath('tc', latest.gw)} className="hover:underline">
            Chips
          </Link>
          <Link href="/sims" className="hover:underline">
            What-ifs
          </Link>
          <Link href="/methods" className="hover:underline">
            Methods
          </Link>
          <Link href="/about" className="hidden sm:inline hover:underline">
            About
          </Link>
          <Link
            href={gameweekPath(latest.gw)}
            className="hidden md:inline text-neutral-600"
          >
            {latestLabel}
            {latest.status === 'live' ? ` · ${statusLabel(latest.status)}` : ''}
          </Link>
        </nav>
      </div>
    </header>
  );
}
