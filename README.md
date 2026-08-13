# Claude Code Training

**Repo Rescue** — a hands-on workshop where you take a real ticket through a real codebase with Claude Code, open a pull request, and get scored on it.

Built by [Tenex](https://tenex.co) in partnership with Anthropic.

> **Status:** the Northwind merchant console is mid-build. The base app and the tickets are in place; the API, seed data, and planted bugs are still landing.

---

## The premise

You are a new engineer at **Northwind Payments**, a fictional payments company. Your team owns the merchant console: the internal tool support and ops staff use to look up a payment, refund it, and work the dispute queue.

It is your first sprint. NWP-1042 is assigned to you. NWP-1057 is sitting in triage, unloved, and three merchants are asking about it.

Every merchant, cardholder, and amount in this repository is generated. Northwind Payments is not a real company.

## Prerequisites

- [ ] **Claude Code** installed and authenticated
- [ ] **GitHub account**, for submitting your pull request
- [ ] **Git** installed
- [ ] **Node.js 20+**
- [ ] A code editor — optional

## Quick Start

```bash
git clone https://github.com/JJFromTenex/claude-code-training.git
cd claude-code-training/build-battle/merchant-console
npm install
npm run seed
npm run dev
```

Then read your ticket, and pull it into Claude Code rather than retyping it:

```
@docs/tickets/NWP-1042.md
```

## How this repo is used

It is both where you get the work and where you hand it in.

1. **Download.** Clone this repository, or fork it if you want somewhere of your own to push.
2. **Take your ticket.** `docs/tickets/` holds tickets written the way they arrive on a sprint board: description, acceptance criteria, and notes from the team.
3. **Do the work.** Branch with the ticket ID, for example `NWP-1042-export-options`.
4. **Open a pull request** against this repository. The template asks what changed and how you verified it.
5. **Get scored.** A Claude reviewer runs on every push to an open PR and comments with a breakdown. Push again and it re-scores. Your best run counts.

## Layout

| Path | What it is |
|------|-----------|
| `docs/tickets/` | The tickets you work |
| `build-battle/` | The exercise brief, scoring, and the `/ship-ready` skill |
| `build-battle/merchant-console/` | Northwind Payments, the application itself |
| `.github/` | PR template and the grading workflow |

## Concepts you will use

| Concept | What It Is | Where You Use It |
|---------|-----------|-----------------|
| **CLAUDE.md** | Persistent project context that loads every session | Before you write a line |
| **Skills** | Reusable slash commands in `.claude/skills/` | `/ship-ready` before you push |
| **Hooks** | Shell commands that fire before or after Claude acts | Blocking a push that fails the money tests |
| **Sub-Agents** | Independent Claude instances for delegated work | Investigating NWP-1057 read-only |
| **MCP Connectors** | Connect Claude to external tools | Driving the browser to verify your work |
