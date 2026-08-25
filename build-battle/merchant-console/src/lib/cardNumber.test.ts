import { describe, expect, it } from "vitest"
import {
  generateCardNumber,
  isLuhnValid,
  lastFour,
  maskCardNumber,
} from "./cardNumber"

describe("generateCardNumber", () => {
  it("produces a 16-digit number", () => {
    expect(generateCardNumber()).toMatch(/^\d{16}$/)
  })

  it("always starts with the 4242 test BIN", () => {
    for (let i = 0; i < 25; i++) {
      expect(generateCardNumber().startsWith("4242")).toBe(true)
    }
  })

  it("is always Luhn-valid", () => {
    for (let i = 0; i < 25; i++) {
      expect(isLuhnValid(generateCardNumber())).toBe(true)
    }
  })

  it("is not constant across calls", () => {
    const numbers = new Set(Array.from({ length: 20 }, generateCardNumber))
    expect(numbers.size).toBeGreaterThan(1)
  })
})

describe("isLuhnValid", () => {
  it("rejects a number with a broken check digit", () => {
    const pan = generateCardNumber()
    const brokenLastDigit = String((Number(pan.at(-1)) + 1) % 10)
    const broken = pan.slice(0, -1) + brokenLastDigit
    expect(isLuhnValid(broken)).toBe(false)
  })

  it("rejects non-digit input", () => {
    expect(isLuhnValid("4242abcd12345678")).toBe(false)
  })
})

describe("lastFour", () => {
  it("extracts the last four digits", () => {
    expect(lastFour("4242424242424242")).toBe("4242")
    expect(lastFour("4242123456789013")).toBe("9013")
  })
})

describe("maskCardNumber", () => {
  it("masks with the given last four", () => {
    expect(maskCardNumber("9013")).toBe("•••• 9013")
  })
})
