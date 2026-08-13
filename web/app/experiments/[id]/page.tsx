import { getExperiments, getTools, getPlays, getScorecards } from '@/lib/loaders';
import { notFound } from 'next/navigation';
import Badge from '@/components/Badge';
import Link from 'next/link';

export function generateStaticParams() {
  return getExperiments().map((e) => ({ id: e.id }));
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = getExperiments().find((e) => e.id === id);
  if (!exp) notFound();

  const tools = getTools().filter((t) => exp.linkedTools.includes(t.id));
  const plays = getPlays().filter((p) => exp.linkedPlays.includes(p.id));
  const scorecards = getScorecards().filter((s) => exp.linkedScorecards.includes(s.id));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href="/experiments" className="text-sm text-slate-500 hover:text-slate-700">← Experiments</Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold">{exp.title}</h1>
          <Badge label={exp.status} variant="status" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {exp.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
          {exp.dimensions.map((d) => <Badge key={d} label={d} variant="dimension" />)}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Owner</div>
          <div className="text-slate-700">{exp.owner}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Team</div>
          <div className="text-slate-700">{exp.team}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Review Date</div>
          <div className="text-slate-700">{exp.reviewDate}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-800 mb-2">Hypothesis</h2>
        <p className="text-sm text-slate-600">{exp.hypothesis}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-800 mb-2">Change Summary</h2>
        <p className="text-sm text-slate-600">{exp.changeSummary}</p>
      </div>

      {tools.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Linked Tools</h2>
          <div className="space-y-2">
            {tools.map((t) => (
              <Link key={t.id} href={`/tools/${t.id}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <span className="font-medium text-sm">{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {plays.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Linked Plays</h2>
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

      {scorecards.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Linked Scorecards</h2>
          <div className="space-y-2">
            {scorecards.map((s) => (
              <Link key={s.id} href={`/scorecards/${s.team}/${encodeURIComponent(s.cycle)}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <span className="font-medium text-sm">{s.team}</span>
                <span className="text-xs text-slate-400 ml-2">{s.cycle}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
