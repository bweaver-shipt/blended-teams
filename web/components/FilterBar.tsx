'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
}

export default function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  const hasFilters = filters.some((f) => searchParams.has(f.key));

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {filters.map((f) => (
        <div key={f.key} className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {f.label}
          </label>
          <select
            value={searchParams.get(f.key) ?? ''}
            onChange={(e) => handleChange(f.key, e.target.value)}
            className="text-sm border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">All</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {hasFilters && (
        <button
          onClick={handleClear}
          className="text-xs text-slate-500 hover:text-slate-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
