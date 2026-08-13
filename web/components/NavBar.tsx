import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Tools' },
  { href: '/plays', label: 'Plays' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/impact', label: 'Impact' },
  { href: '/scorecards', label: 'Scorecards' },
  { href: '/teams', label: 'Teams' },
];

export default function NavBar() {
  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-14">
        <Link href="/" className="font-semibold text-sm mr-4 text-slate-100 whitespace-nowrap">
          Blended Teams
        </Link>
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
