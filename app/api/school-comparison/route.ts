import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

interface SchoolComparisonRequest {
  userId?: string
  schoolIds: (string | number)[]
  schoolNames: string[]
}

/**
 * GET /api/school-comparison
 * Retrieve latest saved school comparison
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'users', userId, 'comparisons', 'latest')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ School comparison retrieved from Firestore')
      return NextResponse.json({
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: null,
    })
  } catch (error) {
    console.error('❌ Error retrieving school comparison:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve school comparison' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/school-comparison
 * Save school comparison
 */
export async function POST(request: NextRequest) {
  try {
    const body: SchoolComparisonRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    if (!body.schoolIds || body.schoolIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one school is required' },
        { status: 400 }
      )
    }

    const dataToSave = {
      schoolIds: body.schoolIds,
      schoolNames: body.schoolNames,
      comparedAt: new Date().toISOString(),
    }

    const docRef = doc(db, 'users', userId, 'comparisons', 'latest')
    await setDoc(docRef, dataToSave)

    console.log('✅ School comparison saved to Firestore')
    return NextResponse.json({
      success: true,
      message: 'Comparison saved successfully',
      data: {
        id: 'latest',
        ...dataToSave,
      },
    })
  } catch (error) {
    console.error('❌ Error saving school comparison:', error)
    return NextResponse.json(
      { error: 'Failed to save school comparison' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/school-comparison
 * Clear saved comparison
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'users', userId, 'comparisons', 'latest')
    await setDoc(docRef, {})

    console.log('✅ School comparison cleared from Firestore')
    return NextResponse.json({
      success: true,
      message: 'Comparison cleared successfully',
    })
  } catch (error) {
    console.error('❌ Error clearing school comparison:', error)
    return NextResponse.json(
      { error: 'Failed to clear school comparison' },
      { status: 500 }
    )
  }
}
