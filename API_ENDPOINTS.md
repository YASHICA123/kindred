# 📡 API Endpoints - Firebase Firestore Storage

All API endpoints now store data in **Firebase Firestore** instead of localhost state.

## 🔐 Authentication

All endpoints require:
- User to be authenticated with Firebase
- Firebase ID token in Authorization header (where applicable)

---

## 📋 Endpoints Overview

| Endpoint | Method | Purpose | Storage |
|----------|--------|---------|---------|
| `/api/applications` | POST | Submit school application | Firestore |
| `/api/applications` | GET | Get application status | Firestore |
| `/api/counselor-booking` | POST | Book counselor session | Firestore |
| `/api/counselor-booking` | GET | List bookings | Firestore |
| `/api/counselor-booking` | PATCH | Update booking | Firestore |
| `/api/counselor-booking` | DELETE | Cancel booking | Firestore |
| `/api/journey` | POST | Record journey event | Firestore |
| `/api/journey` | GET | Get journey timeline | Firestore |
| `/api/journey` | PATCH | Update progress | Firestore |
| `/api/user/saved-schools` | POST | Save school | Firestore |
| `/api/user/saved-schools` | GET | Get saved schools | Firestore |
| `/api/user/saved-schools` | DELETE | Unsave school | Firestore |
| `/api/user/preferences` | POST | Create preferences | Firestore |
| `/api/user/preferences` | GET | Get preferences | Firestore |
| `/api/user/preferences` | PATCH | Update preferences | Firestore |

---

## 📝 Detailed Endpoint Documentation

### 1. APPLICATIONS ENDPOINTS

#### POST /api/applications
Submit a new school application.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "parentProfile": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+91-9999999999",
    "address": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "occupation": "Engineer",
    "income": "10-15 lakhs"
  },
  "studentDetails": {
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "2015-05-15",
    "gender": "Female",
    "currentGrade": "Grade 5",
    "currentSchool": "ABC School",
    "previousSchool": "XYZ School",
    "caste": "General",
    "religion": "Hindu",
    "specialNeeds": false,
    "specialNeedsDetails": ""
  },
  "documents": [
    {
      "id": "doc-1",
      "name": "Mark Sheet",
      "type": "pdf",
      "size": 1024000
    }
  ],
  "selectedSchools": [
    {
      "id": "school-123",
      "name": "Delhi Public School",
      "slug": "dps",
      "selected": true,
      "preference": 1
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "applicationId": "jkq2p8x9r",
  "message": "Application submitted successfully",
  "submittedAt": "2026-02-20T10:30:00Z",
  "nextSteps": [
    "Check your email for confirmation",
    "Schools will contact you within 5-7 days",
    "Track your application status in your dashboard"
  ]
}
```

**Firestore Structure:**
```
users/{userId}/applications/{applicationId}
├── parentProfile: {...}
├── studentDetails: {...}
├── documents: [...]
├── selectedSchools: [...]
├── status: "submitted"
├── submittedAt: Timestamp
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

#### GET /api/applications?id={applicationId}&userId={userId}
Retrieve a specific application.

**Response:**
```json
{
  "id": "jkq2p8x9r",
  "parentProfile": {...},
  "studentDetails": {...},
  "status": "under_review",
  "submittedAt": "2026-02-20T10:30:00Z",
  "updates": [
    {
      "date": "2026-02-20T10:30:00Z",
      "status": "received",
      "message": "Your application is being reviewed"
    }
  ]
}
```

---

### 2. COUNSELOR BOOKING ENDPOINTS

#### POST /api/counselor-booking
Create a new counselor booking.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "counselorId": "counselor-123",
  "counselorName": "Ms. Sarah Johnson",
  "counselorEmail": "sarah@example.com",
  "bookingDate": "2026-03-15",
  "bookingTime": "14:00",
  "duration": 30,
  "topic": "College Selection",
  "notes": "Need guidance for engineering colleges"
}
```

**Response (201):**
```json
{
  "success": true,
  "bookingId": "booking-456",
  "message": "Booking confirmed successfully",
  "confirmationDetails": {
    "date": "2026-03-15",
    "time": "14:00",
    "counselor": "Ms. Sarah Johnson",
    "duration": 30
  }
}
```

**Firestore Structure:**
```
users/{userId}/counsellorBookings/{bookingId}
├── counselorId: string
├── counselorName: string
├── counselorEmail: string
├── bookingDate: string (YYYY-MM-DD)
├── bookingTime: string (HH:MM)
├── duration: number
├── topic: string
├── notes: string
├── status: "pending" | "confirmed" | "completed" | "cancelled"
├── meetingLink?: string
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

#### GET /api/counselor-booking?userId={userId}
Get all bookings for a user.

**Response:**
```json
{
  "total": 2,
  "bookings": [
    {
      "id": "booking-456",
      "counselorName": "Ms. Sarah Johnson",
      "bookingDate": "2026-03-15",
      "bookingTime": "14:00",
      "status": "confirmed",
      "topic": "College Selection"
    }
  ]
}
```

#### GET /api/counselor-booking?userId={userId}&bookingId={bookingId}
Get a specific booking.

#### PATCH /api/counselor-booking
Update a booking.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "bookingId": "booking-456",
  "bookingDate": "2026-03-16",
  "bookingTime": "15:00",
  "status": "confirmed"
}
```

#### DELETE /api/counselor-booking
Cancel a booking.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "bookingId": "booking-456"
}
```

