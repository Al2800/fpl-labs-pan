import type { MetadataRoute } from 'next';
import { getAllGameweeks, getAllSims } from '@/lib/data';
import { ARM_IDS, CHIP_IDS } from '@/lib/present';
import { getSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const gameweeks = getAllGameweeks();
  const sims = getAllSims();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/decisions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sims`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/methods`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  for (const gw of gameweeks) {
    routes.push({
      url: `${baseUrl}/decisions/gw/${gw.gw}`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: gw.status === 'live' ? 'hourly' : 'weekly',
      priority: 0.9,
    });
    routes.push({
      url: `${baseUrl}/decisions/gw/${gw.gw}/snapshot.json`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: 'weekly',
      priority: 0.4,
    });

    for (const arm of ARM_IDS) {
      routes.push({
        url: `${baseUrl}/replays/${gw.season}/gw/${gw.gw}/${arm}`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
      routes.push({
        url: `${baseUrl}/replays/${gw.season}/gw/${gw.gw}/${arm}/snapshot.json`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.3,
      });
    }

    for (const chip of CHIP_IDS) {
      routes.push({
        url: `${baseUrl}/chips/${chip}/gw/${gw.gw}`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      routes.push({
        url: `${baseUrl}/chips/${chip}/gw/${gw.gw}/snapshot.json`,
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
      priority: 0.75,
    });
    routes.push({
      url: `${baseUrl}/sims/${sim.season}/gw/${sim.gw}/${sim.slug}/snapshot.json`,
      lastModified: new Date(sim.provenance.frozenAt),
      changeFrequency: 'weekly',
      priority: 0.3,
    });
  }

  return routes;
}
