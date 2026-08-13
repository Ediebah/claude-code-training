---
paths:
  - "src/app/api/**/*.ts"
---

# Route handlers

- **Validate everything from the client** against an allowlist before it reaches the store, a query, or a filename. Column names, currencies, statuses, sort fields, page sizes. Client-side checks are a convenience, never the enforcement.
- **Reuse the query builder.** Payment filtering goes through the one behind `GET /api/payments`. Writing a second filter path is a defect.
- **Bucket and compare in UTC.** Display converts to the merchant's timezone; nothing in here does.
- **Return the same error shape everywhere**: a status code that means what it says, and a body with a message safe to show a user.
- **Never return a full card number** from a list or detail route. The full number exists in exactly one response, the creation one.
- Reject early and return. Deeply nested validation is where cases go missing.
