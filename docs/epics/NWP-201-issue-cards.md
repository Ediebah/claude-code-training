# EPIC · NWP-201 — Issue virtual cards from the console

> Written before any code. Load as context: `@docs/epics/NWP-201-issue-cards.md`

**Ticket:** [NWP-201](../tickets/NWP-201.md)
**Author:** Claude (paired with Ediebah)
**Status:** building

## Problem

Ops issues virtual cards by messaging the platform team by hand, 12-20 times a week, and a hand-off mistake already put a wrong spend limit on two cards last month. Marcus Bell wants issuance, a list, and a detail view inside the console so ops can self-serve without a Slack thread.

## Current state

- `src/data/types.ts` — has `Currency`, `Merchant`, `Payment`, etc. No `Card` type yet.
- `src/data/store.ts` — in-memory `Store` holds `merchants/payments/refunds/disputes/payouts`. Needs a `cards: Card[]` array, empty at boot (cards are issued at runtime, not seeded).
- `src/data/queries.ts` — the one query-builder pattern (`parseFilters` → `filterPayments` → `sortPayments` → `paginate`) other list reads should imitate, though cards is a small, unpaginated list so a simpler `listCards()` suffices.
- `src/lib/money.ts` — `formatMoney`, `parseAmountToMinorUnits` (string → integer minor units, rejects anything not exact) are reused as-is for the issue form and detail page.
- `src/lib/dates.ts` — `formatDate` reused for "created" column.
- `src/components/` — `Button`, `Input`, `Select` (Radix-based), `Badge`, `Table*`, `Divider`, `Skeleton`. No `Dialog` wrapper exists yet; building one is out of scope for the time box, so the issue flow is a plain page (`/cards/new`), not a modal — the ticket allows "a form or dialog."
- `src/app/payments/[id]/page.tsx` — the detail-page shape to imitate (`Field` helper, `notFound()` on miss).
- `src/app/disputes/page.tsx` — the list-page shape to imitate (`TableRoot`/`Table`, `StatusBadge`).
- `src/components/ui/payments/StatusBadge.tsx` — `LABELS`/`DOTS`/`VARIANTS` records keyed by status; card statuses extend this pattern via a new `CardStatusBadge`.
- No validation library (no zod) is present anywhere in the repo; the existing convention is a hand-rolled allowlist function (`parseFilters` in `queries.ts`). Card issuance validation follows the same shape: one function, plain field-keyed errors.
- Nothing card-related exists yet (`src/app/cards`, `src/data/cards.ts`, `src/lib/cardNumber.ts` are all new).

## Domain rules

| Rule | Source | What breaks if ignored |
| --- | --- | --- |
| Money is integer minor units | `CLAUDE.md`, `.claude/rules/money.md` | Spend limits drift; `$250.00` must be `25000` |
| Test BIN only, valid Luhn, generated server-side | `.claude/rules/cards.md`, ticket | A client-generated or non-`4242` number could be mistaken for a real PAN |
| Reveal once, mask everywhere else | `.claude/rules/cards.md`, `.claude/rules/api-routes.md` | A full PAN in the card model, a list/detail response, storage, or logs is a real data-safety bug in this exercise's terms |
| Status is a state machine, `cancelled` terminal | `.claude/rules/cards.md` | Ad-hoc status writes let a cancelled card come back to life |
| Validate on the server, allowlist everything from the client | `.claude/rules/api-routes.md` | Currency/limit/merchant checks done only in the form are bypassable |
| No database/ORM/migration | `build-battle/CLAUDE.md` | Out of scope; store is `globalThis`-backed in-memory only |

## Approach

Add a small, self-contained card domain: a pure Luhn/BIN generator and a pure status-transition function in `src/lib/` (each with its own `.test.ts`, matching the `src/lib/money.test.ts` pattern), a `src/data/cards.ts` module that owns the in-memory `cards` array plus `issueCard`/`listCards`/`cardById`/`transitionCard`, two API routes (`/api/cards` for list+issue, `/api/cards/[id]` for detail, `/api/cards/[id]/status` for freeze/unfreeze if time remains), and three pages under `/cards`. The reveal-once number is carried as in-memory React state inside one client component that renders list → issue form → success purely by local view state (no route change, no storage, no query param), so a refresh or back-navigation always lands back on masked data.

