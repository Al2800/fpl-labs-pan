'use client';

import { useState } from 'react';
import { ValidatedPlan } from '@/types/fpl';
import { SquadTable } from '@/components/SquadTable';
import { PitchLineup } from '@/components/PitchLineup';

interface SquadViewProps {
  plan: ValidatedPlan;
}

export function SquadView({ plan }: SquadViewProps) {
  const [view, setView] = useState<'table' | 'pitch'>('table');

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Squad</h2>
        <div className="flex border border-neutral-300 text-sm">
          <button
            type="button"
            onClick={() => setView('table')}
            aria-pressed={view === 'table'}
            className={`px-3 py-1 ${view === 'table' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'}`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setView('pitch')}
            aria-pressed={view === 'pitch'}
            className={`px-3 py-1 border-l border-neutral-300 ${view === 'pitch' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'}`}
          >
            Pitch
          </button>
        </div>
      </div>
      {view === 'table' ? <SquadTable plan={plan} /> : <PitchLineup plan={plan} />}
    </section>
  );
}
