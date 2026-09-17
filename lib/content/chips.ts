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
      'When to play Triple Captain in FPL: vice-captain rules, picking the optimal double gameweek, minutes security, and avoiding costly single-fixture blanks.',
    h1: 'When to play Triple Captain in FPL',
    oneLiner:
      'Triple Captain in FPL triples your nominated captain’s score instead of doubling it. Reserve it for a locked-in premium talisman playing twice in a favourable double gameweek.',
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
        a: 'When deciding when to play Triple Captain in FPL, the gold standard is a double gameweek featuring an in-form, penalty-taking premium attacker with two favourable home fixtures and guaranteed 90-minute security.',
      },
      {
        q: 'What happens if my Triple Captain does not play?',
        a: 'If your Triple Captain registers zero minutes across the entire gameweek, the triple points multiplier automatically shifts to your nominated vice-captain, provided your vice-captain plays at least one minute.',
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
      'Bench Boost FPL guide: what is Bench Boost in FPL, how your substitutes score points, and the best double gameweek timing windows to maximise your 15-man squad.',
    h1: 'Bench Boost FPL: what is Bench Boost and when to play',
    oneLiner:
      'Bench Boost FPL: what is Bench Boost in FPL and when to play it. This single-use chip counts the points scored by all four substitutes, turning your 15-man squad into active scorers for one gameweek.',
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
        a: 'What is Bench Boost in FPL? It is a single-use chip that adds the points scored by your four substitutes—one goalkeeper and three outfield players—to your overall gameweek total. In a normal gameweek, your bench only contributes if a starter plays zero minutes; with Bench Boost active, all 15 squad members score simultaneously.',
      },
      {
        q: 'When should I play Bench Boost in FPL?',
        a: 'Bench Boost FPL strategy centres on targeting a major double gameweek late in the season, typically between Gameweeks 34 and 37 when rescheduled cup ties create packed schedules. By ensuring all four of your substitutes play twice, you can extract up to eight extra player appearances from your bench.',
      },
      {
        q: 'What is a good score for Bench Boost in FPL?',
        a: 'A return of 15 to 25 points from your four bench players is generally considered a successful Bench Boost in FPL. If your substitutes only deliver the appearance points of a single gameweek (around 8 points), the chip has essentially underperformed.',
      },
      {
        q: 'Can you Wildcard and Bench Boost in the same gameweek?',
        a: 'No, FPL rules state that you can only play one chip per gameweek. The most common expert tactic is to Wildcard in the gameweek preceding your Bench Boost, locking in a full 15-man squad of double gameweek starters with no points penalties.',
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
      'The Free Hit chip (commonly searched as freehit) lets you make unlimited transfers for one gameweek before your previous 15-man squad returns intact. Deploy it to survive major blank gameweeks without wrecking your long-term team.',
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
        a: 'The Free Hit chip in FPL—frequently spelled by managers as freehit—grants you unlimited transfers for a single gameweek with zero transfer point deductions. When the gameweek ends, your squad immediately reverts back to the exact 15 players you held prior to playing the chip.',
      },
      {
        q: 'When should I play Free Hit in FPL?',
        a: 'You should play Free Hit in FPL during a major blank gameweek when postponed fixtures leave you with fewer than eight or nine playing starters. Using the freehit chip here lets you target players with guaranteed fixtures while rival managers either take -8 or -12 hits or field incomplete teams.',
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
      'Wondering when should I play Wildcard in FPL? Complete timing guide for your first and second Wildcards, fixture swings, international breaks, and squad rebuilds.',
    h1: 'FPL when to Wildcard: strategy, rules and timing',
    oneLiner:
      'FPL when to Wildcard: rebuild your entire 15-man squad permanently without points deductions. Trigger it ahead of extended fixture swings or when multiple starters lose their places, rather than kneejerking after one bad week.',
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
        a: 'When deciding when should I play Wildcard in FPL, the optimal moment arrives when your squad has at least three structural flaws—such as sustained injuries, lost starting berths, or difficult fixture turnarounds—that free transfers cannot mend. In the first half of the season, Gameweeks 6 to 10 are historically the most effective window once manager rotations and early form settle.',
      },
      {
        q: 'FPL when to Wildcard: should you use it in the first or second half of the season?',
        a: 'FPL when to Wildcard rules provide two chips per campaign: the first Wildcard must be played before the mid-season deadline in late December, and the second becomes active immediately afterwards for the remainder of the season. If you do not play your first Wildcard before the mid-season cut-off, you lose it permanently; the two chips do not roll over or stack.',
      },
      {
        q: 'Does activating Wildcard cancel transfer hits already taken?',
        a: 'Yes, activating your Wildcard immediately cancels any points deductions (transfer hits) you have accumulated in that gameweek prior to hitting confirm. All transfers completed during that gameweek window become completely free, allowing you to experiment freely right up until the deadline.',
      },
      {
        q: 'Is it better to Wildcard or take hits in a blank gameweek?',
        a: 'Taking one or two planned hits (-4 or -8) is usually preferable to burning a Wildcard if your long-term team remains sound, whereas a Wildcard is justified if you are pivoting to players with strong multi-gameweek runs. In our 2025/26 replay, the optimiser took an 8-point hit in Gameweek 34 because the squad was already strong for subsequent rounds.',
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
