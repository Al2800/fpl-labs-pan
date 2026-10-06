import { REPLAY_SEASON_ID, replayDatasetCsv } from '@/lib/replay-2025';

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
    return new Response('Not found', { status: 404 });
  }
  return new Response(replayDatasetCsv(), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="fpl-replay-2025-26.csv"',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
