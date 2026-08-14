/**
 * Marks illustrative content. Deliberately plain and grey — it must not read as a
 * risk or dimension tag, and it must not be mistakable for real adoption data.
 */
export default function ExampleMarker({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-dashed border-slate-400 rounded px-2 py-0.5 ${className}`}
    >
      Example
    </span>
  );
}

/** Fuller wording for detail pages, where there is room to say why it does not count. */
export function ExampleNotice({ kind }: { kind: string }) {
  return (
    <div className="border border-dashed border-slate-400 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-600">
      <span className="font-semibold text-slate-700">Example {kind}.</span> This is illustrative
      content kept as a worked example. Its numbers are made up and it is excluded from all org-wide
      metrics.
    </div>
  );
}
