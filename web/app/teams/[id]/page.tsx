import { getTeamIds, getTools, getPlays, getExperiments, getScorecards } from '@/lib/loaders';
import { ALL_DIMENSIONS, type Dimension } from '@/lib/types';
import ScoreBar from '@/components/ScoreBar';
import Badge from '@/components/Badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getTeamIds().map((id) => ({ id }));
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teams = getTeamIds();
  if (!teams.includes(id)) notFound();

  const tools = getTools().filter((t) => t.team === id || t.triedByTeams.includes(id));
  const plays = getPlays().filter((p) => p.team === id);
  const experiments = getExperiments().filter((e) => e.team === id);
  const scorecards = getScorecards().filter((s) => s.team === id).sort((a, b) => b.cycle.localeCompare(a.cycle));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href="/teams" className="text-sm text-slate-500 hover:text-slate-700">← Teams</Link>
        <h1 className="text-2xl font-bold mt-2">{id}</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: 'Tools', value: tools.length },
          { label: 'Plays', value: plays.length },
          { label: 'Experiments', value: experiments.length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {scorecards.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <h2 className="font-semibold text-slate-800">Score History</h2>
          {scorecards.map((sc) => (
            <div key={sc.id}>
              <div className="flex justify-between items-center mb-3">
                <Link href={`/scorecards/${sc.team}/${encodeURIComponent(sc.cycle)}`} className="text-sm font-semibold text-blue-600 hover:underline">{sc.cycle}</Link>
                <span className="text-xs text-slate-400">{sc.period.start} → {sc.period.end}</span>
              </div>
              <div className="space-y-2">
                {ALL_DIMENSIONS.map((dim) => (
                  <ScoreBar key={dim} dimension={dim as Dimension} score={sc.scores[dim as Dimension]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tools.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Tools</h2>
          <div className="space-y-2">
            {tools.map((t) => (
              <Link key={t.id} href={`/tools/${t.id}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{t.name}</span>
                  <div className="flex gap-1">{t.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {experiments.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Experiments</h2>
          <div className="space-y-2">
            {experiments.map((e) => (
              <Link key={e.id} href={`/experiments/${e.id}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{e.title}</span>
                  <Badge label={e.status} variant="status" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {plays.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Plays</h2>
          <div className="space-y-2">
            {plays.map((p) => (
              <Link key={p.id} href={`/plays/${p.id}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <span className="font-medium text-sm">{p.title}</span>
                <span className="text-xs text-slate-400 ml-2">{p.role} → {p.adjacentRole}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
