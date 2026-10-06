import Link from 'next/link';
import { Metadata } from 'next';
import { ChipCalculator } from '@/components/ChipCalculator';
import { JsonLd } from '@/components/JsonLd';
import { bestWeek, CHIP_CALCULATOR_PATH, chipFaqs, getChipCalculator } from '@/lib/chip-calculator';
import { absoluteUrl, breadcrumbList, faqPage } from '@/lib/present';
import { REPLAY_DOWNLOAD_PATH } from '@/lib/replay-2025';

const title = 'What Would This FPL Chip Have Added?';
const description =
  'What Triple Captain and Bench Boost would have added on the 2025/26 FPL replay, week by week. Arithmetic on the recorded team. No chip was played.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: CHIP_CALCULATOR_PATH },
  openGraph: { title, description, url: CHIP_CALCULATOR_PATH },
};

export default function ChipCalculatorPage() {
  const data = getChipCalculator();
  const faqs = chipFaqs(data);
  const initialGw = bestWeek(data.weeks, 'tc').gw;

  return (
    <div className="space-y-8 max-w-3xl">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'FPL chip calculator',
            applicationCategory: 'SportsApplication',
            operatingSystem: 'Web',
            url: absoluteUrl(CHIP_CALCULATOR_PATH),
            description,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'GBP',
            },
          },
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Chips', path: '/chips' },
            { name: 'Calculator', path: CHIP_CALCULATOR_PATH },
          ]),
          faqPage(faqs),
        ]}
      />
      <nav className="text-sm text-neutral-600">
        <Link href="/chips" className="underline underline-offset-2">
          Chips
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-900">Calculator</span>
      </nav>
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          What would this FPL chip have added?
        </h1>
        <p className="text-neutral-800 leading-relaxed">
          Pick Triple Captain or Bench Boost, then a 2025/26 gameweek. You get the points that chip
          would have added to the replay team, and where that week sits against the rest of the
          season. It is arithmetic. No chip was played. Free Hit and Wildcard are there so you can
          see why they have no number.
        </p>
      </header>
      <p className="text-neutral-800 leading-relaxed">
        Triple Captain adds one extra copy of the captain&apos;s points, because the replay already
        counted them twice. Bench Boost adds the four substitute scores, minus the amount by which
        the recorded score already sits above the starting XI. Three weeks stay as n/a: the captain
        recorded 0, and the file has no minutes played, so the armband might have moved.
      </p>
      <ChipCalculator weeks={data.weeks} initialGw={initialGw} />
      {faqs.map((faq) => (
        <section key={faq.q} className="space-y-2">
          <h2 className="text-lg font-semibold">{faq.q}</h2>
          <p className="text-neutral-800 leading-relaxed">{faq.a}</p>
        </section>
      ))}
      <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/chips/triple-captain" className="underline underline-offset-2">
          Triple Captain
        </Link>
        <Link href="/chips/bench-boost" className="underline underline-offset-2">
          Bench Boost
        </Link>
        <Link href="/chips/free-hit" className="underline underline-offset-2">
          Free Hit
        </Link>
        <Link href="/chips/wildcard" className="underline underline-offset-2">
          Wildcard
        </Link>
        <Link href="/guides/when-to-play-fpl-chips" className="underline underline-offset-2">
          When to play them
        </Link>
        <Link href={REPLAY_DOWNLOAD_PATH} className="underline underline-offset-2">
          Download the replay
        </Link>
      </p>
    </div>
  );
}
