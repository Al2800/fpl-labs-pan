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
    title: 'When to Play FPL Chips: Wildcard, Bench Boost & Free Hit',
    description:
      'When to play FPL chips: clear timing rules for when to Wildcard, what is Bench Boost in FPL, how freehit works, and avoiding wasted chips on low-ceiling weeks.',
    answer:
      'Knowing when to play FPL chips is essential for a competitive season. The golden rules are clear: play your Wildcard when your squad requires three or more permanent structural fixes; trigger Bench Boost in FPL during a double gameweek when all 15 players have confirmed starts; deploy Free Hit (freehit) to navigate major blank gameweeks without taking transfer hits; and reserve Triple Captain for an elite talisman playing twice. In the 2025/26 reconstructive replay, holding all chips unplayed proved how unspent chips leave points on the table.',
    sections: [
      {
        heading: 'FPL when to Wildcard: timing windows and rules',
        body: [
          'When deciding when to play Wildcard in FPL, split your campaign into two distinct phases. Your first Wildcard must be triggered before the mid-season deadline in late December. The ideal window is between Gameweeks 6 and 10, once early tactical trends crystallise, starting lineups stabilise, and key attacks embark on sustained fixture runs.',
          'Your second Wildcard is most powerful in the spring (typically Gameweeks 27 to 33). By using it one or two weeks before a major double gameweek, you can assemble 15 active double-gameweek footballers, seamlessly setting up your Bench Boost without burning points deductions.',
        ],
      },
      {
        heading: 'What is Bench Boost in FPL and when to play it',
        body: [
          'Bench Boost in FPL is a single-use chip that adds the scores of your substitute goalkeeper and three outfield bench players directly to your gameweek total. In a regular gameweek, your bench only registers points if a starter fails to play.',
          'Because Bench Boost can only be used once per season, playing it in a standard single gameweek often yields just 8 to 12 points from fringe starters. Save it for a confirmed double gameweek (often Gameweek 34 or 37) where your four substitutes play twice each, targeting an extra 20 to 30 points from your bench.',
        ],
      },
      {
        heading: 'Free Hit (freehit) and Triple Captain strategy',
        body: [
          'The Free Hit chip (frequently searched by managers as freehit) lets you replace your entire squad for a single round before your previous 15-man squad returns intact. It is best deployed during major blank gameweeks caused by domestic cup clashes, when several fixtures are cancelled and your squad has fewer than eight playing starters.',
          'For Triple Captain, patience is rewarded. Avoid the urge to trigger it on a single fixture for an in-form player; instead, wait for a double gameweek with two favourable home matches for an elite, penalty-taking premium with zero rotation risk.',
        ],
      },
      {
        heading: 'Lessons from the 2025/26 reconstructive replay',
        body: [
          'In the 2025/26 reconstructive replay, the model never fired a single chip. In Gameweek 34, facing a blank gameweek, the optimiser made three transfers with one free transfer and took an 8-point hit to field starters, scoring 28 net. Both Free Hit and Wildcard were sitting unused.',
          'A balanced managerial strategy must incorporate chip timing alongside weekly transfers. Holding chips until they expire or taking severe hits while chips remain in hand is an expensive tactical error.',
        ],
      },
    ],
    faqs: [
      {
        q: 'When should I play Wildcard in FPL?',
        a: 'When deciding when should I play Wildcard in FPL, pull the trigger when your 15-man squad has at least three structural problems—such as long-term injuries, lost starting spots, or sustained negative fixture swings—that free transfers and minor hits cannot resolve.',
      },
      {
        q: 'FPL when to Wildcard: should I play it early or hold?',
        a: 'FPL when to Wildcard decisions favour playing your first chip between Gameweeks 6 and 10 rather than holding it until December. An early Wildcard lets you capitalise on emerging budget enablers and positive fixture shifts for 10 or more gameweeks, compounding your rank gains over time.',
      },
      {
        q: 'What is Bench Boost in FPL and what is a good return?',
        a: 'What is Bench Boost in FPL? It is a chip that scores all four of your substitutes alongside your starting eleven for one round. A successful Bench Boost return from your four bench players is 15 to 25 additional points, which is why waiting for a double gameweek with guaranteed minutes is so critical.',
      },
      {
        q: 'When should I play Bench Boost in FPL?',
        a: 'Bench Boost FPL strategy centres on targeting a major double gameweek late in the season, typically between Gameweeks 34 and 37 when rescheduled cup ties create packed schedules. By ensuring all four of your substitutes play twice, you can extract up to eight extra player appearances from your bench.',
      },
      {
        q: 'When should you play the Free Hit (freehit) chip?',
        a: 'You should play the Free Hit (or freehit) chip during a severe blank gameweek when postponed fixtures leave you with fewer than eight or nine playing starters. It lets you field a full eleven without wrecking your long-term team with -8 or -12 transfer penalties.',
      },
      {
        q: 'Which FPL chip is most often wasted?',
        a: 'Free Hit and Bench Boost are the most commonly wasted chips in FPL. Free Hit is frequently squandered on minor single-gameweek punts, while Bench Boost is often triggered when holding cheap, non-starting substitutes who score zero points.',
      },
    ],
    related: [
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
