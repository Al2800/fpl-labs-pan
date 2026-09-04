import { MetadataRoute } from 'next';
import { getAllGameweeks } from '@/lib/data';
import { ChipType, ArmId } from '@/types/fpl';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fpl-labs-pan.vercel.app';
  const gameweeks = getAllGameweeks();
  const chips: ChipType[] = ['tc', 'bb', 'fh', 'wc'];
  const arms: ArmId[] = ['baseline', 'optimiser', 'agent'];

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
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

  // Add all Gameweek Decision pages (Template D)
  for (const gw of gameweeks) {
    routes.push({
      url: `${baseUrl}/decisions/gw/${gw.gw}`,
      lastModified: new Date(gw.provenance.frozenAt),
      changeFrequency: gw.status === 'live' ? 'hourly' : 'weekly',
      priority: 0.9,
    });

    // Add Arm detail replay pages
    for (const arm of arms) {
      routes.push({
        url: `${baseUrl}/replays/${gw.season}/gw/${gw.gw}/${arm}`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Add Chip scenario pages (Template C)
    for (const chip of chips) {
      routes.push({
        url: `${baseUrl}/chips/${chip}/gw/${gw.gw}`,
        lastModified: new Date(gw.provenance.frozenAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return routes;
}
