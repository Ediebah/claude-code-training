# Build Battle: Repo Rescue

The exercise wrapper. The application itself lives in `merchant-console/` and has its own CLAUDE.md with the codebase conventions — read that one before writing code.

## What you are doing here

Working ticket NWP-1042 end to end, in a codebase you did not write, under time pressure, with bugs in it. Submitted as a pull request and scored automatically.

- Ticket: `docs/tickets/NWP-1042.md` at the repository root
- Linked bug report: `docs/tickets/NWP-1057.md`
- App: `merchant-console/`

## Workflow rules

- Branch from `main` using the ticket ID: `NWP-1042-export-options`
- Commit subjects start with the ticket ID: `NWP-1042: add export options`
- Read before you edit. The console already has a query builder, money helpers, and date helpers; a second implementation of any of them costs points
- Do not edit the seed data to make a symptom disappear
- Do not commit the generated SQLite file

## Definition of done

A pull request that states what changed, how it was verified, and which acceptance criteria it meets.
