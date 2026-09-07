import { CHIP_IDS } from '@/lib/present';
import { getAllGameweeks, getChipScenario } from '@/lib/data';
import { snapshotNotFound, snapshotResponse } from '@/lib/snapshot';
import { ChipType } from '@/types/fpl';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const params: Array<{ chip: string; n: string }> = [];
  for (const chip of CHIP_IDS) {
    for (const gw of getAllGameweeks()) {
      params.push({ chip, n: gw.gw.toString() });
    }
  }
  return params;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chip: string; n: string }> }
) {
  const { chip, n } = await params;
  const gwNum = parseInt(n, 10);

  if (!CHIP_IDS.includes(chip as Exclude<ChipType, 'none'>)) {
    return snapshotNotFound();
  }

  const data = getChipScenario(chip as ChipType, gwNum);
  if (!data) {
    return snapshotNotFound();
  }

  return snapshotResponse(data, data.solverSettings.snapshotHash);
}
