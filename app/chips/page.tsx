import Link from 'next/link';
import { Metadata } from 'next';
import { CHIP_HUB_CONTENT } from '@/lib/content/chips';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, chipHubPath } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL chips: Triple Captain, Bench Boost, Free Hit, Wildcard',
  description:
    'When to play FPL chips. The 2025/26 reconstructive replay never used one, including an 8-point hit in the Gameweek 34 blank.',
};

export default function ChipsIndexPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Chips', path: '/chips' },
        ])}
      />
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          FPL chips
        </h1>
        <p className="text-neutral-800 leading-relaxed max-w-3xl">
          Triple Captain, Bench Boost, Free Hit and Wildcard are the four season chips. Play them
          when minutes and the calendar justify it. The 2025/26 reconstructive path played none of
          them — including Gameweek 34, when the optimiser took an 8-point hit in a blank instead of
          Free Hit or Wildcard.
        </p>
      </header>
      <ul className="space-y-4">
        {CHIP_HUB_CONTENT.map((chip) => (
          <li key={chip.id} className="border border-neutral-200 bg-white p-5 space-y-2">
            <h2 className="text-lg font-semibold">
              <Link href={chipHubPath(chip.slug)} className="underline underline-offset-2">
                {chip.name}
              </Link>
            </h2>
            <p className="text-neutral-800">{chip.oneLiner}</p>
            <p className="text-sm text-neutral-600">{chip.replay2025}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm">
        <Link href="/guides/when-to-play-fpl-chips" className="underline underline-offset-2">
          When to play chips
        </Link>
        {' · '}
        <Link href="/guides/gw34-blank-and-hits" className="underline underline-offset-2">
          Gameweek 34 hit
        </Link>
      </p>
    </div>
  );
}
