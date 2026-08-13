# App stack recommendation

## Recommendation

Use a **static or mostly-static web app** that reads JSON files from `content/` at build time.

The best fit for v1 is:

- **Next.js with static generation** if you want familiar React ergonomics and simple routing

Good alternatives:

- **Astro** if content performance and low-JavaScript pages matter most
- **Eleventy** if the app is primarily content rendering with minimal interactivity

## Why this fits

- No backend is required for the first version.
- Pull requests remain the primary write path.
- The app can publish from the repo with low operational burden.
- Static builds make aggregation logic straightforward and auditable.

## Build responsibilities

The app should:

1. load and validate content records
2. generate index and detail pages for each module
3. compute simple aggregate metrics for the impact ledger
4. render org rollups from the latest scorecards

## Hosting options

- GitHub Pages if the framework supports static export cleanly
- another repo-connected static host if a richer build pipeline is preferred

## Non-goals for v1

- live editing in the app
- per-user accounts
- workflow automation inferred from activity
- automatic causal measurement
