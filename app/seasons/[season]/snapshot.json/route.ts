import { getSeasonIndex, getSeasons } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';

export const dynamic = 'force-static';

export const dynamicParams = false;

export function generateStaticParams() {
  return getSeasons().map((season) => ({ season: season.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ season: string }> }
) {
  const { season } = await params;
  const index = getSeasonIndex(season);
  if (!index) {
    return snapshotNotFound();
  }
  return snapshotResponse(index, `${index.id}:${index.gameweeks}`);
}
