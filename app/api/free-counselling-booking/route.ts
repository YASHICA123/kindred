import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CounsellingBooking {
  name: string
  email: string
  phone: string
  childAge: string
  currentSchool?: string
  concerns: string
  preferredDate: string
  preferredTime: string
}

// GET /api/free-counselling-booking - Retrieve counselling bookings for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") as string

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    const bookingsRef = collection(db, "freeCounsellingBookings")
    const q = query(bookingsRef, where("userId", "==", userId))
    const snapshot = await getDocs(q)

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching counselling bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

// POST /api/free-counselling-booking - Create new counselling booking
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CounsellingBooking & { userId?: string }

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "childAge", "concerns", "preferredDate", "preferredTime"]
    for (const field of requiredFields) {
      if (!(field in body) || !body[field as keyof typeof body]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const bookingData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      childAge: body.childAge,
      currentSchool: body.currentSchool || "",
      concerns: body.concerns,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      userId: body.userId || "guest",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save to Firestore
    const bookingsRef = collection(db, "freeCounsellingBookings")
    const docRef = await addDoc(bookingsRef, bookingData)

    console.log("✅ Free counselling booking saved:", docRef.id)

    return NextResponse.json(
      {
        id: docRef.id,
        message: "Booking created successfully",
        ...bookingData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Error creating counselling booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

// DELETE /api/free-counselling-booking - Delete counselling booking
export async function DELETE(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId") as string
    const userId = request.nextUrl.searchParams.get("userId") as string

    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: "bookingId and userId are required" },
        { status: 400 }
      )
    }

    // Verify ownership before deleting
    const docRef = doc(db, "freeCounsellingBookings", bookingId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    if (docSnap.data()?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await deleteDoc(docRef)

    console.log("✅ Free counselling booking deleted:", bookingId)

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error deleting counselling booking:", error)
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    )
  }
}
