import { ChipType } from '@/types/fpl';
import { CHIP_HALF_DEADLINE, CHIP_RESET_ANSWER } from '@/lib/content/chip-rules';

export interface ChipHubContent {
  id: Exclude<ChipType, 'none'>;
  slug: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  oneLiner: string;
  howItWorks: string;
  whenToPlay: string[];
  replay2025: string;
  scenario: {
    label: string;
    title: string;
    body: string;
    sourceLabel: string;
    sourcePath: string;
    sourceDetail: string;
  };
  faqs: Array<{ q: string; a: string }>;
}

export const CHIP_HUB_CONTENT: ChipHubContent[] = [
  {
    id: 'tc',
    slug: 'triple-captain',
    name: 'Triple Captain',
    metaTitle: 'How Many Triple Captains in FPL? You Get Two',
    metaDescription:
      'You get two Triple Captains in FPL 2026/27, one in each half. For one gameweek your captain’s points are tripled.',
    h1: 'How many Triple Captains do you get in FPL?',
    oneLiner:
      'You get two Triple Captains in FPL, one in each half of 2026/27. For that gameweek your captain’s points are tripled. The first has to be used by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027, or it is lost. Save it for a double, when your captain starts both matches.',
    howItWorks:
      'The selected captain scores three times their official FPL points instead of two. You get two Triple Captains, one for each half of the season. The first is available from the start and must be used by ' +
      CHIP_HALF_DEADLINE +
      '. It does not carry over. The second is available after that deadline. You can cancel Triple Captain before the deadline. If your captain plays even one minute, the chip is spent. The vice-captain only inherits the triple if your captain records zero minutes across the gameweek.',
    whenToPlay: [
      'A confirmed double gameweek featuring an elite, penalty-taking captain with two favourable home matches and little rotation risk.',
      'When that captain’s recent goal and assist numbers sit clearly ahead of the other options.',
      'A high-ceiling single gameweek only if the later doubles never give you a secure two-start option.',
      'Do not spend it on a player carrying an unresolved knock, or on two difficult away fixtures.',
    ],
    replay2025:
      'The 2025/26 reconstructive path never played Triple Captain. That is a gap in the replay, not proof the chip is a poor play.',
    scenario: {
      label: 'Arithmetic only. Triple Captain was not used.',
      title: 'GW37 captain: how the 3x multiplier changes the total',
      body:
        'In the 2025/26 GW37 replay, the optimiser captained Gabriel, who scored 6 official FPL points. His usual 2x captain return was 12 points. Triple Captain would have made it 18, a 6-point increase. This is arithmetic from the recorded 6 points, not a chip the replay played, and not a recommendation to play it in GW37.',
      sourceLabel: '2025/26 GW37 optimiser snapshot',
      sourcePath: '/seasons/2025-26/gw/37/snapshot.json',
      sourceDetail: 'Data used: validatedPlan.captain.realisedPoints (6) and multiplier (2).',
    },
    faqs: [
      {
        q: 'How many Triple Captains do you get in FPL?',
        a: 'You get two Triple Captains in FPL, one in each half of 2026/27. The first has to be used by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027, or it is lost. The second is available from Gameweek 20.',
      },
      {
        q: 'How many Triple Captains are there in FPL?',
        a: 'There are two Triple Captains in 2026/27. One is for the first half and one is for the second. An unused first chip does not carry over.',
      },
      {
        q: 'What is Triple Captain in FPL?',
        a: 'Triple Captain is the chip that triples your captain’s points for one gameweek. You get two in 2026/27. If your captain plays any minutes, the chip is spent.',
      },
      {
        q: 'How does Triple Captain work in FPL?',
        a: 'Triple Captain scores your captain three times their official points for that gameweek. You can cancel it before the deadline. If your captain plays no minutes, the vice-captain becomes captain, and the triple moves with that change if the vice plays.',
      },
      {
        q: 'Do you get two Triple Captains in FPL?',
        a: 'Yes, you get two Triple Captains in 2026/27, one before the Gameweek 19 deadline and one after it. Only one chip can be played in a gameweek.',
      },
    ],
  },
  {
    id: 'bb',
    slug: 'bench-boost',
    name: 'Bench Boost',
    metaTitle: 'How Many Bench Boosts in FPL? You Get Two',
    metaDescription:
      'You get two Bench Boosts in 2026/27, one in each half. For one gameweek, your four substitutes’ points are added to your score.',
    h1: 'How many Bench Boosts do you get in FPL?',
    oneLiner:
      'You get two Bench Boosts in FPL, one in each half of 2026/27. Bench Boost adds the points from your four substitutes for one gameweek. The first has to be used by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027, or it is lost. Play it when those four start, often in a double gameweek.',
    howItWorks:
      'When you activate Bench Boost, the points scored by all 15 squad members count towards your gameweek total. Points from your substitute goalkeeper and three outfield bench players are added to your score. You get two Bench Boosts, one per half. The first can be used from Gameweek 1 and must be used by ' +
      CHIP_HALF_DEADLINE +
      '. It does not carry over. You can cancel it before the deadline. Because every player on your bench is already active, automatic substitutions do not apply if a starter fails to play.',
    whenToPlay: [
      'A double gameweek where your four bench players have real fixtures, often late in the season when matches are rearranged.',
      'The week after a Wildcard, once you have built a 15-man squad of starters without taking hits.',
      'A single gameweek only if all four substitutes are nailed-on starters and nobody is flagged.',
      'Do not play it with a non-playing cheap keeper, a youth player who will not feature, or a defender who only comes on for a cameo.',
    ],
    replay2025:
      'Bench Boost was never played on the 2025/26 reconstructive path. The bench points on this page are what the substitutes scored. They were not added to the gameweek total.',
    scenario: {
      label: 'Arithmetic only. Bench Boost was not used.',
      title: 'GW37 bench: what Bench Boost would have added',
      body:
        'The optimiser’s four listed substitutes scored 0, 6, 0 and 0 points in the 2025/26 GW37 replay. Adding those 6 bench points to its 70-point score gives 76, assuming the same squad and starting XI. The replay did not use Bench Boost, so 76 is arithmetic, not an observed chip score.',
      sourceLabel: '2025/26 GW37 optimiser snapshot',
      sourcePath: '/seasons/2025-26/gw/37/snapshot.json',
      sourceDetail:
        'Data used: validatedPlan.bench.realisedPoints (0 + 6 + 0 + 0) and realisedSquadTotalPoints (70).',
    },
    faqs: [
      {
        q: 'How many Bench Boosts do you get in FPL?',
        a: 'You get two Bench Boosts in FPL, one in each half of 2026/27. The first has to be used by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027, or it is lost. The second is available from Gameweek 20.',
      },
      {
        q: 'What is Bench Boost in FPL?',
        a: 'Bench Boost is the chip that adds your four substitutes’ points to your score for one gameweek. You get two in 2026/27, one in each half. Your starting eleven still score as usual.',
      },
      {
        q: 'What does Bench Boost do?',
        a: 'Bench Boost counts your bench for one gameweek, as well as the starting eleven. You get two in 2026/27. A substitute who does not play scores zero, and automatic substitutions do not step in.',
      },
      {
        q: 'Do you get two Bench Boosts in FPL?',
        a: 'Yes, you get two Bench Boosts in 2026/27. One lasts until the Gameweek 19 deadline and one is for the second half. The first does not carry over.',
      },
      {
        q: 'How does Bench Boost work in FPL?',
        a: 'Bench Boost adds the points from your substitute goalkeeper and your three outfield bench players. You can cancel it before the deadline. You can play it in a single gameweek. A double gives those bench players two matches.',
      },
    ],
  },
  {
    id: 'fh',
    slug: 'free-hit',
    name: 'Free Hit',
    metaTitle: 'What Is a Free Hit in FPL? You Get Two',
    metaDescription:
      'A free hit in FPL (freehit) is a squad for one week. You make unlimited transfers, then your old 15 come back. You get two in 2026/27.',
    h1: 'What is a free hit in FPL?',
    oneLiner:
      'A free hit in FPL, also written freehit, is a squad for one gameweek, and you get two in 2026/27. You can make as many transfers as you like that week, with no points hit, and your previous 15 come back afterwards. The first has to be played by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027. You cannot play it in Gameweek 1, and you cannot play the two free hits in consecutive gameweeks. Save it for a blank gameweek. If you want the new squad to stay, that is a Wildcard.',
    howItWorks:
      'Free Hit lets you make unlimited transfers for a single gameweek with no points hit. At the next deadline your squad goes back to how it was at the start of that gameweek. You get two Free Hits. The first is available after Gameweek 1 and must be played by ' +
      CHIP_HALF_DEADLINE +
      '. The second is available after that deadline. Free Hit cannot be played in consecutive gameweeks, so a Free Hit in Gameweek 19 blocks Gameweek 20. You confirm it with your transfers, and you cannot cancel it once it is confirmed. Saved free transfers are kept for the following gameweek.',
    whenToPlay: [
      'A blank gameweek, when postponed matches leave a lot of your squad without a fixture.',
      'When you would otherwise take a heavy hit just to field a legal starting eleven.',
      'A big double only if your season squad is aimed at the wrong clubs and you want a one-week side.',
      'Skip it for a small fixture swing, or to chase one captain, when you already have a full side.',
    ],
    replay2025:
      'No Free Hit was played in the 2025/26 replay. Gameweek 31 and Gameweek 34 are the blank weeks in the squad files. The card below is that record, not a Free Hit score.',
    scenario: {
      label: '2025/26 replay record. No Free Hit was played.',
      title: 'Blank weeks in the 2025/26 replay',
      body:
        'The blank-week card on this page is built from the GW31 and GW34 squad files. The replay did not play Free Hit, and it does not contain a Free Hit squad or an alternative score.',
      sourceLabel: '2025/26 GW34 and GW31 snapshots',
      sourcePath: '/seasons/2025-26/gw/34',
      sourceDetail: 'Also see Gameweek 31 and the season download.',
    },
    faqs: [
      {
        q: 'What is a free hit in FPL?',
        a: 'A free hit in FPL is a squad you use for one gameweek. You make unlimited transfers, with no points hit, and your previous 15 come back at the next deadline. It is also written freehit. You get two in 2026/27.',
      },
      {
        q: 'What does a free hit do in FPL?',
        a: 'A free hit lets you change as many players as you like for one gameweek, then puts your old squad back. Those transfers are free. You get two in 2026/27, and you cannot play them in consecutive gameweeks.',
      },
      {
        q: 'What is the free hit meaning in FPL?',
        a: 'Free hit means a temporary squad. The players you bring in do not stay past that gameweek. If you want the new squad to stay, that is a Wildcard. You get two free hits in 2026/27.',
      },
      {
        q: 'How many free hits do you get in FPL?',
        a: 'You get two free hits in FPL 2026/27, one in each half of the season. The first has to be played by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027. You cannot play Free Hit in Gameweek 1. A Free Hit in Gameweek 19 blocks Gameweek 20.',
      },
      {
        q: 'What is freehit?',
        a: 'Freehit is the Free Hit chip written as one word. It is a squad for one gameweek in FPL, and you get two in 2026/27.',
      },
    ],
  },
  {
    id: 'wc',
    slug: 'wildcard',
    name: 'Wildcard',
    metaTitle: 'Wildcard Meaning in FPL: You Get Two',
    metaDescription:
      'A Wildcard in FPL is unlimited free transfers for one gameweek, and the new squad stays. You get two in 2026/27, one in each half.',
    h1: 'Wildcard meaning in FPL',
    oneLiner:
      'Wildcard in FPL means unlimited free transfers for one gameweek, the new squad stays, and you get two in 2026/27. The first has to be played by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027, or it is lost. You cannot play it in Gameweek 1. Use it when several players are injured or the fixtures have gone against you. If everyone is still starting, wait.',
    howItWorks:
      'Wildcard gives you unlimited free transfers for one gameweek, and the new squad stays. You get two. The first is available after Gameweek 1 and must be played by ' +
      CHIP_HALF_DEADLINE +
      '. You cannot play it in Gameweek 1. The second is available after that deadline, for the rest of the season. They do not carry over. You play it when you confirm transfers, and you cannot cancel it once it is played. Hits already taken earlier that gameweek are wiped, because transfers already made become free. Saved free transfers are kept. If a player you sell has risen in price, you still keep only half the profit, rounded down to £0.1m.',
    whenToPlay: [
      'Ahead of a fixture swing, often somewhere in Gameweeks 6 to 10 for the first Wildcard, once you know who is actually starting.',
      'When three or more problems have piled up (injuries, lost minutes, a bad run) and free transfers will not fix them.',
      'Over an international break, if you need the extra time to move the squad.',
      'In the spring, a week or two before a double, so the Bench Boost has 15 starters.',
      'Do not burn it after one poor gameweek if the minutes and the fixtures are still fine.',
    ],
    replay2025:
      'Wildcard was never played on the 2025/26 reconstructive path, including before the Gameweek 34 blank. Chip planning is the largest gap before treating 2,010 as a complete-policy score.',
    scenario: {
      label: '2025/26 replay context. Wildcard was not used.',
      title: 'The season totals do not measure Wildcard value',
      body:
        'The optimiser finished on 2,010 points and the template on 1,990. Neither path used a chip. The 20-point gap compares those recorded squad paths. It does not show what a Wildcard would have added.',
      sourceLabel: '2025/26 season replay snapshot',
      sourcePath: '/seasons/2025-26/snapshot.json',
      sourceDetail: 'Data used: optimiserPoints (2010), templatePoints (1990) and chipsPlayed (empty).',
    },
    faqs: [
      {
        q: 'What does wildcard mean in FPL?',
        a: 'Wildcard in FPL means unlimited free transfers for one gameweek, and the new squad stays. You get two in 2026/27, one in each half.',
      },
      {
        q: 'What is the wildcard FPL meaning?',
        a: 'The wildcard in FPL means you can rebuild for free and keep the new squad. Every transfer that gameweek is free, including transfers you have already made, so a hit from earlier in the week is wiped. You get two in 2026/27.',
      },
      {
        q: 'What is a wildcard in FPL?',
        a: 'A wildcard in FPL is the chip that makes every transfer that gameweek free, and the new 15 stays. You get two in 2026/27. You cannot play Wildcard in Gameweek 1, and you cannot cancel it once you have confirmed it.',
      },
      {
        q: 'How many wildcards do you get in FPL?',
        a: 'You get two wildcards in FPL 2026/27, one in each half. The first must be played by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027, or it is lost. The second is available after that deadline, until the end of the season.',
      },
      {
        q: 'What does a wildcard do in FPL?',
        a: 'A wildcard takes the points cost off your transfers for that gameweek and keeps the squad you build. Saved free transfers stay for the next gameweek. If you had two saved, you still have two.',
      },
    ],
  },
];

