import { getPlays, getTools, getExperiments } from '@/lib/loaders';
import { notFound } from 'next/navigation';
import Badge from '@/components/Badge';
import Link from 'next/link';

export function generateStaticParams() {
  return getPlays().map((p) => ({ id: p.id }));
}

export default async function PlayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const play = getPlays().find((p) => p.id === id);
  if (!play) notFound();

  const tools = getTools().filter((t) => play.linkedTools.includes(t.id));
  const experiments = getExperiments().filter((e) => e.linkedPlays.includes(play.id));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href="/plays" className="text-sm text-slate-500 hover:text-slate-700">← Plays</Link>
        <h1 className="text-2xl font-bold mt-2">{play.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {play.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
          {play.dimensions.map((d) => <Badge key={d} label={d} variant="dimension" />)}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Role</div>
          <div className="text-slate-700">{play.role}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Adjacent Role</div>
          <div className="text-slate-700">{play.adjacentRole}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:col-span-2">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Team</div>
          <div className="text-slate-700">{play.team}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-800 mb-2">The Move</h2>
        <p className="text-sm text-slate-600">{play.move}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 className="font-semibold text-amber-800 mb-2">Guardrail</h2>
        <p className="text-sm text-amber-700">{play.guardrail}</p>
      </div>

      {play.prerequisites.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800 mb-3">Prerequisites</h2>
          <ul className="space-y-1">
            {play.prerequisites.map((p, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-slate-300">•</span>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {tools.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Linked Tools</h2>
          <div className="space-y-2">
            {tools.map((t) => (
              <Link key={t.id} href={`/tools/${t.id}`} className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-400 transition-colors">
                <span className="font-medium text-sm">{t.name}</span>
                <span className="text-xs text-slate-400 ml-2">{t.setup.type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {experiments.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3">Linked Experiments</h2>
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
    </div>
  );
}
