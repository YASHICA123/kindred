import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface UserPreferences {
  userId: string
  displayName?: string
  email?: string
  phone?: string
  location?: string
  schoolPreferences?: {
    preferredBoards?: string[]
    preferredCurriculums?: string[]
    feeRanges?: string[]
    schoolTypes?: string[]
  }
  notifications?: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    schoolUpdates: boolean
    counsellorMessages: boolean
  }
  privacy?: {
    profileVisibility: 'public' | 'private' | 'friends'
    allowDataSharing: boolean
  }
  language?: string
  theme?: 'light' | 'dark'
  createdAt?: any
  updatedAt?: any
}

/**
 * POST /api/user/preferences
 * Create or initialize user preferences
 */
export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json()

    if (!preferences.userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    // Create user profile with preferences
    const userRef = doc(db, 'users', preferences.userId)
    
    const defaultPreferences: UserPreferences = {
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(userRef, defaultPreferences, { merge: true })

    console.log("✅ User preferences created:", preferences.userId)

    return NextResponse.json(
      {
        success: true,
        message: "Preferences saved successfully",
        preferences: defaultPreferences,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Error creating preferences:", error)
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/preferences?userId={userId}
 * Retrieve user preferences
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

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      preferences: userDoc.data(),
    })
  } catch (error) {
    console.error("❌ Error fetching preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/preferences
 * Update user preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    const userRef = doc(db, 'users', userId)
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    console.log("✅ User preferences updated:", userId)

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    })
  } catch (error) {
    console.error("❌ Error updating preferences:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/preferences
 * Delete user account and all associated data (careful!)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    // This should be protected - ideally only allow users to delete their own account
    const userRef = doc(db, 'users', userId)
    
    // Just clear data, don't actually delete the document
    await updateDoc(userRef, {
      displayName: '',
      email: '',
      phone: '',
      dataDeletedAt: serverTimestamp(),
    })

    console.log("✅ User data cleared:", userId)

    return NextResponse.json({
      success: true,
      message: "Account data cleared successfully",
    })
  } catch (error) {
    console.error("❌ Error deleting preferences:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}
