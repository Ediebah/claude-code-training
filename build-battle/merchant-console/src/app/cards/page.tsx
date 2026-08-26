"use client"

import { Button } from "@/components/Button"
import { Card } from "@/data/types"
import { useEffect, useState } from "react"
import { CardsTable } from "./cards-table"
import { IssueCardForm } from "./issue-card-form"
import { IssuedCardReveal } from "./issued-card-reveal"

/**
 * List, issue, and the one-time reveal are sibling views behind local state
 * rather than separate routes. Carrying the full card number across a real
 * navigation would mean putting it in the URL, router state, or storage;
 * held here it dies on refresh or navigate, which is the rule.
 */
type View =
  | { mode: "list" }
  | { mode: "issue" }
  | { mode: "success"; card: Card; fullNumber: string }

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

  /**
   * The server owns the transition; this only asks for one and takes the
   * card it returns. A rejected transition leaves the row as it was and
   * says so in the live region.
   */
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
      <IssuedCardReveal
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

      <CardsTable
        cards={cards}
        loadError={loadError}
        pendingId={pendingId}
        onRetry={loadCards}
        onToggleFreeze={toggleFreeze}
      />

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </section>
  )
}
