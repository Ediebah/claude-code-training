# Claude Code Workshop

This is a training repository for the Claude Code Workshop. Each `station-*/` folder has its own CLAUDE.md with station-specific rules. Always read the station's CLAUDE.md before starting work in that folder.

## Repository layout

- `station-1/`, `station-2/`, `station-3/` — the three workshop stations
- `build-battle/` — the graded sales-leaderboard challenge
- `apps/merchant-console/` — Northwind Payments, the Repo Rescue application
- `docs/tickets/` — the tickets learners work, written the way they would arrive on a sprint board

## General Conventions

- Write clean, readable code with meaningful variable names
- Prefer modern JavaScript (ES2020+): const/let, arrow functions, template literals, optional chaining
- All HTML should be semantic and accessible
- When generating output files, write them to the station's `output/` directory

## Per-area conventions

- **Stations and Build Battle**: no external build tools. Everything runs as vanilla HTML/CSS/JS, opened directly or served statically.
- **`apps/merchant-console/`**: TypeScript, Next.js, and Tailwind, with its own CLAUDE.md. Money is integer minor units and timestamps are UTC; both rules are enforced by tests.

## Submissions

Learner work is submitted as a pull request against this repository and scored automatically. Branch names and commit subjects carry the ticket ID, for example `NWP-1042-export-options` and `NWP-1042: add export options`.
