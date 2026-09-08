import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGuide, GUIDES } from '@/lib/content/guides';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl, breadcrumbList } from '@/lib/present';

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
    author: { '@type': 'Organization', name: 'FPL Labs Pan' },
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
          <p className="text-neutral-800 leading-relaxed">{faq.a}</p>
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
