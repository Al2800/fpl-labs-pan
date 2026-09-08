import { ARM_IDS } from '@/lib/present';
import { getDemoGameweeks, getArmDetail } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';
import { ArmId } from '@/types/fpl';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const params: Array<{ season: string; n: string; arm: string }> = [];
  for (const gw of getDemoGameweeks()) {
    for (const arm of ARM_IDS) {
      params.push({ season: gw.season, n: gw.gw.toString(), arm });
    }
  }
  return params;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ season: string; n: string; arm: string }> }
) {
  const { season, n, arm } = await params;
  const gwNum = parseInt(n, 10);

  if (!ARM_IDS.includes(arm as ArmId)) {
    return snapshotNotFound();
  }

  const detail = getArmDetail(season, gwNum, arm as ArmId);
  if (!detail) {
    return snapshotNotFound();
  }

  return snapshotResponse(detail, detail.provenance.snapshotHash);
}
