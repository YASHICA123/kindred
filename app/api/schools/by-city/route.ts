import { NextRequest, NextResponse } from "next/server"
import { fetchSchoolsByCitySlug } from "@/lib/supabase-queries"

/**
 * GET /api/schools/by-city?city=mumbai
 *
 * Returns all schools in a given city (by slug).
 */
export async function GET(request: NextRequest) {
  try {
    const citySlug = request.nextUrl.searchParams.get("city")

    if (!citySlug) {
      return NextResponse.json(
        { error: "Missing required parameter: city", schools: [] },
        { status: 400 }
      )
    }

    const schools = await fetchSchoolsByCitySlug(citySlug)

    return NextResponse.json(
      { schools, total: schools.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching schools by city:", error)
    return NextResponse.json(
      { error: "Failed to fetch schools by city", schools: [] },
      { status: 500 }
    )
  }
}
