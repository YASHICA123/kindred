import { NextRequest, NextResponse } from "next/server"
import {
  fetchAllAgeGroups,
  fetchAgeGroupsWithSchoolCount,
} from "@/lib/supabase-queries"

/**
 * GET /api/age-groups
 *
 * Query Parameters:
 *   - counts=true  → include school counts per age group
 *
 * Examples:
 *   GET /api/age-groups
 *   GET /api/age-groups?counts=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const withCounts = searchParams.get("counts") === "true"

    const data = withCounts
      ? await fetchAgeGroupsWithSchoolCount()
      : await fetchAllAgeGroups()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    })
  } catch (error) {
    console.error("Error in /api/age-groups:", error)
    return NextResponse.json([], { status: 500 })
  }
}
