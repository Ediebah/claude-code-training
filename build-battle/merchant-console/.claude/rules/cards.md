---
paths:
  - "src/**/card*.ts"
  - "src/**/card*.tsx"
  - "src/**/cards/**"
---

# Cards

- **Test BIN only.** Every generated number starts `4242` and carries a valid Luhn check digit. Nothing here may resemble a real PAN, ever, including in tests and fixtures.
- **Generate on the server.** A card number produced in the browser is a bug.
- **Reveal once.** The full number appears in the creation response and nowhere else: not on the card record, not in a list or detail payload, not left in client state after the success screen closes.
- **Mask everywhere else** as `•••• 4242`.
- **Status is a state machine.** `active ⇄ frozen`, either to `cancelled`, and `cancelled` is terminal. Guard the transition on the server, not only in the UI.
- Spend limits follow the money rule: integer minor units, with a currency.
