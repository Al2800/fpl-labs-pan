import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { CHIP_EXPIRY_PLAN_PATH, CHIP_RESET_CLOCK, CHIP_RESET_PATH } from '@/lib/content/chip-rules';
import {
  DEADLINE_OFFSET_MINUTES,
  DEADLINE_ROWS,
  DEADLINES_CHECKED_ON,
  DEADLINES_CHECKED_ON_LABEL,
  DEADLINES_GUIDE_PATH,
  DEADLINES_GUIDE_TITLE,
  DEADLINES_META_DESCRIPTION,
  DEADLINES_META_TITLE,
  FIXTURE_CHECK,
  GW19_FIRST_KICKOFF,
  nextDeadline,
  utcClock,
  type DeadlineRow,
} from '@/lib/content/deadlines-2026-27';
import { absoluteUrl, breadcrumbList, faqPage } from '@/lib/present';

function requireGameweek19(): DeadlineRow {
  const row = DEADLINE_ROWS.find((item) => item.id === 19);
  if (!row || CHIP_RESET_CLOCK !== `${row.paired} on ${row.dayAndDate}`) {
    throw new Error('Chip reset clock does not match the Gameweek 19 deadline');
  }
  return row;
}

const next = nextDeadline();
const gw19 = requireGameweek19();

const chipAnswer = `The first chip set expires at the Gameweek 19 deadline, ${CHIP_RESET_CLOCK}. The second set runs from Gameweek 20 to Gameweek 38.`;

const faqs = [
  {
    q: 'When is the FPL deadline this week?',
    a: `As of ${DEADLINES_CHECKED_ON_LABEL}, the FPL deadline this week is Gameweek ${next.id}, ${next.dayAndDate}, ${next.paired}.`,
  },
  {
    q: 'What time is the FPL deadline in UTC?',
    a: `The next FPL deadline is ${next.utcTime} on ${next.dayAndDate}, which is ${next.ukTime} on the UK clock. In the table, a BST time is one hour ahead of the UTC time on that row. A GMT time matches UTC.`,
  },
  {
    q: 'When do FPL chips expire in 2026/27?',
    a: chipAnswer,
  },
];

export const metadata: Metadata = {
  title: DEADLINES_META_TITLE,
  description: DEADLINES_META_DESCRIPTION,
  alternates: {
    canonical: DEADLINES_GUIDE_PATH,
  },
  openGraph: {
    title: DEADLINES_META_TITLE,
    description: DEADLINES_META_DESCRIPTION,
    url: DEADLINES_GUIDE_PATH,
  },
};

