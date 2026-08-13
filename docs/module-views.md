# Module views

## 1. Tool & prompt registry

### Index view

Show cards with:

- name
- summary
- team
- risk tags
- dimension tags
- adoption count

### Filters

- risk
- scorecard dimension
- team
- role

### Detail view

Show:

- copyable prompt or setup
- handoff removed
- limitations
- linked plays
- linked experiments
- teams that tried it

## 2. Borrowed skills library

### Index view

Show cards with:

- title
- role to adjacent role move
- risk tags
- guardrail preview

### Detail view

Show:

- the move
- guardrail
- prerequisites
- linked tools
- linked outcome notes

## 3. Experiment board + impact ledger

### Board view

Columns by status:

- active
- kept
- dropped
- inconclusive

Each card should show:

- title
- team
- target dimension
- review date

### Impact ledger view

Aggregate simple v1 metrics:

- total experiments
- kept vs dropped ratio
- total recorded handoffs removed
- practices adopted by multiple teams
- counts by dimension and risk

## 4. Scorecard history

### Team history view

Show per-cycle score history with:

- one line or bar per dimension
- cycle notes
- active experiments overlay

### Org rollup view

Show:

- average score by dimension
- dimensions with the lowest average score
- dimensions with the most linked kept experiments
- teams with the most shared tools adopted

## Cross-linking behavior

- Tool detail pages should link to enabling plays and experiments using them.
- Play detail pages should link to the tools that make the move practical.
- Experiment detail pages should link to the scorecard cycles that bracket the change.
- Scorecard pages should link back to the experiments active in that cycle.
- Team pages should summarize the team’s tools, plays, experiments, outcomes, and scorecards.
