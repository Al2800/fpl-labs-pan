import { ChipType } from '@/types/fpl';

export interface ChipHubContent {
  id: Exclude<ChipType, 'none'>;
  slug: string;
  name: string;
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
    oneLiner:
      'Triple Captain triples one starter’s points. Save it for a player who is very likely to start twice or who has an outsized single-fixture ceiling.',
    howItWorks:
      'The selected captain scores three times their official FPL points instead of two. If they blank, the chip is spent. Vice-captain only applies if the captain plays zero minutes.',
    whenToPlay: [
      'A reliable premium in a double gameweek is the usual default.',
      'A single-fixture Triple Captain can still be right if the alternative windows are weaker or already used.',
      'Do not spend it on a player with unresolved minutes risk just because the fixture looks good.',
    ],
    replay2025:
      'The 2025/26 reconstructive path never played Triple Captain. That is a gap in the policy, not evidence that the chip had no value.',
    faqs: [
      {
        q: 'When should I play Triple Captain?',
        a: 'Prefer a locked-in premium in a double gameweek. If no double is left, use it on the highest-confidence remaining captain rather than rolling it unused.',
      },
      {
        q: 'Did the 2025/26 lab replay use Triple Captain?',
        a: 'No. Wildcard, Free Hit, Triple Captain and Bench Boost were all left unused on that reconstructive path.',
      },
    ],
  },
  {
    id: 'bb',
    slug: 'bench-boost',
    name: 'Bench Boost',
    oneLiner:
      'Bench Boost scores your four bench players. It needs four likely starters, not four cheap names.',
    howItWorks:
      'All 15 squad players can score. The chip is wasted if bench players are rotated or have low minutes. Auto-subs still apply if a starter blanks and a bench player played.',
    whenToPlay: [
      'Best in a double gameweek where most of the bench also has two fixtures.',
      'A single-gameweek Bench Boost is only reasonable if all four bench players are likely to start.',
      'Do not boost a 4.0m third-choice goalkeeper plus three unlikely minutes.',
    ],
    replay2025:
      'Bench Boost was never played in the 2025/26 reconstructive replay. The published squads therefore understate a complete FPL policy.',
    faqs: [
      {
        q: 'When should I play Bench Boost?',
        a: 'When four bench players are likely to start, ideally with two fixtures. Minutes certainty matters more than the headline fixture swing.',
      },
      {
        q: 'Did the 2025/26 replay play Bench Boost?',
        a: 'No. The path evaluated transfers, lineups and captains while leaving chip value unrealised.',
      },
    ],
  },
  {
    id: 'fh',
    slug: 'free-hit',
    name: 'Free Hit',
    oneLiner:
      'Free Hit rebuilds the squad for one gameweek, then reverts. Use it for blanks, not for a mild upgrade.',
    howItWorks:
      'You may make unlimited transfers for one gameweek without changing your next-week squad. Hits are not the point; covering a blank or fielding 11 starters is.',
    whenToPlay: [
      'A blank gameweek with several owned players out is the classic case.',
      'A stacked double can also be right if the rest of the squad cannot be moved in time.',
      'Do not Free Hit just to chase one differential while the rest of the XI is fine.',
    ],
    replay2025:
      'In Gameweek 34 the optimiser and the template both took three transfers and an 8-point hit during a blank, instead of Free Hit or Wildcard. Free Hit was available and unused.',
    faqs: [
      {
        q: 'When should I play Free Hit?',
        a: 'When you cannot field a legal, competitive XI without wrecking next week’s squad — usually a blank. Compare it with taking hits and with Wildcard.',
      },
      {
        q: 'What happened in 2025/26 Gameweek 34?',
        a: 'Both the optimiser and the template took an 8-point hit (three transfers, one free transfer) in a blank. Free Hit was not used. That is the main chip case on this replay.',
      },
    ],
  },
  {
    id: 'wc',
    slug: 'wildcard',
    name: 'Wildcard',
    oneLiner:
      'Wildcard rebuilds the squad permanently. Spend it when the squad is structurally wrong for the next block of fixtures, not to patch one player.',
    howItWorks:
      'Unlimited transfers this gameweek; the new squad carries forward. There is typically one Wildcard in each half of the season. Hits after a poorly timed Wildcard are expensive.',
    whenToPlay: [
      'Before a long fixture swing or after several injuries have made the squad illegal or low-minutes.',
      'Before a double-gameweek block if the current 15 cannot cover it without repeated hits.',
      'Do not Wildcard to make one fashionable transfer that a free transfer could cover.',
    ],
    replay2025:
      'Wildcard was never played on the 2025/26 reconstructive path, including before the Gameweek 34 blank. Chip planning is the largest functional gap before treating 2,010 as a complete-policy score.',
    faqs: [
      {
        q: 'When should I play Wildcard?',
        a: 'When several positions are wrong for the next four-to-six weeks, or when a blank/double block cannot be covered with free transfers and hits.',
      },
      {
        q: 'Should Wildcard have been used in 2025/26 Gameweek 34?',
        a: 'The replay does not settle that. It only shows that an 8-point hit was taken while Wildcard and Free Hit remained unused. A complete policy would publish the hit ladder against those chips.',
      },
    ],
  },
];

export function getChipHub(slug: string): ChipHubContent | null {
  return (
    CHIP_HUB_CONTENT.find((hub) => hub.slug === slug || hub.id === slug) ?? null
  );
}
