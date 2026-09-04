import React from 'react';
import { AlertCircle, Terminal } from 'lucide-react';

export function DemoNoticeBanner() {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200/90 text-xs px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-300">DEMO & ILLUSTRATIVE RUN (2026/27):</strong> Displayed gameweek decisions, solver weights, and snapshot hashes represent pre-production laboratory fixtures for pipeline verification.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-amber-400/80 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-600/30">
          <Terminal className="w-3 h-3" />
          <span>fixture_calibration_mode=true</span>
        </div>
      </div>
    </div>
  );
}
