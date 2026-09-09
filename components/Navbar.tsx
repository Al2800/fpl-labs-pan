import Link from 'next/link';
import { getFeaturedGameweek } from '@/lib/data';
import { gameweekPath, statusLabel } from '@/lib/present';

export function Navbar() {
  const latest = getFeaturedGameweek();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <span className="font-semibold tracking-tight">FPL Replay</span>
          <span className="hidden sm:inline text-sm text-neutral-500 ml-2">
            Checkable FPL decisions
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/seasons" className="hover:underline">
            Decisions
          </Link>
          <Link href="/chips" className="hover:underline">
            Chips
          </Link>
          <Link href="/guides" className="hover:underline">
            Guides
          </Link>
          <Link href="/methods" className="hidden sm:inline hover:underline">
            Methods
          </Link>
          <Link
            href={gameweekPath(latest.season, latest.gw)}
            className="hidden md:inline text-neutral-600"
          >
            GW{latest.gw} · {statusLabel(latest.status)}
          </Link>
        </nav>
      </div>
    </header>
  );
}
