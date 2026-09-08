import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChipHub } from '@/lib/content/chips';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, chipHubPath } from '@/lib/present';

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
  return {
    title: `When to play ${hub.name} in FPL`,
    description: hub.oneLiner,
  };
}

export default async function ChipHubPage({ params }: PageProps) {
  const { chip } = await params;
  const hub = getChipHub(chip);
  if (!hub) notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Chips', path: '/chips' },
          { name: hub.name, path: chipHubPath(hub.slug) },
        ])}
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
          When to play {hub.name}
        </h1>
        <p className="text-neutral-800 leading-relaxed">{hub.oneLiner}</p>
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
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What the 2025/26 replay did</h2>
        <p className="text-neutral-800 leading-relaxed">{hub.replay2025}</p>
      </section>
      {hub.faqs.map((faq) => (
        <section key={faq.q} className="space-y-2">
          <h2 className="text-lg font-semibold">{faq.q}</h2>
          <p className="text-neutral-800 leading-relaxed">{faq.a}</p>
        </section>
      ))}
      <p className="text-sm">
        <Link href="/seasons/2025-26" className="underline underline-offset-2">
          2025/26 season
        </Link>
        {' · '}
        <Link href="/guides/when-to-play-fpl-chips" className="underline underline-offset-2">
          Chip timing guide
        </Link>
      </p>
    </div>
  );
}
