import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { merchantRollup } from "@/data/analytics"
import { formatMoney } from "@/lib/money"
import { cx } from "@/lib/utils"
import Link from "next/link"

export default function MerchantsPage() {
  const rows = merchantRollup()

  return (
    <section aria-label="Merchants">
      <TableRoot className="border-t border-gray-200 dark:border-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Merchant</TableHeaderCell>
              <TableHeaderCell>Country</TableHeaderCell>
              <TableHeaderCell>Risk tier</TableHeaderCell>
              <TableHeaderCell className="text-right">Payments</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Authorization
              </TableHeaderCell>
              <TableHeaderCell className="text-right">Disputes</TableHeaderCell>
              <TableHeaderCell className="text-right">
                Captured volume
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.merchant.id}>
                <TableCell>
                  <Link
                    href={`/payments?merchantId=${row.merchant.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {row.merchant.name}
                  </Link>
                  <p className="text-gray-500">{row.merchant.timezone}</p>
                </TableCell>
                <TableCell>{row.merchant.country}</TableCell>
                <TableCell>
                  <span
                    className={cx(
                      "capitalize",
                      row.merchant.riskTier === "elevated"
                        ? "text-orange-600 dark:text-orange-500"
                        : "text-gray-500",
                    )}
                  >
                    {row.merchant.riskTier}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.payments.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {(row.authRate * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.disputes}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-gray-900 dark:text-gray-50">
                  {formatMoney(row.volume, row.merchant.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </section>
  )
}
