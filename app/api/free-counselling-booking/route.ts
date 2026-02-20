import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import * as admin from "firebase-admin"

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY not found in environment variables")
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
  })
}

const db = getFirestore()

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

    const bookingsRef = db.collection("freeCounsellingBookings")
    const snapshot = await bookingsRef.where("userId", "==", userId).get()

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
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to Firestore
    const docRef = await db.collection("freeCounsellingBookings").add(bookingData)

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
    const docRef = db.collection("freeCounsellingBookings").doc(bookingId)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    if (doc.data()?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await docRef.delete()

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
