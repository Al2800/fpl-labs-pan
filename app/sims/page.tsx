import Link from 'next/link';
import { Metadata } from 'next';
import { getAllSims } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList, gameweekPath, seasonLabel, simAnswer, simPath } from '@/lib/present';

export const metadata: Metadata = {
  title: 'FPL what-ifs',
  description:
    'What-if FPL decisions held to the same pre-deadline freeze: Haaland vs no Haaland, chip timing, and template vs optimiser.',
};

export default function SimsIndexPage() {
  const sims = getAllSims();

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'What-ifs', path: '/sims' },
        ])}
      />

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">FPL what-ifs</h1>
        <p className="text-neutral-700 max-w-3xl leading-relaxed">
          Each what-if holds pre-deadline odds and minutes fixed, then changes one decision — a
          player, a chip, or an approach — and scores both paths against official points.
        </p>
      </header>

      <ul className="space-y-4">
        {sims.map((sim) => {
          const control = sim.arms.find((arm) => arm.isControl);
          const treatment = sim.arms.find((arm) => !arm.isControl);
          return (
            <li key={sim.id} className="border border-neutral-200 bg-white p-5 space-y-3">
              <p className="text-sm text-neutral-500">
                GW{sim.gw} ({seasonLabel(sim.season)})
              </p>
              <h2 className="text-lg font-semibold">
                <Link
                  href={simPath(sim.season, sim.gw, sim.slug)}
                  className="underline underline-offset-2"
                >
                  {sim.title}
                </Link>
              </h2>
              <p className="text-neutral-800 leading-relaxed">{simAnswer(sim)}</p>
              {control && treatment ? (
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <dt className="text-neutral-500">Control</dt>
                    <dd>
                      {control.projectedEP.toFixed(1)} xP
                      {control.realisedPoints !== null ? ` · ${control.realisedPoints} pts` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Alternative</dt>
                    <dd>
                      {treatment.projectedEP.toFixed(1)} xP
                      {treatment.realisedPoints !== null ? ` · ${treatment.realisedPoints} pts` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Model delta</dt>
                    <dd>
                      {treatment.deltaVsControl >= 0 ? '+' : ''}
                      {treatment.deltaVsControl.toFixed(1)} xP
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Related</dt>
                    <dd>
                      <Link href={gameweekPath(sim.gw)} className="underline underline-offset-2">
                        GW{sim.gw} decision
                      </Link>
                    </dd>
                  </div>
                </dl>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
