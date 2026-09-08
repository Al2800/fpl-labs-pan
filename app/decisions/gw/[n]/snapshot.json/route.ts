import { getDemoGameweeks, getGameweekDecision } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getDemoGameweeks().map((gw) => ({ n: gw.gw.toString() }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ n: string }> }
) {
  const { n } = await params;
  const gwNum = parseInt(n, 10);
  const decision = getGameweekDecision(gwNum);

  if (!decision) {
    return snapshotNotFound();
  }

  return snapshotResponse(decision, decision.provenance.snapshotHash);
}
