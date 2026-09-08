import type { MetadataRoute } from 'next';
import { getDemoGameweeks, getSeasonGameweeks, getAllSims } from '@/lib/data';
import { ARM_IDS, CHIP_HUBS, CHIP_IDS } from '@/lib/present';
import { getSiteUrl } from '@/lib/site';
import { GUIDES } from '@/lib/content/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const replayWeeks = getSeasonGameweeks('2025-26');
  const demoWeeks = getDemoGameweeks();
  const sims = getAllSims();

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/seasons`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/seasons/2025-26`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/seasons/2025-26/snapshot.json`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
    { url: `${baseUrl}/decisions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/chips`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sims`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/methods`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  for (const hub of CHIP_HUBS) {
    routes.push({
      url: `${baseUrl}/chips/${hub.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const guide of GUIDES) {
    routes.push({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const gw of replayWeeks) {
    routes.push({
      url: `${baseUrl}/seasons/${gw.season}/gw/${gw.gw}`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: 'yearly',
      priority: 0.8,
    });
    routes.push({
      url: `${baseUrl}/seasons/${gw.season}/gw/${gw.gw}/snapshot.json`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: 'yearly',
      priority: 0.4,
    });
  }

  for (const gw of demoWeeks) {
    routes.push({
      url: `${baseUrl}/decisions/gw/${gw.gw}`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
    routes.push({
      url: `${baseUrl}/decisions/gw/${gw.gw}/snapshot.json`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: 'weekly',
      priority: 0.2,
    });

    for (const arm of ARM_IDS) {
      routes.push({
        url: `${baseUrl}/replays/${gw.season}/gw/${gw.gw}/${arm}`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.4,
      });
    }

    for (const chip of CHIP_IDS) {
      routes.push({
        url: `${baseUrl}/chips/${chip}/gw/${gw.gw}`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.3,
      });
    }
  }

  for (const sim of sims) {
    routes.push({
      url: `${baseUrl}/sims/${sim.season}/gw/${sim.gw}/${sim.slug}`,
      lastModified: new Date(sim.provenance.frozenAt),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  return routes;
}
