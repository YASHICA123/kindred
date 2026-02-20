import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

interface AgeCalculationRequest {
  userId?: string
  dateOfBirth: string
  admissionYear: string
  currentAge: number | null
  admissionAge: number | null
  admissionAgeDecimal: string
  eligibleGrades: Array<{
    grade: string
    minAge: number
    maxAge: number
  }>
}

/**
 * GET /api/age-calculator
 * Retrieve saved age calculation
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

    const docRef = doc(db, 'users', userId, 'ageCalculations', 'current')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Age calculation retrieved from Firestore')
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
    console.error('❌ Error retrieving age calculation:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve age calculation' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/age-calculator
 * Save age calculation
 */
export async function POST(request: NextRequest) {
  try {
    const body: AgeCalculationRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    if (!body.dateOfBirth || !body.admissionYear) {
      return NextResponse.json(
        { error: 'Date of birth and admission year are required' },
        { status: 400 }
      )
    }

    const dataToSave = {
      dateOfBirth: body.dateOfBirth,
      admissionYear: body.admissionYear,
      currentAge: body.currentAge,
      admissionAge: body.admissionAge,
      admissionAgeDecimal: body.admissionAgeDecimal,
      eligibleGrades: body.eligibleGrades,
      updatedAt: new Date().toISOString(),
    }

    const docRef = doc(db, 'users', userId, 'ageCalculations', 'current')
    await setDoc(docRef, dataToSave)

    console.log('✅ Age calculation saved to Firestore')
    return NextResponse.json({
      success: true,
      message: 'Age calculation saved successfully',
      data: {
        id: 'current',
        ...dataToSave,
      },
    })
  } catch (error) {
    console.error('❌ Error saving age calculation:', error)
    return NextResponse.json(
      { error: 'Failed to save age calculation' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/age-calculator
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

    const docRef = doc(db, 'users', userId, 'ageCalculations', 'current')
    await setDoc(docRef, {})

    console.log('✅ Age calculation deleted from Firestore')
    return NextResponse.json({
      success: true,
      message: 'Calculation deleted successfully',
    })
  } catch (error) {
    console.error('❌ Error deleting age calculation:', error)
    return NextResponse.json(
      { error: 'Failed to delete age calculation' },
      { status: 500 }
    )
  }
}
