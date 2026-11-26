import Link from 'next/link';
import { CHIP_EXPIRY_PLAN_PATH, CHIP_RESET_CLOCK } from '@/lib/content/chip-rules';
import { DEADLINES_GUIDE_PATH } from '@/lib/content/deadlines-2026-27';

const linkClass = 'underline underline-offset-2';

function PlanLink() {
  return (
    <Link href={CHIP_EXPIRY_PLAN_PATH} className={linkClass}>
      Gameweek 16 to 19 plan for chips that expire
    </Link>
  );
}

function DeadlinesLink() {
  return (
    <Link href={DEADLINES_GUIDE_PATH} className={linkClass}>
      full deadline list in GMT and UTC
    </Link>
  );
}

/**
 * Short note under the lead on the chips hub and the four chip pages.
 * Titles, meta descriptions and H1s stay on the page. This block only adds links.
 */
export function ChipExpiryLinks({ page }: { page: 'index' | 'tc' | 'bb' | 'fh' | 'wc' }) {
  return (
    <p className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 leading-relaxed">
      {page === 'index' ? (
        <>
          Gameweeks 16 to 19 are the last weeks for the first chip set, which expires at {CHIP_RESET_CLOCK}.
          The <PlanLink /> says where Wildcard, Free Hit, Bench Boost and Triple Captain fit, and the{' '}
          <DeadlinesLink /> lists every gameweek.
        </>
      ) : null}
      {page === 'fh' ? (
        <>
          On the 23 November 2026 fixture list, Gameweeks 16 to 19 are not blanks, so play the first Free
          Hit in the week you are short of starters, and keep it off Gameweek 19 if you want the next one
          in Gameweek 21. Those dates are in the <PlanLink /> and the <DeadlinesLink />.
        </>
      ) : null}
      {page === 'wc' ? (
        <>
          A Gameweek 16 Wildcard leaves the new squad in place for Gameweeks 17, 18 and 19, while a Gameweek
          19 Wildcard only has that week left in the first half. If you have not used it by {CHIP_RESET_CLOCK},
          it is lost, and those weeks are in the <PlanLink /> and the <DeadlinesLink />.
        </>
      ) : null}
      {page === 'bb' ? (
        <>
          There is no double in Gameweeks 16 to 19 on the 23 November 2026 fixture list, so play the first
          Bench Boost in a week when your four substitutes start, before {CHIP_RESET_CLOCK}. The <PlanLink />{' '}
          goes through those four weeks, and the <DeadlinesLink /> has the clock times.
        </>
      ) : null}
      {page === 'tc' ? (
        <>
          There is no double in Gameweeks 16 to 19 on the 23 November 2026 fixture list, so play the first
          Triple Captain in the week you trust your captain for one match, before {CHIP_RESET_CLOCK}. The{' '}
          <PlanLink /> and the <DeadlinesLink /> list those four weeks.
        </>
      ) : null}
    </p>
  );
}
