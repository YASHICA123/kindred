import { NextRequest, NextResponse } from "next/server"
import { fetchAllBoards, fetchBoardsWithSchoolCount } from "@/lib/supabase-queries"

/**
 * GET /api/boards
 *
 * Query Parameters:
 * - counts=true: Include school counts per board
 *
 * Returns all boards, optionally with school counts.
 */
export async function GET(request: NextRequest) {
  try {
    const withCounts = request.nextUrl.searchParams.get("counts") === "true"

    if (withCounts) {
      const boards = await fetchBoardsWithSchoolCount()
      return NextResponse.json(boards, {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
        },
      })
    }

    const boards = await fetchAllBoards()
    return NextResponse.json(boards, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    })
  } catch (error) {
    console.error("Error fetching boards:", error)
    return NextResponse.json([], { status: 500 })
  }
}
