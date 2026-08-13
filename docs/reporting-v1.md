# V1 adoption and impact reporting

The first version should optimize for honest, maintainable reporting rather than automatic precision.

## Manual fields to maintain

### Tool records

- `adoptionCount`
- `triedByTeams`

### Experiment records

- `status`
- `changeSummary`

### Outcome records

- `status`
- `summary`

## Org-level metrics to compute

These can be computed statically from repo content:

1. Total tools in the registry
2. Total plays in the library
3. Active experiments
4. Kept, dropped, and inconclusive experiments
5. Practices used by more than one team
6. Recorded handoffs removed
7. Average score by dimension across latest scorecards

## Guardrails

- Treat adoption counts as approximate self-reporting.
- Avoid presenting causal claims that the content cannot support.
- Prefer counts and simple trends over complex scoring formulas.
- Display sample sizes or record counts when showing aggregates.

## Suggested ledger calculations

### Handoffs removed

Count distinct tool records with a non-empty `handoffRemoved` field and optionally show the most commonly cited patterns.

### Practices spread

Count tools where `triedByTeams.length > 1` or `adoptionCount > 1`.

### Experiment outcomes

Count experiments by `status` and by primary dimension.

### Scorecard movement

For each team, compare the latest cycle with the previous cycle and show deltas by dimension.
