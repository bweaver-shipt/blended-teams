# Blended Teams

Blended Teams is a GitHub-repo-backed handbook and lightweight app for sharing team tools, borrowed skills, experiments, and scorecard history across an organisation.

## What lives here

This repository has four connected modules:

1. **Tool & prompt registry** for discoverable tools, prompts, and setup patterns.
2. **Borrowed skills library** for role-crossing plays and guardrails.
3. **Experiment board + impact ledger** for running and assessing changes in practice.
4. **Scorecard history** for tracking team movement over time.

Everything is connected by a shared taxonomy:

- **Risks**: value, usability, feasibility, viability
- **Scorecard dimensions**:
  - shared-tooling
  - cross-functional-ownership
  - experiment-velocity
  - delivery-autonomy
  - impact-learning

## Repository layout

This blueprint works well with a **Johnny Decimal** structure so the repo stays browsable as it grows. The numbers give every top-level area a stable home and make it easier to talk about where things live.

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
.github/
```

The current sample files in this blueprint still use plain directories for readability, but I recommend numbering the real repo from the start.

## Content model

All records are JSON so they are:

- easy to validate in CI
- easy to diff in pull requests
- easy for a lightweight app to load statically

Every record should include:

- a stable `id`
- a human-readable `title` or `name`
- tags for one or more `risks`
- tags for one or more `dimensions`
- ownership or attribution to a team

## Contribution model

Anyone in the organisation can contribute by opening a pull request.

The preferred contribution path is:

1. Copy the relevant template from `10-content/90-templates/`
2. Add or update a record in the matching Johnny Decimal content directory
3. Open a pull request with the contribution template
4. Maintainers review for clarity, evidence, and taxonomy fit

## Suggested app shape

The app can be a small static site generator build, such as Next.js static export, Astro, or Eleventy. It should provide:

- browsable indexes for tools, plays, experiments, and scorecards
- filters by risk, dimension, team, and role
- detail pages with cross-links between related records
- org rollups and lightweight aggregate metrics

## First milestone

The first useful version is:

- schemas committed
- sample seeded records across all modules
- contribution docs and PR templates
- a basic app that renders the four module views from repo content
