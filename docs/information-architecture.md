# Information architecture

## Principles

1. **One shared spine**: every module uses the same risk and dimension tags.
2. **Repo content is the source of truth**: app views are projections of committed records.
3. **Cross-link everything**: tools, plays, experiments, scorecards, teams, and outcomes should point to each other.
4. **Low-friction contribution**: contributors should mostly fill structured templates, not invent formats.
5. **Stable numbered homes**: use Johnny Decimal areas so the repo stays navigable as content grows.

## Johnny Decimal structure

```text
00-admin/
  00-governance/
  10-contributing/
01-taxonomy-and-schemas/
  10-taxonomy/
  20-schemas/
10-content/
  10-tools/
  20-plays/
  30-experiments/
  40-teams/
  50-outcomes/
  60-scorecards/
  90-templates/
20-app/
  10-routes/
  20-components/
30-docs/
  10-concepts/
  20-reporting/
```

## Why Johnny Decimal fits here

- It gives every module and support asset a stable address.
- It makes cross-team references easier in chat, docs, and pull requests.
- It prevents the repo from turning into a flat pile of loosely related folders.
- It supports future growth without changing the conceptual model.

## Record relationships

- tools link to plays and experiments
- plays link to tools and outcomes
- experiments link to tools, plays, and scorecards
- scorecards link to active experiments
- outcomes link back to tools, plays, and experiments
- teams provide shared reference data for attribution and filtering

## URL / route model for the app

```text
/
/tools
/tools/[id]
/plays
/plays/[id]
/experiments
/experiments/[id]
/impact
/scorecards
/scorecards/[team]/[cycle]
/teams
/teams/[id]
```

## Contribution governance

- Anyone in the organisation can propose a record.
- Maintainers approve new records and taxonomy changes.
- Taxonomy changes should be reviewed more strictly than ordinary content.
- Scorecards should normally be approved by the represented team.

## Suggested CODEOWNERS areas

- `01-taxonomy-and-schemas/` and taxonomy docs: central maintainers
- `10-content/60-scorecards/` and `10-content/40-teams/`: team owners plus maintainers
- `10-content/10-tools/`, `10-content/20-plays/`, `10-content/30-experiments/`, `10-content/50-outcomes/`: maintainers with open contribution
