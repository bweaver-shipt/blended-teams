import { DIMENSION_LABELS, type Dimension } from '@/lib/types';

interface ScoreBarProps {
  dimension: Dimension;
  score: number;
  max?: number;
}

const colors = [
  '',
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-lime-500',
  'bg-green-500',
];

export default function ScoreBar({ dimension, score, max = 5 }: ScoreBarProps) {
  const pct = (score / max) * 100;
  const color = colors[Math.round(score)] ?? 'bg-slate-400';
  return (
    <div className="flex items-center gap-3">
      <span className="w-52 text-sm text-slate-700 shrink-0">
        {DIMENSION_LABELS[dimension]}
      </span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold w-8 text-right text-slate-700">{score}/{max}</span>
    </div>
  );
}
