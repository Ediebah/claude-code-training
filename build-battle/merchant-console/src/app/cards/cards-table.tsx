"use client"

import { Button } from "@/components/Button"
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
import { Card } from "@/data/types"
import { maskCardNumber } from "@/lib/cardNumber"
import { formatDate } from "@/lib/dates"
import { formatMoney } from "@/lib/money"
import Link from "next/link"

const COLUMN_COUNT = 7

/**
 * The issued-card list. `cards` is null while the first load is in flight,
 * which is what separates "still loading" from "loaded and empty" — the two
 * need different things on screen.
 */
export function CardsTable({
  cards,
  loadError,
  pendingId,
  onRetry,
  onToggleFreeze,
}: {
  cards: Card[] | null
  loadError: boolean
  pendingId: string | null
  onRetry: () => void
  onToggleFreeze: (card: Card) => void
}) {
  return (
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
          {cards === null &&
            !loadError &&
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: COLUMN_COUNT }).map((__, j) => (
                  <TableCell key={j}>
                    {/* Skeleton's own bg-muted is not a token in this
                        Tailwind config, so the shade is set here. */}
                    <Skeleton className="h-4 w-full max-w-32 bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {loadError && (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT}>
                <div className="flex flex-col items-start gap-2 py-6">
                  <p className="text-sm text-gray-500">Could not load cards.</p>
                  <Button variant="secondary" onClick={onRetry}>
                    Retry
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}

          {cards !== null && cards.length === 0 && !loadError && (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT}>
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
                {/* Nothing comes back from cancelled, so it gets no control. */}
                {card.status !== "cancelled" && (
                  <Button
                    variant="secondary"
                    disabled={pendingId === card.id}
                    onClick={() => onToggleFreeze(card)}
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
  )
}
