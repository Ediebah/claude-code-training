# Northwind Payments — Merchant Console

The internal tool Northwind's support and ops teams use to look up a payment, refund it, and work the dispute queue.

**Northwind Payments is fictional.** Every merchant, cardholder, amount, and dispute in this app is generated. Nothing here is real payment data, and nothing here is a real company.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. No database, no seed step, no Docker.

Data lives in an in-memory store loaded from JSON at boot. Anything you create lasts for the life of the dev server and resets on restart. That is deliberate — see [`CLAUDE.md`](./CLAUDE.md).

## The rules of this codebase

Read [`CLAUDE.md`](./CLAUDE.md) before writing code. The short version:

1. **Money is integer minor units.** Cents, not dollars. Never a float. Format once, at the edge, next to its currency.
2. **Storage and bucketing are UTC.** Display converts to the merchant's timezone. Nothing else does.
3. **One query builder.** Payment filtering goes through the one behind `GET /api/payments`.
4. **Validate on the server.** Nothing that arrives from the client is trusted.

## Layout

| Path | What lives there |
| --- | --- |
| `src/app/(main)/` | The console routes: overview, payments, disputes, payouts, cards |
| `src/app/api/` | Route handlers. The query builder behind `GET /api/payments` is the one to reuse |
| `src/components/` | Tremor-based UI primitives and the console's own components |
| `src/data/` | Seed JSON, the in-memory store, and types |
| `src/lib/` | Money, date, and card helpers. Read these before touching an amount |

## Your ticket

Tickets live at the repository root in [`docs/tickets/`](../../docs/tickets/). Pull one into context rather than retyping it:

```
@docs/tickets/NWP-1042.md
```

## Attribution

Built on [`tremorlabs/template-dashboard-oss`](https://github.com/tremorlabs/template-dashboard-oss) by Tremor Labs, Inc., used under the Apache License 2.0. See [`LICENSE.md`](./LICENSE.md) for the license and [`NOTICE`](./NOTICE) for the list of changes.
