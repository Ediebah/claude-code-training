import { Divider } from "@/components/Divider"
import { dailyVolume, headlineMetrics } from "@/data/metrics"
import { store } from "@/data/store"
import { merchantById } from "@/data/merchants"
import { formatMoney, formatMoneyCompact } from "@/lib/money"
import { formatDate } from "@/lib/dates"
import { StatusBadge } from "@/components/ui/payments/StatusBadge"
import Link from "next/link"
import { VolumeChart } from "./volume-chart"

export default function OverviewPage() {
  const metrics = headlineMetrics()
  const volume = dailyVolume(30)

  const chartData = volume.map((day) => ({
    date: day.date.slice(5),
    Captured: day.captured / 100,
    Refunded: day.refunded / 100,
  }))

  const recent = [...store.payments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Overview
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Last 30 days across all merchants.
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Gross volume"
          value={formatMoneyCompact(metrics.grossVolume, "USD")}
        />
        <Stat
          label="Authorization rate"
          value={`${(metrics.authRate * 100).toFixed(1)}%`}
        />
        <Stat label="Payments" value={metrics.paymentCount.toLocaleString()} />
        <Stat
          label="Open disputes"
          value={String(metrics.openDisputes)}
          sub={formatMoney(metrics.disputedAmount, "USD")}
        />
      </dl>

      <Divider />

      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
        Daily volume
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Captured against refunded, bucketed by day.
      </p>
      <VolumeChart data={chartData} />

      <Divider />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          Recent payments
        </h2>
        <Link
          href="/payments"
          className="text-sm text-blue-600 hover:underline dark:text-blue-500"
        >
          View all
        </Link>
      </div>
      <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
        {recent.map((payment) => (
          <li
            key={payment.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <Link
                href={`/payments/${payment.id}`}
                className="text-sm font-medium text-gray-900 hover:underline dark:text-gray-50"
              >
                {merchantById(payment.merchantId)?.name}
              </Link>
              <p className="truncate text-sm text-gray-500">
                {payment.description} · {formatDate(payment.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-medium tabular-nums text-gray-900 dark:text-gray-50">
                {formatMoney(payment.amount, payment.currency)}
              </span>
              <StatusBadge status={payment.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
        {value}
      </dd>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  )
}
