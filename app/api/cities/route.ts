import { NextRequest, NextResponse } from "next/server"
import allCities from "@/data/all-indian-cities.json"

/**
 * GET /api/cities
 *
 * Returns cities from the 4200+ Indian cities dataset.
 * Query Parameters:
 *   - q: search query (matches city name or pincode prefix)
 *   - limit: max results (default 50)
 *
 * Without ?q, returns the first `limit` cities alphabetically.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() || ""
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
    500
  )

  let results = allCities as { city: string; state: string }[]

  if (q) {
    results = results.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    )
  }

  return NextResponse.json(
    {
      success: true,
      count: results.length,
      data: results.slice(0, limit),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    }
  )
}
