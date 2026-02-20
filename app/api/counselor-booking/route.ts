import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CounselorBooking {
  userId: string
  counselorId: string
  counselorName: string
  counselorEmail: string
  bookingDate: string
  bookingTime: string
  duration: number // in minutes
  topic: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  meetingLink?: string
  createdAt?: any
  updatedAt?: any
}

/**
 * POST /api/counselor-booking
 * Creates a new counselor booking
 */
export async function POST(request: NextRequest) {
  try {
    const booking: CounselorBooking = await request.json()

    // Validation
    if (!booking.userId || !booking.counselorId || !booking.bookingDate || !booking.bookingTime) {
      return NextResponse.json(
        { error: "Missing required fields: userId, counselorId, bookingDate, bookingTime" },
        { status: 400 }
      )
    }

    // Save booking to Firestore
    const bookingsRef = collection(db, 'users', booking.userId, 'counsellorBookings')
    
    const bookingDocRef = await addDoc(bookingsRef, {
      counselorId: booking.counselorId,
      counselorName: booking.counselorName,
      counselorEmail: booking.counselorEmail,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      duration: booking.duration || 30,
      topic: booking.topic,
      notes: booking.notes || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Counselor booking created:", {
      bookingId: bookingDocRef.id,
      userId: booking.userId,
      counselor: booking.counselorName,
      date: booking.bookingDate,
      time: booking.bookingTime,
    })

    return NextResponse.json(
      {
        success: true,
        bookingId: bookingDocRef.id,
        message: "Booking confirmed successfully",
        confirmationDetails: {
          date: booking.bookingDate,
          time: booking.bookingTime,
          counselor: booking.counselorName,
          duration: booking.duration || 30,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Counselor booking error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/counselor-booking?userId={userId}
 * Retrieves all bookings for a user
 * GET /api/counselor-booking?bookingId={bookingId}&userId={userId}
 * Retrieves a specific booking
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const bookingId = request.nextUrl.searchParams.get("bookingId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    if (bookingId) {
      // Get specific booking
      const bookingRef = doc(db, 'users', userId, 'counsellorBookings', bookingId)
      const bookingDoc = await getDoc(bookingRef)

      if (!bookingDoc.exists()) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        id: bookingId,
        ...bookingDoc.data(),
      })
    }

    // Get all bookings for user
    const bookingsRef = collection(db, 'users', userId, 'counsellorBookings')
    const snapshot = await getDocs(bookingsRef)

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({
      total: bookings.length,
      bookings: bookings.sort((a, b) => {
        const dateA = new Date(a.bookingDate).getTime()
        const dateB = new Date(b.bookingDate).getTime()
        return dateA - dateB
      }),
    })
  } catch (error) {
    console.error("❌ Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/counselor-booking
 * Updates a booking (change time, cancel, etc.)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId, bookingId, ...updates } = await request.json()

    if (!userId || !bookingId) {
      return NextResponse.json(
        { error: "User ID and Booking ID required" },
        { status: 400 }
      )
    }

    const bookingRef = doc(db, 'users', userId, 'counsellorBookings', bookingId)
    
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Booking updated:", { bookingId, updates })

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
    })
  } catch (error) {
    console.error("❌ Error updating booking:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/counselor-booking
 * Cancels a booking
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId, bookingId } = await request.json()

    if (!userId || !bookingId) {
      return NextResponse.json(
        { error: "User ID and Booking ID required" },
        { status: 400 }
      )
    }

    const bookingRef = doc(db, 'users', userId, 'counsellorBookings', bookingId)
    
    await deleteDoc(bookingRef)

    console.log("✅ Booking cancelled:", { bookingId })

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    })
  } catch (error) {
    console.error("❌ Error deleting booking:", error)
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    )
  }
}
