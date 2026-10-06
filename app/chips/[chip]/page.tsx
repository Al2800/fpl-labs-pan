import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CHIP_HUB_CONTENT, getChipHub } from '@/lib/content/chips';
import { DemoNoticeBanner } from '@/components/DemoNoticeBanner';
import { ChipReplayCards, blankWeeksFaqAnswer } from '@/components/ChipReplayCards';
import { JsonLd } from '@/components/JsonLd';
import { REPLAY_DOWNLOAD_PATH } from '@/lib/replay-2025';
import { breadcrumbList, chipHubPath, faqPage } from '@/lib/present';

interface PageProps {
  params: Promise<{ chip: string }>;
}

export function generateStaticParams() {
  return [
    { chip: 'triple-captain' },
    { chip: 'bench-boost' },
    { chip: 'free-hit' },
    { chip: 'wildcard' },
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chip } = await params;
  const hub = getChipHub(chip);
  if (!hub) return { title: 'Chip not found' };
  const path = chipHubPath(hub.slug);
  const title = hub.metaTitle ?? `When to play ${hub.name} in FPL`;
  const description = hub.metaDescription ?? hub.oneLiner;
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
    },
  };
}

export default async function ChipHubPage({ params }: PageProps) {
  const { chip } = await params;
  const hub = getChipHub(chip);
  if (!hub) notFound();
  const faqs = hub.faqs.map((faq) =>
    hub.id === 'fh' && faq.q === 'What happened in the 2025/26 blank gameweeks?'
      ? { ...faq, a: blankWeeksFaqAnswer() }
      : faq
  );
  const otherChips = CHIP_HUB_CONTENT.filter((item) => item.id !== hub.id);

  return (
    <div className="space-y-8 max-w-3xl">
      <JsonLd
        data={[
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Chips', path: '/chips' },
            { name: hub.name, path: chipHubPath(hub.slug) },
          ]),
          faqPage(faqs),
        ]}
      />
      <nav className="text-sm text-neutral-600">
        <Link href="/chips" className="underline underline-offset-2">
          Chips
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-900">{hub.name}</span>
      </nav>
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {hub.h1 ?? `When to play ${hub.name}`}
        </h1>
        <p className="text-neutral-800 leading-relaxed">{hub.oneLiner}</p>
        <DemoNoticeBanner placement="below-lead" />
      </header>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How {hub.name} works</h2>
        <p className="text-neutral-800 leading-relaxed">{hub.howItWorks}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">When to play it</h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-800">
          {hub.whenToPlay.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <ChipReplayCards chip={hub.id} />
      {hub.id === 'fh' ? null : (
      <section
        className="border border-neutral-200 bg-neutral-50 p-5 space-y-2"
        aria-label={`${hub.name} replay scenario`}
      >
        <p className="text-sm font-medium text-neutral-600">{hub.scenario.label}</p>
        <h2 className="text-lg font-semibold">{hub.scenario.title}</h2>
        <p className="text-neutral-800 leading-relaxed">{hub.scenario.body}</p>
        <p className="text-sm text-neutral-600">
          Source:{' '}
          <a href={hub.scenario.sourcePath} className="underline underline-offset-2">
            {hub.scenario.sourceLabel}
          </a>
          . {hub.scenario.sourceDetail}
        </p>
      </section>
      )}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What the 2025/26 replay did</h2>
        <p className="text-neutral-800 leading-relaxed">{hub.replay2025}</p>
      </section>
      {faqs.map((faq) => (
        <section key={faq.q} className="space-y-2">
          <h2 className="text-lg font-semibold">{faq.q}</h2>
          <p className="text-neutral-800 leading-relaxed">{faq.a}</p>
        </section>
      ))}
      <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        {otherChips.map((item) => (
          <Link key={item.id} href={chipHubPath(item.slug)} className="underline underline-offset-2">
            {item.name}
          </Link>
        ))}
        <Link href="/chips" className="underline underline-offset-2">
          All chips
        </Link>
        <Link href="/guides/when-to-play-fpl-chips" className="underline underline-offset-2">
          When to play them
        </Link>
        <Link href="/seasons/2025-26" className="underline underline-offset-2">
          2025/26 season
        </Link>
        <Link href={REPLAY_DOWNLOAD_PATH} className="underline underline-offset-2">
          Download the replay
        </Link>
        {hub.id === 'tc' || hub.id === 'bb' ? (
          <Link href="/chips/calculator" className="underline underline-offset-2">
            What this chip would have added
          </Link>
        ) : null}
      </p>
    </div>
  );
}
