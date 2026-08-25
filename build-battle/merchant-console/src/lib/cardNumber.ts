/**
 * Virtual card numbers are generated on the server only, on the `4242` test
 * BIN, with a valid Luhn check digit. Nothing produced here may resemble a
 * real PAN.
 */

const BIN = "4242"
const PAN_LENGTH = 16

function secureDigit(): number {
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return bytes[0] % 10
}

/** Luhn check digit for a string of digits (without the check digit itself). */
function luhnCheckDigit(digits: string): number {
  let sum = 0
  let double = true // rightmost of the existing digits doubles first
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return (10 - (sum % 10)) % 10
}

/** True if a full digit string (including its check digit) is Luhn-valid. */
export function isLuhnValid(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

/** The last four digits of a full card number, for display and storage. */
export function lastFour(pan: string): string {
  return pan.slice(-4)
}

/** Masked form for anywhere the full number must not appear. */
export function maskCardNumber(last4: string): string {
  return `•••• ${last4}`
}

/**
 * Generates a fresh 16-digit, Luhn-valid card number on the `4242` BIN.
 * Verifies the result before returning it, since a bad check digit here is
 * the one bug this function exists to prevent.
 */
export function generateCardNumber(): string {
  const bodyLength = PAN_LENGTH - BIN.length - 1
  let body = ""
  for (let i = 0; i < bodyLength; i++) body += secureDigit()

  const withoutCheck = BIN + body
  const check = luhnCheckDigit(withoutCheck)
  const pan = withoutCheck + check

  if (pan.length !== PAN_LENGTH || !pan.startsWith(BIN) || !isLuhnValid(pan)) {
    throw new Error("generated card number failed self-verification")
  }

  return pan
}
