import { NextRequest, NextResponse } from 'next/server'
import {
  serverGetUserRecord,
  serverInsertUserRecord,
  serverListUserRecords,
  serverUpsertUserRecord,
} from '@/lib/server-user-data'

const EVENTS_BUCKET = 'journey-events'
const PROGRESS_BUCKET = 'journey-progress'
const PROGRESS_KEY = 'current'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    if (!event.userId || !event.eventType || !event.title) {
      return NextResponse.json({ error: 'Missing required fields: userId, eventType, title' }, { status: 400 })
    }

    const row = await serverInsertUserRecord({
      userId: event.userId,
      bucket: EVENTS_BUCKET,
      keyPrefix: 'event',
      payload: {
        eventType: event.eventType,
        title: event.title,
        description: event.description || '',
        metadata: event.metadata || {},
        createdAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, eventId: row.data_key, message: 'Journey event recorded' }, { status: 201 })
  } catch (error) {
    console.error('Error recording journey event:', error)
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const rows = await serverListUserRecords({ userId, bucket: EVENTS_BUCKET })
    const events = rows.map((row) => ({ id: row.data_key, ...row.payload }))

    const completedSteps: string[] = []
    const eventTypes = new Set<string>()

    events.forEach((event: any) => {
      eventTypes.add(event.eventType)
      if (!completedSteps.includes(event.eventType)) {
        completedSteps.push(event.eventType)
      }
    })

    const progressRow = await serverGetUserRecord({ userId, bucket: PROGRESS_BUCKET, dataKey: PROGRESS_KEY })

    return NextResponse.json({
      userId,
      totalEvents: events.length,
      events: events.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      }),
      progress: {
        completedSteps,
        totalStepTypes: eventTypes.size,
        ...(progressRow?.payload || {}),
      },
      timeline: generateTimeline(events),
    })
  } catch (error) {
    console.error('Error fetching journey:', error)
    return NextResponse.json({ error: 'Failed to fetch journey' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, currentStep, totalSteps, completedSteps } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await serverUpsertUserRecord({
      userId,
      bucket: PROGRESS_BUCKET,
      dataKey: PROGRESS_KEY,
      payload: {
        currentStep: currentStep || 0,
        totalSteps: totalSteps || 5,
        completedSteps: completedSteps || [],
        lastUpdated: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, message: 'Progress updated successfully' })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

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
    const eventDate = new Date(event.createdAt || 0)
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
