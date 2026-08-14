# Blended Teams

A GitHub-repo-backed handbook and app for sharing team tools, plays, experiments, and scorecard
history across an organisation.

The core path: a team scores low on a dimension, clicks it, and sees the tools, plays, and
experiments other teams used to move it.

## What lives here

Four connected modules:

1. **Tool & Prompt Registry** — discoverable tools, prompts, and setup patterns.
2. **Borrowed Skills Library** — role-crossing plays and their guardrails. A single record is a *play*.
3. **Experiment Board and impact ledger** — running and assessing changes in practice.
4. **Scorecard History** — team movement over time.

Everything is connected by a shared taxonomy:

- **Risks**: value, usability, feasibility, viability
- **Dimensions**: shared-tooling, cross-functional-ownership, experiment-velocity,
  delivery-autonomy, impact-learning

Both vocabularies are defined in `schemas/common-defs.json` and explained in
[the taxonomy](20-docs/10-taxonomy/taxonomy.md).

## Repository layout

Content and docs use a Johnny Decimal structure so every area has a stable address.

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
  10-taxonomy/     Risks, dimensions, tagging guidance
  20-contributing/ How to contribute a record
  30-architecture/ Repo structure, routes, reporting, decisions
schemas/           JSON Schemas
scripts/           Content validation
web/               Next.js app
.github/           Workflows and templates
```

`schemas/`, `scripts/`, `web/`, and `.github/` are deliberately unnumbered — tooling and GitHub
address those by name.

## Content model

All records are JSON so they are easy to validate in CI, easy to diff in pull requests, and easy for
the app to load at build time.

Every record has a stable `id`, a human-readable `title` or `name`, at least one `risk`, at least one
`dimension`, and an owning team.

Records may also carry `"example": true`, which marks them as illustrative. Example records stay
browsable and cross-linked but are excluded from every org-wide aggregate. The `payments-platform`
chain in this repository is example content.

## Contributing

1. Copy the relevant template from `10-content/90-templates/`.
2. Add it to the matching directory under `10-content/`.
3. Run `npm install && npm run validate`.
4. Open a pull request with the contribution template.
5. Maintainers review for clarity, evidence, and taxonomy fit.

Full detail in [the contribution guide](20-docs/20-contributing/contribution-guide.md).

## Running the app

```bash
cd web
npm install
npm run dev
```

The app reads JSON from `10-content/` at build time. To reproduce the published build:

```bash
NEXT_PUBLIC_BASE_PATH=/blended-teams npm run build
```

Output lands in `web/out`. Pushing to `master` builds and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`.

## Validation

`.github/workflows/validate-content.yml` runs on every pull request. It checks each record against
its schema and confirms every cross-link resolves to a record that exists. Run it locally with
`npm run validate` from the repository root.
