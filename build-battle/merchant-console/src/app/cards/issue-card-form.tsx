"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Card, Currency, IssueCardFieldErrors } from "@/data/types"
import { parseAmountToMinorUnits } from "@/lib/money"
import { useState } from "react"
import { Field } from "./form-field"

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"]

/**
 * The limit is typed in major units and converted once, here at the
 * boundary. Everything downstream — request body, store, response — is
 * integer minor units. Server validation is the enforcement; the checks
 * in here only save a round trip.
 */
export function IssueCardForm({
  onCancel,
  onIssued,
}: {
  onCancel: () => void
  onIssued: (card: Card, fullNumber: string) => void
}) {
  const [nickname, setNickname] = useState("")
  const [merchant, setMerchant] = useState("")
  const [limitInput, setLimitInput] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [errors, setErrors] = useState<
    IssueCardFieldErrors & { form?: string }
  >({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const limit = parseAmountToMinorUnits(limitInput)
    if (limit === null) {
      setErrors({ limit: "Enter a valid amount, e.g. 250.00" })
      return
    }

    setSubmitting(true)
    setErrors({})
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname, merchant, limit, currency }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors ?? { form: data.message ?? "Issuance failed." })
        return
      }

      onIssued(data.card, data.fullNumber)
    } catch {
      setErrors({ form: "Network error. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-label="Issue card" className="mx-auto max-w-lg p-4 sm:p-6">
      <button
        onClick={onCancel}
        className="rounded-sm text-sm text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-gray-50"
      >
        ← All cards
      </button>

      <h1 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
        Issue a card
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {errors.form && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-500">
            {errors.form}
          </p>
        )}

        <Field label="Nickname" htmlFor="nickname" error={errors.nickname}>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            hasError={!!errors.nickname}
            aria-invalid={!!errors.nickname}
            aria-describedby={errors.nickname ? "nickname-error" : undefined}
            placeholder="Ad spend — Q3"
          />
        </Field>

        <Field label="Merchant" htmlFor="merchant" error={errors.merchant}>
          <Input
            id="merchant"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            hasError={!!errors.merchant}
            aria-invalid={!!errors.merchant}
            aria-describedby={errors.merchant ? "merchant-error" : undefined}
            placeholder="Lumen Coffee Roasters"
          />
        </Field>

        <div className="flex gap-3">
          <Field
            label="Spend limit"
            htmlFor="limit"
            error={errors.limit}
            className="flex-1"
          >
            <Input
              id="limit"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              hasError={!!errors.limit}
              aria-invalid={!!errors.limit}
              aria-describedby={errors.limit ? "limit-error" : undefined}
              placeholder="250.00"
              inputMode="decimal"
            />
          </Field>

          <Field label="Currency" htmlFor="currency" error={errors.currency}>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as Currency)}
            >
              <SelectTrigger
                id="currency"
                hasError={!!errors.currency}
                className="w-24"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Issuing…" : "Issue card"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}
