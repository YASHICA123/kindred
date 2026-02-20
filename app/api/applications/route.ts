import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, getDoc, doc, getDocs, query, where, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { getAuth } from "firebase/auth"

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
    const data = await request.json()

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

    // Get userId from request body (sent by client)
    const userId = data.userId || data.firebaseId
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 401 }
      )
    }

    // Save application to Firestore
    const applicationsRef = collection(db, 'users', userId, 'applications')
    
    const applicationDocRef = await addDoc(applicationsRef, {
      parentProfile: data.parentProfile,
      studentDetails: data.studentDetails,
      documents: data.documents,
      selectedSchools: data.selectedSchools.filter((s) => s.selected),
      status: 'submitted',
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const applicationId = applicationDocRef.id

    console.log("✅ New application stored in Firestore:", {
      applicationId,
      userId,
      parentEmail: data.parentProfile.email,
      studentName: `${data.studentDetails.firstName} ${data.studentDetails.lastName}`,
      schoolCount: data.selectedSchools.filter(s => s.selected).length,
      documentCount: data.documents.length,
      submittedAt: new Date().toISOString(),
    })

    // TODO: Send confirmation email to parent
    // TODO: Notify schools of new applications
    // TODO: Add to email queue for async processing

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
    const applicationId = request.nextUrl.searchParams.get("id")
    const userId = request.nextUrl.searchParams.get("userId")

    if (!applicationId || !userId) {
      return NextResponse.json(
        { error: "Application ID and User ID required" },
        { status: 400 }
      )
    }

    // Fetch application from Firestore
    const applicationRef = doc(db, 'users', userId, 'applications', applicationId)
    const applicationDoc = await getDoc(applicationRef)

    if (!applicationDoc.exists()) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }

    const appData = applicationDoc.data()
    
    return NextResponse.json({
      id: applicationId,
      ...appData,
      status: appData.status || 'submitted',
      submittedAt: appData.submittedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updates: [
        {
          date: new Date().toISOString(),
          status: appData.status || "received",
          message: "Your application is being reviewed",
        },
      ],
    })
  } catch (error) {
    console.error("❌ Application retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve application" },
      { status: 500 }
    )
  }
}
