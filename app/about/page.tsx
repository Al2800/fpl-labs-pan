import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  FlaskConical,
  Shield,
  Clock,
  ExternalLink,
  Terminal,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Lab | FPL Labs Pan',
  description:
    'About FPL Labs Pan: A lab-backed, reproducible entity × time decision data product for Fantasy Premier League. Neutral product voice, cryptographic freeze protocol, and open methods.',
};

export default function AboutPage() {
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fpl-labs-pan.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://fpl-labs-pan.vercel.app/about',
      },
    ],
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <JsonLd data={breadcrumbsJsonLd} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <FlaskConical className="w-4 h-4" />
          <span>Product About & Mission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          About FPL Labs Pan
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          The entity × time decision intelligence data product for Fantasy Premier League.
        </p>
      </div>

      {/* Product Thesis */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">
          The Product Thesis
        </h2>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <p>
            While personal research journals (such as <span className="font-mono text-emerald-400">ajmclab.com</span>) document exploratory research and qualitative engineering diaries, <strong>FPL Labs Pan</strong> is the dedicated <em>entity × time data product</em> built specifically for programmatic verification, auditable decision science, and search engine discoverability.
          </p>
          <p>
            We intentionally do not compete as a commodity player expectation screen (platforms like FPL Review already serve raw tabular lookups). Instead, we lead with <strong>lab-native decision artefacts</strong>:
          </p>
          <ul className="space-y-2 list-disc pl-5 pt-1 text-slate-300">
            <li>
              <strong>Template D (Decision Replay Pages):</strong> Parallel comparison of template heuristics, mixed-integer linear programming (MILP), and multi-objective agent policies locked prior to every gameweek deadline.
            </li>
            <li>
              <strong>Template C (Chip Horizon Pages):</strong> Full 38-round mathematical solvers evaluating opportunity cost and optimal deployment timing for Triple Captain, Bench Boost, Free Hit, and Wildcard.
            </li>
          </ul>
        </div>
      </section>

      {/* Neutral Product Voice */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">
          Neutral Product Voice & Scientific Rigor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-lg space-y-2">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Immutable Pre-Deadline Freezes</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Every lineup, transfer, captaincy pick, and shadow price is locked and hashed with SHA-256 at T-120 minutes prior to the official Premier League deadline. Retroactive revisions are strictly prohibited.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-lg space-y-2">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>No Narrative / No First-Person Diary</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              We do not produce emotional opinion pieces or influencer &quot;gut-feel&quot; content. Every assertion is backed by mathematical formulations, dual variables, and empirical out-of-sample error metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Community */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-100">
          Connect with the Lab
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Follow automated freeze alerts, model releases, and round review reports on X:
        </p>
        <div>
          <a
            href="https://x.com/FPLabsPan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-colors text-xs font-mono"
          >
            <span>Follow @FPLabsPan on X</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </section>

      {/* Legal & Affiliation Disclaimers (Required) */}
      <section className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Independent Research & Disclaimers</span>
        </div>
        <div className="space-y-2 text-slate-400 leading-relaxed">
          <p>
            <strong>Not Affiliated with Premier League:</strong> FPL Labs Pan is an independent open statistical decision intelligence project. This service is not affiliated with, associated with, sponsored by, or endorsed by the Football Association Premier League Ltd (&quot;Premier League&quot;), Fantasy Premier League (&quot;FPL&quot;), or any Premier League football club. All trademarks, logos, and club insignias remain the property of their respective owners.
          </p>
          <p>
            <strong>Not Financial or Betting Advice:</strong> Content, tables, and mathematical recommendations published on this website are intended solely for academic research, data science evaluation, and entertainment purposes. FPL Labs Pan does not provide financial, gambling, betting, or investment advice. The laboratory assumes no responsibility for decisions made based on outputs generated by our models.
          </p>
        </div>
      </section>
    </div>
  );
}
