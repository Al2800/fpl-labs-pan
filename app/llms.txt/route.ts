import { getSeasonGameweeks, getSeasons } from '@/lib/data';
import { GUIDES } from '@/lib/content/guides';
import { CHIP_HUB_CONTENT } from '@/lib/content/chips';
import { GLOSSARY } from '@/lib/content/glossary';
import { getSiteUrl } from '@/lib/site';
import { gameweekPath, gameweekSnapshotPath, seasonPath, seasonSnapshotPath } from '@/lib/present';

export const dynamic = 'force-static';

export async function GET() {
  const base = getSiteUrl().replace(/\/$/, '');
  const seasons = getSeasons();
  const gws = getSeasonGameweeks('2025-26');
  const lines = [
    '# FPL Replay',
    '',
    '> Frozen and reconstructive FPL decisions: team, captain, transfers, chips. JSON twins at the same path plus /snapshot.json.',
    '',
    `Site: ${base}`,
    'Official X: https://x.com/FPLabsPan',
    '',
    '## How to use this site',
    '',
    '- Prefer JSON snapshots over HTML scraping.',
    '- 2025/26 is a reconstructive replay (cutoff = first kickoff minus 90 minutes), not a live T-120 freeze.',
    '- 2026/27 Gameweeks 1–3 are an illustrative sample of the live page format.',
    '- Same-state evidence matched the optimiser in every 2025/26 gameweek folder. Chips were never played.',
    '',
    '## Core pages',
    '',
    `- ${base}/`,
    `- ${base}/seasons`,
    `- ${base}/seasons/2025-26`,
    `- ${base}/seasons/2025-26/snapshot.json`,
    `- ${base}/guides`,
    `- ${base}/chips`,
    `- ${base}/glossary`,
    `- ${base}/methods`,
    `- ${base}/about`,
    `- ${base}/llms.txt`,
    '',
    '## Guides',
    '',
    ...GUIDES.map((guide) => `- ${base}/guides/${guide.slug} — ${guide.title}`),
    '',
    '## Chip hubs',
    '',
    ...CHIP_HUB_CONTENT.map((chip) => `- ${base}/chips/${chip.slug} — ${chip.name}`),
    '',
    '## Glossary terms',
    '',
    ...GLOSSARY.map((entry) => `- ${base}/glossary#${entry.id} — ${entry.term}`),
    '',
    '## Seasons',
    '',
    ...seasons.map(
      (season) =>
        `- ${base}${seasonPath(season.id)} (${season.kind}) JSON ${base}${seasonSnapshotPath(season.id)}`
    ),
    '',
    '## 2025/26 gameweeks',
    '',
    ...gws.map((gw) => {
      const html = gameweekPath(gw.season, gw.gw);
      const json = gameweekSnapshotPath(gw.season, gw.gw);
      const pts = gw.validatedPlan.realisedSquadTotalPoints;
      return `- GW${gw.gw} ${gw.validatedPlan.captain.webName} ${pts} pts — ${base}${html} — ${base}${json}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