export default function FplDeadlinesPage() {
  const pageUrl = absoluteUrl(DEADLINES_GUIDE_PATH);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: DEADLINES_GUIDE_TITLE,
    description: DEADLINES_META_DESCRIPTION,
    url: pageUrl,
    datePublished: DEADLINES_CHECKED_ON,
    dateModified: DEADLINES_CHECKED_ON,
    author: { '@type': 'Organization', name: 'FPL Replay' },
  };
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: DEADLINES_GUIDE_TITLE,
    description: DEADLINES_META_DESCRIPTION,
    url: pageUrl,
    dateModified: DEADLINES_CHECKED_ON,
  };

  return (
    <article className="space-y-8 max-w-3xl">
      <JsonLd
        data={[
          webPageJsonLd,
          articleJsonLd,
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: DEADLINES_GUIDE_TITLE, path: DEADLINES_GUIDE_PATH },
          ]),
          faqPage(faqs),
        ]}
      />
      <nav className="text-sm text-neutral-600">
        <Link href="/guides" className="underline underline-offset-2">
          Guides
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-900">{DEADLINES_GUIDE_TITLE}</span>
      </nav>
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{DEADLINES_GUIDE_TITLE}</h1>
        <p className="text-neutral-800 leading-relaxed">
          The next FPL deadline is Gameweek {next.id}, {next.dayAndDate}, {next.paired}.
        </p>
        <p className="text-neutral-800 leading-relaxed">
          Checked on {DEADLINES_CHECKED_ON_LABEL} against the FPL API (deadline_time {next.deadlineTime}).
          The UK is on GMT that day, so GMT and UTC show the same clock time.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Gameweek 1 to Gameweek 38</h2>
        <p className="text-neutral-800 leading-relaxed">
          Each row is one gameweek. The date is the UK date. UK time is GMT or BST, matching the UK clock
          that day. The UTC column is the same moment. Passed means the deadline fell before{' '}
          {DEADLINES_CHECKED_ON_LABEL}. Next is the first deadline after that date.
        </p>
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full text-sm text-left">
            <caption className="caption-top px-3 py-2 text-left text-neutral-600">
              2026/27 FPL deadlines in UK time and UTC, checked on {DEADLINES_CHECKED_ON_LABEL}.
            </caption>
            <thead className="bg-neutral-100 text-neutral-600">
              <tr>
                <th scope="col" className="py-2 px-3 font-medium">
                  Gameweek
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Day and date
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  UK time
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  UTC
                </th>
                <th scope="col" className="py-2 px-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {DEADLINE_ROWS.map((row) => (
                <tr
                  key={row.id}
                  id={row.status === 'Next' ? 'next-deadline' : undefined}
                  className={
                    row.status === 'Next'
                      ? 'border-t border-neutral-200 bg-neutral-50'
                      : 'border-t border-neutral-200'
                  }
                >
                  <th scope="row" className="py-2 px-3 font-medium text-neutral-900 whitespace-nowrap">
                    {row.id}
                  </th>
                  <td className="py-2 px-3 text-neutral-800 whitespace-nowrap">{row.dayAndDate}</td>
                  <td className="py-2 px-3 text-neutral-800 whitespace-nowrap">
                    <time dateTime={row.deadlineTime}>{row.ukTime}</time>
                  </td>
                  <td className="py-2 px-3 text-neutral-800 whitespace-nowrap">{row.utcTime}</td>
                  <td className="py-2 px-3 text-neutral-800">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">When the first chips expire</h2>
        <p className="text-neutral-800 leading-relaxed">{chipAnswer}</p>
        <p className="text-neutral-800 leading-relaxed">
          Gameweeks 16 to 19 are the last four weeks for that first set. The{' '}
          <Link href={CHIP_EXPIRY_PLAN_PATH} className="underline underline-offset-2">
            Gameweek 16 to 19 plan for chips that expire
          </Link>{' '}
          goes through Wildcard, Free Hit, Bench Boost and Triple Captain for those weeks.
        </p>
        <p className="text-sm">
          <Link href={CHIP_RESET_PATH} className="underline underline-offset-2">
            When do FPL chips reset?
          </Link>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How the deadline is set</h2>
        <p className="text-neutral-800 leading-relaxed">
          The deadline is {DEADLINE_OFFSET_MINUTES} minutes before the first kickoff of the gameweek. On
          the {DEADLINES_CHECKED_ON_LABEL} snapshot, that gap holds for all 38 gameweeks. Gameweek 19 is
          one example: the first kickoff is {utcClock(GW19_FIRST_KICKOFF)} and the deadline is{' '}
          {gw19.paired}.
        </p>
        <p className="text-neutral-800 leading-relaxed">
          The fixtures list from that check has {FIXTURE_CHECK.totalFixtures} matches. Every match has a
          gameweek and a kickoff time, so none are unscheduled. Gameweeks 12 to 15 each have{' '}
          {FIXTURE_CHECK.fixturesPerGameweek} fixtures and all {FIXTURE_CHECK.clubsPerGameweek} clubs, so
          there is no blank and no double in those four weeks. Gameweeks 1 to 38 are the same:{' '}
          {FIXTURE_CHECK.fixturesPerGameweek} fixtures each.
        </p>
        <p className="text-neutral-800 leading-relaxed">
          A deadline that has not passed can move if a fixture is rescheduled. The FPL site is the final
          word.
        </p>
      </section>

      {faqs.map((faq) => (
        <section key={faq.q} className="space-y-2">
          <h2 className="text-lg font-semibold">{faq.q}</h2>
          <p className="text-neutral-800 leading-relaxed">{faq.a}</p>
        </section>
      ))}

      <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/seasons/2026-27" className="underline underline-offset-2">
          2026/27 season
        </Link>
        <Link href={CHIP_EXPIRY_PLAN_PATH} className="underline underline-offset-2">
          Gameweek 16 to 19 plan for chips that expire
        </Link>
        <Link href={CHIP_RESET_PATH} className="underline underline-offset-2">
          When do FPL chips reset?
        </Link>
      </p>
    </article>
  );
}