export function getChipHub(slug: string): ChipHubContent | null {
  return CHIP_HUB_CONTENT.find((hub) => hub.slug === slug || hub.id === slug) ?? null;
}

export interface ChipIndexFaq {
  q: string;
  a: string;
  links?: Array<{ href: string; label: string }>;
}

export const CHIPS_INDEX_FAQS: ChipIndexFaq[] = [
  {
    q: 'What are the FPL chips?',
    a: 'The FPL chips are Triple Captain, Bench Boost, Free Hit and Wildcard. You get two of each in 2026/27, eight in total. Only one chip can be played in a gameweek.',
    links: [
      { href: '/chips/triple-captain', label: 'Triple Captain' },
      { href: '/chips/bench-boost', label: 'Bench Boost' },
      { href: '/chips/free-hit', label: 'Free Hit' },
      { href: '/chips/wildcard', label: 'Wildcard' },
    ],
  },
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
    q: 'Do FPL chips reset in January?',
    a: 'Yes, FPL chips reset on Friday 1 January 2027, at the Gameweek 19 deadline of 18:30 GMT. The first Wildcard, Free Hit, Bench Boost and Triple Captain do not carry over. A new set of four is available from Gameweek 20.',
    links: [
      { href: '/chips/wildcard', label: 'Wildcard' },
      { href: '/chips/free-hit', label: 'Free Hit' },
      { href: '/chips/bench-boost', label: 'Bench Boost' },
      { href: '/chips/triple-captain', label: 'Triple Captain' },
    ],
  },
  {
    q: 'How many FPL chips do you get?',
    a: 'You get eight FPL chips in 2026/27: two Triple Captains, two Bench Boosts, two Free Hits and two Wildcards. The first of each is lost if it is still unused at the Gameweek 19 deadline.',
    links: [
      { href: '/chips/triple-captain', label: 'Triple Captains' },
      { href: '/chips/bench-boost', label: 'Bench Boosts' },
      { href: '/chips/free-hit', label: 'Free Hits' },
      { href: '/chips/wildcard', label: 'Wildcards' },
    ],
  },
  {
    q: 'When do chips reset in FPL?',
    a: 'Chips in FPL reset when the Gameweek 19 deadline passes. In 2026/27 that is 18:30 GMT on Friday 1 January 2027. You then have a fresh Wildcard, Free Hit, Bench Boost and Triple Captain from Gameweek 20.',
    links: [
      { href: '/chips/wildcard', label: 'Wildcard' },
      { href: '/chips/free-hit', label: 'Free Hit' },
      { href: '/chips/bench-boost', label: 'Bench Boost' },
      { href: '/chips/triple-captain', label: 'Triple Captain' },
    ],
  },
];
