import { NextRequest, NextResponse } from 'next/server'
import { serverGetUserRecord, serverUpsertUserRecord } from '@/lib/server-user-data'

const BUCKET = 'points-calculations'
const DATA_KEY = 'current'

interface PointsCalculationRequest {
  userId?: string
  schoolName: string
  criteria: Array<{
    label: string
    maxPoints: number
    current: number
  }>
  totalPoints: number
  maxTotalPoints: number
  percentage: number
  prediction: string
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
    console.error('Error retrieving points calculation:', error)
    return NextResponse.json({ error: 'Failed to retrieve points calculation' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PointsCalculationRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const payload = {
      schoolName: body.schoolName,
      criteria: body.criteria,
      totalPoints: body.totalPoints,
      maxTotalPoints: body.maxTotalPoints,
      percentage: body.percentage,
      prediction: body.prediction,
      updatedAt: new Date().toISOString(),
    }

    const row = await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload })

    return NextResponse.json({
      success: true,
      message: 'Calculation saved successfully',
      data: { id: row.data_key, ...row.payload },
    })
  } catch (error) {
    console.error('Error saving points calculation:', error)
    return NextResponse.json({ error: 'Failed to save points calculation' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload: {} })

    return NextResponse.json({ success: true, message: 'Calculation deleted successfully' })
  } catch (error) {
    console.error('Error deleting points calculation:', error)
    return NextResponse.json({ error: 'Failed to delete points calculation' }, { status: 500 })
  }
}
