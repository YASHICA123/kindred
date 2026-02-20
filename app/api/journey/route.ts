import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, query, getDocs, doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface JourneyEvent {
  userId: string
  eventType: 'quiz_started' | 'quiz_completed' | 'school_viewed' | 'school_saved' | 'application_started' | 'application_submitted'
  title: string
  description?: string
  metadata?: Record<string, any>
  createdAt?: any
}

interface JourneyProgress {
  userId: string
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  lastUpdated?: any
}

/**
 * POST /api/journey/event
 * Track a student journey event
 */
export async function POST(request: NextRequest) {
  try {
    const event: JourneyEvent = await request.json()

    // Validation
    if (!event.userId || !event.eventType || !event.title) {
      return NextResponse.json(
        { error: "Missing required fields: userId, eventType, title" },
        { status: 400 }
      )
    }

    // Save event to Firestore
    const eventsRef = collection(db, 'users', event.userId, 'journeyEvents')
    
    const eventDocRef = await addDoc(eventsRef, {
      eventType: event.eventType,
      title: event.title,
      description: event.description || '',
      metadata: event.metadata || {},
      createdAt: serverTimestamp(),
    })

    console.log("✅ Journey event recorded:", {
      eventId: eventDocRef.id,
      userId: event.userId,
      eventType: event.eventType,
      title: event.title,
    })

    return NextResponse.json(
      {
        success: true,
        eventId: eventDocRef.id,
        message: "Journey event recorded",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Error recording journey event:", error)
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/journey?userId={userId}
 * Get all journey events for a user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    // Get all journey events
    const eventsRef = collection(db, 'users', userId, 'journeyEvents')
    const snapshot = await getDocs(eventsRef)

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))

    // Calculate progress
    const completedSteps: string[] = []
    const eventTypes = new Set<string>()

    events.forEach((event) => {
      eventTypes.add(event.eventType)
      if (!completedSteps.includes(event.eventType)) {
        completedSteps.push(event.eventType)
      }
    })

    // Get progress document if exists
    const progressRef = doc(db, 'users', userId, 'journeyProgress', 'current')
    const progressDoc = await getDoc(progressRef)
    const progressData = progressDoc.exists() ? progressDoc.data() : {}

    return NextResponse.json({
      userId,
      totalEvents: events.length,
      events: events.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      }),
      progress: {
        completedSteps,
        totalStepTypes: eventTypes.size,
        ...progressData,
      },
      timeline: generateTimeline(events),
    })
  } catch (error) {
    console.error("❌ Error fetching journey:", error)
    return NextResponse.json(
      { error: "Failed to fetch journey" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/journey/progress
 * Update student's journey progress
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId, currentStep, totalSteps, completedSteps } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    // Update progress document
    const progressRef = doc(db, 'users', userId, 'journeyProgress', 'current')
    
    await updateDoc(progressRef, {
      currentStep: currentStep || 0,
      totalSteps: totalSteps || 5,
      completedSteps: completedSteps || [],
      lastUpdated: serverTimestamp(),
    }).catch(async (error) => {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await setDoc(progressRef, {
          currentStep: currentStep || 0,
          totalSteps: totalSteps || 5,
          completedSteps: completedSteps || [],
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        })
      }
    })

    console.log("✅ Journey progress updated:", {
      userId,
      currentStep,
      completedSteps: completedSteps?.length || 0,
    })

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
    })
  } catch (error) {
    console.error("❌ Error updating progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}

/**
 * Helper function to generate timeline from events
 */
function generateTimeline(events: any[]) {
  const timeline: Record<string, any[]> = {
    today: [],
    week: [],
    month: [],
    older: [],
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  events.forEach((event) => {
    const eventDate = new Date(event.createdAt)
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

    if (eventDateOnly.getTime() === today.getTime()) {
      timeline.today.push(event)
    } else if (eventDate > weekAgo) {
      timeline.week.push(event)
    } else if (eventDate > monthAgo) {
      timeline.month.push(event)
    } else {
      timeline.older.push(event)
    }
  })

  return timeline
}
