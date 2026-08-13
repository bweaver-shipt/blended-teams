import { getTools, getTeamIds } from '@/lib/loaders';
import { ALL_RISKS, ALL_DIMENSIONS, RISK_LABELS, DIMENSION_LABELS } from '@/lib/types';
import Link from 'next/link';
import Badge from '@/components/Badge';
import { Suspense } from 'react';
import ToolsClient from './ToolsClient';

export default function ToolsPage() {
  const tools = getTools();
  const teams = getTeamIds();
  const allRoles = Array.from(new Set(tools.flatMap((t) => t.roles))).sort();

  const filterDefs = [
    { key: 'risk', label: 'Risk', options: ALL_RISKS.map((r) => ({ value: r, label: RISK_LABELS[r] })) },
    { key: 'dimension', label: 'Dimension', options: ALL_DIMENSIONS.map((d) => ({ value: d, label: DIMENSION_LABELS[d] })) },
    { key: 'team', label: 'Team', options: teams.map((t) => ({ value: t, label: t })) },
    { key: 'role', label: 'Role', options: allRoles.map((r) => ({ value: r, label: r })) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tool & Prompt Registry</h1>
        <p className="text-slate-500 mt-1">{tools.length} tool{tools.length !== 1 ? 's' : ''} — reusable prompts, checklists, scripts, and workflows</p>
      </div>
      <Suspense>
        <ToolsClient tools={tools} filterDefs={filterDefs} />
      </Suspense>
    </div>
  );
}
