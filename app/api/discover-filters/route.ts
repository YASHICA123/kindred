import { NextRequest, NextResponse } from 'next/server'
import { serverGetUserRecord, serverUpsertUserRecord } from '@/lib/server-user-data'

const BUCKET = 'discover-filters'
const DATA_KEY = 'discoverFilters'

interface DiscoverFiltersRequest {
  userId?: string
  searchTerm?: string
  selectedBoard?: string
  selectedCity?: string
  selectedClass?: string
  selectedFeeRange?: string
  selectedSchoolType?: string
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY })
    return NextResponse.json({ success: true, data: row ? { id: row.data_key, ...row.payload } : null })
  } catch (error) {
    console.error('Error retrieving discover filters:', error)
    return NextResponse.json({ error: 'Failed to retrieve discover filters' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DiscoverFiltersRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const payload = {
      ...(body.searchTerm && { searchTerm: body.searchTerm }),
      ...(body.selectedBoard && { selectedBoard: body.selectedBoard }),
      ...(body.selectedCity && { selectedCity: body.selectedCity }),
      ...(body.selectedClass && { selectedClass: body.selectedClass }),
      ...(body.selectedFeeRange && { selectedFeeRange: body.selectedFeeRange }),
      ...(body.selectedSchoolType && { selectedSchoolType: body.selectedSchoolType }),
      updatedAt: new Date().toISOString(),
    }

    const row = await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload })

    return NextResponse.json({
      success: true,
      message: 'Filters saved successfully',
      data: { id: row.data_key, ...row.payload },
    })
  } catch (error) {
    console.error('Error saving discover filters:', error)
    return NextResponse.json({ error: 'Failed to save discover filters' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload: {} })

    return NextResponse.json({ success: true, message: 'Filters cleared successfully' })
  } catch (error) {
    console.error('Error clearing discover filters:', error)
    return NextResponse.json({ error: 'Failed to clear discover filters' }, { status: 500 })
  }
}
