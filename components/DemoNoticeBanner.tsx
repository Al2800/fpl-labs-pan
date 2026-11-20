import Link from 'next/link';

function NoticeCopy() {
  return (
    <>
      2025/26 is a reconstructive replay, and so are 2026/27 Gameweeks 1 to 10. The cutoff is first
      kickoff minus 90 minutes. From Gameweek 11 the 2026/27 pick is frozen before the deadline.{' '}
      <Link href="/guides/reconstructive-replay" className="underline underline-offset-2">
        What that means
      </Link>
    </>
  );
}

export function DemoNoticeBanner({
  placement = 'top',
}: {
  placement?: 'top' | 'below-lead';
}) {
  if (placement === 'below-lead') {
    return (
      <p className="border border-neutral-200 bg-neutral-100 text-sm text-neutral-700 leading-relaxed px-4 py-3">
        <NoticeCopy />
      </p>
    );
  }

  return (
    <div className="border-b border-neutral-200 bg-neutral-100 text-sm text-neutral-700 px-4 py-2">
      <p className="max-w-5xl mx-auto">
        <NoticeCopy />
      </p>
    </div>
  );
}
