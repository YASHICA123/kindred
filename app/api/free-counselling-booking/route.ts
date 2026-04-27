import { NextRequest, NextResponse } from 'next/server'
import {
  serverDeleteUserRecord,
  serverGetUserRecord,
  serverInsertUserRecord,
  serverListUserRecords,
} from '@/lib/server-user-data'

const BUCKET = 'free-counselling-bookings'

function guestUserId(email?: string) {
  if (!email) {
    return `guest_${Date.now()}`
  }
  return `guest_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') as string

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const rows = await serverListUserRecords({ userId, bucket: BUCKET })
    const bookings = rows.map((row) => ({ id: row.data_key, ...row.payload }))

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error('Error fetching counselling bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, any>

    const requiredFields = ['name', 'email', 'phone', 'childAge', 'concerns', 'preferredDate', 'preferredTime']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const userId = body.userId || guestUserId(body.email)

    const row = await serverInsertUserRecord({
      userId,
      bucket: BUCKET,
      keyPrefix: 'counselling',
      payload: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        childAge: body.childAge,
        currentSchool: body.currentSchool || '',
        concerns: body.concerns,
        preferredDate: body.preferredDate,
        preferredTime: body.preferredTime,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json(
      {
        id: row.data_key,
        message: 'Booking created successfully',
        ...row.payload,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating counselling booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get('bookingId') as string
    const userId = request.nextUrl.searchParams.get('userId') as string

    if (!bookingId || !userId) {
      return NextResponse.json({ error: 'bookingId and userId are required' }, { status: 400 })
    }

    const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: bookingId })

    if (!row) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    await serverDeleteUserRecord({ userId, bucket: BUCKET, dataKey: bookingId })

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting counselling booking:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
