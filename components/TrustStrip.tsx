'use client';

import { useState } from 'react';
import { DatasetKind, ProvenanceMetadata } from '@/types/fpl';
import { formatUtc, shortHash, statusLabel } from '@/lib/present';

interface TrustStripProps {
  provenance: ProvenanceMetadata;
  snapshotHref: string;
  status?: string;
  kind?: DatasetKind;
}

export function TrustStrip({ provenance, snapshotHref, status, kind }: TrustStripProps) {
  const [copied, setCopied] = useState(false);
  const freezeKind =
    kind === 'historical-replay'
      ? 'Reconstructed cutoff (kickoff − 90 min)'
      : kind === 'illustrative-sample'
        ? 'Illustrative sample'
        : '2h before deadline';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(provenance.snapshotHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-sm text-neutral-600 border border-neutral-200 bg-white px-3 py-2.5">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>Cutoff {formatUtc(provenance.frozenAt)}</span>
        <span aria-hidden="true">·</span>
        <span>{freezeKind}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono text-xs">{shortHash(provenance.snapshotHash)}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="underline underline-offset-2 text-neutral-800"
        >
          {copied ? 'Copied' : 'Copy hash'}
        </button>
        <a href={snapshotHref} className="underline underline-offset-2 text-neutral-800">
          Download snapshot
        </a>
        {status ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{statusLabel(status)}</span>
          </>
        ) : null}
        {kind === 'historical-replay' ? (
          <>
            <span aria-hidden="true">·</span>
            <span>Reconstructive replay</span>
          </>
        ) : null}
        {provenance.isDemoSample && kind !== 'historical-replay' ? (
          <>
            <span aria-hidden="true">·</span>
            <span>Illustrative sample</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
