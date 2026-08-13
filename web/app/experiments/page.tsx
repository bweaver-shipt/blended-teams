import { getExperiments } from '@/lib/loaders';
import { STATUS_LABELS, type ExperimentStatus } from '@/lib/types';
import Badge from '@/components/Badge';
import Link from 'next/link';

const STATUS_ORDER: ExperimentStatus[] = ['active', 'kept', 'dropped', 'inconclusive'];

export default function ExperimentsPage() {
  const experiments = getExperiments();
  const byStatus = STATUS_ORDER.reduce<Record<string, typeof experiments>>((acc, s) => {
    acc[s] = experiments.filter((e) => e.status === s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Experiment Board</h1>
        <p className="text-slate-500 mt-1">{experiments.length} experiment{experiments.length !== 1 ? 's' : ''} across {Object.keys(byStatus).length} statuses</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATUS_ORDER.map((status) => (
          <div key={status}>
            <div className="flex items-center gap-2 mb-3">
              <Badge label={status} variant="status" />
              <span className="text-sm text-slate-400">{byStatus[status].length}</span>
            </div>
            <div className="space-y-2">
              {byStatus[status].map((e) => (
                <Link key={e.id} href={`/experiments/${e.id}`} className="block bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-400 hover:shadow-sm transition-all">
                  <p className="font-medium text-sm text-slate-800 leading-snug mb-1">{e.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{e.hypothesis}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {e.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
                  </div>
                  <div className="mt-2 text-xs text-slate-400 flex justify-between">
                    <span>{e.team}</span>
                    <span>{e.reviewDate}</span>
                  </div>
                </Link>
              ))}
              {byStatus[status].length === 0 && (
                <div className="text-xs text-slate-300 italic px-1">None</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
