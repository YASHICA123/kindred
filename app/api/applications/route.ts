import { NextRequest, NextResponse } from 'next/server'
import {
  serverGetUserRecord,
  serverInsertUserRecord,
} from '@/lib/server-user-data'

const BUCKET = 'applications'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.parentProfile?.email || !data.parentProfile?.phone) {
      return NextResponse.json({ error: 'Parent profile incomplete' }, { status: 400 })
    }

    if (!data.studentDetails?.firstName || !data.studentDetails?.lastName) {
      return NextResponse.json({ error: 'Student details incomplete' }, { status: 400 })
    }

    if (!data.selectedSchools || data.selectedSchools.length === 0) {
      return NextResponse.json({ error: 'No schools selected' }, { status: 400 })
    }

    const userId = data.userId || data.applicationStoreId
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const row = await serverInsertUserRecord({
      userId,
      bucket: BUCKET,
      keyPrefix: 'application',
      payload: {
        parentProfile: data.parentProfile,
        studentDetails: data.studentDetails,
        documents: data.documents || [],
        selectedSchools: (data.selectedSchools || []).filter((s: any) => s.selected),
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        applicationId: row.data_key,
        message: 'Application submitted successfully',
        submittedAt: new Date().toISOString(),
        nextSteps: [
          'Check your email for confirmation',
          'Schools will contact you within 5-7 days',
          'Track your application status in your dashboard',
        ],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json({ error: 'Failed to submit application. Please try again later.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const applicationId = request.nextUrl.searchParams.get('id')
    const userId = request.nextUrl.searchParams.get('userId')

    if (!applicationId || !userId) {
      return NextResponse.json({ error: 'Application ID and User ID required' }, { status: 400 })
    }

    const row = await serverGetUserRecord({ userId, bucket: BUCKET, dataKey: applicationId })

    if (!row) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const appData = row.payload || {}

    return NextResponse.json({
      id: applicationId,
      ...appData,
      status: (appData as any).status || 'submitted',
      submittedAt: (appData as any).submittedAt || new Date().toISOString(),
      updates: [
        {
          date: new Date().toISOString(),
          status: (appData as any).status || 'received',
          message: 'Your application is being reviewed',
        },
      ],
    })
  } catch (error) {
    console.error('Application retrieval error:', error)
    return NextResponse.json({ error: 'Failed to retrieve application' }, { status: 500 })
  }
}
