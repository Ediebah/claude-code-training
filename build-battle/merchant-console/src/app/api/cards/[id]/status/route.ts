import { cardById, transitionCard } from "@/data/cards"
import { InvalidCardTransitionError } from "@/lib/cardStatus"
import { CardStatus } from "@/data/types"
import { NextRequest, NextResponse } from "next/server"

const TARGETS: readonly CardStatus[] = ["active", "frozen", "cancelled"]

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!cardById(id)) {
    return NextResponse.json({ message: "Card not found." }, { status: 404 })
  }

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Request body must be JSON." },
      { status: 400 },
    )
  }

  if (!body.status || !TARGETS.includes(body.status as CardStatus)) {
    return NextResponse.json(
      { message: "status must be one of active, frozen, cancelled." },
      { status: 400 },
    )
  }

  try {
    const card = transitionCard(id, body.status as CardStatus)
    return NextResponse.json({ card })
  } catch (error) {
    if (error instanceof InvalidCardTransitionError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    throw error
  }
}
