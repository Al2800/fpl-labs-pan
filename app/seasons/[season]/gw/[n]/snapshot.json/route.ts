import { getSeasonGameweek, getSeasons } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getSeasons().flatMap((season) =>
    season.rows.map((row) => ({
      season: season.id,
      n: row.gw.toString(),
    }))
  );
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