---

### 3. JOURNEY TRACKING ENDPOINTS

#### POST /api/journey/event
Record a student journey event.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "eventType": "school_saved",
  "title": "Saved Delhi Public School",
  "description": "User saved DPS to their list",
  "metadata": {
    "schoolId": "school-123",
    "schoolName": "Delhi Public School"
  }
}
```

**Event Types:**
- `quiz_started` - User started a recommendation quiz
- `quiz_completed` - User completed a quiz
- `school_viewed` - User viewed school details
- `school_saved` - User saved a school
- `application_started` - User started an application
- `application_submitted` - User submitted an application

**Response (201):**
```json
{
  "success": true,
  "eventId": "event-789",
  "message": "Journey event recorded"
}
```

---

#### GET /api/journey?userId={userId}
Get complete journey timeline.

**Response:**
```json
{
  "userId": "firebase-user-id",
  "totalEvents": 12,
  "events": [
    {
      "id": "event-789",
      "eventType": "application_submitted",
      "title": "Submitted application",
      "description": "Applied to Delhi Public School",
      "createdAt": "2026-02-20T10:30:00Z"
    }
  ],
  "progress": {
    "completedSteps": ["quiz_completed", "school_saved", "application_submitted"],
    "totalStepTypes": 3
  },
  "timeline": {
    "today": [...],
    "week": [...],
    "month": [...],
    "older": [...]
  }
}
```

---

#### PATCH /api/journey
Update journey progress.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "currentStep": 3,
  "totalSteps": 5,
  "completedSteps": ["school_search", "school_comparison", "application"]
}
```

---

### 4. USER PREFERENCES ENDPOINTS

#### POST /api/user/preferences
Create/initialize user preferences.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "displayName": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9999999999",
  "location": "Delhi",
  "schoolPreferences": {
    "preferredBoards": ["CBSE", "ICSE"],
    "preferredCurriculums": ["Science", "Commerce"],
    "feeRanges": ["5-10L", "10-15L"],
    "schoolTypes": ["Private", "Semi-Private"]
  },
  "notifications": {
    "emailNotifications": true,
    "smsNotifications": true,
    "schoolUpdates": true
  },
  "privacy": {
    "profileVisibility": "private",
    "allowDataSharing": false
  },
  "language": "en",
  "theme": "light"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Preferences saved successfully",
  "preferences": {...}
}
```

**Firestore Structure:**
```
users/{userId}
├── displayName: string
├── email: string
├── phone: string
├── location: string
├── schoolPreferences: {...}
├── notifications: {...}
├── privacy: {...}
├── language: string
├── theme: "light" | "dark"
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

#### GET /api/user/preferences?userId={userId}
Get user preferences.

#### PATCH /api/user/preferences
Update user preferences.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "theme": "dark",
  "language": "hi"
}
```

---

## 🔄 Data Flow

```
Client Component
     ↓
API Endpoint (Next.js)
     ↓
Firebase Auth Check
     ↓
Firestore CRUD
     ↓
Response to Client
```

---

## ⚠️ Status Codes

| Code | Meaning |
|------|---------|
| 201 | Created successfully |
| 200 | Ok / Success |
| 400 | Bad request (missing/invalid fields) |
| 401 | Unauthorized (not authenticated) |
| 404 | Not found |
| 500 | Server error |

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Create application
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "user-123",
    "parentProfile": {...},
    "studentDetails": {...},
    "documents": [],
    "selectedSchools": [...]
  }'

# Get journey
curl -X GET "http://localhost:3000/api/journey?userId=user-123"

# Update preferences
curl -X PATCH http://localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "theme": "dark"
  }'
```

### Using Fetch (JavaScript)

```typescript
// Create application
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: 'user-123',
    parentProfile: {...},
    ...
  })
})

const data = await response.json()
console.log('Application ID:', data.applicationId)
```

---

## 📊 Firestore Collection Structure

```
Firestore/
├── users/
│   └── {userId}/
│       ├── (profile data)
│       ├── applications/
│       │   └── {applicationId}
│       │       ├── parentProfile, studentDetails, etc.
│       ├── counsellorBookings/
│       │   └── {bookingId}
│       │       ├── counselorName, date, time, etc.
│       ├── journeyEvents/
│       │   └── {eventId}
│       │       ├── eventType, title, metadata
│       ├── journeyProgress/
│       │   └── current
│       │       ├── currentStep, completedSteps
│       └── savedSchools/
│           └── {schoolId}
│               ├── schoolName, location, etc.
```

---

## 🔒 Security Rules

All endpoints are protected by Firestore Security Rules:

```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
  
  match /applications/{appId} {
    allow read, write: if request.auth.uid == userId;
  }
  
  match /counsellorBookings/{bookingId} {
    allow read, write: if request.auth.uid == userId;
  }
  
  match /journeyEvents/{eventId} {
    allow read, write: if request.auth.uid == userId;
  }
  
  match /savedSchools/{schoolId} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

---

## 📞 Error Handling

All endpoints return error details:

```json
{
  "error": "Failed to create booking",
  "details": "..." // additional info in logs
}
```

Check browser console or server logs for detailed error messages.

---

**Last Updated**: February 20, 2026  
**All Endpoints**: Firebase Firestore ✅
