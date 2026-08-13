---
paths:
  - "src/lib/**/*.ts"
  - "src/app/api/**/*.ts"
  - "src/data/**/*.ts"
---

# Money

Amounts are **integer minor units**. `$250.00` is `25000`.

- Never store, compare, or accumulate an amount as a float.
- Never parse a currency string into a number. If a value arrives as `"250.00"`, it is client input and it is validated and converted at the boundary, once.
- `toFixed` is a display call. If its result is stored or compared, that is a bug.
- Every amount travels with its currency code. Summing across currencies without converting is a bug even when the number looks right.
- Format at the edge, in the component that renders it, and nowhere else.

Existing helpers live in `src/lib/`. Use them. A second formatter is how the two halves of an app start disagreeing.
