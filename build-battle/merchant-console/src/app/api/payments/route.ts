import { parseFilters, queryPayments } from "@/data/queries"
import { NextRequest, NextResponse } from "next/server"

export function GET(request: NextRequest) {
  const filters = parseFilters(request.nextUrl.searchParams)
  return NextResponse.json(queryPayments(filters))
}
