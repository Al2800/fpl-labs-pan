import { getSeasonIndex } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ season: '2025-26' }, { season: '2026-27' }];
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
