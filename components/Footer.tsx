import Link from 'next/link';
import { getAllGameweeks, getLatestGameweekDecision } from '@/lib/data';
import { CHIP_IDS, CHIP_LABELS, chipPath, gameweekPath } from '@/lib/present';

export function Footer() {
  const gameweeks = getAllGameweeks();
  const latest = getLatestGameweekDecision();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-sm text-neutral-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">FPL Labs Pan</div>
            <p>
              Frozen FPL gameweek teams, captains, transfers and chip timing. Each plan is locked
              two hours before the deadline.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">Gameweeks</div>
            <ul className="space-y-1">
              {[...gameweeks].reverse().map((gw) => (
                <li key={gw.gw}>
                  <Link href={gameweekPath(gw.gw)} className="hover:underline">
                    GW{gw.gw}
                    {gw.validatedPlan.realisedSquadTotalPoints !== null
                      ? ` · ${gw.validatedPlan.realisedSquadTotalPoints} pts`
                      : ' · Live'}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/decisions" className="hover:underline">
                  All gameweeks
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">Chips</div>
            <ul className="space-y-1">
              {CHIP_IDS.map((chip) => (
                <li key={chip}>
                  <Link href={chipPath(chip, latest.gw)} className="hover:underline">
                    {CHIP_LABELS[chip]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-neutral-900">Lab</div>
            <ul className="space-y-1">
              <li>
                <Link href="/sims" className="hover:underline">
                  What-ifs
                </Link>
              </li>
              <li>
                <Link href="/methods" className="hover:underline">
                  Methods
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
          FPL Labs Pan is independent and is not affiliated with, sponsored by, or endorsed by the
          Football Association Premier League Ltd, Fantasy Premier League, or any Premier League
          club. Outputs are for research and entertainment — not financial, gambling, or betting
          advice.
        </p>
      </div>
    </footer>
  );
}
