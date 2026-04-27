import { NextRequest, NextResponse } from 'next/server'
import { serverGetUserRecord, serverUpsertUserRecord } from '@/lib/server-user-data'

const BUCKET = 'quiz-answers'
const DATA_KEY = 'latestRecommendation'

interface QuizAnswersRequest {
  userId?: string
  learning_style?: string
  budget?: string
  location?: string
  board?: string
  special_needs?: string
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY })

    return NextResponse.json({ success: true, data: row ? { id: row.data_key, ...row.payload } : null })
  } catch (error) {
    console.error('Error retrieving quiz answers:', error)
    return NextResponse.json({ error: 'Failed to retrieve quiz answers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: QuizAnswersRequest = await request.json()
    const userId = body.userId || request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const payload = {
      ...(body.learning_style && { learning_style: body.learning_style }),
      ...(body.budget && { budget: body.budget }),
      ...(body.location && { location: body.location }),
      ...(body.board && { board: body.board }),
      ...(body.special_needs && { special_needs: body.special_needs }),
      savedAt: new Date().toISOString(),
    }

    const row = await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload })

    return NextResponse.json({
      success: true,
      message: 'Quiz answers saved successfully',
      data: { id: row.data_key, ...row.payload },
    })
  } catch (error) {
    console.error('Error saving quiz answers:', error)
    return NextResponse.json({ error: 'Failed to save quiz answers' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await serverUpsertUserRecord({ userId, bucket: BUCKET, dataKey: DATA_KEY, payload: {} })

    return NextResponse.json({ success: true, message: 'Quiz answers cleared successfully' })
  } catch (error) {
    console.error('Error clearing quiz answers:', error)
    return NextResponse.json({ error: 'Failed to clear quiz answers' }, { status: 500 })
  }
}
