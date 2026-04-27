import { NextRequest, NextResponse } from 'next/server'
import { serverGetUserRecord, serverUpsertUserRecord } from '@/lib/server-user-data'

const BUCKET = 'user-preferences'
const DATA_KEY = 'settings'

export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json()

    if (!preferences.userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const defaultPreferences = {
      userId: preferences.userId,
      displayName: preferences.displayName || '',
      email: preferences.email || '',
      phone: preferences.phone || '',
      location: preferences.location || '',
      schoolPreferences: preferences.schoolPreferences || {
        preferredBoards: [],
        preferredCurriculums: [],
        feeRanges: [],
        schoolTypes: [],
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        schoolUpdates: true,
        counsellorMessages: true,
        ...preferences.notifications,
      },
      privacy: {
        profileVisibility: 'private',
        allowDataSharing: false,
        ...preferences.privacy,
      },
      language: preferences.language || 'en',
      theme: preferences.theme || 'light',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await serverUpsertUserRecord({
      userId: preferences.userId,
      bucket: BUCKET,
      dataKey: DATA_KEY,
      payload: defaultPreferences,
    })

    return NextResponse.json({
      success: true,
      message: 'Preferences saved successfully',
      preferences: defaultPreferences,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating preferences:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY })

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, preferences: row.payload })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const existing = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY })

    await serverUpsertUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: DATA_KEY,
      payload: {
        ...(existing?.payload || {}),
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, message: 'Preferences updated successfully' })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const existing = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY })

    await serverUpsertUserRecord({
      userId,
      bucket: BUCKET,
      dataKey: DATA_KEY,
      payload: {
        ...(existing?.payload || {}),
        displayName: '',
        email: '',
        phone: '',
        dataDeletedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, message: 'Account data cleared successfully' })
  } catch (error) {
    console.error('Error deleting preferences:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
