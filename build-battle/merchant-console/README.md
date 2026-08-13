# Northwind Payments — Merchant Console

The internal tool Northwind's support and ops teams use to look up a payment, refund it, and work the dispute queue.

**Northwind Payments is fictional.** Every merchant, cardholder, amount, and dispute in this app is generated. Nothing here is real payment data, and nothing here is a real company.

## Run it

```bash
npm install
npm run seed
npm run dev
```

Then open http://localhost:3000.

`npm run seed` builds a local SQLite file from a fixed seed, so everyone in the room gets identical data and identical bugs. Delete it and re-run any time you want a clean slate.

## The rules of this codebase

Two conventions explain most of the code, and violating either one is how the bugs in here got written:

1. **Money is integer minor units.** Cents, not dollars. Never a float. Format once, at the edge, next to its currency.
2. **Storage and bucketing are UTC.** Display converts to the merchant's timezone. Nothing else does.

## Layout

| Path | What lives there |
| --- | --- |
| `src/app/(main)/` | The console routes: overview, payments, disputes, payouts |
| `src/app/api/` | Route handlers. The query builder behind `GET /api/payments` is the one to reuse |
| `src/components/` | Tremor-based UI primitives and the console's own components |
| `src/data/` | Schema, seed generator, and database access |
| `src/lib/` | Money and date helpers. Read these before touching an amount |

## Your ticket

Tickets live at the repository root in [`docs/tickets/`](../../docs/tickets/). Pull one into context rather than retyping it:

```
@docs/tickets/NWP-1042.md
```

## Attribution

Built on [`tremorlabs/template-dashboard-oss`](https://github.com/tremorlabs/template-dashboard-oss) by Tremor Labs, Inc., used under the Apache License 2.0. See [`LICENSE.md`](./LICENSE.md) for the license and [`NOTICE`](./NOTICE) for the list of changes.
