# Contribution guide

This repository is open to contributions from any employee, with review and approval by maintainers.

## What you can contribute

- a new tool or prompt
- a new borrowed skill or play
- a new experiment
- a new scorecard cycle for your team
- a short outcome note after trying something

## Contribution workflow

1. Pick the right template from `10-content/90-templates/`.
2. Copy it into the matching Johnny Decimal folder under `10-content/`.
3. Fill in the required fields and keep the tags honest and minimal.
4. Open a pull request using the provided template.
5. A maintainer reviews for taxonomy fit, clarity, and evidence.

## Johnny Decimal layout

Use a stable numbered structure so contributors can find material quickly:

| Area | Purpose |
| --- | --- |
| `00-admin/00-governance/` | Policies, ownership, review rules |
| `00-admin/10-contributing/` | Contribution guide and workflow docs |
| `01-taxonomy-and-schemas/10-taxonomy/` | Shared tag definitions and mapping guidance |
| `01-taxonomy-and-schemas/20-schemas/` | JSON Schemas and validation assets |
| `10-content/10-tools/` | Tool and prompt registry entries |
| `10-content/20-plays/` | Borrowed skills and role-crossing plays |
| `10-content/30-experiments/` | Experiment records |
| `10-content/40-teams/` | Team reference records |
| `10-content/50-outcomes/` | Outcome notes |
| `10-content/60-scorecards/` | Team scorecard cycles |
| `10-content/90-templates/` | Record templates for contributors |
| `20-app/10-routes/` | Route definitions and page plans |
| `20-app/20-components/` | Shared UI components if the app expands |
| `30-docs/10-concepts/` | Product and model explanations |
| `30-docs/20-reporting/` | Reporting and ledger documentation |

## Folder-by-folder guidance

| Folder | What belongs there |
| --- | --- |
| `10-content/10-tools/` | Reusable tools, prompts, and setup patterns another team can adopt |
| `10-content/20-plays/` | Role-crossing plays, moves, and guardrails |
| `10-content/30-experiments/` | Hypotheses, owners, review dates, and outcomes |
| `10-content/40-teams/` | Team reference records used by other content |
| `10-content/50-outcomes/` | Short, honest notes on what changed after trying a tool or play |
| `10-content/60-scorecards/` | Per-team scorecard snapshots for a cycle |

## Review standards

Maintainers should ask:

1. Is this understandable by another team?
2. Are the risk and dimension tags specific and credible?
3. Does it describe a real move, not just an aspiration?
4. Does it say what it does **not** give you?
5. If it claims impact, is the evidence proportional and honest?

## Writing guidance

- Prefer short, concrete language over slogans.
- Capture one real handoff removed when possible.
- Include limitations so teams do not over-trust a pattern.
- Use outcome notes to record what happened, even if the experiment was dropped.

## Manual metrics in v1

The first version uses manual entry for:

- `adoptionCount`
- `triedByTeams`
- experiment `status`
- outcome summaries

This is intentional. The goal is a usable practice repository, not a fragile analytics system.
