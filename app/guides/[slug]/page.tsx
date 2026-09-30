import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGuide, GUIDES, type GuidePage as Guide } from '@/lib/content/guides';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl, breadcrumbList, faqPage } from '@/lib/present';

function FaqAnswer({ faq }: { faq: Guide['faqs'][number] }) {
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Guide not found' };
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `/guides/${slug}`,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: absoluteUrl(`/guides/${guide.slug}`),
    author: { '@type': 'Organization', name: 'FPL Replay' },
  };

  return (
    <article className="space-y-8 max-w-3xl">
      <JsonLd
        data={[
          articleJsonLd,
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
          ...(guide.faqs && guide.faqs.length > 0 ? [faqPage(guide.faqs)] : []),
        ]}
      />
      <nav className="text-sm text-neutral-600">
        <Link href="/guides" className="underline underline-offset-2">
          Guides
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-900">{guide.title}</span>
      </nav>
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{guide.title}</h1>
        <p className="text-neutral-800 leading-relaxed">{guide.answer}</p>
      </header>
      {guide.sections.map((section) => (
        <section key={section.heading} className="space-y-2">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="text-neutral-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      {guide.faqs.map((faq) => (
        <section key={faq.q} className="space-y-2">
          <h2 className="text-lg font-semibold">{faq.q}</h2>
          <FaqAnswer faq={faq} />
        </section>
      ))}
      <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        {guide.related.map((item) => (
          <Link key={item.href} href={item.href} className="underline underline-offset-2">
            {item.label}
          </Link>
        ))}
      </p>
    </article>
  );
}
