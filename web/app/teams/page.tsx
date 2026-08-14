import { getTeamIds, getTeam, getTools, getPlays, getExperiments, getScorecards } from '@/lib/loaders';
import Link from 'next/link';

export default function TeamsPage() {
  const teams = getTeamIds();
  const tools = getTools();
  const plays = getPlays();
  const experiments = getExperiments();
  const scorecards = getScorecards();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-slate-500 mt-1">{teams.length} team{teams.length !== 1 ? 's' : ''} in the registry</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const record = getTeam(team);
          const teamTools = tools.filter((t) => t.team === team || t.triedByTeams.includes(team));
          const teamPlays = plays.filter((p) => p.team === team);
          const teamExps = experiments.filter((e) => e.team === team);
          const latestSc = scorecards.filter((s) => s.team === team).sort((a, b) => b.cycle.localeCompare(a.cycle))[0];
          const avgScore = latestSc ? Math.round((Object.values(latestSc.scores).reduce((a, b) => a + b, 0) / 5) * 10) / 10 : null;
          return (
            <Link key={team} href={`/teams/${team}`} className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-400 hover:shadow-sm transition-all">
              <h2 className="font-semibold text-slate-800">{record?.name ?? team}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{record ? record.area : 'No team record yet'}</p>
              {record && record.roles.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">{record.roles.join(' · ')}</p>
              )}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                <div><div className="font-bold text-lg text-slate-700">{teamTools.length}</div><div className="text-slate-400">Tools</div></div>
                <div><div className="font-bold text-lg text-slate-700">{teamPlays.length}</div><div className="text-slate-400">Plays</div></div>
                <div><div className="font-bold text-lg text-slate-700">{teamExps.length}</div><div className="text-slate-400">Experiments</div></div>
              </div>
              {avgScore !== null && (
                <p className="text-xs text-slate-400 mt-3">Latest scorecard avg: <span className="font-semibold text-slate-600">{avgScore}/5</span> ({latestSc!.cycle})</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
