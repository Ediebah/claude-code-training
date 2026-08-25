import { CardStatus } from "@/data/types"

/**
 * The one place card status transitions are decided. Route handlers and UI
 * call `transitionCardStatus`; neither re-implements the rules.
 *
 * active ⇄ frozen, either to cancelled, cancelled is terminal.
 */
const ALLOWED_TRANSITIONS: Record<CardStatus, readonly CardStatus[]> = {
  active: ["frozen", "cancelled"],
  frozen: ["active", "cancelled"],
  cancelled: [],
}

export class InvalidCardTransitionError extends Error {
  constructor(from: CardStatus, to: CardStatus) {
    super(`cannot transition card from "${from}" to "${to}"`)
    this.name = "InvalidCardTransitionError"
  }
}

/** Returns the new status, or throws if the transition is not allowed. */
export function transitionCardStatus(
  from: CardStatus,
  to: CardStatus,
): CardStatus {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new InvalidCardTransitionError(from, to)
  }
  return to
}

export function canTransitionCardStatus(
  from: CardStatus,
  to: CardStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to)
}
