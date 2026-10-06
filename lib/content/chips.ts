import { ChipType } from '@/types/fpl';
import { CHIP_HALF_DEADLINE, CHIP_RESET_ANSWER, SAVED_TRANSFERS_KEPT } from '@/lib/content/chip-rules';

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
    metaTitle: 'Triple Captain FPL: What It Is and How Many',
    metaDescription:
      'Triple Captain in FPL triples your captain’s points for one gameweek. You get two in 2026/27, one each half. The first must be used by the GW19 deadline.',
    h1: 'What is Triple Captain in FPL?',
    oneLiner:
      'Triple Captain in FPL triples your chosen captain’s official points instead of doubling them. You get two in 2026/27, one in each half of the season. The first has to be used by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027. Hold it for a secure premium with two starts in a confirmed double, not a one-off single fixture.',
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
        q: 'What is Triple Captain in FPL?',
        a: 'Triple Captain in FPL multiplies your captain’s official points by three for one gameweek, instead of the usual double. You get two in 2026/27, one in each half, and the chip is spent as soon as your captain records any minutes.',
      },
      {
        q: 'How many Triple Captains do you get in FPL?',
        a: 'You get two Triple Captains in FPL 2026/27, one in each half of the season. The first has to be used by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027. If you leave it, it is lost. The second is available from Gameweek 20.',
      },
      {
        q: 'When should I play Triple Captain in FPL?',
        a: 'Play Triple Captain in an attractive double gameweek where an elite, penalty-taking captain has two starts locked in and strong home fixtures. A single-fixture week is a last resort if the later doubles never deliver a secure option.',
      },
      {
        q: 'Does Triple Captain work better in a double gameweek?',
        a: 'Yes. In a double gameweek your captain can play twice, so the 3x multiplier covers both fixtures if they start both. That is why most managers hold the chip for a confirmed double rather than a single home fixture.',
      },
      {
        q: 'What happens if my Triple Captain does not play?',
        a: 'If your captain plays zero minutes across the gameweek, the triple multiplier passes to your vice-captain, if the vice plays. If the captain plays even one minute, the chip is spent and the vice does not inherit the 3x.',
      },
      {
        q: 'Can you cancel Triple Captain after you have played it?',
        a: 'You can cancel Triple Captain before the gameweek deadline. Once the deadline has passed, the captain and the chip are locked.',
      },
      {
        q: 'Can you play Triple Captain and Bench Boost together?',
        a: 'No. Official FPL rules allow only one chip in a gameweek. Triple Captain, Bench Boost, Free Hit and Wildcard have to go in different gameweeks.',
      },
      {
        q: 'Did the 2025/26 lab replay use Triple Captain?',
        a: 'No. The 2025/26 reconstructive path left Triple Captain, Bench Boost, Free Hit and Wildcard unused across all 38 gameweeks. The captain log on this page is who was captained at the normal double. Any “added points” line is arithmetic, not a chip that was played.',
      },
    ],
  },
  {
    id: 'bb',
    slug: 'bench-boost',
    name: 'Bench Boost',
    metaTitle: 'What Is Bench Boost in FPL? Rules and When to Play',
    metaDescription:
      'Bench Boost in FPL adds your four substitutes’ points for one gameweek. You get two in 2026/27, one each half. Often best when the bench plays twice.',
    h1: 'What is Bench Boost in FPL?',
    oneLiner:
      'Bench Boost in FPL adds the points from your four substitutes to your gameweek score. You get two in 2026/27, one in each half of the season. The first has to be used by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027. Hold it for a confirmed double where those four can play twice, rather than a bench of players who will not start.',
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
        q: 'What is Bench Boost in FPL?',
        a: 'Bench Boost in FPL adds the points from your four substitutes to your score for one gameweek. You get two in 2026/27, one in each half. The starting eleven still score as usual.',
      },
      {
        q: 'Is Bench Boost once a season?',
        a: 'No. You get two Bench Boosts in FPL 2026/27, one in each half of the season. The first has to be used by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027, or it is lost. The second is available from Gameweek 20.',
      },
      {
        q: 'How does Bench Boost work in FPL?',
        a: 'Bench Boost counts all 15 players for one gameweek. Your starting eleven score as usual, and the points from your four substitutes are added on top. Automatic substitutions do not apply, because the bench is already active.',
      },
      {
        q: 'Can you play Bench Boost in a single gameweek?',
        a: 'Yes. You can play Bench Boost in a single gameweek. It adds your four substitutes’ points for that one round, even when each club plays only once. A double is usually the better time, because those bench players can play twice.',
      },
      {
        q: 'When should I play Bench Boost in FPL?',
        a: 'Play Bench Boost when your four substitutes actually start. A double gameweek is the usual spot. In the first half you can also play it in Gameweek 1, or straight after a Wildcard, if the whole 15 have a match.',
      },
      {
        q: 'What is a good score for Bench Boost in FPL?',
        a: 'A strong Bench Boost is one where the four substitutes actually start. If they only bring appearance points, the chip has not done much. The 2025/26 table on this page is the substitutes’ recorded scores. Those figures are arithmetic, not a Bench Boost the replay played.',
      },
      {
        q: 'Can you Wildcard and Bench Boost in the same gameweek?',
        a: 'No. FPL rules allow only one chip in a gameweek. The usual move is to Wildcard the week before, then Bench Boost a 15-man squad of starters.',
      },
      {
        q: 'What happens if a bench player does not play during Bench Boost?',
        a: 'They score zero, the same as a starter who does not play. Automatic substitutions do not step in, because every player in the squad is already active.',
      },
      {
        q: 'Did the 2025/26 replay play Bench Boost?',
        a: 'No. Bench Boost was never played on the 2025/26 path. The bench table adds up the four substitutes’ recorded scores. Those totals are arithmetic, not a Bench Boost the replay played.',
      },
    ],
  },
  {
    id: 'fh',
    slug: 'free-hit',
    name: 'Free Hit',
    metaTitle: 'FPL Free Hit: What Is a Free Hit (Freehit)?',
    metaDescription:
      'A Free Hit in FPL is a one-week squad: unlimited transfers, then your old 15 return. You get two, one each half. Save it for a blank week.',
    h1: 'What is Free Hit in FPL?',
    oneLiner:
      'A Free Hit in FPL (also written freehit) is a one-week squad. You can make as many transfers as you like for that gameweek, with no points hit, and your previous 15 come back afterwards. In 2026/27 you get two Free Hits, one in each half. The first has to be played by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027. You cannot play it in Gameweek 1, and you cannot play the two Free Hits in back-to-back gameweeks, so Gameweek 19 and Gameweek 20 is not allowed. Save it for a blank week. If you want the new squad to stay, that is a Wildcard.',
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
        q: 'What is Free Hit in FPL?',
        a: 'Free Hit in FPL is a one-week squad. You get unlimited transfers with no points deduction, and your old 15 return afterwards. It is also written freehit.',
      },
      {
        q: 'How many Free Hits do you get in FPL?',
        a: 'You get two Free Hits in FPL 2026/27, one in each half of the season. The first has to be played by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027. You cannot play Free Hit in Gameweek 1. You also cannot play the two Free Hits in consecutive gameweeks, so Gameweek 19 and Gameweek 20 back to back is not allowed.',
      },
      {
        q: 'What happens to saved free transfers when you play Free Hit?',
        a: SAVED_TRANSFERS_KEPT,
      },
      {
        q: 'How does Free Hit differ from Wildcard?',
        a: 'Free Hit gives your old squad back after one gameweek. Wildcard keeps the new 15. Both allow unlimited transfers, with no points hit, in the week you play them. Both also keep your saved free transfers.',
      },
      {
        q: 'Is Free Hit a one-week squad for a blank week?',
        a: 'Yes. A Free Hit is a squad for one gameweek, and a blank week is the usual reason to play it. You cover the postponed fixtures, then your previous 15 return. A double is the other case, and only when your season squad is aimed at the wrong clubs.',
      },
      {
        q: 'When should I play Free Hit in FPL?',
        a: 'Play Free Hit in a blank gameweek when postponed fixtures leave you short of starters. It saves a stack of hits just to field a team, and your long-term squad comes back the next week.',
      },
      {
        q: 'Do you keep the Free Hit squad, and what about price changes?',
        a: 'No. The squad does not stay. At the next deadline it goes back to how it was at the start of the Free Hit gameweek. The published chip rules stop there. They do not spell out a separate price-rise rule.',
      },
      {
        q: 'Can you cancel a Free Hit?',
        a: 'No. Free Hit is played when you confirm your transfers, and it cannot be cancelled once confirmed. Bench Boost and Triple Captain can still be cancelled before the deadline.',
      },
      {
        q: 'What happened in the 2025/26 blank gameweeks?',
        a: 'The replay did not play Free Hit in the blank weeks. The numbers are on the card above, taken from the squad files.',
      },
    ],
  },
  {
    id: 'wc',
    slug: 'wildcard',
    name: 'Wildcard',
    metaTitle: 'Wildcard Meaning in FPL: When to Wildcard',
    metaDescription:
      'Wildcard meaning in FPL: unlimited free transfers for one gameweek, and the new squad stays. Two per season. The first must be used by the GW19 deadline on 2 Jan 2027.',
    h1: 'Wildcard meaning in FPL',
    oneLiner:
      'Wildcard meaning in FPL: unlimited free transfers for one gameweek, and the new squad stays. You get two in 2026/27, one in each half. The first has to be played by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027, or it is lost. Use it for a run of bad fixtures or several injuries, not after one bad week.',
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
        q: 'What is the wildcard meaning in FPL?',
        a: 'Wildcard meaning in FPL: unlimited free transfers for one gameweek, and the new squad stays. Unlike Free Hit, the old squad does not come back.',
      },
      {
        q: 'How many Wildcards do you get per season?',
        a: 'You get two Wildcards in 2026/27, one in each half. The first must be played by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027, or it is lost. The second is available after that deadline. They do not roll over. You cannot play Wildcard in Gameweek 1.',
      },
      {
        q: 'Do you keep saved free transfers after a Wildcard?',
        a: SAVED_TRANSFERS_KEPT,
      },
      {
        q: 'When should I play Wildcard in FPL?',
        a: 'Play Wildcard when the squad has at least three problems you cannot fix with free transfers, such as long-term injuries, lost starting spots, or a bad run of fixtures.',
      },
      {
        q: 'When to Wildcard: first half or second half of the season?',
        a: 'Play the first Wildcard in the first half, before the Gameweek 19 deadline on 2 January 2027, when the squad needs a permanent rebuild. Keep the second for later. If you leave the first one unused, it is lost.',
      },
      {
        q: 'Does activating Wildcard cancel transfer hits already taken?',
        a: 'Yes. The rules say all transfers already made in that gameweek are free once you play Wildcard. The hits from earlier in the week are wiped.',
      },
      {
        q: 'Is it better to Wildcard or take hits in a blank gameweek?',
        a: 'A planned four-point or eight-point hit is often enough if the long-term squad is fine. Wildcard is better kept for a wider move onto players with a sustained run of fixtures. In the 2025/26 replay, Gameweek 31 used banked free transfers and no chip.',
      },
      {
        q: 'Can you cancel a Wildcard once activated?',
        a: 'No. Once you confirm a Wildcard, you cannot cancel it or get it back. Check the new squad before you confirm.',
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
    a: 'The FPL chips are Triple Captain, Bench Boost, Free Hit and Wildcard. Each hub on this page covers one of them. You get two of each in 2026/27.',
    links: [
      { href: '/chips/triple-captain', label: 'Triple Captain' },
      { href: '/chips/bench-boost', label: 'Bench Boost' },
      { href: '/chips/free-hit', label: 'Free Hit' },
      { href: '/chips/wildcard', label: 'Wildcard' },
    ],
  },
  {
    q: 'How many chips are there in FPL?',
    a: 'There are eight chips in 2026/27: two each of Triple Captain, Bench Boost, Free Hit and Wildcard. Only one chip can be played in a gameweek.',
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
    q: 'Can you play more than one chip in a season?',
    a: 'Yes. You play them in different gameweeks. You get two of each chip, eight in total. The first set is lost if you have not used it by the Gameweek 19 deadline, 13:30 GMT on Saturday 2 January 2027.',
  },
  {
    q: 'Can you play two chips in one gameweek?',
    a: 'No. Official FPL rules allow only one chip in a gameweek. Triple Captain, Bench Boost, Free Hit and Wildcard have to go in different gameweeks.',
  },
  {
    q: 'Where does Triple Captain fit?',
    a: 'Triple Captain triples your captain’s official points for one gameweek, instead of doubling them. You get two, one in each half. The Triple Captain hub covers the rules and the 2025/26 captain log.',
    links: [{ href: '/chips/triple-captain', label: 'Triple Captain hub' }],
  },
  {
    q: 'Where does Bench Boost fit?',
    a: 'Bench Boost adds the points from your four substitutes for one gameweek. You get two, one in each half. The Bench Boost hub covers the rules and the 2025/26 bench points.',
    links: [{ href: '/chips/bench-boost', label: 'Bench Boost hub' }],
  },
  {
    q: 'Where does Free Hit fit?',
    a: 'Free Hit is a one-week squad: unlimited transfers for that gameweek, with no points deduction, then your previous 15 return. You get two, and you cannot play them back to back. The Free Hit hub covers the rules.',
    links: [{ href: '/chips/free-hit', label: 'Free Hit hub' }],
  },
  {
    q: 'Where does Wildcard fit?',
    a: 'Wildcard gives you unlimited free transfers for one gameweek, and the new squad stays. You get two. An unused first Wildcard is lost at the Gameweek 19 deadline on 2 January 2027. The Wildcard hub covers the rules.',
    links: [{ href: '/chips/wildcard', label: 'Wildcard hub' }],
  },
];
