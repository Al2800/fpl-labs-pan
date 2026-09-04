'use client';

import React, { useState } from 'react';
import { ProvenanceMetadata } from '@/types/fpl';
import { ShieldCheck, Copy, Check, Clock, Cpu, Hash, FileCode } from 'lucide-react';

interface ProvenanceCardProps {
  provenance: ProvenanceMetadata;
  gw: number;
  season: string;
}

export function ProvenanceCard({ provenance, gw, season }: ProvenanceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(provenance.snapshotHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Lab Provenance & Freeze State
            </h3>
            <p className="text-xs text-slate-400">
              Cryptographically verified decision snapshot for {season} Gameweek {gw}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{provenance.modelVersion}</span>
          </span>
          <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
            FROZEN
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Frozen At */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Frozen At (UTC)</span>
          </div>
          <div className="font-mono text-slate-200 font-medium">
            {provenance.frozenAt}
          </div>
          <div className="text-[10px] text-slate-500">
            T-120m prior to deadline lock
          </div>
        </div>

        {/* Snapshot Hash */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 lg:col-span-2">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Snapshot SHA-256 Digest</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[10px] hover:bg-slate-800 px-1.5 py-0.5 rounded transition-colors"
              title="Copy SHA-256 hash"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-[11px] text-slate-300 truncate" title={provenance.snapshotHash}>
            {provenance.snapshotHash}
          </div>
          <div className="text-[10px] text-slate-500">
            Immutable audit anchor for reproducible policy arms
          </div>
        </div>

        {/* Solver Configuration */}
        <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="text-slate-400 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>Solver Engine</span>
          </div>
          <div className="font-mono text-slate-200 font-medium">
            {provenance.solverEngine}
          </div>
          <div className="text-[10px] text-slate-500">
            H={provenance.solverParameters.horizonWeeks}w | γ={provenance.solverParameters.decayRate} | hit={provenance.solverParameters.hitPenalty}
          </div>
        </div>
      </div>
    </div>
  );
}
