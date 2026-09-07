import { getAllSims, getSimById } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllSims().map((sim) => ({
    season: sim.season,
    n: sim.gw.toString(),
    scenario: sim.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ season: string; n: string; scenario: string }> }
) {
  const { season, n, scenario } = await params;
  const gwNum = parseInt(n, 10);
  const sim = getSimById(season, gwNum, scenario);

  if (!sim) {
    return snapshotNotFound();
  }

  return snapshotResponse(sim, sim.provenance.snapshotHash);
}
