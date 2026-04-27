import { NextRequest, NextResponse } from 'next/server'
import {
  serverGetUserRecord,
  serverUpsertUserRecord,
} from '@/lib/server-user-data'

const BUCKET = 'age-calculations'
const DATA_KEY = 'current'

interface AgeCalculationRequest {
  userId?: string
  dateOfBirth: string
  admissionYear: string
  currentAge: number | null
  admissionAge: number | null
  admissionAgeDecimal: string
  eligibleGrades: Array<{
    grade: string
    minAge: number
    maxAge: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY })

    return NextResponse.json({
      success: true,
      data: row
        ? {
            id: row.data_key,
            ...row.payload,
          }
        : null,
    })
  } catch (error) {
    console.error('Error retrieving age calculation:', error)
    return NextResponse.json({ error: 'Failed to retrieve age calculation' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AgeCalculationRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!body.dateOfBirth || !body.admissionYear) {
      return NextResponse.json({ error: 'Date of birth and admission year are required' }, { status: 400 })
    }

    const payload = {
      dateOfBirth: body.dateOfBirth,
      admissionYear: body.admissionYear,
      currentAge: body.currentAge,
      admissionAge: body.admissionAge,
      admissionAgeDecimal: body.admissionAgeDecimal,
      eligibleGrades: body.eligibleGrades,
      updatedAt: new Date().toISOString(),
    }

    const row = await serverUpsertUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: DATA_KEY,
      payload,
    })

    return NextResponse.json({
      success: true,
      message: 'Age calculation saved successfully',
      data: {
        id: row.data_key,
        ...row.payload,
      },
    })
  } catch (error) {
    console.error('Error saving age calculation:', error)
    return NextResponse.json({ error: 'Failed to save age calculation' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await serverUpsertUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: DATA_KEY,
      payload: {},
    })

    return NextResponse.json({
      success: true,
      message: 'Calculation deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting age calculation:', error)
    return NextResponse.json({ error: 'Failed to delete age calculation' }, { status: 500 })
  }
}
