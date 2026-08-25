# Northwind Engineering Standards

Every service in the org is measured against this list. It is written to be
checked, not admired: each item names what a violation looks like.

## Money

1. **Integer minor units.** `$250.00` is `25000`. A float, a rounded
   intermediate, or a string with a currency symbol in stored data is a
   violation — even when the total happens to come out right.
2. **Format once, at the edge.** A formatter's output never goes back into
   arithmetic or storage.
3. **The math adds up.** Totals equal the sum of their parts. Gross, net,
   fees, and refunds reconcile; a number shown twice is derived once.

## Time

4. **Store and bucket in UTC.** Grouping by the server's local calendar is a
   violation, whatever timezone the server happens to be in.
5. **Convert only at display**, using the merchant's own timezone.

## Data access

6. **One query builder.** Filtering and sorting go through the shared
   builder. A second implementation of the same lookup is a defect, not a
   convenience.
7. **Validate on the server.** Anything from a client — column names,
   currencies, limits, statuses — is checked against an allowlist before it
   reaches a query, a filename, or the store. Client-side checks are UX,
   never enforcement.

## Sensitive data

8. **Card numbers are masked everywhere** except the single creation
   response. Stored records carry the last four and a reference, never the
   number.

## Structure

9. **Match the neighborhood.** New code follows the naming, layout, and
   component patterns of the files around it.
10. **No debris.** No `console.log`, no commented-out code, no TODO shipped
    to main.

A reviewer citing this document names the item number, the file, and the
line. "Violates #1" is a finding; "looks wrong" is not.
