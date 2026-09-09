export const SITE_NAME = 'FPL Replay';
export const SITE_X_HANDLE = '@FPLabsPan';
export const SITE_X_URL = 'https://x.com/FPLabsPan';

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://fplreplay.com'
  );
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
