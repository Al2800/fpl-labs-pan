import { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/present';

export const metadata: Metadata = {
  title: 'About',
  description:
    'FPL Replay publishes frozen FPL gameweek teams, captains and chip timing. Independent, not affiliated with the Premier League or FPL.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">About FPL Replay</h1>
        <p className="text-neutral-700 leading-relaxed">
          A public record of FPL decisions that can be checked: the team, the captain, the
          transfers, and whether a chip was worth playing, all frozen before the deadline.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What this is</h2>
        <p className="text-neutral-800 leading-relaxed">
          Personal notes live elsewhere. This site is the product: one page per gameweek, chip
          timing against a 38-week window, and what-ifs that change one decision at a time. It is
          not a player-by-player points table, and it is not a tip blog.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-neutral-800">
          <li>
            Gameweek pages compare a template, an optimiser, and an evidence approach on the same
            cutoff. 2025/26 is a reconstructive replay; 2026/27 pages are an illustrative sample.
          </li>
          <li>
            Chip hubs say when Triple Captain, Bench Boost, Free Hit or Wildcard is worth playing.
            That reconstructive path never used a chip.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How it differs</h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-800">
          <li>
            Plans that are live will lock two hours before the deadline and be hashed. 2025/26
            pages are reconstructive and labelled as such.
          </li>
          <li>There is no first-person diary or “due a haul” language.</li>
          <li>
            Claims sit next to a downloadable snapshot. See{' '}
            <Link href="/methods" className="underline underline-offset-2">
              Methods
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-neutral-800">
          Freeze notes and round reviews:{' '}
          <a
            href="https://x.com/FPLabsPan"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            @FPLabsPan
          </a>
          .
        </p>
      </section>

      <section className="space-y-2 text-sm text-neutral-600">
        <h2 className="text-lg font-semibold text-neutral-900">Disclaimer</h2>
        <p>
          FPL Replay is independent. It is not affiliated with, sponsored by, or endorsed by the
          Football Association Premier League Ltd, Fantasy Premier League, or any Premier League
          club. Trademarks remain with their owners.
        </p>
        <p>
          Content is for research and entertainment. It is not financial, gambling, betting, or
          investment advice.
        </p>
      </section>
    </div>
  );
}
