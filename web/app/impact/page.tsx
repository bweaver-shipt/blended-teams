import { getTools, getExperiments } from '@/lib/loaders';
import { ALL_RISKS, ALL_DIMENSIONS, RISK_LABELS, DIMENSION_LABELS, type Dimension, type Risk } from '@/lib/types';

export default function ImpactPage() {
  const tools = getTools();
  const experiments = getExperiments();

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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Impact Ledger</h1>
        <p className="text-slate-500 mt-1">Aggregate outcomes from all experiments and tool adoption</p>
      </div>

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
