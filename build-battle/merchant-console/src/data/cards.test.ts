import { beforeEach, describe, expect, it } from "vitest"
import { isLuhnValid } from "@/lib/cardNumber"
import { store } from "./store"
import {
  cardById,
  issueCard,
  IssueCardValidationError,
  listCards,
  transitionCard,
  validateIssueInput,
} from "./cards"
import { IssueCardInput } from "./types"

const VALID_INPUT: IssueCardInput = {
  nickname: "Ad spend",
  merchant: "Lumen Coffee Roasters",
  limit: 25000,
  currency: "USD",
}

beforeEach(() => {
  store.cards.length = 0
})

describe("validateIssueInput", () => {
  it("accepts valid input", () => {
    expect(validateIssueInput(VALID_INPUT)).toEqual({})
  })

  it("rejects a blank nickname", () => {
    expect(
      validateIssueInput({ ...VALID_INPUT, nickname: "  " }),
    ).toHaveProperty("nickname")
  })

  it("rejects a missing merchant", () => {
    expect(
      validateIssueInput({ ...VALID_INPUT, merchant: undefined }),
    ).toHaveProperty("merchant")
  })

  it("rejects a zero limit", () => {
    expect(validateIssueInput({ ...VALID_INPUT, limit: 0 })).toHaveProperty(
      "limit",
    )
  })

  it("rejects a negative limit", () => {
    expect(validateIssueInput({ ...VALID_INPUT, limit: -100 })).toHaveProperty(
      "limit",
    )
  })

  it("rejects a limit over 5,000,000 minor units", () => {
    expect(
      validateIssueInput({ ...VALID_INPUT, limit: 5_000_001 }),
    ).toHaveProperty("limit")
  })

  it("accepts a limit of exactly 5,000,000 minor units", () => {
    expect(validateIssueInput({ ...VALID_INPUT, limit: 5_000_000 })).toEqual({})
  })

  it("rejects a non-integer limit", () => {
    expect(validateIssueInput({ ...VALID_INPUT, limit: 250.5 })).toHaveProperty(
      "limit",
    )
  })

  it("rejects an unsupported currency", () => {
    expect(
      validateIssueInput({ ...VALID_INPUT, currency: "JPY" as never }),
    ).toHaveProperty("currency")
  })
})

describe("issueCard", () => {
  it("issues a card with a Luhn-valid 4242 number and returns it once", () => {
    const result = issueCard(VALID_INPUT)
    expect(result.fullNumber).toMatch(/^4242\d{12}$/)
    expect(isLuhnValid(result.fullNumber)).toBe(true)
    expect(result.card.last4).toBe(result.fullNumber.slice(-4))
    expect(result.card.status).toBe("active")
    expect(result.card.spend).toBe(0)
  })

  it("does not retain the full number on the safe record", () => {
    const { card } = issueCard(VALID_INPUT)
    expect(Object.values(card)).not.toContain(
      expect.stringMatching(/^4242\d{12}$/),
    )
    expect("fullNumber" in card).toBe(false)
  })

  it("throws IssueCardValidationError on invalid input", () => {
    expect(() => issueCard({ ...VALID_INPUT, limit: 0 })).toThrow(
      IssueCardValidationError,
    )
  })

  it("adds the card to the list", () => {
    const { card } = issueCard(VALID_INPUT)
    expect(listCards().map((c) => c.id)).toContain(card.id)
  })

  it("gives every card a distinct id", () => {
    const ids = Array.from({ length: 5 }, () => issueCard(VALID_INPUT).card.id)
    expect(new Set(ids).size).toBe(5)
  })
})

describe("listCards / cardById", () => {
  it("returns an empty list when no cards exist", () => {
    expect(listCards()).toEqual([])
  })

  it("finds a card by id after issuance", () => {
    const { card } = issueCard(VALID_INPUT)
    expect(cardById(card.id)).toEqual(card)
  })

  it("returns null for an unknown id", () => {
    expect(cardById("card_999999")).toBeNull()
  })

  it("full number is absent from list and detail data", () => {
    issueCard(VALID_INPUT)
    const [listed] = listCards()
    expect(Object.keys(listed)).not.toContain("fullNumber")
    expect(Object.keys(cardById(listed.id)!)).not.toContain("fullNumber")
  })
})

describe("transitionCard", () => {
  it("freezes an active card", () => {
    const { card } = issueCard(VALID_INPUT)
    const updated = transitionCard(card.id, "frozen")
    expect(updated?.status).toBe("frozen")
  })

  it("returns null for an unknown card", () => {
    expect(transitionCard("card_999999", "frozen")).toBeNull()
  })

  it("throws for an invalid transition", () => {
    const { card } = issueCard(VALID_INPUT)
    transitionCard(card.id, "cancelled")
    expect(() => transitionCard(card.id, "active")).toThrow()
  })
})
