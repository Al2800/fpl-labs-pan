import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getAdjacentGameweeks,
  getChipScenario,
  getDemoGameweeks,
  getGameweekDecision,
  getSimsForGameweek,
} from '@/lib/data';
import { ChipScenarioData } from '@/types/fpl';
import { GameweekDecisionView } from '@/components/GameweekDecisionView';
import {
  CHIP_IDS,
  gameweekAnswer,
  gameweekHeading,
  gameweekPath,
  gameweekSnapshotPath,
  jsonAlternate,
} from '@/lib/present';

interface PageProps {
  params: Promise<{ n: string }>;
}

export function generateStaticParams() {
  return getDemoGameweeks().map((gw) => ({ n: gw.gw.toString() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { n } = await params;
  const decision = getGameweekDecision(parseInt(n, 10));

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
    openGraph: {
      title,
      description,
    },
  };
}

export default async function GameweekDecisionPage({ params }: PageProps) {
  const { n } = await params;
  const gwNum = parseInt(n, 10);
  const decision = getGameweekDecision(gwNum);

  if (!decision) {
    notFound();
  }

  const { prev, next } = getAdjacentGameweeks(decision.season, decision.gw);
  const sims = getSimsForGameweek(decision.season, decision.gw);
  const chips = CHIP_IDS.map((chip) => getChipScenario(chip, decision.gw)).filter(
    (chip): chip is ChipScenarioData => chip !== null
  );

  return (
    <GameweekDecisionView
      decision={decision}
      snapshotHref={gameweekSnapshotPath(decision.season, decision.gw)}
      indexHref="/decisions"
      indexLabel="Sample decisions"
      prevHref={prev ? gameweekPath(prev.season, prev.gw) : null}
      nextHref={next ? gameweekPath(next.season, next.gw) : null}
      prevGw={prev?.gw ?? null}
      nextGw={next?.gw ?? null}
      chips={chips}
      sims={sims}
    />
  );
}
