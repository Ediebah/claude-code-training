"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Skeleton } from "@/components/Skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { CardStatusBadge } from "@/components/ui/cards/CardStatusBadge"
import { Card, Currency, IssueCardFieldErrors } from "@/data/types"
import { formatDate } from "@/lib/dates"
import { maskCardNumber } from "@/lib/cardNumber"
import { formatMoney, parseAmountToMinorUnits } from "@/lib/money"
import Link from "next/link"
import { useEffect, useState } from "react"

type View =
  | { mode: "list" }
  | { mode: "issue" }
  | { mode: "success"; card: Card; fullNumber: string }

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"]

export default function CardsPage() {
  const [view, setView] = useState<View>({ mode: "list" })
  const [cards, setCards] = useState<Card[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const loadCards = async () => {
    setLoadError(false)
    try {
      const res = await fetch("/api/cards")
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setCards(data.cards)
    } catch {
      setLoadError(true)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  const toggleFreeze = async (card: Card) => {
    const target = card.status === "active" ? "frozen" : "active"
    setPendingId(card.id)
    try {
      const res = await fetch(`/api/cards/${card.id}/status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: target }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAnnouncement(
          `Could not update ${card.nickname}: ${data.message ?? "request failed"}.`,
        )
        return
      }
      setCards((prev) =>
        prev ? prev.map((c) => (c.id === card.id ? data.card : c)) : prev,
      )
      setAnnouncement(
        `${card.nickname} is now ${target === "frozen" ? "frozen" : "active"}.`,
      )
    } catch {
      setAnnouncement(`Could not update ${card.nickname}: network error.`)
    } finally {
      setPendingId(null)
    }
  }

  if (view.mode === "issue") {
    return (
      <IssueCardForm
        onCancel={() => setView({ mode: "list" })}
        onIssued={(card, fullNumber) => {
          setView({ mode: "success", card, fullNumber })
          loadCards()
        }}
      />
    )
  }

  if (view.mode === "success") {
    return (
      <RevealOnceSuccess
        card={view.card}
        fullNumber={view.fullNumber}
        onDone={() => setView({ mode: "list" })}
      />
    )
  }

  return (
    <section aria-label="Cards">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
            Cards
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Virtual cards issued to merchants for vendor subscriptions, ad
            spend, and contractor tools.
          </p>
        </div>
        <Button onClick={() => setView({ mode: "issue" })}>Issue card</Button>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nickname</TableHeaderCell>
              <TableHeaderCell>Merchant</TableHeaderCell>
              <TableHeaderCell>Card number</TableHeaderCell>
              <TableHeaderCell className="text-right">Limit</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>
                <span className="sr-only">Actions</span>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards === null && !loadError && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        {/* Skeleton's own bg-muted is not a token in this
                            Tailwind config, so the shade is set here. */}
                        <Skeleton className="h-4 w-full max-w-32 bg-gray-200 dark:bg-gray-800" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}

            {loadError && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-start gap-2 py-6">
                    <p className="text-sm text-gray-500">
                      Could not load cards.
                    </p>
                    <Button variant="secondary" onClick={loadCards}>
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {cards !== null && cards.length === 0 && !loadError && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="py-6 text-sm text-gray-500">
                    No cards issued yet. Issue the first one to get started.
                  </div>
                </TableCell>
              </TableRow>
            )}

            {cards?.map((card) => (
              <TableRow
                key={card.id}
                className="focus-within:bg-gray-50 dark:focus-within:bg-gray-900"
              >
                <TableCell>
                  <Link
                    href={`/cards/${card.id}`}
                    className="rounded-sm font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-500"
                  >
                    {card.nickname}
                  </Link>
                </TableCell>
                <TableCell>{card.merchant}</TableCell>
                <TableCell className="font-mono text-gray-500">
                  {maskCardNumber(card.last4)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-gray-900 dark:text-gray-50">
                  {formatMoney(card.limit, card.currency)}
                </TableCell>
                <TableCell>
                  <CardStatusBadge status={card.status} />
                </TableCell>
                <TableCell>{formatDate(card.createdAt)}</TableCell>
                <TableCell>
                  {card.status !== "cancelled" && (
                    <Button
                      variant="secondary"
                      disabled={pendingId === card.id}
                      onClick={() => toggleFreeze(card)}
                      aria-label={`${
                        card.status === "active" ? "Freeze" : "Unfreeze"
                      } ${card.nickname}`}
                    >
                      {pendingId === card.id
                        ? "Updating…"
                        : card.status === "active"
                          ? "Freeze"
                          : "Unfreeze"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </section>
  )
}

function IssueCardForm({
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

function RevealOnceSuccess({
  card,
  fullNumber,
  onDone,
}: {
  card: Card
  fullNumber: string
  onDone: () => void
}) {
  return (
    <section aria-label="Card issued" className="mx-auto max-w-lg p-4 sm:p-6">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Card issued
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {card.nickname} · {card.merchant}
      </p>

      <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Full card number
        </p>
        <p className="mt-1 font-mono text-lg text-gray-900 dark:text-gray-50">
          {fullNumber}
        </p>
      </div>

      <p
        role="alert"
        className="mt-3 text-sm text-orange-600 dark:text-orange-500"
      >
        This is the only time the full number will be shown. Copy it now — it
        will not be available again, including on this card&apos;s detail page.
      </p>

      <Divider />

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Limit</dt>
          <dd className="text-gray-900 dark:text-gray-50">
            {formatMoney(card.limit, card.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Masked</dt>
          <dd className="font-mono text-gray-900 dark:text-gray-50">
            {maskCardNumber(card.last4)}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex gap-3">
        <Button onClick={onDone}>Done</Button>
        <Link href={`/cards/${card.id}`}>
          <Button variant="secondary" onClick={onDone}>
            View card detail
          </Button>
        </Link>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-gray-900 dark:text-gray-50"
      >
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1 text-sm text-red-600 dark:text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  )
}
