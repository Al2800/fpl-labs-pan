export interface GuidePage {
  slug: string;
  title: string;
  description: string;
  answer: string;
  sections: Array<{ heading: string; body: string[] }>;
  faqs: Array<{ q: string; a: string }>;
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
          'The optimiser finished 2,010 net points. The template finished 1,990. Same-state evidence scored 2,010 — identical week by week, because the evidence arm selected the same plan as the optimiser in every gameweek folder.',
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
          'Wildcard, Free Hit, Triple Captain and Bench Boost were never played. In Gameweek 34, a blank, both the optimiser and the template took three transfers with one free transfer and paid eight points. Free Hit and Wildcard were still available. That is the main chip lesson on this path: the replay evaluated transfers, lineups and captains, not a complete FPL policy.',
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
      'A reconstructive replay rebuilds what the lab could have known before a historical deadline, then scores the plan on official points. The 2025/26 cutoff is first kickoff minus 90 minutes. A live FPL Replay freeze will lock inputs two hours before the official deadline and publish a hash before results.',
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
        a: 'No. Live pages will freeze at T-120 and keep an immutable snapshot. 2025/26 pages say reconstructive replay on the trust strip.',
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
      'Every gameweek page has a JSON snapshot at the same URL plus /snapshot.json. The trust strip shows the cutoff time and a shortened SHA-256. Download the file to inspect the squad, transfers and limitations. Live seasons will freeze two hours before the deadline; 2025/26 snapshots are reconstructive.',
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
          'Prefer the JSON twin over scraping HTML. Start at /llms.txt for the catalog, then fetch /seasons/2025-26/snapshot.json or a gameweek snapshot. The Content-Type is application/json. X-Snapshot-Hash repeats the digest.',
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
    slug: 'when-to-play-fpl-chips',
    title: 'When to play FPL chips',
    description:
      'Short rules for Triple Captain, Bench Boost, Free Hit and Wildcard, plus what the 2025/26 replay left unused.',
    answer:
      'Play Triple Captain and Bench Boost when minutes are secure, usually in a double. Play Free Hit to cover a blank without wrecking next week. Play Wildcard when the 15 is structurally wrong for a block of fixtures. The 2025/26 reconstructive path played none of them, including in the Gameweek 34 blank.',
    sections: [
      {
        heading: 'A complete policy includes chips',
        body: [
          'Transfer, lineup and captaincy totals without chips are not a full FPL season. The 2025/26 replay is explicit about that gap. Use the chip hubs for the rules of thumb, and Gameweek 34 as the case where hits were taken instead.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which chip is most often wasted?',
        a: 'Free Hit on a mild upgrade, and Bench Boost on a bench that will not start. The 2025/26 lab path wasted them in a different way: it never fired them at all.',
      },
    ],
    related: [
      { href: '/chips', label: 'Chip hubs' },
      { href: '/guides/gw34-blank-and-hits', label: 'Gameweek 34' },
      { href: '/chips/free-hit', label: 'Free Hit' },
    ],
  },
  {
    slug: 'gw34-blank-and-hits',
    title: 'FPL Gameweek 34 2025/26: an 8-point hit in a blank',
    description:
      'The optimiser took three transfers with one free transfer and paid eight points in a blank gameweek, captaining Bruno Fernandes, and scored 28 net. Free Hit and Wildcard were unused.',
    answer:
      'In 2025/26 Gameweek 34 the optimiser captained Bruno Fernandes, used a 3-4-3, and made three transfers (Wieffer to Rice, Chalobah to Virgil, Haaland to Bowen) with one free transfer, taking an 8-point hit. It scored 28 net versus 33 for the template, which held. Free Hit and Wildcard were available and not played.',
    sections: [
      {
        heading: 'What was published',
        body: [
          'Projected objective was 35.6 expected points. Net realised was 28 after the hit. The template scored 33 by making no transfers. Same-state evidence matched the optimiser.',
        ],
      },
      {
        heading: 'What is still missing',
        body: [
          'A complete chip policy would show points with zero, one, two and three transfers, the payback week, and Free Hit / Wildcard alternatives. That ladder is not in the 2025/26 artifacts. Until it exists, treat the hit as an observed choice, not as proof it was optimal.',
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
