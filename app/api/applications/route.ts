import { NextRequest, NextResponse } from "next/server"

interface ParentProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  occupation: string
  income: string
}

interface StudentDetails {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  currentGrade: string
  currentSchool: string
  previousSchool: string
  caste: string
  religion: string
  specialNeeds: boolean
  specialNeedsDetails?: string
}

interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  file: string
}

interface SchoolSelection {
  id: string
  name: string
  slug: string
  selected: boolean
  preference: number
}

interface ApplicationData {
  parentProfile: ParentProfile
  studentDetails: StudentDetails
  documents: DocumentFile[]
  selectedSchools: SchoolSelection[]
}

export async function POST(request: NextRequest) {
  try {
    const data: ApplicationData = await request.json()

    // Validation
    if (!data.parentProfile?.email || !data.parentProfile?.phone) {
      return NextResponse.json(
        { error: "Parent profile incomplete" },
        { status: 400 }
      )
    }

    if (!data.studentDetails?.firstName || !data.studentDetails?.lastName) {
      return NextResponse.json(
        { error: "Student details incomplete" },
        { status: 400 }
      )
    }

    if (!data.selectedSchools || data.selectedSchools.length === 0) {
      return NextResponse.json(
        { error: "No schools selected" },
        { status: 400 }
      )
    }

    // Generate application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // TODO: Store application in database
    // In a real application, you would:
    // 1. Connect to your database (MongoDB, PostgreSQL, etc.)
    // 2. Create an applications collection/table
    // 3. Insert the application data with timestamp
    // 4. Send confirmation email to parent
    // 5. Notify schools of new applications

    console.log("New application submitted:", {
      applicationId,
      parentEmail: data.parentProfile.email,
      studentName: `${data.studentDetails.firstName} ${data.studentDetails.lastName}`,
      schoolCount: data.selectedSchools.length,
      documentCount: data.documents.length,
      submittedAt: new Date().toISOString(),
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: "Application submitted successfully",
        submittedAt: new Date().toISOString(),
        nextSteps: [
          "Check your email for confirmation",
          "Schools will contact you within 5-7 days",
          "Track your application status in your dashboard",
        ],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Get application status by ID
    const applicationId = request.nextUrl.searchParams.get("id")

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      )
    }

    // Return mock status for now
    return NextResponse.json({
      applicationId,
      status: "under_review",
      submittedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      updates: [
        {
          date: new Date().toISOString(),
          status: "received",
          message: "Application received and documents are being reviewed",
        },
      ],
    })
  } catch (error) {
    console.error("Application status error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve application status" },
      { status: 500 }
    )
  }
}
