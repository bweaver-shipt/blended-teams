import { getTools, getPlays, getExperiments } from '@/lib/loaders';
import { notFound } from 'next/navigation';
import Badge from '@/components/Badge';
import CopyButton from '@/components/CopyButton';
import { ExampleNotice } from '@/components/ExampleMarker';
import Link from 'next/link';

export function generateStaticParams() {
  return getTools().map((t) => ({ id: t.id }));
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = getTools().find((t) => t.id === id);
  if (!tool) notFound();

  const plays = getPlays().filter((p) => tool.linkedPlays.includes(p.id));
  const experiments = getExperiments().filter((e) => tool.linkedExperiments.includes(e.id));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link href="/tools" className="text-sm text-slate-500 hover:text-slate-700">← Tools</Link>
        <h1 className="text-2xl font-bold mt-2">{tool.name}</h1>
        <p className="text-slate-600 mt-1">{tool.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tool.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
          {tool.dimensions.map((d) => <Badge key={d} label={d} variant="dimension" />)}
        </div>
      </div>

      {tool.example && <ExampleNotice kind="tool" />}

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Team</div>
          <div className="text-slate-700">{tool.team}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Roles</div>
          <div className="text-slate-700">{tool.roles.join(', ')}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Adoption count</div>
          <div className="text-slate-700">{tool.adoptionCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Tried by teams</div>
          <div className="text-slate-700">{tool.triedByTeams.join(', ') || '—'}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Setup <span className="text-xs font-normal text-slate-400">({tool.setup.type})</span></h2>
          <CopyButton text={tool.setup.content} />
        </div>
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 rounded p-4 border border-slate-100">{tool.setup.content}</pre>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-800 mb-2">Handoff removed</h2>
        <p className="text-sm text-slate-600">{tool.handoffRemoved}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold text-slate-800 mb-2">Limitations</h2>
        <p className="text-sm text-slate-600">{tool.limitations}</p>
      </div>

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
