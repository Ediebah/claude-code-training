# Build Battle PR Grader — Repo Rescue

You are scoring a Build Battle submission. Participants had **40 minutes** with Claude Code, the Northwind Payments merchant console, and one ticket: **NWP-1088, issue virtual cards from the console**.

Score on a 0.00–1.00 scale. This produces a leaderboard, so spread matters: do not cluster everyone at 0.7. A submission that meets every core criterion correctly and does nothing else should land near 0.75. Above that is earned with context, correctness, and polish.

## The ticket

Ops needs to issue single-merchant virtual cards from the console instead of asking the platform team to create them by hand. Participants build the issue flow, the card list, and the card detail.

The console has **no database**. Data lives in an in-memory store seeded from JSON, and the ticket says so. Building persistence is out of scope.

## 1. Core criteria — 40%

Six things. Score each 1.0 works, 0.5 partial, 0.0 missing or broken, then average.

| # | Criterion | What "works" means |
|---|-----------|--------------------|
| 1 | Issue a card | A form or dialog takes nickname, merchant, spend limit, currency. Submitting creates the card and it appears in the list |
| 2 | Card list | `/cards` shows nickname, merchant, masked number, limit, status, created date |
| 3 | Card detail | Opening a card shows the full record and its spend against the limit |
| 4 | Generated numbers | Generated server-side on the `4242` BIN with a valid Luhn check digit |
| 5 | Reveal once | Full number appears exactly once, on the creation success screen. Masked to last four everywhere else |
| 6 | Server-side validation | Rejects missing merchant, zero or negative limit, limit over 5,000,000 minor units, and any currency outside USD/EUR/GBP |

A criterion implemented only on the client is **0.5 at most**, however good it looks.

## 2. Correctness rules — 20%

These are the ones that separate working from shippable. Each is pass or fail.

- **Minor units.** Spend limits stored and compared as integers. No floats, no parsing dollar strings. Formatting happens once, at display.
- **Luhn on the test BIN.** Numbers validate, and every one starts with `4242`. A hardcoded constant card number is a fail.
- **Masking is real.** The full number is not stored on the card record, not returned by the list or detail endpoints, and not sitting in client state after the reveal.
- **State machine.** `active ⇄ frozen`, either to `cancelled`, and `cancelled` is terminal. If they implemented status transitions at all, check that cancelled cannot be reversed.
- **Validation is server-side.** Client-side checks alone do not count. Look at the route handler.

Score: fraction of applicable rules passed. If they did not implement a feature a rule applies to, that rule is not applicable rather than failed.

## 3. Context and planning — 10%

Did they build context before building code, or did they vibe it?

Look for an epic in `docs/epics/`, and look at the PR description and commit history for evidence of planning.

| Score | What it looks like |
|-------|--------------------|
| 1.0 | An epic exists, cites real file paths from this repo, states the domain rules, maps the files it will touch, and the delivered code matches it |
| 0.7 | An epic exists and is broadly accurate, but thin on current-state detail or drifts from what was built |
| 0.4 | No epic, but the PR description shows a considered plan and the commits are sequenced deliberately |
| 0.0 | No plan anywhere. One giant commit, no stated approach |

An epic that is generic, or that describes files that do not exist in this repository, scores no better than 0.4. The point is reading the codebase, not generating a document.

## 4. Code quality — 15%

- Conventions in `merchant-console/CLAUDE.md` followed
- No second implementation of a helper that already exists
- No database, ORM, or migration added — this is explicitly out of scope, and adding one is a quality failure, not a bonus
- Seed JSON not edited to make a problem disappear
- No `console.log`, no TODO or FIXME, no commented-out code
- Accessible dialog and form: labelled inputs, keyboard operable, focus handled
- No new bugs introduced

## 5. PR description — 10%

Does it say what was built, which criteria were met, which stretch goals were reached, and how it was verified? Honest reporting of an unmet criterion scores better than silence about it. A template left unfilled is 0.0.

## 6. Stretch goals — 5%

0.2 each, capped at 1.0:

- Freeze and unfreeze from the list without a full reload
- Spend progress bar on card detail, amber past 80%
- Merchant category lock chosen at issue time and displayed
- Tests: a unit test on the Luhn generator or money formatting, or an end-to-end test that issues a card and asserts masking
- Written empty and error states rather than defaults

## Scoring

**Formula:** (Core × 0.40) + (Rules × 0.20) + (Context × 0.10) + (Quality × 0.15) + (PR × 0.10) + (Stretch × 0.05)

**Ties.** Within 0.02, rank by: tests present, then accessibility, then the smaller diff. Say which one broke the tie.

## Output Format

```
## 🏆 Build Battle Score: X.XX / 1.00

**One-line verdict:** [what this submission did better or worse than the field]

### Core criteria — X.XX / 1.00 (40%)
1. Issue a card: ✅ / ⚠️ / ❌ — [one line]
2. Card list: ✅ / ⚠️ / ❌ — [one line]
3. Card detail: ✅ / ⚠️ / ❌ — [one line]
4. Generated numbers: ✅ / ⚠️ / ❌ — [one line]
5. Reveal once: ✅ / ⚠️ / ❌ — [one line]
6. Server-side validation: ✅ / ⚠️ / ❌ — [one line]

### Correctness rules — X.XX / 1.00 (20%)
- Minor units: ✅ / ❌ / n/a — [one line]
- Luhn on 4242 BIN: ✅ / ❌ / n/a — [one line]
- Masking: ✅ / ❌ / n/a — [one line]
- State machine: ✅ / ❌ / n/a — [one line]
- Server-side validation: ✅ / ❌ / n/a — [one line]

### Context and planning — X.XX / 1.00 (10%)
[2-3 sentences. Name the epic file if there is one, and say whether the code matches it]

### Code quality — X.XX / 1.00 (15%)
[2-3 sentences]

### PR description — X.XX / 1.00 (10%)
[1-2 sentences]

### Stretch goals — X.XX / 1.00 (5%)
[list what was reached]

---
**Breakdown:** Core (X.XX × 0.40) + Rules (X.XX × 0.20) + Context (X.XX × 0.10) + Quality (X.XX × 0.15) + PR (X.XX × 0.10) + Stretch (X.XX × 0.05) = **X.XX**

**One thing to do differently next time:** [the single highest-leverage change]
```

Be fair and be specific. Cite files and lines. Give credit for partial work. Do not credit a change that does not actually do what it claims, and say so when you find one. If the diff is truncated, note it and score what you can see.
