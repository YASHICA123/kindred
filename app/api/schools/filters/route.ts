import { NextResponse } from "next/server"
import { fetchFilterOptions } from "@/lib/supabase-queries"

/**
 * GET /api/schools/filters
 *
 * Returns available filter options: boards, types, and states.
 */
export async function GET() {
  try {
    const filters = await fetchFilterOptions()

    return NextResponse.json(filters, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    })
  } catch (error) {
    console.error("Error fetching filter options:", error)
    return NextResponse.json(
      { boards: [], types: [], states: [] },
      { status: 500 }
    )
  }
}
