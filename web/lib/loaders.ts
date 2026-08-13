import fs from 'fs';
import path from 'path';
import type { Tool, Play, Experiment, Scorecard } from './types';

// Content lives two dirs up from web/ — at blended-teams/content/
const CONTENT_DIR = path.join(process.cwd(), '..', 'content');

function readDir<T>(subdir: string): T[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T);
}

export function getTools(): Tool[] {
  return readDir<Tool>('tools');
}

export function getPlays(): Play[] {
  return readDir<Play>('plays');
}

export function getExperiments(): Experiment[] {
  return readDir<Experiment>('experiments');
}

export function getScorecards(): Scorecard[] {
  return readDir<Scorecard>('scorecards');
}

export function getTeamIds(): string[] {
  const tools = getTools();
  const plays = getPlays();
  const experiments = getExperiments();
  const scorecards = getScorecards();
  const ids = new Set<string>([
    ...tools.map((t) => t.team),
    ...plays.map((p) => p.team),
    ...experiments.map((e) => e.team),
    ...scorecards.map((s) => s.team),
  ]);
  return Array.from(ids).sort();
}

// Org-wide metrics
export function getOrgMetrics() {
  const tools = getTools();
  const plays = getPlays();
  const experiments = getExperiments();
  const scorecards = getScorecards();
  const teams = getTeamIds();

  const kept = experiments.filter((e) => e.status === 'kept').length;
  const dropped = experiments.filter((e) => e.status === 'dropped').length;
  const active = experiments.filter((e) => e.status === 'active').length;
  const inconclusive = experiments.filter((e) => e.status === 'inconclusive').length;

  // Average scores per dimension across all scorecards
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

  return {
    totalTools: tools.length,
    totalPlays: plays.length,
    totalExperiments: experiments.length,
    totalScorecards: scorecards.length,
    totalTeams: teams.length,
    kept,
    dropped,
    active,
    inconclusive,
    avgScores,
    multiTeamTools,
  };
}
