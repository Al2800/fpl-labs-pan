import { getSeasonGameweek, getSeasonGameweeks } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getSeasonGameweeks('2025-26').map((gw) => ({
    season: gw.season,
    n: gw.gw.toString(),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ season: string; n: string }> }
) {
  const { season, n } = await params;
  const decision = getSeasonGameweek(season, parseInt(n, 10));
  if (!decision) {
    return snapshotNotFound();
  }
  return snapshotResponse(decision, decision.provenance.snapshotHash);
}
