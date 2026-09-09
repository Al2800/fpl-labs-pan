import Link from 'next/link';
import { Metadata } from 'next';
import { GLOSSARY } from '@/lib/content/glossary';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL Replay glossary',
  description:
    'Definitions for xP, FDR, T-120 freeze, reconstructed cutoff, approaches, hits, net points, and JSON snapshots.',
};

export default function GlossaryPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Glossary', path: '/glossary' },
        ])}
      />
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Glossary</h1>
        <p className="text-neutral-700 leading-relaxed">
          Words used on this site, in plain language. Agents can treat each heading as a term.
        </p>
      </header>
      {GLOSSARY.map((entry) => (
        <section key={entry.id} id={entry.id} className="space-y-2">
          <h2 className="text-lg font-semibold">{entry.term}</h2>
          <p className="text-neutral-800 leading-relaxed">{entry.definition}</p>
        </section>
      ))}
      <p className="text-sm">
        <Link href="/guides/reconstructive-replay" className="underline underline-offset-2">
          Reconstructive replay
        </Link>
        {' · '}
        <Link href="/methods" className="underline underline-offset-2">
          Methods
        </Link>
      </p>
    </div>
  );
}
