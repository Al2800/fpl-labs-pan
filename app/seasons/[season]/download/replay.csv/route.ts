import { LIVE_SEASON_ID, REPLAY_SEASON_ID, replayDatasetCsv } from '@/lib/replay-2025';

export const dynamic = 'force-static';
export const dynamicParams = false;

const SEASONS = [REPLAY_SEASON_ID, LIVE_SEASON_ID];

export function generateStaticParams() {
  return SEASONS.map((season) => ({ season }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ season: string }> }
) {
  const { season } = await params;
  if (!SEASONS.includes(season)) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(replayDatasetCsv(season), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fpl-replay-${season}.csv"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
