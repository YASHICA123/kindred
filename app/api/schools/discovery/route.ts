import { NextRequest, NextResponse } from "next/server"
import {
  fetchStatesWithSchoolCount,
  fetchCitiesWithSchoolCount,
  getSchoolsStatistics,
} from "@/lib/supabase-queries"

/**
 * GET /api/schools/discovery
 *
 * Returns discovery data for the school exploration UI.
 * - No params: returns all states with school counts + statistics
 * - ?state=slug: returns cities with school counts for that state
 */
export async function GET(request: NextRequest) {
  try {
    const stateSlug = request.nextUrl.searchParams.get("state")

    if (stateSlug) {
      const result = await fetchCitiesWithSchoolCount(stateSlug)
      return NextResponse.json(result, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      })
    }

    const [states, statistics] = await Promise.all([
      fetchStatesWithSchoolCount(),
      getSchoolsStatistics(),
    ])

    return NextResponse.json(
      { states, statistics },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching discovery data:", error)
    return NextResponse.json(
      { states: [], statistics: { totalSchools: 0, byBoard: {}, byType: {} } },
      { status: 500 }
    )
  }
}
