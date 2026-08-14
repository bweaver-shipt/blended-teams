import fs from 'fs';
import path from 'path';
import type { Tool, Play, Experiment, Scorecard, Outcome, Team } from './types';

// Content lives one dir up from web/ — at blended-teams/10-content/
const CONTENT_DIR = path.join(process.cwd(), '..', '10-content');

function readDir<T>(subdir: string): T[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T);
}

export function getTools(): Tool[] {
  return readDir<Tool>('10-tools');
}

export function getPlays(): Play[] {
  return readDir<Play>('20-plays');
}

export function getExperiments(): Experiment[] {
  return readDir<Experiment>('30-experiments');
}

export function getScorecards(): Scorecard[] {
  return readDir<Scorecard>('60-scorecards');
}

export function getOutcomes(): Outcome[] {
  return readDir<Outcome>('50-outcomes');
}

export function getTeams(): Team[] {
  return readDir<Team>('40-teams');
}

// A team ID can appear in content before anyone commits a 40-teams/ record for it,
// so union both sources and let callers fall back to the bare slug.
export function getTeamIds(): string[] {
  const tools = getTools();
  const plays = getPlays();
  const experiments = getExperiments();
  const scorecards = getScorecards();
  const ids = new Set<string>([
    ...getTeams().map((t) => t.id),
    ...tools.map((t) => t.team),
    ...tools.flatMap((t) => t.triedByTeams),
    ...plays.map((p) => p.team),
    ...experiments.map((e) => e.team),
    ...scorecards.map((s) => s.team),
    ...getOutcomes().map((o) => o.team),
  ]);
  return Array.from(ids).sort();
}

export function getTeam(id: string): Team | undefined {
  return getTeams().find((t) => t.id === id);
}

/** Example records stay browsable, but must never count toward a number presented as fact. */
export function isExample(record: { example?: boolean }): boolean {
  return record.example === true;
}

export function realOnly<T extends { example?: boolean }>(records: T[]): T[] {
  return records.filter((r) => !isExample(r));
}

// Org-wide metrics. `catalogue` counts everything browsable; `real` excludes example records
// and is the only source for any figure presented as measurement.
export function getOrgMetrics() {
  const tools = realOnly(getTools());
  const plays = realOnly(getPlays());
  const experiments = realOnly(getExperiments());
  const scorecards = realOnly(getScorecards());
  const outcomes = realOnly(getOutcomes());

  const teams = new Set<string>([
    ...tools.map((t) => t.team),
    ...tools.flatMap((t) => t.triedByTeams),
    ...plays.map((p) => p.team),
    ...experiments.map((e) => e.team),
    ...scorecards.map((s) => s.team),
    ...outcomes.map((o) => o.team),
  ]);

  const kept = experiments.filter((e) => e.status === 'kept').length;
  const dropped = experiments.filter((e) => e.status === 'dropped').length;
  const active = experiments.filter((e) => e.status === 'active').length;
  const inconclusive = experiments.filter((e) => e.status === 'inconclusive').length;

  // Average scores per dimension across all real scorecards
  const dimTotals: Record<string, number> = {};
  const dimCounts: Record<string, number> = {};
  for (const sc of scorecards) {
    for (const [dim, score] of Object.entries(sc.scores)) {
      dimTotals[dim] = (dimTotals[dim] || 0) + score;
      dimCounts[dim] = (dimCounts[dim] || 0) + 1;
    }
  }
  const avgScores: Record<string, number> = {};
  for (const dim of Object.keys(dimTotals)) {
    avgScores[dim] = Math.round((dimTotals[dim] / dimCounts[dim]) * 10) / 10;
  }

  // Tools adopted by multiple teams
  const multiTeamTools = tools.filter((t) => t.triedByTeams.length > 1).length;

  const hasRealData =
    tools.length + plays.length + experiments.length + scorecards.length + outcomes.length > 0;

  return {
    hasRealData,
    catalogue: {
      tools: getTools().length,
      plays: getPlays().length,
      experiments: getExperiments().length,
      scorecards: getScorecards().length,
      outcomes: getOutcomes().length,
      teams: getTeamIds().length,
    },
    totalTools: tools.length,
    totalPlays: plays.length,
    totalExperiments: experiments.length,
    totalScorecards: scorecards.length,
    totalOutcomes: outcomes.length,
    totalTeams: teams.size,
    kept,
    dropped,
    active,
    inconclusive,
    avgScores,
    multiTeamTools,
  };
}
