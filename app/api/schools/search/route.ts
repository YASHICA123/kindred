import { NextRequest, NextResponse } from "next/server"
import {
  searchSchoolsAdvanced,
  searchSchoolsFromView,
} from "@/lib/supabase-queries"

/**
 * GET /api/schools/search
 *
 * Query Parameters:
 * - state: State slug (e.g., "haryana")
 * - city: City slug (e.g., "gurgaon")
 * - board: Board name (e.g., "IB")
 * - type: School type (e.g., "Day School")
 * - feesMin: Minimum fees (numeric)
 * - feesMax: Maximum fees (numeric)
 * - sort: Sort order ("rating_desc", "fees_asc", "name_asc")
 * - limit: Results per page (default: 20)
 * - offset: Pagination offset (default: 0)
 *
 * Example:
 * GET /api/schools/search?state=haryana&city=gurgaon&board=IB&feesMax=200000
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse parameters
    const stateSlug = searchParams.get("state") || undefined
    const citySlug = searchParams.get("city") || undefined
    const board = searchParams.get("board") || undefined
    const type = searchParams.get("type") || undefined
    const feesMin = searchParams.get("feesMin")
      ? parseInt(searchParams.get("feesMin")!)
      : undefined
    const feesMax = searchParams.get("feesMax")
      ? parseInt(searchParams.get("feesMax")!)
      : undefined
    const sort = (searchParams.get("sort") as any) || "rating_desc"
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20"),
      100
    ) // Cap at 100
    const offset = parseInt(searchParams.get("offset") || "0")

    // Call search function
    const result = await searchSchoolsAdvanced({
      stateSlug,
      citySlug,
      board,
      type,
      feesMin,
      feesMax,
      sort,
      limit,
      offset,
    })

    // If RPC fails, try fallback
    if (!result.schools || result.schools.length === 0) {
      const fallback = await searchSchoolsFromView({
        stateSlug,
        citySlug,
        board,
        type,
        feesMin,
        feesMax,
        limit,
        offset,
      })
      return NextResponse.json(fallback, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      })
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Error searching schools:", error)
    return NextResponse.json(
      {
        error: "Failed to search schools",
        schools: [],
        total: 0,
      },
      { status: 500 }
    )
  }
}
