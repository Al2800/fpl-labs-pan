import { getSeasonGameweeks, getSeasons } from '@/lib/data';
import { GUIDES } from '@/lib/content/guides';
import { DEADLINES_GUIDE_PATH, DEADLINES_GUIDE_TITLE } from '@/lib/content/deadlines-2026-27';
import { CHIP_HUB_CONTENT } from '@/lib/content/chips';
import { GLOSSARY } from '@/lib/content/glossary';
import { getSiteUrl } from '@/lib/site';
import { gameweekPath, gameweekSnapshotPath, seasonPath, seasonSnapshotPath } from '@/lib/present';
import { LIVE_DOWNLOAD_PATH, REPLAY_DOWNLOAD_PATH } from '@/lib/replay-2025';

export const dynamic = 'force-static';

export async function GET() {
  const base = getSiteUrl().replace(/\/$/, '');
  const seasons = getSeasons();
  const gws = getSeasonGameweeks('2025-26');
  const live = getSeasonGameweeks('2026-27');
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
    '- 2025/26 is a reconstructive replay (cutoff = first kickoff minus 90 minutes), not a live two-hour freeze.',
    '- 2026/27 Gameweeks 1 to 10 are the same kind of reconstructive replay. They were not frozen before the deadline.',
    '- From Gameweek 11 the 2026/27 pick is frozen before the official deadline. The weekly job aims for about two hours before. An early publish can be replaced once inside that window. Scoring fills official points and does not change the plan hash.',
    '- The 2026/27 solver is the public WP-07 bounded search in https://github.com/Al2800/FPL. It is a one-week search after Gameweek 1. Chips are not in the search. Evidence copies the optimiser.',
    '- Same-state evidence matched the optimiser in every 2025/26 gameweek folder. Chips were never played.',
    '- In 2026/27 managers get two of each chip. The first set must be used by the Gameweek 19 deadline, 18:30 GMT on Friday 1 January 2027.',
    '',
    '## Core pages',
    '',
    `- ${base}/`,
    `- ${base}/seasons`,
    `- ${base}/seasons/2026-27`,
    `- ${base}${LIVE_DOWNLOAD_PATH}`,
    `- ${base}/seasons/2025-26`,
    `- ${base}${REPLAY_DOWNLOAD_PATH}`,
    `- ${base}/guides`,
    `- ${base}/chips`,
    `- ${base}/chips/calculator`,
    `- ${base}/glossary`,
    `- ${base}/methods`,
    `- ${base}/about`,
    `- ${base}/llms.txt`,
    '',
    '## Guides',
    '',
    `- ${base}${DEADLINES_GUIDE_PATH}: ${DEADLINES_GUIDE_TITLE}`,
    ...GUIDES.map((guide) => `- ${base}/guides/${guide.slug}: ${guide.title}`),
    '',
    '## Chip hubs',
    '',
    ...CHIP_HUB_CONTENT.map((chip) => `- ${base}/chips/${chip.slug}: ${chip.name}`),
    '',
    '## Glossary terms',
    '',
    ...GLOSSARY.map((entry) => `- ${base}/glossary#${entry.id}: ${entry.term}`),
    '',
    '## Seasons',
    '',
    ...seasons.map(
      (season) =>
        `- ${base}${seasonPath(season.id)} (${season.kind}) JSON ${base}${seasonSnapshotPath(season.id)}`
    ),
    '',
    '## 2026/27 gameweeks',
    '',
    ...live.map((gw) => {
      const html = gameweekPath(gw.season, gw.gw);
      const json = gameweekSnapshotPath(gw.season, gw.gw);
      const pts = gw.validatedPlan.realisedSquadTotalPoints;
      const score = pts === null ? 'pending' : `${pts} pts`;
      const mode = gw.provenance.freezeMode ?? gw.datasetKind;
      return `- GW${gw.gw} ${gw.validatedPlan.captain.webName} ${score} (${mode}): ${base}${html} | ${base}${json}`;
    }),
    '',
    '## 2025/26 gameweeks',
    '',
    ...gws.map((gw) => {
      const html = gameweekPath(gw.season, gw.gw);
      const json = gameweekSnapshotPath(gw.season, gw.gw);
      const pts = gw.validatedPlan.realisedSquadTotalPoints;
      return `- GW${gw.gw} ${gw.validatedPlan.captain.webName} ${pts} pts: ${base}${html} | ${base}${json}`;
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
