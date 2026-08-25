import { cardById } from "@/data/cards"
import { CardStatusBadge } from "@/components/ui/cards/CardStatusBadge"
import { Divider } from "@/components/Divider"
import { formatDate } from "@/lib/dates"
import { maskCardNumber } from "@/lib/cardNumber"
import { formatMoney, isNearLimit, utilizationPercent } from "@/lib/money"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function CardDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = cardById(id)
  if (!card) notFound()

  const percent = utilizationPercent(card.spend, card.limit)
  const amber = isNearLimit(card.spend, card.limit)

  return (
    <div className="p-4 sm:p-6">
      <Link
        href="/cards"
        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-50"
      >
        ← All cards
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {card.nickname}
        </h1>
        <CardStatusBadge status={card.status} />
      </div>
      <p className="mt-1 font-mono text-sm text-gray-500">
        {card.id} · {maskCardNumber(card.last4)}
      </p>

      <Divider />

      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Merchant">{card.merchant}</Field>
        <Field label="Currency">{card.currency}</Field>
        <Field label="Limit">{formatMoney(card.limit, card.currency)}</Field>
        <Field label="Spend">{formatMoney(card.spend, card.currency)}</Field>
        <Field label="Created">
          <span className="font-mono text-sm">
            {formatDate(card.createdAt)}
          </span>
        </Field>
      </dl>

      <Divider />

      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
        Spend progress
      </h2>
      <div className="mt-3 max-w-md">
        <div
          role="progressbar"
          aria-label={`Spend: ${formatMoney(card.spend, card.currency)} of ${formatMoney(card.limit, card.currency)} limit`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        >
          <div
            className={`h-full rounded-full transition-all ${
              amber
                ? "bg-amber-500 dark:bg-amber-500"
                : "bg-blue-500 dark:bg-blue-500"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {formatMoney(card.spend, card.currency)} of{" "}
          {formatMoney(card.limit, card.currency)} ({percent}%)
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
        {children}
      </dd>
    </div>
  )
}
