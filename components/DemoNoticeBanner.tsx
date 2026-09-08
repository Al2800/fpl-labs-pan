import Link from 'next/link';

export function DemoNoticeBanner() {
  return (
    <div className="border-b border-neutral-200 bg-neutral-100 text-sm text-neutral-700 px-4 py-2">
      <p className="max-w-5xl mx-auto">
        2025/26 is a reconstructive replay (cutoff = first kickoff − 90 minutes, not a live two-hour
        freeze). 2026/27 pages are an illustrative sample of the live format.{' '}
        <Link href="/guides/reconstructive-replay" className="underline underline-offset-2">
          What that means
        </Link>
      </p>
    </div>
  );
}
