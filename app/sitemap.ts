import type { MetadataRoute } from 'next';
import { getSeasonGameweeks } from '@/lib/data';
import { CHIP_HUBS } from '@/lib/present';
import { getSiteUrl } from '@/lib/site';
import { GUIDES } from '@/lib/content/guides';
import { CHIP_CALCULATOR_PATH } from '@/lib/chip-calculator';
import { REPLAY_DOWNLOAD_PATH } from '@/lib/replay-2025';

const CONTENT_UPDATED = new Date('2026-10-06T00:00:00.000Z');
const GUIDE_UPDATED = new Date('2026-09-09T00:00:00.000Z');
const SEASON_REVIEW_UPDATED = new Date('2026-09-24T00:00:00.000Z');

const UNCHANGED_GUIDE_DATES: Record<string, Date> = {
  '2025-26-season-review': SEASON_REVIEW_UPDATED,
  'reconstructive-replay': GUIDE_UPDATED,
  'how-freeze-and-hash-work': GUIDE_UPDATED,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const replayWeeks = getSeasonGameweeks('2025-26');

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/seasons`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/seasons/2025-26`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.95 },
    {
      url: `${baseUrl}${REPLAY_DOWNLOAD_PATH}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    { url: `${baseUrl}/decisions`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/chips`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.85 },
    {
      url: `${baseUrl}${CHIP_CALCULATOR_PATH}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    { url: `${baseUrl}/guides`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sims`, lastModified: CONTENT_UPDATED, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/methods`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
  ];

  for (const hub of CHIP_HUBS) {
    routes.push({
      url: `${baseUrl}/chips/${hub.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const guide of GUIDES) {
    routes.push({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: UNCHANGED_GUIDE_DATES[guide.slug] ?? CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const gw of replayWeeks) {
    routes.push({
      url: `${baseUrl}/seasons/${gw.season}/gw/${gw.gw}`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: 'yearly',
      priority: 0.8,
    });
  }

  return routes;
}
