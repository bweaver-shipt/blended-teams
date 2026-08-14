import Link from 'next/link';
import { getOrgMetrics } from '@/lib/loaders';
import { ALL_DIMENSIONS, DIMENSION_LABELS, type Dimension } from '@/lib/types';

export default function HomePage() {
  const m = getOrgMetrics();

  const modules = [
    { href: '/tools', label: 'Tool & Prompt Registry', count: m.catalogue.tools, desc: 'Reusable tools, prompts, and workflows with setup instructions and adoption tracking.' },
    { href: '/plays', label: 'Borrowed Skills Library', count: m.catalogue.plays, desc: 'Cross-role plays with guardrails and prerequisites, linked to tools and outcomes.' },
    { href: '/experiments', label: 'Experiment Board', count: m.catalogue.experiments, desc: 'Active and completed experiments grouped by status, linked to plays and scorecards.' },
    { href: '/scorecards', label: 'Scorecard History', count: m.catalogue.scorecards, desc: 'Team scores across five dimensions with trend tracking and experiment linkage.' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Blended Teams Blueprint</h1>
        <p className="mt-2 text-slate-500 max-w-2xl">
          A shared registry of tools, plays, experiments, and scorecards for cross-functional teams reducing unnecessary handoffs.
        </p>
      </div>

      {/* Org metrics — real records only. Example content never counts here. */}
      {m.hasRealData ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Teams', value: m.totalTeams },
            { label: 'Experiments', value: m.totalExperiments },
            { label: 'Kept', value: m.kept },
            { label: 'Active', value: m.active },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-4 text-center">
              <div className="text-3xl font-bold text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">No org metrics yet</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Everything currently in the repository is example content, so there is nothing real to
            measure. Rather than show zeros — which would imply we measured and found none — this
            stays empty until the first real record lands.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            The {m.catalogue.tools + m.catalogue.plays + m.catalogue.experiments + m.catalogue.scorecards + m.catalogue.outcomes} example
            record{m.catalogue.tools + m.catalogue.plays + m.catalogue.experiments + m.catalogue.scorecards + m.catalogue.outcomes !== 1 ? 's are' : ' is'} still
            browsable below.
          </p>
        </div>
      )}

      {/* Avg scores by dimension */}
      {m.hasRealData && Object.keys(m.avgScores).length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Org Average Scores</h2>
          <div className="space-y-3">
            {ALL_DIMENSIONS.map((dim) => {
              const score = m.avgScores[dim] ?? 0;
              const pct = (score / 5) * 100;
              const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-green-500'];
              const color = colors[Math.round(score)] ?? 'bg-slate-400';
              return (
                <div key={dim} className="flex items-center gap-3">
                  <span className="w-52 text-sm text-slate-700 shrink-0">{DIMENSION_LABELS[dim as Dimension]}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-10 text-right text-slate-700">{score}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Four modules */}
      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="block bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-400 hover:shadow-sm transition-all group">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">{mod.label}</h2>
              <span className="text-2xl font-bold text-slate-400">{mod.count}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{mod.desc}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/impact" className="text-slate-600 hover:text-slate-900 underline">View Impact Ledger →</Link>
        <Link href="/teams" className="text-slate-600 hover:text-slate-900 underline">Browse Teams →</Link>
      </div>
    </div>
  );
}
