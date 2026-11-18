import { LIVE_SEASON_ID, REPLAY_SEASON_ID, replayDatasetJson } from '@/lib/replay-2025';

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
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(replayDatasetJson(season), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="fpl-replay-${season}.json"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
