# Build Battle: Repo Rescue

**Time:** 30 minutes | **Everyone competes** | **All skills from today**

You are a new engineer at **Northwind Payments**. Your team owns the merchant console: the internal tool support and ops staff use to look up a payment, refund it, and work the dispute queue.

It is your first sprint. There is a ticket with your name on it, and a bug report nobody has picked up yet.

---

## The Rules

1. Work the ticket in [`docs/tickets/NWP-1042.md`](../docs/tickets/NWP-1042.md) from start to finish.
2. The codebase has **bugs hiding in plain sight**. Some are described in [`NWP-1057`](../docs/tickets/NWP-1057.md). Others are not described anywhere.
3. You have 30 minutes to build the feature, fix what you find, and push a clean PR.

Pull the ticket into Claude Code instead of retyping it:

```
@docs/tickets/NWP-1042.md
```

## Setup

```bash
cd build-battle/merchant-console
npm install
npm run seed
npm run dev
```

Everyone gets the same seeded data, so everyone gets the same bugs.

## Scoring

A Claude sub-agent reviews every PR automatically and scores on:

| Weight | Category | What It Checks |
|--------|----------|---------------|
| 40% | **Ticket** | Does NWP-1042 meet its acceptance criteria? |
| 30% | **Bugs Fixed** | How many of the planted bugs did you find and fix? |
| 20% | **Code Quality** | Clean code, project conventions followed, no new issues introduced |
| 10% | **PR Description** | Clear explanation of what changed and how you verified it |

## How to Submit

```bash
git checkout -b NWP-1042-export-options
# ...do the work...
git add -A
git commit -m "NWP-1042: add export options"
git push -u origin NWP-1042-export-options
# Open a PR — the reviewer runs automatically
```

You can push multiple times. Each push re-triggers the reviewer. Your highest score counts.

## Tips

- **Read the notes on the ticket.** The team left three warnings there, and each one maps to a way people lose points.
- Run `/ship-ready` before pushing. It catches some issues, not all.
- Read `merchant-console/CLAUDE.md` first. Two conventions in it explain most of the bugs in this codebase.
- The bugs range from obvious to subtle. Some are in the API, some in the UI, one is in the seed data.
- Fixing a symptom is not fixing a bug. The grader checks whether the root cause is gone.
- Write the PR description. It is worth more than any single bug fix.

Good luck.
