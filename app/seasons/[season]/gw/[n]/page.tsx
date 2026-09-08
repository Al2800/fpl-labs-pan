import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAdjacentGameweeks, getSeasonGameweek, getSeasonGameweeks } from '@/lib/data';
import { GameweekDecisionView } from '@/components/GameweekDecisionView';
import {
  gameweekAnswer,
  gameweekHeading,
  gameweekPath,
  gameweekSnapshotPath,
  jsonAlternate,
  seasonLabel,
} from '@/lib/present';

interface PageProps {
  params: Promise<{ season: string; n: string }>;
}

export function generateStaticParams() {
  return getSeasonGameweeks('2025-26').map((gw) => ({
    season: gw.season,
    n: gw.gw.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season, n } = await params;
  const decision = getSeasonGameweek(season, parseInt(n, 10));
  if (!decision) {
    return { title: 'Gameweek not found' };
  }
  const title = gameweekHeading(decision);
  const description = gameweekAnswer(decision);
  return {
    title,
    description,
    alternates: jsonAlternate(
      gameweekPath(decision.season, decision.gw),
      gameweekSnapshotPath(decision.season, decision.gw)
    ),
    openGraph: { title, description },
  };
}

export default async function SeasonGameweekPage({ params }: PageProps) {
  const { season, n } = await params;
  const decision = getSeasonGameweek(season, parseInt(n, 10));
  if (!decision) {
    notFound();
  }
  const { prev, next } = getAdjacentGameweeks(decision.season, decision.gw);

  return (
    <GameweekDecisionView
      decision={decision}
      snapshotHref={gameweekSnapshotPath(decision.season, decision.gw)}
      indexHref={`/seasons/${decision.season}`}
      indexLabel={`${seasonLabel(decision.season)} season`}
      prevHref={prev ? gameweekPath(prev.season, prev.gw) : null}
      nextHref={next ? gameweekPath(next.season, next.gw) : null}
      prevGw={prev?.gw ?? null}
      nextGw={next?.gw ?? null}
      chips={[]}
      sims={[]}
    />
  );
}
