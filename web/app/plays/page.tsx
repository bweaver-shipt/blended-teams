import { getPlays, getTeamIds } from '@/lib/loaders';
import { ALL_RISKS, RISK_LABELS } from '@/lib/types';
import { Suspense } from 'react';
import PlaysClient from './PlaysClient';

export default function PlaysPage() {
  const plays = getPlays();
  const teams = getTeamIds();
  const roles = Array.from(new Set(plays.flatMap((p) => [p.role, p.adjacentRole]))).sort();

  const filterDefs = [
    { key: 'role', label: 'Role', options: roles.map((r) => ({ value: r, label: r })) },
    { key: 'risk', label: 'Risk', options: ALL_RISKS.map((r) => ({ value: r, label: RISK_LABELS[r] })) },
    { key: 'team', label: 'Team', options: teams.map((t) => ({ value: t, label: t })) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Borrowed Skills Library</h1>
        <p className="text-slate-500 mt-1">{plays.length} play{plays.length !== 1 ? 's' : ''} — cross-role moves with guardrails and prerequisites</p>
      </div>
      <Suspense>
        <PlaysClient plays={plays} filterDefs={filterDefs} />
      </Suspense>
    </div>
  );
}
