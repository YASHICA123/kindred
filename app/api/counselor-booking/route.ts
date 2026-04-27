import { NextRequest, NextResponse } from 'next/server'
import {
  serverDeleteUserRecord,
  serverGetUserRecord,
  serverInsertUserRecord,
  serverListUserRecords,
  serverUpsertUserRecord,
} from '@/lib/server-user-data'

const BUCKET = 'counsellor-bookings'

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json()

    if (!booking.userId || !booking.counselorId || !booking.bookingDate || !booking.bookingTime) {
      return NextResponse.json({ error: 'Missing required fields: userId, counselorId, bookingDate, bookingTime' }, { status: 400 })
    }

    const row = await serverInsertUserRecord({
      userId: booking.userId,
      bucket: BUCKET,
      keyPrefix: 'booking',
      payload: {
        counselorId: booking.counselorId,
        counselorName: booking.counselorName,
        counselorEmail: booking.counselorEmail,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        duration: booking.duration || 30,
        topic: booking.topic,
        notes: booking.notes || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        bookingId: row.data_key,
        message: 'Booking confirmed successfully',
        confirmationDetails: {
          date: booking.bookingDate,
          time: booking.bookingTime,
          counselor: booking.counselorName,
          duration: booking.duration || 30,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Counselor booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const bookingId = request.nextUrl.searchParams.get('bookingId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (bookingId) {
      const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: bookingId })
      if (!row) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }
      return NextResponse.json({ id: bookingId, ...row.payload })
    }

    const rows = await serverListUserRecords({ userId, bucket: BUCKET })
    const bookings = rows.map((row) => ({ id: row.data_key, ...row.payload }))

    return NextResponse.json({
      total: bookings.length,
      bookings: bookings.sort((a: any, b: any) => {
        const dateA = new Date(a.bookingDate || 0).getTime()
        const dateB = new Date(b.bookingDate || 0).getTime()
        return dateA - dateB
      }),
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, bookingId, ...updates } = await request.json()

    if (!userId || !bookingId) {
      return NextResponse.json({ error: 'User ID and Booking ID required' }, { status: 400 })
    }

    const existing = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: bookingId })
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    await serverUpsertUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: bookingId,
      payload: {
        ...(existing.payload || {}),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, message: 'Booking updated successfully' })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, bookingId } = await request.json()

    if (!userId || !bookingId) {
      return NextResponse.json({ error: 'User ID and Booking ID required' }, { status: 400 })
    }

    await serverDeleteUserRecord({ userId, bucket: BUCKET, dataKey: bookingId })

    return NextResponse.json({ success: true, message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}
