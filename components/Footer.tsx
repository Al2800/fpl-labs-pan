import Link from 'next/link';
import { getFeaturedGameweek, getSeasonIndex } from '@/lib/data';
import { CHIP_HUBS, chipHubPath, gameweekPath, seasonPath } from '@/lib/present';

export function Footer() {
  const latest = getFeaturedGameweek();
  const live = getSeasonIndex('2026-27');
  const recent = live ? [...live.rows].reverse().slice(0, 5) : [];

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-sm text-neutral-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">FPL Replay</div>
            <p>
              Checkable FPL gameweek teams, captains, transfers and chip timing. 2026/27 is the
              current season. 2025/26 stays up as a settled reconstructive replay.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">2026/27</div>
            <ul className="space-y-1">
              <li>
                <Link href={gameweekPath(latest.season, latest.gw)} className="hover:underline">
                  Latest: GW{latest.gw}
                </Link>
              </li>
              {recent.map((row) => (
                <li key={row.gw}>
                  <Link href={gameweekPath('2026-27', row.gw)} className="hover:underline">
                    GW{row.gw}
                    {row.points !== null ? ` · ${row.points} pts` : ' · pending'}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={seasonPath('2026-27')} className="hover:underline">
                  2026/27 season
                </Link>
              </li>
              <li>
                <Link href="/seasons/2026-27/download" className="hover:underline">
                  Download 2026/27
                </Link>
              </li>
              <li>
                <Link href={seasonPath('2025-26')} className="hover:underline">
                  2025/26 replay
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">Chips</div>
            <ul className="space-y-1">
              {CHIP_HUBS.map((chip) => (
                <li key={chip.id}>
                  <Link href={chipHubPath(chip.slug)} className="hover:underline">
                    {chip.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">Lab</div>
            <ul className="space-y-1">
              <li>
                <Link href="/guides" className="hover:underline">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:underline">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/methods" className="hover:underline">
                  Methods
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" className="hover:underline">
                  llms.txt
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://x.com/FPLabsPan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @FPLabsPan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          FPL Replay is independent and is not affiliated with, sponsored by, or endorsed by the
          Football Association Premier League Ltd, Fantasy Premier League, or any Premier League
          club. Outputs are for research and entertainment, not financial, gambling, or betting
          advice.
        </p>
      </div>
    </footer>
  );
}
