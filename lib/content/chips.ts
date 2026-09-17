import { ChipType } from '@/types/fpl';

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
  faqs: Array<{ q: string; a: string }>;
}

export const CHIP_HUB_CONTENT: ChipHubContent[] = [
  {
    id: 'tc',
    slug: 'triple-captain',
    name: 'Triple Captain',
    metaTitle: 'When to Play Triple Captain in FPL: Rules & Timing',
    metaDescription:
      'Triple Captain rules and timing in FPL: how vice-captaincy works, picking the right double gameweek, minutes security, and avoiding single-fixture blanks.',
    h1: 'When to play Triple Captain in FPL',
    oneLiner:
      'Triple Captain triples your captain’s score instead of doubling it. Save it for a secure premium talisman playing twice in an attractive double gameweek.',
    howItWorks:
      'The selected captain scores three times their official FPL points instead of two. If your captain plays even one minute across the gameweek, the chip is deemed active and spent. The vice-captain only inherits the triple multiplier if your primary captain records zero minutes across all scheduled fixtures in that round.',
    whenToPlay: [
      'A confirmed double gameweek featuring an elite, penalty-taking talisman with two favourable home matches and zero rotation risk.',
      'When underlying non-penalty expected goals (npxG) and expected goal involvement (xGI) comfortably outstrip all rival options.',
      'A high-ceiling single gameweek only if late-season double gameweeks fail to produce a secure 180-minute option.',
      'Never spend the chip on a player carrying an unresolved knock or facing two difficult away fixtures against top-six defences.',
    ],
    replay2025:
      'The 2025/26 reconstructive path never played Triple Captain. That is a deliberate omission in the historical replay policy rather than evidence that the chip lacked scoring power.',
    faqs: [
      {
        q: 'When should I play Triple Captain in FPL?',
        a: 'Play Triple Captain in an attractive double gameweek where an elite, penalty-taking captain has two starts locked in and strong home fixtures.',
      },
      {
        q: 'What happens if my Triple Captain does not play?',
        a: 'If your captain plays zero minutes across the entire gameweek, the triple points multiplier passes to your vice-captain, provided they feature.',
      },
      {
        q: 'Can you change or cancel Triple Captain after the deadline?',
        a: 'No, once the gameweek deadline passes, your captaincy selection and the Triple Captain chip are locked and cannot be amended or refunded.',
      },
      {
        q: 'Can you play Triple Captain and Bench Boost together?',
        a: 'No, official FPL rules strictly permit only one active chip per gameweek. You must deploy Triple Captain, Bench Boost, Free Hit, and Wildcard in distinct gameweeks.',
      },
      {
        q: 'Did the 2025/26 lab replay use Triple Captain?',
        a: 'No, Triple Captain, Bench Boost, Free Hit, and Wildcard were all left unused on that reconstructive path.',
      },
    ],
  },
  {
    id: 'bb',
    slug: 'bench-boost',
    name: 'Bench Boost',
    metaTitle: 'Bench Boost FPL: What Is Bench Boost & When to Play',
    metaDescription:
      'Bench Boost FPL guide: what the chip does, how your substitutes score points, and the best double gameweek windows to maximise your full 15-man squad.',
    h1: 'Bench Boost FPL: what is Bench Boost and when to play',
    oneLiner:
      'Bench Boost adds your four substitutes’ points to your gameweek score. It turns all 15 squad players into active scorers for one round, so you need four reliable starters rather than cheap bench-fillers.',
    howItWorks:
      'When you activate Bench Boost, the points scored by all 15 squad members count towards your gameweek total. Points from your substitute goalkeeper and three outfield bench players are added directly to your official score. The chip can only be used once per season. Because every player on your bench is already active, standard automatic substitutions do not apply if a starter fails to play.',
    whenToPlay: [
      'During a major double gameweek late in the season (typically Gameweeks 34 to 37), allowing your four bench players to play two fixtures each for up to 30 combined squad appearances.',
      'Directly following a second Wildcard, which gives you the flexibility to build a deep, 15-man playing squad without taking points deductions to strengthen your bench.',
      'Only in a single gameweek if all four substitutes are nailed-on starters with premier home fixtures and your squad has zero injury flags.',
      'Never trigger Bench Boost when holding non-playing £4.0m keepers, youth fringe players, or defenders subject to 89th-minute rotation cameos.',
    ],
    replay2025:
      'Bench Boost was never triggered on the 2025/26 reconstructive path. The replay optimised starting selections and captains while leaving all substitute scoring value unrealised on the bench.',
    faqs: [
      {
        q: 'What is Bench Boost in FPL?',
        a: 'Bench Boost is a single-use chip that counts the points scored by all four of your substitutes alongside your starting eleven for one gameweek.',
      },
      {
        q: 'When should I play Bench Boost in FPL?',
        a: 'Play Bench Boost in a major double gameweek late in the season, usually between Gameweeks 34 and 37 when rearranged fixtures let your substitutes play twice.',
      },
      {
        q: 'What is a good score for Bench Boost in FPL?',
        a: 'A return of 15 to 25 points from your four bench players makes for a strong Bench Boost. If your substitutes only muster standard two-point appearance returns, the chip has largely been wasted.',
      },
      {
        q: 'Can you Wildcard and Bench Boost in the same gameweek?',
        a: 'No, FPL rules allow only one active chip per gameweek. The standard tactic is to Wildcard the round before, setting up a 15-man squad of doubling starters with no transfer penalties.',
      },
      {
        q: 'What happens if a bench player doesn’t play during Bench Boost?',
        a: 'If a substitute does not feature during a Bench Boost gameweek, they score zero points, just like a non-playing starter. Auto-substitutions do not step in, as every player in your squad is already considered active.',
      },
      {
        q: 'Did the 2025/26 replay play Bench Boost?',
        a: 'No, Bench Boost was never triggered on the 2025/26 reconstructive path. The published squads therefore understate what a complete FPL policy could achieve.',
      },
    ],
  },
  {
    id: 'fh',
    slug: 'free-hit',
    name: 'Free Hit',
    metaTitle: 'Free Hit FPL: When to Play the Freehit Chip & Rules',
    metaDescription:
      'Free Hit FPL guide: when to play the freehit chip, how single-gameweek squad reverts work, blank vs double gameweek tactics, and avoiding unnecessary transfer hits.',
    h1: 'Free Hit FPL: when to play the freehit chip',
    oneLiner:
      'Free Hit gives you unlimited transfers for one gameweek before your old 15-man squad returns intact. It is your main escape hatch for surviving severe blank gameweeks without dismantling your long-term team.',
    howItWorks:
      'Free Hit allows you to make unlimited transfers for a single gameweek without incurring any points deductions (-4 hits). Once the gameweek deadline passes and all matches conclude, your team resets exactly to the 15 players you owned before activating the chip. Any free transfers you had saved before triggering Free Hit will reset to one for the following week, and you do not retain any player price changes generated during the Free Hit round.',
    whenToPlay: [
      'Major blank gameweeks (frequently Gameweek 29 or 32) when FA Cup quarter-finals or semi-finals postpone half the Premier League fixture list.',
      'When you have fewer than eight active starters available in a blank and would otherwise be forced into taking heavy transfer hits to field a legal starting XI.',
      'A massive double gameweek if your core squad is entirely misaligned with the doubling clubs and you prefer a one-week attacking punt.',
      'Avoid using Free Hit for minor fixture swings or to target a single captaincy option when you already have 10 or 11 reliable starters.',
    ],
    replay2025:
      'In Gameweek 34 of the 2025/26 replay, both the optimiser and the template took an 8-point hit (three transfers with one free transfer) during a blank, scoring 28 net. Free Hit was available and held in reserve.',
    faqs: [
      {
        q: 'What is the Free Hit (freehit) chip in FPL?',
        a: 'The Free Hit chip grants unlimited transfers for a single gameweek with no points deductions, reverting to your previous 15 players as soon as the gameweek ends.',
      },
      {
        q: 'When should I play Free Hit in FPL?',
        a: 'Play Free Hit during a major blank gameweek when postponed fixtures leave you with fewer than eight or nine available starters. It saves you from taking -8 or -12 hits just to field a team.',
      },
      {
        q: 'Do you keep team value and price rises gained on a Free Hit?',
        a: 'No, you do not keep price rises or team value increases accrued while on a Free Hit. When your team reverts after the gameweek concludes, your bank balance and player purchase prices return to their exact pre-chip values.',
      },
      {
        q: 'What happens to saved free transfers when you play Free Hit?',
        a: 'If you had two saved free transfers before activating Free Hit, you will only have one free transfer available in the gameweek following the chip. Saved transfers do not carry over through a Free Hit week.',
      },
      {
        q: 'Does playing Free Hit cancel hits already taken this gameweek?',
        a: 'Yes, activating Free Hit wipes out any transfer hits (-4, -8, etc.) you had already incurred earlier in the same gameweek before confirming the chip.',
      },
      {
        q: 'What happened in 2025/26 Gameweek 34?',
        a: 'Both the optimiser and the template took an 8-point hit (three transfers, one free transfer) during the Gameweek 34 blank. Free Hit was not used, serving as a primary example of unrealised chip equity.',
      },
    ],
  },
  {
    id: 'wc',
    slug: 'wildcard',
    name: 'Wildcard',
    metaTitle: 'FPL When to Wildcard: Best Gameweeks & Timing Guide',
    metaDescription:
      'Best gameweeks to Wildcard in FPL: timing your first and second Wildcards, navigating fixture swings, international breaks, and permanent squad rebuilds.',
    h1: 'FPL when to Wildcard: strategy, rules and timing',
    oneLiner:
      'Wildcard rebuilds your entire 15-man squad permanently with no transfer penalties. Pull the trigger ahead of sustained fixture swings or when multiple injuries break your structure, not as a kneejerk reaction to one bad week.',
    howItWorks:
      'Wildcard gives you unlimited free transfers for one gameweek, and the resulting squad remains permanently in place. You receive two Wildcards per season: one for the first half of the campaign (which expires in late December) and one for the second half. Any transfer hits taken earlier in the same gameweek are eliminated the moment you confirm the chip. However, your team value only reflects locked-in prices, so selling and buying players back at a higher price still incurs the 50% profit tax.',
    whenToPlay: [
      'Ahead of a major fixture swing (typically Gameweeks 6 to 10 for the first Wildcard), rotating your funds towards teams embarking on favourable five-to-six match runs.',
      'When structural squad issues mount—three or more injuries, benchings, or players losing minutes that cannot be fixed with free transfers and a single four-point hit.',
      'During an international break if prices are fluctuating rapidly and you need two full weeks of market movement to fund your target XI.',
      'In the spring ahead of major double gameweeks (typically Gameweeks 27 to 33), setting up your 15-man bench for a future Bench Boost.',
      'Avoid burning the chip in frustration after a single sub-par gameweek when the underlying minutes and expected data for your starting XI remain healthy.',
    ],
    replay2025:
      'Wildcard was never played on the 2025/26 reconstructive path, including before the Gameweek 34 blank. Chip planning is the largest functional gap before treating 2,010 as a complete-policy score.',
    faqs: [
      {
        q: 'When should I play Wildcard in FPL?',
        a: 'Play Wildcard when your squad has at least three structural problems—such as long-term injuries, lost starting spots, or a brutal run of fixtures—that regular free transfers cannot fix.',
      },
      {
        q: 'FPL when to Wildcard: should you use it in the first or second half of the season?',
        a: 'You get two Wildcards per season: one must be played before the late December cut-off, and the second is available for the rest of the campaign. The two chips do not stack or roll over, so an unused first Wildcard is lost permanently.',
      },
      {
        q: 'Does activating Wildcard cancel transfer hits already taken?',
        a: 'Yes, activating your Wildcard immediately wipes out any transfer hits you took earlier that gameweek. Every transfer made before the deadline becomes completely free.',
      },
      {
        q: 'Is it better to Wildcard or take hits in a blank gameweek?',
        a: 'Taking a planned four-point or eight-point hit is usually wiser than burning a Wildcard if your long-term squad is in good shape. Wildcards are better saved for broad shifts into players with sustained fixture runs.',
      },
      {
        q: 'Can you cancel a Wildcard once activated?',
        a: 'No, once confirmed, an FPL Wildcard cannot be cancelled, reversed, or refunded under any circumstances. Ensure you are completely satisfied with your newly assembled squad before clicking the final confirmation button.',
      },
      {
        q: 'Should Wildcard have been used in 2025/26 Gameweek 34?',
        a: 'The 2025/26 replay took an 8-point hit in Gameweek 34 while leaving Wildcard and Free Hit unplayed. A complete human policy would evaluate whether playing Wildcard here unlocked higher net returns over the final four gameweeks.',
      },
    ],
  },
];

export function getChipHub(slug: string): ChipHubContent | null {
  return (
    CHIP_HUB_CONTENT.find((hub) => hub.slug === slug || hub.id === slug) ?? null
  );
}
