import { NextRequest, NextResponse } from "next/server"
import {
  fetchAllSchoolTypes,
  fetchSchoolTypesWithSchoolCount,
} from "@/lib/supabase-queries"

/**
 * GET /api/school-types
 *
 * Query Parameters:
 *   - counts=true  → include school counts per type
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const withCounts = searchParams.get("counts") === "true"

    const data = withCounts
      ? await fetchSchoolTypesWithSchoolCount()
      : await fetchAllSchoolTypes()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    })
  } catch (error) {
    console.error("Error in /api/school-types:", error)
    return NextResponse.json([], { status: 500 })
  }
}
