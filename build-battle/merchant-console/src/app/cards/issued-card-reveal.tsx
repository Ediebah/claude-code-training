"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { Card } from "@/data/types"
import { maskCardNumber } from "@/lib/cardNumber"
import { formatMoney } from "@/lib/money"
import Link from "next/link"

/**
 * The one place a full card number is ever rendered.
 *
 * `fullNumber` arrives as a prop held in the parent's component state and
 * is never persisted, put in the URL, or written to storage — so leaving
 * this view, refreshing, or navigating back loses it for good. That is the
 * intended behavior, not a gap: after this screen the card is `•••• 4242`
 * everywhere, including its own detail page.
 */
export function IssuedCardReveal({
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
