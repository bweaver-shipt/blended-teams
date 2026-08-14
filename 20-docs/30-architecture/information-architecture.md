# Information architecture

How this repository is organised, how records relate to each other, how the app projects them, and
which structural decisions have already been made.

## Principles

1. **One shared spine**: every module uses the same risk and dimension tags.
2. **Repo content is the source of truth**: app views are projections of committed records.
3. **Cross-link everything**: tools, plays, experiments, scorecards, teams, and outcomes should point to each other.
4. **Low-friction contribution**: contributors mostly fill in structured templates rather than inventing formats.
5. **Stable numbered homes**: content and docs use Johnny Decimal areas so the repo stays navigable as it grows.

## Repository structure

```text
10-content/
  10-tools/        Tool and prompt registry entries
  20-plays/        Plays for the Borrowed Skills Library
  30-experiments/  Experiment records
  40-teams/        Team reference records
  50-outcomes/     Outcome notes
  60-scorecards/   Team scorecard cycles
  90-templates/    Record templates for contributors
20-docs/
  10-taxonomy/     Risks, dimensions, and tagging guidance
  20-contributing/ How to add a record, review standards, writing guidance
  30-architecture/ This document
schemas/           JSON Schemas, referenced by the validator
scripts/           Content validation
web/               Next.js app that renders the content
.github/           Workflows, issue templates, PR template
```

Only `10-content/` and `20-docs/` are numbered. `schemas/`, `scripts/`, `web/`, and `.github/` are
addressed by convention — build tools and GitHub itself expect those exact names, and numbering
`.github/` would stop it working entirely.

### Why Johnny Decimal for content and docs

- It gives every module and support asset a stable address.
- It makes cross-team references easier in chat, docs, and pull requests.
- It keeps the repo from turning into a flat pile of loosely related folders.
- It supports growth without changing the conceptual model.

## Record relationships

- tools link to plays and experiments
- plays link to tools and outcomes
- experiments link to tools, plays, and scorecards
- scorecards link to active experiments
- outcomes link back to tools, plays, and experiments
- teams provide shared reference data for attribution and filtering

Every one of those links is checked in CI. See `scripts/validate-content.mjs`.

## Routes

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

### What each view shows

**Tool & Prompt Registry** — index cards show name, summary, team, risk and dimension tags, and
adoption count, filterable by risk, dimension, team, and role. Detail pages show the copyable prompt
or setup, the handoff removed, limitations, linked plays and experiments, and the teams that tried
it.

**Borrowed Skills Library** — index cards show the play title, the role-to-adjacent-role move, risk
tags, and a guardrail preview. Detail pages show the move, guardrail, prerequisites, linked tools,
and linked outcome notes.

**Experiment Board** — grouped into columns by status (active, kept, dropped, inconclusive). Cards
show title, team, dimensions, and review date. Detail pages add the hypothesis, change summary, and
linked tools, plays, scorecards, and outcomes.

**Impact ledger** — org rollups computed from committed records: experiment counts by status, the
kept/dropped ratio, tools adopted by more than one team, and experiment counts by dimension and
risk.

**Scorecard History** — org average by dimension, dimensions averaging below 3, and per-team cycle
history. Cycle detail pages show scores, notes, observed movement, and the experiments active in
that cycle.

**Teams** — each team's tools, plays, experiments, outcomes, and scorecard history, using the
reference record in `10-content/40-teams/` for name, area, and roles. A team ID that appears in
content without a team record still gets a page; it falls back to the bare slug.

## Reporting approach

The ledger optimises for honest, maintainable reporting over automatic precision.

### Manually maintained fields

- tools: `adoptionCount`, `triedByTeams`
- experiments: `status`, `changeSummary`
- outcomes: `status`, `summary`

This is deliberate. The goal is a usable practice repository, not a fragile analytics system.

### Metrics computed from content

1. Total tools in the registry
2. Total plays in the library
3. Active experiments
4. Kept, dropped, and inconclusive experiments
5. Practices used by more than one team
6. Recorded handoffs removed
7. Average score by dimension across the latest scorecards

### Guardrails

- Treat adoption counts as approximate self-reporting.
- Avoid causal claims the content cannot support.
- Prefer counts and simple trends over complex scoring formulas.
- Show record counts alongside aggregates so readers can judge the sample.
- Records flagged `"example": true` are excluded from every aggregate. See the contribution guide.
- When there is no real data, the app says so rather than rendering zeros — a 0% kept ratio would
  imply a measurement that never happened.

## Decision record: Next.js static export

**Decided and shipped.** The app is a Next.js app in `web/` using `output: 'export'`, reading JSON
from `10-content/` at build time and publishing to GitHub Pages.

Astro and Eleventy were the alternatives considered. Next.js was chosen for familiar React
ergonomics and file-system routing; the content volume is small enough that Astro's
low-JavaScript advantage did not outweigh that.

What the decision bought us:

- No backend. Pull requests remain the only write path.
- Aggregation logic is plain TypeScript, running at build time, auditable in review.
- Low operational burden — the site is a directory of static files.

Out of scope, deliberately: live editing in the app, per-user accounts, workflow automation inferred
from activity, and automatic causal measurement.

## Deployment

`.github/workflows/deploy.yml` builds `web/` on every push to `master` and publishes `web/out`
through `actions/upload-pages-artifact` and `actions/deploy-pages`.

The artifact-based flow replaced an earlier manual build-and-force-push to a `gh-pages` branch. That
flow had already caused a real incident: `web/.next/cache` was committed and leaked a GitHub OAuth
token, which GitHub auto-revoked, and history had to be rewritten with `git filter-repo`. A later
push committed `node_modules` and triggered large-file warnings. Publishing an artifact removes both
failure modes — nothing built is ever committed.

`.nojekyll` is written into the output before upload. Without it, Pages runs the artifact through
Jekyll, which strips the `_next/` asset directory and breaks every stylesheet and script.

**Manual step:** for this workflow to take effect, the repository's Pages source must be set to
**GitHub Actions** under Settings → Pages. If it is still set to "Deploy from a branch", the
workflow will run and succeed while the published site continues to serve the old `gh-pages`
content.

## Contribution governance

- Anyone in the organisation can propose a record.
- Maintainers approve new records and taxonomy changes.
- Taxonomy changes should be reviewed more strictly than ordinary content.
- Scorecards should normally be approved by the team they represent.

### Suggested CODEOWNERS areas

- `schemas/` and `20-docs/10-taxonomy/`: central maintainers
- `10-content/60-scorecards/` and `10-content/40-teams/`: team owners plus maintainers
- `10-content/10-tools/`, `10-content/20-plays/`, `10-content/30-experiments/`, `10-content/50-outcomes/`: maintainers, open contribution
