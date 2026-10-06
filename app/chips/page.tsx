import Link from 'next/link';
import { Metadata } from 'next';
import { CHIP_HUB_CONTENT, CHIPS_INDEX_FAQS, type ChipIndexFaq } from '@/lib/content/chips';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, chipHubPath, faqPage } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL Chips: Triple Captain, Bench Boost, Free Hit, Wildcard',
  description:
    'Eight FPL chips in 2026/27: two each of Triple Captain, Bench Boost, Free Hit and Wildcard. The first set expires at the GW19 deadline on 2 Jan 2027.',
  alternates: {
    canonical: '/chips',
  },
  openGraph: {
    title: 'FPL Chips: Triple Captain, Bench Boost, Free Hit, Wildcard',
    description:
      'Eight FPL chips in 2026/27: two each of Triple Captain, Bench Boost, Free Hit and Wildcard. The first set expires at the GW19 deadline on 2 Jan 2027.',
    url: '/chips',
  },
};

function FaqAnswer({ faq }: { faq: ChipIndexFaq }) {
  const links = [...(faq.links ?? [])].sort((a, b) => b.label.length - a.label.length);
  if (links.length === 0) {
    return <p className="text-neutral-800 leading-relaxed">{faq.a}</p>;
  }

  const parts: Array<string | { href: string; label: string }> = [];
  let rest = faq.a;

  while (rest.length > 0) {
    let best: { index: number; link: (typeof links)[number] } | null = null;
    for (const link of links) {
      const index = rest.indexOf(link.label);
      if (index === -1) continue;
      if (
        !best ||
        index < best.index ||
        (index === best.index && link.label.length > best.link.label.length)
      ) {
        best = { index, link };
      }
    }
    if (!best) {
      parts.push(rest);
      break;
    }
    if (best.index > 0) parts.push(rest.slice(0, best.index));
    parts.push(best.link);
    const used = links.indexOf(best.link);
    if (used >= 0) links.splice(used, 1);
    rest = rest.slice(best.index + best.link.label.length);
  }

  return (
    <p className="text-neutral-800 leading-relaxed">
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          <Link key={`${part.href}-${index}`} href={part.href} className="underline underline-offset-2">
            {part.label}
          </Link>
        )
      )}
    </p>
  );
}

export default function ChipsIndexPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Chips', path: '/chips' },
          ]),
          faqPage(CHIPS_INDEX_FAQS),
        ]}
      />
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          FPL chips: Triple Captain, Bench Boost, Free Hit and Wildcard
        </h1>
        <p className="text-neutral-800 leading-relaxed max-w-3xl">
          FPL chips are Triple Captain, Bench Boost, Free Hit and Wildcard. In 2026/27 you get two of each, eight in
          total, and only one chip in a gameweek. The first set has to be used by the Gameweek 19 deadline, 13:30 GMT
          on Saturday 2 January 2027. It does not carry over. A new set is there from Gameweek 20. In the 2025/26
          replay, all four were left unused, including Gameweek 34, when the optimiser took an 8-point hit in a blank
          and did not play Free Hit or Wildcard.
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
      {CHIPS_INDEX_FAQS.map((faq) => (
        <section key={faq.q} className="space-y-2 max-w-3xl">
          <h2 className="text-lg font-semibold">{faq.q}</h2>
          <FaqAnswer faq={faq} />
        </section>
      ))}
      <p className="text-sm">
        <Link href="/guides/when-to-play-fpl-chips" className="underline underline-offset-2">
          When to play chips
        </Link>
        {' · '}
        <Link href="/guides/gw34-blank-and-hits" className="underline underline-offset-2">
          Gameweek 34 hit
        </Link>
        {' · '}
        <Link href="/seasons/2025-26/download" className="underline underline-offset-2">
          2025/26 download
        </Link>
      </p>
    </div>
  );
}
