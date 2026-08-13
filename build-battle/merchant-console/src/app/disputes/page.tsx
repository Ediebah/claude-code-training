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
import { GENERATED_AT } from "@/data/generate"
import { merchantById } from "@/data/merchants"
import { store } from "@/data/store"
import { daysUntil, formatDate } from "@/lib/dates"
import { formatMoney } from "@/lib/money"
import { cx } from "@/lib/utils"
import Link from "next/link"

export default function DisputesPage() {
  const disputes = [...store.disputes].sort((a, b) =>
    a.evidenceDueAt.localeCompare(b.evidenceDueAt),
  )

  const open = disputes.filter(
    (d) => d.status === "needs_response" || d.status === "under_review",
  )

  return (
    <section aria-label="Disputes">
      <div className="p-4 sm:p-6">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Disputes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {open.length} open of {disputes.length}. Sorted by evidence deadline.
        </p>
      </div>

      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Dispute</TableHeaderCell>
              <TableHeaderCell>Merchant</TableHeaderCell>
              <TableHeaderCell>Reason</TableHeaderCell>
              <TableHeaderCell>Opened</TableHeaderCell>
              <TableHeaderCell>Evidence due</TableHeaderCell>
              <TableHeaderCell className="text-right">Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disputes.map((dispute) => {
              const remaining = daysUntil(dispute.evidenceDueAt, GENERATED_AT)
              const needsAction = dispute.status === "needs_response"
              return (
                <TableRow key={dispute.id}>
                  <TableCell>
                    <Link
                      href={`/payments/${dispute.paymentId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {dispute.id}
                    </Link>
                  </TableCell>
                  <TableCell>{merchantById(dispute.merchantId)?.name}</TableCell>
                  <TableCell className="text-gray-500">
                    {dispute.reasonCode}
                  </TableCell>
                  <TableCell>{formatDate(dispute.openedAt)}</TableCell>
                  <TableCell>
                    <span className="text-gray-900 dark:text-gray-50">
                      {formatDate(dispute.evidenceDueAt)}
                    </span>
                    {needsAction && (
                      <span
                        className={cx(
                          "ml-2 text-xs font-medium",
                          remaining <= 0
                            ? "text-red-600 dark:text-red-500"
                            : remaining <= 3
                              ? "text-orange-600 dark:text-orange-500"
                              : "text-gray-500",
                        )}
                      >
                        {remaining <= 0
                          ? "overdue"
                          : `${remaining} day${remaining === 1 ? "" : "s"} left`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-gray-900 dark:text-gray-50">
                    {formatMoney(dispute.amount, dispute.currency)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={dispute.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableRoot>
    </section>
  )
}