**Considered and rejected:** a modal/dialog for issuance, since the ticket allows either. Rejected because no `Dialog` primitive exists in `src/components/` yet and building an accessible one from scratch (focus trap, return focus, Escape) costs more of the 45-minute box than a plain form view is worth. A separate route per view (`/cards/new`, `/cards/new/success`) was also rejected because passing the transient PAN across a real navigation would force it into the URL, router state, or storage — all explicitly disallowed — whereas keeping list/form/success as sibling views inside one client component keeps the number in a plain `useState` that dies the moment the user navigates or refreshes.

## File map

| File | Add or change | Why |
| --- | --- | --- |
| `src/lib/cardNumber.ts` + `.test.ts` | add | Server-only Luhn-valid `4242...` generator, last-four extraction |
| `src/lib/cardStatus.ts` + `.test.ts` | add | One `transition(status, target)` function, the state machine |
| `src/data/types.ts` | change | `Card`, `CardStatus`, `IssueCardInput`, `IssueCardResult` |
| `src/data/store.ts` | change | Add `cards: Card[]`, empty at boot |
| `src/data/cards.ts` + `.test.ts` | add | `validateIssueInput`, `issueCard`, `listCards`, `cardById`, `transitionCardStatus` |
| `src/app/api/cards/route.ts` | add | `GET` list, `POST` issue |
| `src/app/api/cards/[id]/route.ts` | add | `GET` detail |
| `src/app/api/cards/[id]/status/route.ts` | add (stretch) | `POST` freeze/unfreeze/cancel transition |
| `src/components/ui/cards/CardStatusBadge.tsx` | add | Status badge, mirrors `StatusBadge.tsx` |
| `src/app/cards/page.tsx` | add | List + issue form + reveal-once success, one client component |
| `src/app/cards/[id]/page.tsx` | add | Detail + spend progress |
| `src/app/siteConfig.ts` | change | Add `cards: "/cards"` |
| `src/components/ui/navigation/AppSidebar.tsx` | change | Add the nav entry |

## Plan

1. **Card number generator** (`src/lib/cardNumber.ts`) — done when: unit tests pass for length, BIN, Luhn validity, last-four, non-constant output.
2. **Status state machine** (`src/lib/cardStatus.ts`) — done when: unit tests pass for every valid and invalid transition, `cancelled` terminal.
3. **Domain model + store** (`src/data/types.ts`, `src/data/store.ts`, `src/data/cards.ts`) — done when: `issueCard` returns a safe record plus a transient full number, and the safe record has no PAN field even at the type level.
4. **API routes** — done when: manual `curl`/httpie against `/api/cards` proves every validation boundary from the ticket, and the full number appears only in the POST response.
5. **Cards list + issue + reveal-once page** — done when: issuing a card in the browser shows the number once, then only `•••• 4242` after navigating away and back.
6. **Card detail + spend progress** — done when: detail shows the full safe record and an accessible progress bar that turns amber over 80%.
7. **Verification pass** — done when: `npm test`, `npm run lint`, `npx tsc --noEmit` are clean and the manual checklist in the ticket is walked end to end.

## Verification

| Acceptance criterion | How it is proven |
| --- | --- |
| Issue a card (form → list) | Browser: submit form, card appears in `/cards` immediately |
| Card list shows required fields | Browser + read of `src/app/cards/page.tsx` |
| Card detail shows full record + spend | Browser: open a card, see nickname/merchant/limit/spend/status |
| Numbers generated server-side, `4242` BIN, Luhn | `src/lib/cardNumber.test.ts` |
| Reveal once, mask forever | Browser: refresh/back after issuance shows masked only; grep diff for PAN leakage |
| Server-side validation of all six boundaries | `src/data/cards.test.ts` + direct `curl` calls |

## Risks

- No `Dialog` component exists — mitigated by using a plain page view instead of a modal (see Approach).
- Time box is 45 minutes — mitigated by doing core criteria in strict order and treating stretch goals (freeze/unfreeze, amber progress, category lock, extra tests, polished empty/error states) as separable, additive work.

## Out of scope

- Persistence beyond the in-memory store (NWP-203).
- Editing a card's limit after issue (NWP-202).
- Auth, roles, real card network calls.

## Open questions

- None blocking; masking uses the actual generated last four (ticket's "prefer masking with the actual generated last four" branch), not a forced `4242` suffix.
