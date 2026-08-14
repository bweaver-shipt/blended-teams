import { getScorecards, getExperiments } from '@/lib/loaders';
import { ALL_DIMENSIONS, type Dimension } from '@/lib/types';
import ScoreBar from '@/components/ScoreBar';
import Badge from '@/components/Badge';
import { ExampleNotice } from '@/components/ExampleMarker';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getScorecards().map((sc) => ({
    team: sc.team,
    cycle: encodeURIComponent(sc.cycle),
  }));
}

export default async function ScorecardDetailPage({ params }: { params: Promise<{ team: string; cycle: string }> }) {
  const { team, cycle } = await params;
  const decodedCycle = decodeURIComponent(cycle);
  const sc = getScorecards().find((s) => s.team === team && s.cycle === decodedCycle);
  if (!sc) notFound();

  const experiments = getExperiments().filter((e) => sc.activeExperiments.includes(e.id));
  const avgScore = Math.round((Object.values(sc.scores).reduce((a, b) => a + b, 0) / 5) * 10) / 10;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href="/scorecards" className="text-sm text-slate-500 hover:text-slate-700">← Scorecards</Link>
        <h1 className="text-2xl font-bold mt-2">{sc.team} — {sc.cycle}</h1>
        <p className="text-slate-500 mt-1">{sc.period.start} to {sc.period.end}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sc.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
        </div>
      </div>

      {sc.example && <ExampleNotice kind="scorecard" />}

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-slate-800">Dimension Scores</h2>
          <span className="text-2xl font-bold text-slate-700">{avgScore}/5 avg</span>
        </div>
        {ALL_DIMENSIONS.map((dim) => (
          <ScoreBar key={dim} dimension={dim as Dimension} score={sc.scores[dim as Dimension]} />
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-800 mb-2">Notes</h2>
        <p className="text-sm text-slate-600">{sc.notes}</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="font-semibold text-green-800 mb-2">Observed Movement</h2>
        <p className="text-sm text-green-700">{sc.observedMovement}</p>
      </div>

      {experiments.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Active Experiments This Cycle</h2>
          <div className="space-y-2">
            {experiments.map((e) => (
              <Link key={e.id} href={`/experiments/${e.id}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{e.title}</span>
                  <Badge label={e.status} variant="status" />
                </div>
                <p className="text-xs text-slate-400 mt-1">{e.owner}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
