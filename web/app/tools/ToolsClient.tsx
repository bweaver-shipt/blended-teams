'use client';
/**
 * Renders client-side: `useSearchParams` puts this behind a Suspense boundary, so the card list
 * (including the `example` flag's marker) only appears after hydration. A no-JS reader sees an
 * empty list rather than unmarked example content, so Task 9's failure mode can't occur here.
 *
 * If this page is ever converted to static rendering for SEO or crawlability, the ExampleMarker
 * must be carried into the server-rendered path — otherwise example tools would appear in crawled
 * HTML with their invented `adoptionCount` and `triedByTeams` and nothing marking them as fiction.
 */
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/Badge';
import FilterBar from '@/components/FilterBar';
import ExampleMarker from '@/components/ExampleMarker';
import type { Tool } from '@/lib/types';

interface Props {
  tools: Tool[];
  filterDefs: { key: string; label: string; options: { value: string; label: string }[] }[];
}

export default function ToolsClient({ tools, filterDefs }: Props) {
  const searchParams = useSearchParams();
  const risk = searchParams.get('risk');
  const dimension = searchParams.get('dimension');
  const team = searchParams.get('team');
  const role = searchParams.get('role');

  const filtered = tools.filter((t) => {
    if (risk && !t.risks.includes(risk as never)) return false;
    if (dimension && !t.dimensions.includes(dimension as never)) return false;
    if (team && t.team !== team) return false;
    if (role && !t.roles.includes(role)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <FilterBar filters={filterDefs} />
      <p className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Link key={t.id} href={`/tools/${t.id}`} className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-semibold text-slate-800 text-sm leading-snug">{t.name}</h2>
              <span className="text-xs text-slate-400 whitespace-nowrap">{t.setup.type}</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{t.summary}</p>
            {t.example && <div className="mb-3"><ExampleMarker /></div>}
            <div className="flex flex-wrap gap-1 mb-2">
              {t.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
            </div>
            <div className="flex flex-wrap gap-1">
              {t.dimensions.map((d) => <Badge key={d} label={d} variant="dimension" />)}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{t.team}</span>
              <span>{t.adoptionCount} adoption{t.adoptionCount !== 1 ? 's' : ''}</span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">No tools match the current filters.</div>
      )}
    </div>
  );
}
