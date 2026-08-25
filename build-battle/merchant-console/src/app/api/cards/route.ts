import { IssueCardValidationError, issueCard, listCards } from "@/data/cards"
import { IssueCardInput } from "@/data/types"
import { NextRequest, NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({ cards: listCards() })
}

export async function POST(request: NextRequest) {
  let body: Partial<IssueCardInput>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Request body must be JSON." },
      { status: 400 },
    )
  }

  try {
    const { card, fullNumber } = issueCard(body)
    return NextResponse.json({ card, fullNumber }, { status: 201 })
  } catch (error) {
    if (error instanceof IssueCardValidationError) {
      return NextResponse.json(
        { message: "Card issuance failed validation.", errors: error.errors },
        { status: 400 },
      )
    }
    throw error
  }
}
