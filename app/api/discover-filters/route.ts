import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

interface DiscoverFiltersRequest {
  userId?: string
  searchTerm?: string
  selectedBoard?: string
  selectedCity?: string
  selectedClass?: string
  selectedFeeRange?: string
  selectedSchoolType?: string
}

/**
 * GET /api/discover-filters
 * Retrieve saved discover page filters
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

    const docRef = doc(db, 'users', userId, 'preferences', 'discoverFilters')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Discover filters retrieved from Firestore')
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
    console.error('❌ Error retrieving discover filters:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve discover filters' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/discover-filters
 * Save discover page filters
 */
export async function POST(request: NextRequest) {
  try {
    const body: DiscoverFiltersRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const dataToSave = {
      ...(body.searchTerm && { searchTerm: body.searchTerm }),
      ...(body.selectedBoard && { selectedBoard: body.selectedBoard }),
      ...(body.selectedCity && { selectedCity: body.selectedCity }),
      ...(body.selectedClass && { selectedClass: body.selectedClass }),
      ...(body.selectedFeeRange && { selectedFeeRange: body.selectedFeeRange }),
      ...(body.selectedSchoolType && { selectedSchoolType: body.selectedSchoolType }),
      updatedAt: new Date().toISOString(),
    }

    const docRef = doc(db, 'users', userId, 'preferences', 'discoverFilters')
    await setDoc(docRef, dataToSave, { merge: true })

    console.log('✅ Discover filters saved to Firestore')
    return NextResponse.json({
      success: true,
      message: 'Filters saved successfully',
      data: {
        id: 'discoverFilters',
        ...dataToSave,
      },
    })
  } catch (error) {
    console.error('❌ Error saving discover filters:', error)
    return NextResponse.json(
      { error: 'Failed to save discover filters' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/discover-filters
 * Clear saved filters
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

    const docRef = doc(db, 'users', userId, 'preferences', 'discoverFilters')
    await setDoc(docRef, {})

    console.log('✅ Discover filters cleared from Firestore')
    return NextResponse.json({
      success: true,
      message: 'Filters cleared successfully',
    })
  } catch (error) {
    console.error('❌ Error clearing discover filters:', error)
    return NextResponse.json(
      { error: 'Failed to clear discover filters' },
      { status: 500 }
    )
  }
}
