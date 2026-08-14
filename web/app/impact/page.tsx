import { getTools, getExperiments, realOnly } from '@/lib/loaders';
import { ALL_RISKS, ALL_DIMENSIONS, RISK_LABELS, DIMENSION_LABELS, type Dimension, type Risk } from '@/lib/types';

export default function ImpactPage() {
  // The ledger only ever reports real records. Example content is browsable elsewhere.
  const tools = realOnly(getTools());
  const experiments = realOnly(getExperiments());
  const excludedExamples =
    getTools().length - tools.length + (getExperiments().length - experiments.length);

  const total = experiments.length;
  const kept = experiments.filter((e) => e.status === 'kept').length;
  const dropped = experiments.filter((e) => e.status === 'dropped').length;
  const active = experiments.filter((e) => e.status === 'active').length;
  const inconclusive = experiments.filter((e) => e.status === 'inconclusive').length;

  const multiTeamTools = tools.filter((t) => t.triedByTeams.length > 1);

  const byDimension = ALL_DIMENSIONS.map((dim) => ({
    dim,
    count: experiments.filter((e) => e.dimensions.includes(dim)).length,
  }));
  const byRisk = ALL_RISKS.map((risk) => ({
    risk,
    count: experiments.filter((e) => e.risks.includes(risk)).length,
  }));

  const hasRealData = tools.length + experiments.length > 0;

  const header = (
    <div>
      <h1 className="text-2xl font-bold">Impact Ledger</h1>
      <p className="text-slate-500 mt-1">Aggregate outcomes from real experiments and tool adoption</p>
    </div>
  );

  if (!hasRealData) {
    return (
      <div className="space-y-10">
        {header}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800">Nothing to report yet</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            The ledger counts only real records, and none have been contributed yet. The{' '}
            {excludedExamples} example record{excludedExamples !== 1 ? 's' : ''} in the repository
            {excludedExamples !== 1 ? ' are' : ' is'} deliberately excluded, so there is nothing here
            to aggregate.
          </p>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Showing zeros and a 0% kept ratio would imply the organisation measured its practice and
            found nothing. It hasn&apos;t measured anything yet. That distinction is the whole point
            of this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {header}

      {excludedExamples > 0 && (
        <p className="text-xs text-slate-500">
          Excludes {excludedExamples} example record{excludedExamples !== 1 ? 's' : ''}.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Experiments', value: total, color: 'text-slate-900' },
          { label: 'Kept', value: kept, color: 'text-green-700' },
          { label: 'Dropped', value: dropped, color: 'text-red-600' },
          { label: 'Active', value: active, color: 'text-blue-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-5 text-center">
            <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Kept / Dropped Ratio</h2>
          <p className="text-sm text-slate-500 mb-4">Of completed experiments (kept + dropped)</p>
          {(() => {
            const completed = kept + dropped;
            if (completed === 0) return <p className="text-sm text-slate-400">No completed experiments yet.</p>;
            const keptPct = Math.round((kept / completed) * 100);
            return (
              <div className="space-y-2">
                <div className="h-5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: `${keptPct}%` }} />
                  <div className="bg-red-400 h-full flex-1" />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{keptPct}% kept ({kept})</span>
                  <span>{100 - keptPct}% dropped ({dropped})</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {multiTeamTools.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800 mb-3">Practices Adopted by Multiple Teams</h2>
          <div className="space-y-2">
            {multiTeamTools.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <span className="font-medium text-slate-700">{t.name}</span>
                <span className="text-slate-500">{t.triedByTeams.length} teams — {t.triedByTeams.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Experiments by Dimension</h2>
          <div className="space-y-3">
            {byDimension.map(({ dim, count }) => (
              <div key={dim} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-44 shrink-0">{DIMENSION_LABELS[dim as Dimension]}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-600 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Experiments by Risk</h2>
          <div className="space-y-3">
            {byRisk.map(({ risk, count }) => (
              <div key={risk} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24 shrink-0">{RISK_LABELS[risk as Risk]}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-600 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
