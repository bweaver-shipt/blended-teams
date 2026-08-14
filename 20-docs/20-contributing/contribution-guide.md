# Contribution guide

This repository is open to contributions from any employee, with review and approval by maintainers.

## What you can contribute

- a new tool or prompt
- a new play for the Borrowed Skills Library
- a new experiment
- a new scorecard cycle for your team
- a short outcome note after trying something
- a team reference record, if your team does not have one yet

## Contribution workflow

1. Pick the matching template from `10-content/90-templates/`:

   | Template | Copy it to |
   | --- | --- |
   | `tool.template.json` | `10-content/10-tools/` |
   | `play.template.json` | `10-content/20-plays/` |
   | `experiment.template.json` | `10-content/30-experiments/` |
   | `outcome.template.json` | `10-content/50-outcomes/` |
   | `scorecard.template.json` | `10-content/60-scorecards/` |

   Team records have no template — copy the shape of an existing file in `10-content/40-teams/`.

2. Name the file after the record's `id`, for example
   `10-content/10-tools/prototype-to-pr.json`.
3. Fill in the required fields and keep the tags honest and minimal. See
   [the taxonomy](../10-taxonomy/taxonomy.md) for what each risk and dimension means.
4. Check your cross-links point at IDs that exist. Every `linkedTools`, `linkedPlays`,
   `linkedExperiments`, `linkedScorecards`, `outcomeNotes`, and `activeExperiments` entry must
   resolve to a real record.
5. Open a pull request using the provided template.
6. A maintainer reviews for taxonomy fit, clarity, and evidence.

### Validate before you push

```bash
npm install
npm run validate
```

This checks every record in `10-content/` against its schema in `schemas/` and confirms every
cross-link resolves. The same check runs on every pull request, and it fails with the offending file
path and the specific problem.

## Where things live

| Folder | What belongs there |
| --- | --- |
| `10-content/10-tools/` | Reusable tools, prompts, and setup patterns another team can adopt |
| `10-content/20-plays/` | Plays: role-crossing moves and their guardrails |
| `10-content/30-experiments/` | Hypotheses, owners, review dates, and status |
| `10-content/40-teams/` | Team reference records used by other content |
| `10-content/50-outcomes/` | Short, honest notes on what changed after trying a tool or play |
| `10-content/60-scorecards/` | Per-team scorecard snapshots for a cycle |
| `10-content/90-templates/` | Record templates for contributors |
| `20-docs/10-taxonomy/` | Risk and dimension definitions, tagging guidance |
| `20-docs/20-contributing/` | This guide |
| `20-docs/30-architecture/` | Repo structure, record relationships, routes, reporting, decisions |
| `schemas/` | JSON Schemas |
| `scripts/` | Content validation |
| `web/` | The app that renders all of this |

## Example content and the `example` flag

Tool, play, experiment, scorecard, and outcome records accept an optional `"example": true`.

It means: this record is illustrative, not a report of something that happened. The
`payments-platform` chain in this repository is example content, kept permanently as a worked
example of how the pieces link together.

Flagged records are:

- **fully browsable and cross-linked**, and marked "Example" in the UI
- **excluded from every org-wide aggregate** — the impact ledger, the org scorecard rollup, and the
  counts on the home page

That exclusion is the point. The example carries invented numbers — an `adoptionCount`, a populated
`triedByTeams`, a full set of scorecard scores. Once real content lands beside it, blending the two
would make every org-wide figure part fiction while still looking authoritative.

**Do not set `example` on real content.** If a record describes something your team actually did,
leave the field out, even if you are contributing it partly to illustrate the format.

## Review standards

Maintainers should ask:

1. Is this understandable by another team?
2. Are the risk and dimension tags specific and credible?
3. Does it describe a real move, not just an aspiration?
4. Does it say what it does **not** give you?
5. If it claims impact, is the evidence proportional and honest?
6. Is `example` set correctly — absent on real content, present on illustrations?

## Writing guidance

- Prefer short, concrete language over slogans.
- Capture one real handoff removed when possible.
- Include limitations so teams do not over-trust a pattern.
- Use outcome notes to record what happened, even if the experiment was dropped.

## Manual metrics

Some fields are maintained by hand rather than derived:

- `adoptionCount`
- `triedByTeams`
- experiment `status`
- outcome summaries

This is intentional. The goal is a usable practice repository, not a fragile analytics system. Treat
these numbers as approximate self-reporting, and see
[the reporting approach](../30-architecture/information-architecture.md#reporting-approach) for the
guardrails that go with them.
