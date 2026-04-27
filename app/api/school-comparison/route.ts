import { NextRequest, NextResponse } from 'next/server'
import { serverGetUserRecord, serverUpsertUserRecord } from '@/lib/server-user-data'

const BUCKET = 'school-comparisons'
const DATA_KEY = 'latest'

interface SchoolComparisonRequest {
  userId?: string
  schoolIds: (string | number)[]
  schoolNames: string[]
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
    console.error('Error retrieving school comparison:', error)
    return NextResponse.json({ error: 'Failed to retrieve school comparison' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SchoolComparisonRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!body.schoolIds || body.schoolIds.length === 0) {
      return NextResponse.json({ error: 'At least one school is required' }, { status: 400 })
    }

    const payload = {
      schoolIds: body.schoolIds,
      schoolNames: body.schoolNames,
      comparedAt: new Date().toISOString(),
    }

    const row = await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload })

    return NextResponse.json({
      success: true,
      message: 'Comparison saved successfully',
      data: { id: row.data_key, ...row.payload },
    })
  } catch (error) {
    console.error('Error saving school comparison:', error)
    return NextResponse.json({ error: 'Failed to save school comparison' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload: {} })

    return NextResponse.json({ success: true, message: 'Comparison cleared successfully' })
  } catch (error) {
    console.error('Error clearing school comparison:', error)
    return NextResponse.json({ error: 'Failed to clear school comparison' }, { status: 500 })
  }
}
