import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

interface QuizAnswersRequest {
  userId?: string
  learning_style?: string
  budget?: string
  location?: string
  board?: string
  special_needs?: string
}

/**
 * GET /api/quiz-answers
 * Retrieve last saved quiz answers and recommendations
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

    const docRef = doc(db, 'users', userId, 'quizzes', 'latestRecommendation')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Quiz answers retrieved from Firestore')
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
    console.error('❌ Error retrieving quiz answers:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve quiz answers' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quiz-answers
 * Save quiz answers and recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const body: QuizAnswersRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const dataToSave = {
      ...(body.learning_style && { learning_style: body.learning_style }),
      ...(body.budget && { budget: body.budget }),
      ...(body.location && { location: body.location }),
      ...(body.board && { board: body.board }),
      ...(body.special_needs && { special_needs: body.special_needs }),
      savedAt: new Date().toISOString(),
    }

    const docRef = doc(db, 'users', userId, 'quizzes', 'latestRecommendation')
    await setDoc(docRef, dataToSave)

    console.log('✅ Quiz answers saved to Firestore')
    return NextResponse.json({
      success: true,
      message: 'Quiz answers saved successfully',
      data: {
        id: 'latestRecommendation',
        ...dataToSave,
      },
    })
  } catch (error) {
    console.error('❌ Error saving quiz answers:', error)
    return NextResponse.json(
      { error: 'Failed to save quiz answers' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/quiz-answers
 * Clear saved quiz answers
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

    const docRef = doc(db, 'users', userId, 'quizzes', 'latestRecommendation')
    await setDoc(docRef, {})

    console.log('✅ Quiz answers cleared from Firestore')
    return NextResponse.json({
      success: true,
      message: 'Quiz answers cleared successfully',
    })
  } catch (error) {
    console.error('❌ Error clearing quiz answers:', error)
    return NextResponse.json(
      { error: 'Failed to clear quiz answers' },
      { status: 500 }
    )
  }
}
