import { NextRequest, NextResponse } from 'next/server'
import {
  serverDeleteUserRecord,
  serverListUserRecords,
  serverUpsertUserRecord,
} from '@/lib/server-user-data'

const BUCKET = 'saved-schools'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolId, schoolName, schoolImage, schoolLocation, userId } = body

    if (!userId || !schoolId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await serverUpsertUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: schoolId.toString(),
      payload: {
        schoolId,
        schoolName,
        schoolImage,
        schoolLocation,
        savedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, message: 'School saved' })
  } catch (error) {
    console.error('Error saving school:', error)
    return NextResponse.json({ error: 'Failed to save school' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const rows = await serverListUserRecords({ userId, bucket: BUCKET })
    const savedSchools = rows.map((row) => ({
      id: row.data_key,
      ...(row.payload as Record<string, any>),
    }))

    return NextResponse.json({ savedSchools })
  } catch (error) {
    console.error('Error fetching saved schools:', error)
    return NextResponse.json({ error: 'Failed to fetch saved schools' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, schoolId } = await request.json()

    if (!userId || !schoolId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await serverDeleteUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: schoolId.toString(),
    })

    return NextResponse.json({ success: true, message: 'School removed from saved' })
  } catch (error) {
    console.error('Error removing saved school:', error)
    return NextResponse.json({ error: 'Failed to remove school' }, { status: 500 })
  }
}
