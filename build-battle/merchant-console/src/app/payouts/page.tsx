import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { StatusBadge } from "@/components/ui/payments/StatusBadge"
import { merchantById } from "@/data/merchants"
import { store } from "@/data/store"
import { formatDate } from "@/lib/dates"
import { formatMoney } from "@/lib/money"
import { Fragment } from "react"

export default function PayoutsPage() {
  const payouts = [...store.payouts].sort((a, b) =>
    b.periodEnd.localeCompare(a.periodEnd),
  )

  const byStatus = new Map<string, typeof payouts>()
  for (const payout of payouts) {
    const group = byStatus.get(payout.status) ?? []
    group.push(payout)
    byStatus.set(payout.status, group)
  }
  const order = ["pending", "in_transit", "paid"] as const

  return (
    <section aria-label="Payouts">
      <div className="p-4 sm:p-6">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Payouts
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Weekly settlement batches. Net is gross less processing fees.
        </p>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Payout</TableHeaderCell>
              <TableHeaderCell>Merchant</TableHeaderCell>
              <TableHeaderCell>Period</TableHeaderCell>
              <TableHeaderCell className="text-right">Payments</TableHeaderCell>
              <TableHeaderCell className="text-right">Gross</TableHeaderCell>
              <TableHeaderCell className="text-right">Fees</TableHeaderCell>
              <TableHeaderCell className="text-right">Net</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.map((status) => {
              const group = byStatus.get(status)
              if (!group?.length) return null
              return (
                <Fragment key={status}>
                  <TableRow>
                    <TableHeaderCell
                      scope="colgroup"
                      colSpan={7}
                      className="bg-gray-50 py-3 pl-4 sm:pl-6 dark:bg-gray-900"
                    >
                      <StatusBadge status={status} />
                      <span className="ml-2 font-medium text-gray-600 dark:text-gray-400">
                        {group.length}
                      </span>
                    </TableHeaderCell>
                  </TableRow>
                  {group.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-xs">
                        {payout.id}
                      </TableCell>
                      <TableCell>
                        {merchantById(payout.merchantId)?.name}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatDate(payout.periodStart)} –{" "}
                        {formatDate(payout.periodEnd)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {payout.paymentIds.length}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(payout.gross, payout.currency)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-gray-500">
                        {formatMoney(payout.fees, payout.currency)}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums text-gray-900 dark:text-gray-50">
                        {formatMoney(payout.net, payout.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableRoot>
    </section>
  )
}
