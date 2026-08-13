export type Risk = 'value' | 'usability' | 'feasibility' | 'viability';
export type Dimension =
  | 'shared-tooling'
  | 'cross-functional-ownership'
  | 'experiment-velocity'
  | 'delivery-autonomy'
  | 'impact-learning';
export type ExperimentStatus = 'active' | 'kept' | 'dropped' | 'inconclusive';
export type SetupType = 'prompt' | 'checklist' | 'script' | 'workflow' | 'other';

export interface Tool {
  id: string;
  name: string;
  summary: string;
  team: string;
  roles: string[];
  risks: Risk[];
  dimensions: Dimension[];
  handoffRemoved: string;
  setup: { type: SetupType; content: string };
  limitations: string;
  linkedPlays: string[];
  linkedExperiments: string[];
  adoptionCount: number;
  triedByTeams: string[];
}

export interface Play {
  id: string;
  title: string;
  role: string;
  adjacentRole: string;
  team: string;
  risks: Risk[];
  dimensions: Dimension[];
  move: string;
  guardrail: string;
  prerequisites: string[];
  linkedTools: string[];
  outcomeNotes: string[];
}

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  owner: string;
  team: string;
  risks: Risk[];
  dimensions: Dimension[];
  reviewDate: string;
  status: ExperimentStatus;
  changeSummary: string;
  linkedTools: string[];
  linkedPlays: string[];
  linkedScorecards: string[];
}

export type DimensionScores = Record<Dimension, number>;

export interface Scorecard {
  id: string;
  team: string;
  cycle: string;
  period: { start: string; end: string };
  risks: Risk[];
  dimensions: Dimension[];
  scores: DimensionScores;
  notes: string;
  activeExperiments: string[];
  observedMovement: string;
}

export interface Team {
  id: string;
  name?: string;
}

export const ALL_RISKS: Risk[] = ['value', 'usability', 'feasibility', 'viability'];
export const ALL_DIMENSIONS: Dimension[] = [
  'shared-tooling',
  'cross-functional-ownership',
  'experiment-velocity',
  'delivery-autonomy',
  'impact-learning',
];
export const DIMENSION_LABELS: Record<Dimension, string> = {
  'shared-tooling': 'Shared Tooling',
  'cross-functional-ownership': 'Cross-Functional Ownership',
  'experiment-velocity': 'Experiment Velocity',
  'delivery-autonomy': 'Delivery Autonomy',
  'impact-learning': 'Impact Learning',
};
export const RISK_LABELS: Record<Risk, string> = {
  value: 'Value',
  usability: 'Usability',
  feasibility: 'Feasibility',
  viability: 'Viability',
};
export const STATUS_LABELS: Record<ExperimentStatus, string> = {
  active: 'Active',
  kept: 'Kept',
  dropped: 'Dropped',
  inconclusive: 'Inconclusive',
};
