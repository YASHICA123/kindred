import { NextRequest, NextResponse } from "next/server"
import {
  fetchAllStates,
  fetchStatesWithSchoolCount,
  fetchCitiesWithSchoolCount,
} from "@/lib/supabase-queries"

/**
 * GET /api/states
 *
 * Returns all states. Use ?counts=true for school counts.
 * Use ?slug=maharashtra to get cities for a specific state.
 */
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug")
    const withCounts = request.nextUrl.searchParams.get("counts") === "true"

    if (slug) {
      const result = await fetchCitiesWithSchoolCount(slug)
      return NextResponse.json(result, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      })
    }

    const states = withCounts
      ? await fetchStatesWithSchoolCount()
      : await fetchAllStates()

    return NextResponse.json(
      { states, total: states.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching states:", error)
    return NextResponse.json(
      { error: "Failed to fetch states", states: [] },
      { status: 500 }
    )
  }
}
