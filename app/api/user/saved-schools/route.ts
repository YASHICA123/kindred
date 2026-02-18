import { NextRequest, NextResponse } from 'next/server'
import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { getAuth } from 'firebase/auth'

export async function POST(request: NextRequest) {
  try {
    const { schoolId, schoolName, schoolImage, schoolLocation } = await request.json()
    
    // Get current user from auth header or session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real app, you'd validate the token
    // For now, we'll assume the userId is passed in the body
    const { userId } = await request.json()
    
    if (!userId || !schoolId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    const savedSchool = {
      schoolId,
      schoolName,
      schoolImage,
      schoolLocation,
      savedAt: new Date().toISOString(),
    }

    if (userDoc.exists()) {
      // Update existing user document
      await setDoc(userRef, {
        savedSchools: arrayUnion(savedSchool),
      }, { merge: true })
    } else {
      // Create new user document
      await setDoc(userRef, {
        savedSchools: [savedSchool],
      })
    }

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

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return NextResponse.json({ savedSchools: [] })
    }

    const data = userDoc.data()
    return NextResponse.json({ savedSchools: data.savedSchools || [] })
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

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = userDoc.data()
    const updatedSavedSchools = (data.savedSchools || []).filter(
      (school: any) => school.schoolId !== schoolId
    )

    await setDoc(userRef, { savedSchools: updatedSavedSchools }, { merge: true })

    return NextResponse.json({ success: true, message: 'School removed from saved' })
  } catch (error) {
    console.error('Error removing saved school:', error)
    return NextResponse.json({ error: 'Failed to remove school' }, { status: 500 })
  }
}
