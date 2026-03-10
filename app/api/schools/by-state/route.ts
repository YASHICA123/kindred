import { NextRequest, NextResponse } from "next/server"
import { fetchSchoolsByStateSlug } from "@/lib/supabase-queries"

/**
 * GET /api/schools/by-state?state=maharashtra
 *
 * Returns all schools in a given state (by slug).
 */
export async function GET(request: NextRequest) {
  try {
    const stateSlug = request.nextUrl.searchParams.get("state")

    if (!stateSlug) {
      return NextResponse.json(
        { error: "Missing required parameter: state", schools: [] },
        { status: 400 }
      )
    }

    const schools = await fetchSchoolsByStateSlug(stateSlug)

    return NextResponse.json(
      { schools, total: schools.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching schools by state:", error)
    return NextResponse.json(
      { error: "Failed to fetch schools by state", schools: [] },
      { status: 500 }
    )
  }
}
