const riskColors: Record<string, string> = {
  value: 'bg-green-100 text-green-800 border-green-200',
  usability: 'bg-blue-100 text-blue-800 border-blue-200',
  feasibility: 'bg-orange-100 text-orange-800 border-orange-200',
  viability: 'bg-purple-100 text-purple-800 border-purple-200',
};

const dimColors: Record<string, string> = {
  'shared-tooling': 'bg-sky-100 text-sky-800 border-sky-200',
  'cross-functional-ownership': 'bg-pink-100 text-pink-800 border-pink-200',
  'experiment-velocity': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'delivery-autonomy': 'bg-teal-100 text-teal-800 border-teal-200',
  'impact-learning': 'bg-violet-100 text-violet-800 border-violet-200',
};

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800 border-blue-200',
  kept: 'bg-green-100 text-green-800 border-green-200',
  dropped: 'bg-red-100 text-red-800 border-red-200',
  inconclusive: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface BadgeProps {
  label: string;
  variant?: 'risk' | 'dimension' | 'status' | 'neutral';
}

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  let cls = 'bg-slate-100 text-slate-700 border-slate-200';
  if (variant === 'risk') cls = riskColors[label] ?? cls;
  else if (variant === 'dimension') cls = dimColors[label] ?? cls;
  else if (variant === 'status') cls = statusColors[label] ?? cls;

  const display = label
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${cls}`}>
      {display}
    </span>
  );
}
