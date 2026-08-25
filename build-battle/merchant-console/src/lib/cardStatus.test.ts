import { describe, expect, it } from "vitest"
import {
  canTransitionCardStatus,
  InvalidCardTransitionError,
  transitionCardStatus,
} from "./cardStatus"

describe("transitionCardStatus", () => {
  it("allows active to frozen", () => {
    expect(transitionCardStatus("active", "frozen")).toBe("frozen")
  })

  it("allows frozen back to active", () => {
    expect(transitionCardStatus("frozen", "active")).toBe("active")
  })

  it("allows active to cancelled", () => {
    expect(transitionCardStatus("active", "cancelled")).toBe("cancelled")
  })

  it("allows frozen to cancelled", () => {
    expect(transitionCardStatus("frozen", "cancelled")).toBe("cancelled")
  })

  it("rejects cancelled to active", () => {
    expect(() => transitionCardStatus("cancelled", "active")).toThrow(
      InvalidCardTransitionError,
    )
  })

  it("rejects cancelled to frozen", () => {
    expect(() => transitionCardStatus("cancelled", "frozen")).toThrow(
      InvalidCardTransitionError,
    )
  })

  it("rejects a same-state transition", () => {
    expect(() => transitionCardStatus("active", "active")).toThrow(
      InvalidCardTransitionError,
    )
    expect(() => transitionCardStatus("frozen", "frozen")).toThrow()
  })

  it("cancelled is terminal", () => {
    expect(() => transitionCardStatus("cancelled", "cancelled")).toThrow()
  })
})

describe("canTransitionCardStatus", () => {
  it("mirrors transitionCardStatus without throwing", () => {
    expect(canTransitionCardStatus("active", "frozen")).toBe(true)
    expect(canTransitionCardStatus("cancelled", "active")).toBe(false)
  })
})
