import Link from 'next/link';
import { Metadata } from 'next';
import { GUIDES } from '@/lib/content/guides';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL guides',
  description:
    'Guides for reading FPL Labs Pan: the 2025/26 reconstructive replay, freeze vs replay, chips, and Gameweek 34.',
};

export default function GuidesIndexPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ])}
      />
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Guides</h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          Short articles for humans and question-shaped headings for agents. Each gameweek still has
          the squad; these pages explain the season, the freeze rule, and chips.
        </p>
      </header>
      <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
        {GUIDES.map((guide) => (
          <li key={guide.slug} className="px-4 py-4 space-y-1">
            <Link
              href={`/guides/${guide.slug}`}
              className="font-medium underline underline-offset-2"
            >
              {guide.title}
            </Link>
            <p className="text-sm text-neutral-600">{guide.description}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm">
        <Link href="/glossary" className="underline underline-offset-2">
          Glossary
        </Link>
        {' · '}
        <Link href="/llms.txt" className="underline underline-offset-2">
          llms.txt
        </Link>
      </p>
    </div>
  );
}
