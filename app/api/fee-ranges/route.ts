import { NextRequest, NextResponse } from "next/server"
import {
  fetchAllFeeRanges,
  fetchFeeRangesWithSchoolCount,
} from "@/lib/supabase-queries"

/**
 * GET /api/fee-ranges
 *
 * Query Parameters:
 *   - counts=true  → include school counts per fee range
 *
 * Examples:
 *   GET /api/fee-ranges
 *   GET /api/fee-ranges?counts=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const withCounts = searchParams.get("counts") === "true"

    const data = withCounts
      ? await fetchFeeRangesWithSchoolCount()
      : await fetchAllFeeRanges()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    })
  } catch (error) {
    console.error("Error in /api/fee-ranges:", error)
    return NextResponse.json([], { status: 500 })
  }
}
