import { getScorecards, getExperiments, realOnly, isExample } from '@/lib/loaders';
import { ALL_DIMENSIONS, DIMENSION_LABELS, type Dimension } from '@/lib/types';
import ScoreBar from '@/components/ScoreBar';
import ExampleMarker from '@/components/ExampleMarker';
import Link from 'next/link';

export default function ScorecardsPage() {
  const scorecards = getScorecards();
  const experiments = getExperiments();
  // Org rollup is a factual claim, so it only ever averages real scorecards.
  const realScorecards = realOnly(scorecards);

  // Avg per dimension
  const dimTotals: Record<string, number> = {};
  const dimCounts: Record<string, number> = {};
  for (const sc of realScorecards) {
    for (const [dim, score] of Object.entries(sc.scores)) {
      dimTotals[dim] = (dimTotals[dim] || 0) + score;
      dimCounts[dim] = (dimCounts[dim] || 0) + 1;
    }
  }
  const avgScores = ALL_DIMENSIONS.map((dim) => ({
    dim,
    avg: dimCounts[dim] ? Math.round((dimTotals[dim] / dimCounts[dim]) * 10) / 10 : 0,
  }));
  const weakAreas = avgScores.filter((d) => d.avg > 0 && d.avg < 3).sort((a, b) => a.avg - b.avg);

  // Group by team
  const byTeam: Record<string, typeof scorecards> = {};
  for (const sc of scorecards) {
    (byTeam[sc.team] ??= []).push(sc);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Scorecard History</h1>
        <p className="text-slate-500 mt-1">{scorecards.length} scorecard{scorecards.length !== 1 ? 's' : ''} across {Object.keys(byTeam).length} team{Object.keys(byTeam).length !== 1 ? 's' : ''}</p>
      </div>

      {realScorecards.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Org Average Scores</h2>
          <p className="text-xs text-slate-500">
            Averaged across {realScorecards.length} real scorecard{realScorecards.length !== 1 ? 's' : ''}.
            Example scorecards are excluded.
          </p>
          {avgScores.map(({ dim, avg }) => (
            <ScoreBar key={dim} dimension={dim as Dimension} score={avg} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold text-slate-800">No org averages yet</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Every scorecard currently in the repository is example content, so there is no real
            score history to average. Averaging the examples would produce a number that looks like
            a measurement and isn&apos;t one.
          </p>
        </div>
      )}

      {weakAreas.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="font-semibold text-amber-800 mb-3">Org-Wide Weak Areas (avg &lt; 3)</h2>
          <ul className="space-y-1">
            {weakAreas.map(({ dim, avg }) => (
              <li key={dim} className="text-sm text-amber-700 flex justify-between">
                <span>{DIMENSION_LABELS[dim as Dimension]}</span>
                <span className="font-semibold">{avg}/5</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-800 mb-4">All Scorecards by Team</h2>
        <div className="space-y-6">
          {Object.entries(byTeam).map(([team, cards]) => (
            <div key={team}>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{team}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cards.map((sc) => {
                  const avgScore = Math.round((Object.values(sc.scores).reduce((a, b) => a + b, 0) / 5) * 10) / 10;
                  const linkedExps = experiments.filter((e) => sc.activeExperiments.includes(e.id));
                  return (
                    <Link key={sc.id} href={`/scorecards/${sc.team}/${encodeURIComponent(sc.cycle)}`} className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">{sc.cycle}</span>
                        <span className="text-lg font-bold text-slate-700">{avgScore}/5</span>
                      </div>
                      {isExample(sc) && <ExampleMarker className="mb-2" />}
                      <p className="text-xs text-slate-400">{sc.period.start} → {sc.period.end}</p>
                      {linkedExps.length > 0 && (
                        <p className="text-xs text-blue-500 mt-1">{linkedExps.length} active experiment{linkedExps.length !== 1 ? 's' : ''}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
