import { CHIP_HALF_DEADLINE, CHIP_RESET_ANSWER } from '@/lib/content/chip-rules';

export interface GuidePage {
  slug: string;
  title: string;
  description: string;
  answer: string;
  sections: Array<{ heading: string; body: string[] }>;
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
    title: 'Wildcard, Bench Boost, Free Hit, Triple Captain: when to play',
    description:
      'Eight FPL chips in 2026/27, two of each. Wildcard when transfers cannot fix the squad, Bench Boost and Triple Captain in a double, Free Hit in a blank.',
    answer:
      'You get eight chips in 2026/27: two each of Wildcard, Bench Boost, Free Hit and Triple Captain, one set per half. Play Wildcard when the squad needs three or more permanent fixes. Play Bench Boost in a double when all 15 have confirmed starts. Play Free Hit (freehit) in a blank so you do not take hits. Save Triple Captain for a premium with two good fixtures. The first set has to be used by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027. In the 2025/26 replay, every chip stayed unused, including when the optimiser took an 8-point hit in Gameweek 34 and did not play Free Hit or Wildcard.',
    sections: [
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
        links: [
          { href: '/chips/free-hit', label: 'Free Hit' },
          { href: '/chips/wildcard', label: 'Wildcard' },
          { href: '/chips/bench-boost', label: 'Bench Boost' },
          { href: '/chips/triple-captain', label: 'Triple Captain' },
        ],
      },
      {
        q: 'What are the FPL chips and when do you play them?',
        a: 'The FPL chips are Wildcard, Bench Boost, Free Hit and Triple Captain, and you get two of each. The chips page has a hub for each. Play Wildcard when the squad has at least three problems that free transfers cannot fix. Play Bench Boost in a double when all 15 players have confirmed starts. Play Free Hit in a blank when you are short of starters. Save Triple Captain for a confirmed double where a premium has two starts.',
        links: [
          { href: '/chips/wildcard', label: 'Wildcard' },
          { href: '/chips/bench-boost', label: 'Bench Boost' },
          { href: '/chips/free-hit', label: 'Free Hit' },
          { href: '/chips/triple-captain', label: 'Triple Captain' },
          { href: '/chips', label: 'chips page' },
        ],
      },
      {
        q: 'When should I play Wildcard in FPL?',
        a: 'Play Wildcard when your squad has at least three structural problems (such as long-term injuries, lost starting spots, or a brutal run of fixtures) that regular free transfers cannot fix.',
      },
      {
        q: 'FPL when to Wildcard: should I play it early or hold?',
        a: 'Playing the first Wildcard between Gameweeks 6 and 10 is usually more useful than holding it to the deadline. The new squad then has a long run. In 2026/27 that deadline is 13:30 GMT on Saturday 2 January 2027. If you leave the first Wildcard, it is lost.',
      },
      {
        q: 'What is Bench Boost in FPL and what is a good return?',
        a: 'Bench Boost scores all four of your substitutes alongside your starting eleven for one round. You get two in 2026/27, one in each half. A return in the mid-teens or higher from the bench is a strong week. The 2025/26 replay never played it.',
      },
      {
        q: 'When should I play Bench Boost in FPL?',
        a: 'Play Bench Boost in a major double gameweek late in the season, usually between Gameweeks 34 and 37 when rearranged fixtures let your substitutes play twice.',
      },
      {
        q: 'When should you play the Free Hit (freehit) chip?',
        a: 'Play Free Hit (or freehit) during a severe blank gameweek when postponed fixtures leave you with fewer than eight or nine playing starters. It lets you field a full eleven without wrecking your long-term squad with transfer hits.',
      },
      {
        q: 'What is Triple Captain in FPL, and when should you play it?',
        a: 'Triple Captain triples your captain’s official points for one gameweek instead of doubling them. You get two in 2026/27, one in each half. Save one for a confirmed double where a premium has two starts.',
      },
      {
        q: 'Which FPL chip is most often wasted?',
        a: 'Free Hit and Bench Boost are the chips managers most often waste. Free Hit gets spent on minor single-gameweek punts, while Bench Boost often fires while cheap non-starters on the bench score zero.',
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
