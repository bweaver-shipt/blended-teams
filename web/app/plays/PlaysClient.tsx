'use client';
/**
 * Renders client-side: `useSearchParams` puts this behind a Suspense boundary, so the card list
 * (including the `example` flag's marker) only appears after hydration. A no-JS reader sees an
 * empty list rather than unmarked example content, so Task 9's failure mode can't occur here.
 *
 * If this page is ever converted to static rendering for SEO or crawlability, the ExampleMarker
 * must be carried into the server-rendered path — otherwise example plays would appear in crawled
 * HTML with nothing marking them as illustrative rather than something a team actually did.
 */
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/Badge';
import FilterBar from '@/components/FilterBar';
import ExampleMarker from '@/components/ExampleMarker';
import type { Play } from '@/lib/types';

interface Props {
  plays: Play[];
  filterDefs: { key: string; label: string; options: { value: string; label: string }[] }[];
}

export default function PlaysClient({ plays, filterDefs }: Props) {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const risk = searchParams.get('risk');
  const team = searchParams.get('team');

  const filtered = plays.filter((p) => {
    if (role && p.role !== role && p.adjacentRole !== role) return false;
    if (risk && !p.risks.includes(risk as never)) return false;
    if (team && p.team !== team) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <FilterBar filters={filterDefs} />
      <p className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Link key={p.id} href={`/plays/${p.id}`} className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 hover:shadow-sm transition-all">
            <h2 className="font-semibold text-sm text-slate-800 mb-1">{p.title}</h2>
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.move}</p>
            {p.example && <div className="mb-3"><ExampleMarker /></div>}
            <div className="flex flex-wrap gap-1 mb-2">
              {p.risks.map((r) => <Badge key={r} label={r} variant="risk" />)}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{p.role} → {p.adjacentRole}</span>
              <span>{p.team}</span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">No plays match the current filters.</div>
      )}
    </div>
  );
}
