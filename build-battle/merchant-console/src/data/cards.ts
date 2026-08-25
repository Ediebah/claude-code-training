import { generateCardNumber, lastFour } from "@/lib/cardNumber"
import { canTransitionCardStatus, transitionCardStatus } from "@/lib/cardStatus"
import { store } from "./store"
import {
  Card,
  CardStatus,
  Currency,
  IssueCardFieldErrors,
  IssueCardInput,
  IssuedCard,
} from "./types"

const CURRENCIES: readonly Currency[] = ["USD", "EUR", "GBP"]
const MAX_LIMIT_MINOR_UNITS = 5_000_000

const pad = (n: number) => String(n).padStart(6, "0")

/**
 * Validates issuance input against the allowlist the ticket spells out.
 * Anything from the client is checked here before it reaches the store —
 * the client-side form is a convenience, never the enforcement.
 */
export function validateIssueInput(
  input: Partial<IssueCardInput>,
): IssueCardFieldErrors {
  const errors: IssueCardFieldErrors = {}

  if (!input.nickname || !input.nickname.trim()) {
    errors.nickname = "Nickname is required."
  }

  if (!input.merchant || !input.merchant.trim()) {
    errors.merchant = "Merchant is required."
  }

  if (
    typeof input.limit !== "number" ||
    !Number.isInteger(input.limit) ||
    !Number.isFinite(input.limit)
  ) {
    errors.limit = "Limit must be a whole number of minor units."
  } else if (input.limit <= 0) {
    errors.limit = "Limit must be greater than 0."
  } else if (input.limit > MAX_LIMIT_MINOR_UNITS) {
    errors.limit = `Limit must not exceed ${MAX_LIMIT_MINOR_UNITS.toLocaleString()} minor units.`
  }

  if (!input.currency || !CURRENCIES.includes(input.currency)) {
    errors.currency = "Currency must be USD, EUR, or GBP."
  }

  return errors
}

/**
 * Issues a card: validates, generates the full number, builds the safe
 * record, stores it, and returns the safe record alongside the transient
 * full number. The full number is never written to the store.
 */
export function issueCard(input: Partial<IssueCardInput>): IssuedCard {
  const errors = validateIssueInput(input)
  if (Object.keys(errors).length > 0) {
    throw new IssueCardValidationError(errors)
  }
  const validated = input as IssueCardInput

  const fullNumber = generateCardNumber()

  const card: Card = {
    id: `card_${pad(++store.cardSeq)}`,
    nickname: validated.nickname.trim(),
    merchant: validated.merchant.trim(),
    last4: lastFour(fullNumber),
    limit: validated.limit,
    spend: 0,
    currency: validated.currency,
    status: "active",
    createdAt: new Date().toISOString(),
  }

  store.cards.push(card)

  return { card, fullNumber }
}

export class IssueCardValidationError extends Error {
  constructor(public readonly errors: IssueCardFieldErrors) {
    super("card issuance failed validation")
    this.name = "IssueCardValidationError"
  }
}

export function listCards(): Card[] {
  return [...store.cards].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function cardById(id: string): Card | null {
  return store.cards.find((c) => c.id === id) ?? null
}

export function transitionCard(id: string, target: CardStatus): Card | null {
  const card = cardById(id)
  if (!card) return null
  card.status = transitionCardStatus(card.status, target)
  return card
}

export function canTransitionCard(card: Card, target: CardStatus): boolean {
  return canTransitionCardStatus(card.status, target)
}
