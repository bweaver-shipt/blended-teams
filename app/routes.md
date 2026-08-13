# App route blueprint

This is a minimal route plan for the published app.

## Landing page

- explain the four modules
- show top-level rollup counts
- link into tools, plays, experiments, impact, and scorecards

## Tools

- `/tools` index with filters
- `/tools/[id]` detail with setup, limitations, and related plays/experiments

## Plays

- `/plays` index with role and risk filters
- `/plays/[id]` detail with move, guardrail, and linked tools/outcomes

## Experiments and impact

- `/experiments` board or list grouped by status
- `/experiments/[id]` detail
- `/impact` aggregate ledger view

## Scorecards

- `/scorecards` org rollup
- `/scorecards/[team]/[cycle]` cycle detail

## Teams

- `/teams` index
- `/teams/[id]` team summary page
