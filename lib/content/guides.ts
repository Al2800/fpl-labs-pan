import {
  CHIP_HALF_DEADLINE,
  CHIP_RESET_ANSWER,
  CHIP_RESET_CLOCK,
  CHIP_RESET_PATH,
} from '@/lib/content/chip-rules';

export interface GuidePage {
  slug: string;
  title: string;
  description: string;
  answer: string;
  sections: Array<{
    heading: string;
    body: string[];
    table?: { caption: string; headers: string[]; rows: string[][] };
  }>;
  faqs: Array<{ q: string; a: string; links?: Array<{ href: string; label: string }> }>;
  related: Array<{ href: string; label: string }>;
}

export const GUIDES: GuidePage[] = [
  {
    slug: '2025-26-season-review',
    title: 'FPL 2025/26 reconstructive replay: what the season shows',
    description:
      'The lab’s 2025/26 reconstructive path scored 2,010 net points, never played a chip, and took an 8-point hit in the Gameweek 34 blank. Same-state evidence matched the optimiser every week.',
    answer:
      'Over 38 gameweeks the forecast optimiser scored 2,010 net points versus 1,990 for the template. Same-state evidence copied the optimiser every week. An exploratory post-season fork that kept a different squad state from Gameweek 12 finished 65 points ahead; that fork is not a live freeze and is not a skill headline. No chip was used.',
    sections: [
      {
        heading: 'The published path',
        body: [
          'Each gameweek page is built from the lab’s reconstructive artifacts: a template that rolls transfers, a forecast optimiser (the selected plan), and a same-state evidence arm. The cutoff is first kickoff minus 90 minutes, rebuilt after the season. It is not a two-hour live freeze.',
          'The optimiser finished 2,010 net points. The template finished 1,990. Same-state evidence scored 2,010, identical week by week, because the evidence arm selected the same plan as the optimiser in every gameweek folder.',
        ],
      },
      {
        heading: 'What “evidence” did and did not do',
        body: [
          'A separate exploratory fork, recovered after outcomes were known, kept a different squad from Gameweek 12 and finished 2,075 hybrid net versus 2,010 canonical (+65 from Gameweek 12 to 38). Paired same-state tests from Gameweek 13 to 38 attribute only +16 points directly to that week’s evidence, in four weeks.',
          'Those fork numbers are on the season page as context. They are not the squads published on each gameweek page, and they are not a claim that unstructured news beat the forecast.',
        ],
      },
      {
        heading: 'Chips and Gameweek 34',
        body: [
          'Wildcard, Free Hit, Triple Captain and Bench Boost were never played. In Gameweek 34, the optimiser made three transfers with one free transfer and took an 8-point hit. It scored 28 net; the template held and scored 33. Free Hit and Wildcard were still available. The replay evaluated transfers, lineups and captains, not a complete FPL policy.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is 2,010 a live mini-league score?',
        a: 'No. It is the net total of a reconstructive optimiser path with rebuilt inputs. Private manager state, exact pre-deadline prices, and live news were not archived.',
      },
      {
        q: 'Why is the evidence column the same as the optimiser?',
        a: 'In the per-gameweek artifacts, the evidence arm produced the same validated plan as the forecast optimiser all 38 weeks. The +65 figure comes from a later forked squad trajectory, not from those same-state plans.',
      },
    ],
    related: [
      { href: '/seasons/2025-26', label: '2025/26 season hub' },
      { href: '/guides/gw34-blank-and-hits', label: 'Gameweek 34 hit case' },
      { href: '/chips', label: 'Chip guides' },
    ],
  },
  {
    slug: 'reconstructive-replay',
    title: 'What a reconstructive FPL replay is',
    description:
      'A reconstructive replay rebuilds pre-deadline inputs after the season. It is not the same as locking odds and minutes two hours before a live deadline.',
    answer:
      'A reconstructive replay rebuilds what the lab could have known before a historical deadline, then scores the plan on official points. The cutoff is first kickoff minus 90 minutes. That is how 2025/26 was built, and how 2026/27 Gameweeks 1 to 10 were built. From Gameweek 11 the 2026/27 pick is frozen before the official deadline and hashed.',
    sections: [
      {
        heading: 'What is rebuilt',
        body: [
          'Fixtures, prices, forecasts and news are taken from season exports and later artifacts. Limitations are listed on each gameweek page: no private bank or selling prices, no timestamped odds, and press notes that were not locked before the deadline.',
          'Gameweek 1 used the official Scout seed because no historical forecast lock existed.',
        ],
      },
      {
        heading: 'What it is useful for',
        body: [
          'It is useful for reading a full season of teams, captains and transfers in one place, and for asking whether hits or unused chips were costly. It is not useful as proof that a live model would have scored 2,010.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is this the same as a two-hour freeze?',
        a: 'No. A live freeze locks the plan about two hours before the deadline and keeps the hash. 2025/26, and 2026/27 Gameweeks 1 to 10, say reconstructive replay on the trust strip. They were not frozen before the deadline.',
      },
    ],
    related: [
      { href: '/guides/how-freeze-and-hash-work', label: 'Freeze and hash' },
      { href: '/methods', label: 'Methods' },
      { href: '/glossary', label: 'Glossary' },
    ],
  },
  {
    slug: 'how-freeze-and-hash-work',
    title: 'How the freeze and SHA-256 snapshot work',
    description:
      'Each published plan has a JSON twin and a SHA-256 hash so humans and agents can download the same object the page was built from.',
    answer:
      'Every gameweek page has a JSON snapshot at the same URL plus /snapshot.json. The trust strip shows the cutoff time and a shortened SHA-256. Download the file to inspect the squad, transfers and limitations. A live 2026/27 week freezes about two hours before the deadline. 2025/26, and 2026/27 Gameweeks 1 to 10, are reconstructive.',
    sections: [
      {
        heading: 'For humans',
        body: [
          'Open a gameweek, read the answer paragraph, then use Download snapshot if you want the raw object. The hash is a checksum of that object, not a secret.',
        ],
      },
      {
        heading: 'For agents',
        body: [
          'Prefer the JSON twin over scraping HTML. Start at /llms.txt for the catalog, then fetch /seasons/2026-27/snapshot.json or a gameweek snapshot. The Content-Type is application/json. X-Snapshot-Hash repeats the digest. Scoring a finished week fills official points and does not change the plan hash.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I use the hash to prove the plan was live?',
        a: 'Only for seasons that were frozen before results. A reconstructive hash proves the published JSON has not been silently rewritten since ingest, not that it existed before kick-off.',
      },
    ],
    related: [
      { href: '/llms.txt', label: 'llms.txt' },
      { href: '/seasons/2025-26/snapshot.json', label: '2025/26 season JSON' },
      { href: '/glossary', label: 'Glossary' },
    ],
  },
  {
    slug: 'use-fpl-chips-before-they-expire',
    title: 'Do FPL chips reset in January? Plan Gameweeks 16 to 19',
    description:
      'Yes. The first Wildcard, Free Hit, Bench Boost and Triple Captain expire at 18:30 GMT (18:30 UTC) on Friday 1 January 2027. Plan Gameweeks 16 to 19 before they go.',
    answer:
      'Yes. The first set of FPL chips expires at ' +
      CHIP_HALF_DEADLINE +
      '. Unused Wildcard, Free Hit, Bench Boost and Triple Captain chips do not carry over. A second set is available from Gameweek 20 to Gameweek 38. Gameweeks 16 to 19 are the last weeks you can play the first set.',
    sections: [
      {
        heading: 'Deadlines for Gameweeks 16 to 19',
        body: [
          'These are the last four deadlines of the first chip set. Anything still unused expires at the Gameweek 19 deadline, the last row. Each time is the same instant in GMT and UTC. The UK is on Greenwich Mean Time then, and GMT is UTC+0.',
          'At the time of writing (20 November 2026) the fixture list has no blank and no double gameweek. Every gameweek has 10 fixtures. That can change if fixtures are moved.',
        ],
        table: {
          caption: 'Gameweek 16 to 19 deadlines, in GMT and UTC',
          headers: ['Gameweek', 'Deadline'],
          rows: [
            ['16', '11:00 GMT (11:00 UTC) on Saturday 19 December 2026'],
            ['17', '11:00 GMT (11:00 UTC) on Saturday 26 December 2026'],
            ['18', '18:00 GMT (18:00 UTC) on Tuesday 29 December 2026'],
            ['19', CHIP_RESET_CLOCK],
          ],
        },
      },
      {
        heading: 'The first Wildcard',
        body: [
          'The first Wildcard runs from Gameweek 2 to Gameweek 19. It is unlimited transfers for one gameweek, and the new squad stays. You cannot cancel it once you have confirmed it. Saved free transfers are kept. If you had two, you still have two in the next gameweek.',
          'Play it in the earliest of these four weeks where free transfers will not fix the squad. A Gameweek 16 Wildcard leaves the new 15 in place for Gameweek 17, Gameweek 18 and Gameweek 19 as well. A Gameweek 19 Wildcard still counts, but that squad only has Gameweek 19 left in the first half. The second Wildcard runs from Gameweek 20 to Gameweek 38 either way. If the first is still unused at ' +
            CHIP_RESET_CLOCK +
            ', it is lost.',
        ],
      },
      {
        heading: 'The first Free Hit',
        body: [
          'The first Free Hit runs from Gameweek 2 to Gameweek 19. It is a squad for one gameweek, then your previous 15 come back. You cannot cancel it once it is confirmed. Saved free transfers are kept.',
          'A blank is the usual reason to play it, when postponed matches leave you short of starters. At the time of writing, Gameweeks 16 to 19 are not blanks. If a fixture move creates one, that is the week to look at. The chip still expires at ' +
            CHIP_HALF_DEADLINE +
            ' if you do not play it.',
          'Free Hit cannot be played in consecutive gameweeks. A Free Hit in Gameweek 19 cannot be active again until Gameweek 21. The second Free Hit is in the set that starts at Gameweek 20, but you cannot play it in Gameweek 20 if the first one was active in Gameweek 19.',
        ],
      },
      {
        heading: 'The first Bench Boost',
        body: [
          'The first Bench Boost runs from Gameweek 1 to Gameweek 19. It adds the points from your four substitutes for that gameweek. You can cancel it before the deadline. Automatic substitutions do not apply while it is active, because all 15 players count.',
          'A double is the usual week, because the bench can play twice. At the time of writing there is no double in Gameweeks 16 to 19, so each substitute has one fixture, the same as every other gameweek on the current list. Play it in one of these four weeks only if those four are expected to start. If they are not, the first Bench Boost still expires at ' +
            CHIP_RESET_CLOCK +
            '. The second Bench Boost runs from Gameweek 20 to Gameweek 38.',
        ],
      },
      {
        heading: 'The first Triple Captain',
        body: [
          'The first Triple Captain runs from Gameweek 1 to Gameweek 19. For that gameweek your captain’s points are tripled instead of doubled. You can cancel it before the deadline. If your captain plays any minutes, the chip is spent. The vice-captain inherits the triple only if your captain records zero minutes across the gameweek.',
          'There is no double on the fixture list at the time of writing, so the chip triples one match. The Triple Captain resets in January. The second one is available from Gameweek 20 to Gameweek 38, after ' +
            CHIP_RESET_CLOCK +
            '. The first one does not carry over, even if it is still unused after Christmas.',
        ],
      },
      {
        heading: 'Fitting the four chips into four weeks',
        body: [
          'You can play only one chip in a gameweek. If all four first-half chips are still unused at the Gameweek 16 deadline, these four weeks give you a week for each. If you have already used some, play the ones you have left. This page does not know your chip history.',
          'If the 20 November 2026 fixture list has not changed, share the four weeks like this. Use Wildcard in the earliest week where free transfers will not fix the squad, so the new side plays more than Gameweek 19. Use Bench Boost in a later week, once the four substitutes start. Use Triple Captain in the week you trust your captain for a single match, because there is no double to wait for. Use Free Hit in a week you are short of starters, and keep it off Gameweek 19 if you want the next one in Gameweek 21. A Free Hit in Gameweek 19 cannot be active again until then.',
          'The deadlines sit close together. Gameweek 16 closes at 11:00 GMT (11:00 UTC) on Saturday 19 December 2026. Gameweek 17 closes at 11:00 GMT (11:00 UTC) on Saturday 26 December 2026, Boxing Day. Gameweek 18 closes at 18:00 GMT (18:00 UTC) on Tuesday 29 December 2026. Gameweek 19 closes at ' +
            CHIP_RESET_CLOCK +
            '. After that, the first set is gone.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do FPL chips reset in January?',
        a:
          'Yes. The first Wildcard, Free Hit, Bench Boost and Triple Captain expire at ' +
          CHIP_RESET_CLOCK +
          ', the Gameweek 19 deadline. They do not carry over. A second set is available from Gameweek 20 to Gameweek 38.',
        links: [
          { href: '/chips/wildcard', label: 'Wildcard' },
          { href: '/chips/free-hit', label: 'Free Hit' },
          { href: '/chips/bench-boost', label: 'Bench Boost' },
          { href: '/chips/triple-captain', label: 'Triple Captain' },
        ],
      },
      {
        q: 'What is the Free Hit deadline in FPL?',
        a:
          'The first Free Hit deadline is ' +
          CHIP_RESET_CLOCK +
          ', the Gameweek 19 deadline. You can play that Free Hit from Gameweek 2 to Gameweek 19. Free Hit cannot be played in consecutive gameweeks, so a Free Hit in Gameweek 19 cannot be active again until Gameweek 21.',
        links: [{ href: '/chips/free-hit', label: 'Free Hit' }],
      },
      {
        q: 'Does your Triple Captain reset in January?',
        a:
          'Yes. Your first Triple Captain expires at ' +
          CHIP_RESET_CLOCK +
          ' if you have not used it. A second Triple Captain is available from Gameweek 20 to Gameweek 38. The first one does not carry over.',
        links: [{ href: '/chips/triple-captain', label: 'Triple Captain' }],
      },
      {
        q: 'Do you get another Triple Captain after Christmas?',
        a:
          'Yes. You get another Triple Captain from Gameweek 20, after ' +
          CHIP_RESET_CLOCK +
          '. The Christmas gameweek is Gameweek 17, with a deadline of 11:00 GMT (11:00 UTC) on Saturday 26 December 2026. The new Triple Captain is not available in Gameweek 17 or Gameweek 18.',
        links: [{ href: '/chips/triple-captain', label: 'Triple Captain' }],
      },
      {
        q: 'Do all FPL chips reset after Christmas?',
        a:
          'Yes. Wildcard, Free Hit, Bench Boost and Triple Captain all reset together after Christmas, at ' +
          CHIP_RESET_CLOCK +
          '. Unused first-half chips do not carry over. Each chip is available again from Gameweek 20 to Gameweek 38.',
        links: [
          { href: '/chips/wildcard', label: 'Wildcard' },
          { href: '/chips/free-hit', label: 'Free Hit' },
          { href: '/chips/bench-boost', label: 'Bench Boost' },
          { href: '/chips/triple-captain', label: 'Triple Captain' },
        ],
      },
    ],
    related: [
      { href: CHIP_RESET_PATH, label: 'When do FPL chips reset?' },
      { href: '/guides/when-to-play-fpl-chips', label: 'When to play FPL chips' },
      { href: '/chips/wildcard', label: 'Wildcard' },
      { href: '/chips/free-hit', label: 'Free Hit' },
      { href: '/chips/bench-boost', label: 'Bench Boost' },
      { href: '/chips/triple-captain', label: 'Triple Captain' },
    ],
  },
  {
    slug: 'when-to-play-fpl-chips',
    title: 'When to play Free Hit in FPL 2026: a blank week',
    description:
      'Play Free Hit in a blank in 2026/27, when you are short of starters. You get two. The first has to be used by 18:30 GMT (18:30 UTC) on 1 January 2027.',
    answer:
      'Play Free Hit in FPL 2026 in a blank gameweek, when postponed matches leave you short of starters. You get two Free Hits in 2026/27, one in each half, and your previous squad comes back the next week. The first has to be used by ' +
      CHIP_HALF_DEADLINE +
      '. You cannot play Free Hit in Gameweek 1, and you cannot play the two Free Hits in consecutive gameweeks. Play Wildcard when free transfers will not fix the squad, Bench Boost when your substitutes start in a double, and Triple Captain when your captain has two fixtures. In the 2025/26 replay, every chip stayed unused, including Gameweek 34, when the optimiser took an 8-point hit and did not play Free Hit or Wildcard.',
    sections: [
      {
        heading: 'When do FPL chips reset?',
        body: [
          CHIP_RESET_ANSWER,
          'Use the first set in 2026/27 before that deadline. Play Free Hit in a blank, when you are short of starters. Play Wildcard when free transfers will not fix the squad. Play Bench Boost when your four substitutes start. Play Triple Captain when your captain starts twice. Only one chip can be played in a gameweek.',
        ],
      },
      {
        heading: 'When to play your Wildcard',
        body: [
          'You get two Wildcards, one in each half. The first must be used by ' +
            CHIP_HALF_DEADLINE +
            '. Gameweeks 6 to 10 are often a sensible window: the teams have settled, and a good run of fixtures can last a while. You cannot play Wildcard in Gameweek 1.',
          'The second Wildcard is usually better in the spring, often somewhere in Gameweeks 27 to 33. Playing it a week or two before a big double lets you build a 15 of players who all have two games, without a hit, so Bench Boost has a full squad.',
        ],
      },
      {
        heading: 'What Bench Boost does and when to use it',
        body: [
          'Bench Boost adds the points scored by your substitute goalkeeper and three outfield bench players to your gameweek score for one round. You get two, one in each half. Automatic substitutions do not apply while it is active, because all 15 players count.',
          'A single gameweek is usually a weak time, because the cheap players on the bench often do not start. Save it for a confirmed double (often Gameweek 34 or 37) where those four can play twice. The 2025/26 bench table on the Bench Boost page shows what the substitutes actually scored. That table is arithmetic. Bench Boost was not played.',
        ],
      },
      {
        heading: 'Free Hit (freehit) and Triple Captain strategy',
        body: [
          'Free Hit (often searched as freehit) replaces your squad for one round, then your previous 15 come back. You get two. You cannot play it in Gameweek 1, and you cannot play the two Free Hits in consecutive gameweeks, so Gameweek 19 then Gameweek 20 is not allowed. Saved free transfers are kept. A blank, when you are short of starters, is the usual time.',
          'Triple Captain triples your captain’s points instead of doubling them. You get two. Do not spend the first one on a single home fixture if a proper double is still ahead. Wait for two favourable matches for an in-form, penalty-taking premium.',
        ],
      },
      {
        heading: 'Lessons from the 2025/26 reconstructive replay',
        body: [
          'In the 2025/26 replay, no chip was played. In Gameweek 34, a blank, the optimiser made three transfers with one free transfer and took an 8-point hit, scoring 28 net. Free Hit and Wildcard were both still available. The chip calculator ranks what Triple Captain and Bench Boost would have added in each scored week.',
          'Chip timing belongs alongside weekly transfers. Holding chips unused while taking heavy hits, or burning them on low-ceiling weeks, is an expensive tactical error.',
        ],
      },
    ],
    faqs: [
      {
        q: 'When do FPL chips reset?',
        a: CHIP_RESET_ANSWER,
      },
      {
        q: 'When should you play Free Hit in FPL 2026?',
        a: 'Play Free Hit in FPL 2026 in a blank gameweek, when postponed fixtures leave you short of starters. You get two Free Hits in 2026/27. Your old squad comes back the next week. You cannot play Free Hit in Gameweek 1, or in two gameweeks running.',
        links: [{ href: '/chips/free-hit', label: 'Free Hit' }],
      },
      {
        q: 'When to play Free Hit in FPL?',
        a: 'Play Free Hit when fielding eleven players would otherwise cost you several transfer hits. Keep it for a blank gameweek. Use it in a double only when your season squad is built around the wrong clubs.',
        links: [{ href: '/chips/free-hit', label: 'Free Hit' }],
      },
      {
        q: 'When should you play Wildcard in FPL?',
        a:
          'Play Wildcard when the squad has three or more problems that free transfers will not fix, such as long-term injuries, lost starting spots, or a bad run of fixtures. You get two in 2026/27. The first is lost if you still have it after ' +
          CHIP_RESET_CLOCK +
          '.',
        links: [{ href: '/chips/wildcard', label: 'Wildcard' }],
      },
      {
        q: 'When should you play Bench Boost in FPL?',
        a: 'Play Bench Boost when your four substitutes are starting, usually in a double gameweek so they can play twice. You get two in 2026/27, one in each half.',
        links: [{ href: '/chips/bench-boost', label: 'Bench Boost' }],
      },
      {
        q: 'When should you play Triple Captain in FPL?',
        a: 'Play Triple Captain when your captain starts both matches in a confirmed double. You get two in 2026/27, one in each half. If your captain has only one match and a double is still coming, wait.',
        links: [{ href: '/chips/triple-captain', label: 'Triple Captain' }],
      },
    ],
    related: [
      { href: '/chips/calculator', label: 'Chip calculator' },
      { href: '/chips', label: 'All Chip Hubs' },
      { href: '/chips/wildcard', label: 'Wildcard Timing Guide' },
      { href: '/chips/bench-boost', label: 'Bench Boost Strategy' },
      { href: '/chips/free-hit', label: 'Free Hit Guide' },
      { href: '/chips/triple-captain', label: 'Triple Captain Guide' },
      { href: '/guides/gw34-blank-and-hits', label: 'Gameweek 34 Case Study' },
    ],
  },
  {
    slug: 'gw34-blank-and-hits',
    title: 'FPL Gameweek 34 2025/26: an 8-point hit in a blank',
    description:
      'In FPL GW34 2025/26 the optimiser captained Bruno Fernandes, took an 8-point hit in a blank, and scored 28 net. The template scored 33. No chip was played.',
    answer:
      'In 2025/26 Gameweek 34 the optimiser captained Bruno Fernandes, used a 3-4-3, and made three transfers (Wieffer to Rice, Chalobah to Virgil, Haaland to Bowen) with one free transfer, taking an 8-point hit. It scored 28 net. The template made no transfers and scored 33. Free Hit and Wildcard were available and not played.',
    sections: [
      {
        heading: 'The blank in the squad file',
        body: [
          'Seven of the 15 squad players had no fixture stored. Groß, João Pedro and Marc Guiu were in the starting XI. Dúbravka, Guéhi, Rodon and Semenyo were on the bench. The other eight had a fixture. Those names and the 7 of 15 count come from gw-34.json. The opponent field holds one fixture only, so this is not a double-gameweek note.',
          'Gameweek 31 is the other blank in the files, and it is a useful contrast. Three of 15 had no fixture (Guéhi in the XI, Gabriel and J.Timber on the bench). Five free transfers were available, three were used, and there was no hit. The optimiser scored 63 net and the template 68. No chip was played that week either.',
        ],
      },
      {
        heading: 'What was published',
        body: [
          'The projected objective was 35.6 expected points. Net realised was 28 after the hit. The template scored 33 by making no transfers. Same-state evidence matched the optimiser. Across the whole season this was the only hit week: 39 transfers in total, and the 8-point hit only in Gameweek 34.',
        ],
      },
      {
        heading: 'What is still missing',
        body: [
          'A complete chip policy would show the points from zero, one, two and three transfers, the weeks after, and a Free Hit or Wildcard alternative. That comparison is not in the 2025/26 files. The hit is an observed choice. It is not proof it was the right one. No Free Hit score was modelled.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Should I take an 8-point hit in a blank?',
        a: 'Only if the multi-week value beats Free Hit, Wildcard, and rolling. This replay does not publish that comparison. It only shows that the hit happened and chips stayed on the bench.',
      },
    ],
    related: [
      { href: '/seasons/2025-26/gw/34', label: 'Gameweek 34 page' },
      { href: '/chips/free-hit', label: 'Free Hit guide' },
      { href: '/chips/wildcard', label: 'Wildcard guide' },
    ],
  },
];

export function getGuide(slug: string): GuidePage | null {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}
