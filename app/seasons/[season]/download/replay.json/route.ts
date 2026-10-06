import { REPLAY_SEASON_ID, replayDatasetJson } from '@/lib/replay-2025';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ season: REPLAY_SEASON_ID }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ season: string }> }
) {
  const { season } = await params;
  if (season !== REPLAY_SEASON_ID) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(replayDatasetJson(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="fpl-replay-2025-26.json"',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
