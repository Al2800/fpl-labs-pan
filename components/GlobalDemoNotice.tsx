'use client';

import { usePathname } from 'next/navigation';
import { DemoNoticeBanner } from '@/components/DemoNoticeBanner';

const CHIP_HUB_PATHS = new Set([
  '/chips/triple-captain',
  '/chips/bench-boost',
  '/chips/free-hit',
  '/chips/wildcard',
]);

export function GlobalDemoNotice() {
  const pathname = usePathname();
  if (CHIP_HUB_PATHS.has(pathname)) return null;
  return <DemoNoticeBanner />;
}
