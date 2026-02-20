import { NextRequest, NextResponse } from 'next/server'
import { db, auth } from '@/lib/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

interface PointsCalculationRequest {
  userId?: string
  schoolName: string
  criteria: Array<{
    label: string
    maxPoints: number
    current: number
  }>
  totalPoints: number
  maxTotalPoints: number
  percentage: number
  prediction: string
}

/**
 * GET /api/points-calculator
 * Retrieve saved points calculation
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

    const docRef = doc(db, 'users', userId, 'pointsCalculations', 'current')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Points calculation retrieved from Firestore')
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
    console.error('❌ Error retrieving points calculation:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve points calculation' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/points-calculator
 * Save or update points calculation
 */
export async function POST(request: NextRequest) {
  try {
    const body: PointsCalculationRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const dataToSave = {
      schoolName: body.schoolName,
      criteria: body.criteria,
      totalPoints: body.totalPoints,
      maxTotalPoints: body.maxTotalPoints,
      percentage: body.percentage,
      prediction: body.prediction,
      updatedAt: new Date().toISOString(),
    }

    const docRef = doc(db, 'users', userId, 'pointsCalculations', 'current')
    await setDoc(docRef, dataToSave, { merge: true })

    console.log('✅ Points calculation saved to Firestore')
    return NextResponse.json({
      success: true,
      message: 'Calculation saved successfully',
      data: {
        id: 'current',
        ...dataToSave,
      },
    })
  } catch (error) {
    console.error('❌ Error saving points calculation:', error)
    return NextResponse.json(
      { error: 'Failed to save points calculation' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/points-calculator
 * Delete saved calculation
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

    const docRef = doc(db, 'users', userId, 'pointsCalculations', 'current')
    
    // Delete by setting empty document (Firestore doesn't error on non-existent deletes)
    await setDoc(docRef, {}, { merge: false })

    console.log('✅ Points calculation deleted from Firestore')
    return NextResponse.json({
      success: true,
      message: 'Calculation deleted successfully',
    })
  } catch (error) {
    console.error('❌ Error deleting points calculation:', error)
    return NextResponse.json(
      { error: 'Failed to delete points calculation' },
      { status: 500 }
    )
  }
}
