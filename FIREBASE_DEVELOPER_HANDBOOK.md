# Firebase Data Service - Developer Handbook

## 🎯 Quick Start

All user data is now stored in Firebase Firestore. Import functions from `lib/firebase-data.ts`:

```typescript
import {
  // Enquiries
  saveEnquiry,
  getLastEnquiry,
  
  // Saved Schools
  saveSchool,
  getSavedSchools,
  removeSavedSchool,
  isSchoolSaved,
  
  // Applications
  saveApplicationForm,
  updateApplicationForm,
  getApplicationForm,
  getUserApplications,
  deleteApplicationForm,
} from '@/lib/firebase-data'
```

---

## 📚 API Reference

### **ENQUIRIES**

#### `saveEnquiry(enquiryData)`
Save a new search enquiry to Firestore.

**Parameters:**
```typescript
{
  city: string
  class: string
  board?: string
  feeRange?: string
  schoolType?: string
  searchMode: string
  timestamp: string
}
```

**Example:**
```typescript
const enquiry = await saveEnquiry({
  city: 'Delhi NCR',
  class: 'Grade 10',
  board: 'CBSE',
  feeRange: '₹5L - ₹10L',
  searchMode: 'smart-search',
  timestamp: new Date().toISOString()
})
console.log('Saved enquiry:', enquiry.id)
```

**Returns:** `EnquiryData | null`

---

#### `getLastEnquiry()`
Fetch the user's most recent enquiry.

**Example:**
```typescript
const lastEnquiry = await getLastEnquiry()
if (lastEnquiry) {
  console.log(`Last searched in: ${lastEnquiry.city}`)
  // Pre-fill form with last search
  setSelectedCity(lastEnquiry.city)
}
```

**Returns:** `EnquiryData | null`

---

### **SAVED SCHOOLS**

#### `saveSchool(schoolData)`
Add a school to user's saved list.

**Parameters:**
```typescript
{
  schoolId: string
  schoolName: string
  schoolImage?: string
  schoolLocation?: string
  schoolCity?: string
  schoolState?: string
  notes?: string
}
```

**Example:**
```typescript
await saveSchool({
  schoolId: '123',
  schoolName: 'Delhi Public School',
  schoolImage: '/images/dps.jpg',
  schoolLocation: 'Gurgaon',
  schoolCity: 'Gurgaon',
  schoolState: 'Haryana',
  notes: 'Excellent STEM program'
})
```

**Returns:** `SavedSchoolData | null`

---

#### `getSavedSchools()`
Fetch all saved schools for current user.

**Example:**
```typescript
const savedSchools = await getSavedSchools()
if (savedSchools.length === 0) {
  console.log('No saved schools yet')
  return
}

savedSchools.forEach(school => {
  console.log(`${school.schoolName} - Saved on ${school.savedAt}`)
})
```

**Returns:** `SavedSchoolData[]`

---

#### `removeSavedSchool(schoolId)`
Remove a school from saved list.

**Example:**
```typescript
await removeSavedSchool('123')
console.log('School removed from saved')
```

**Returns:** `void`

---

#### `isSchoolSaved(schoolId)`
Check if a school is in user's saved list.

**Example:**
```typescript
const isSaved = await isSchoolSaved('123')
if (isSaved) {
  console.log('This school is saved ❤️')
} else {
  console.log('Not saved yet')
}
```

**Returns:** `Promise<boolean>`

---

### **APPLICATIONS**

#### `saveApplicationForm(formData)`
Save a new application form (creates draft).

**Parameters:**
```typescript
{
  userId: string
  currentStep: number
  parentProfile: ParentProfile
  studentDetails: StudentDetails
  documents: DocumentFile[]
  selectedSchools: SchoolSelection[]
  isSubmitting?: boolean
  submissionError?: string
  submittedApplicationId?: string
}
```

**Example:**
```typescript
const app = await saveApplicationForm({
  userId: auth.currentUser.uid,
  currentStep: 1,
  parentProfile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    // ... other fields
  },
  studentDetails: {
    firstName: 'Jane',
    lastName: 'Doe',
    // ... other fields
  },
  documents: [],
  selectedSchools: [],
})

console.log('Application saved as draft:', app.id)
```

**Returns:** `ApplicationFormData | null`

---

#### `updateApplicationForm(applicationId, formData)`
Update an existing application draft.

**Example:**
```typescript
await updateApplicationForm(applicationId, {
  currentStep: 2,
  parentProfile: updatedProfile,
})
console.log('Draft updated')
```

**Returns:** `void`

---

#### `getApplicationForm(applicationId)`
Fetch a specific application form.

**Example:**
```typescript
const app = await getApplicationForm(applicationId)
if (app) {
  console.log(`Application step: ${app.currentStep}`)
  // Pre-fill form with saved data
  setParentProfile(app.parentProfile)
}
```

**Returns:** `ApplicationFormData | null`

---

#### `getUserApplications()`
Fetch all applications for current user.

**Example:**
```typescript
const applications = await getUserApplications()
console.log(`You have ${applications.length} applications`)

applications.forEach(app => {
  console.log(`- Application Step ${app.currentStep}`)
})
```

**Returns:** `ApplicationFormData[]`

---

#### `deleteApplicationForm(applicationId)`
Delete an application.

**Example:**
```typescript
await deleteApplicationForm(applicationId)
console.log('Application deleted')
```

**Returns:** `void`

---

## 💡 Common Patterns

### Pattern 1: Auto-save Form Draft

```typescript
// In your form component
import { useApplicationForm } from '@/hooks/use-application-form'

export function ApplicationForm() {
  const { state, saveDraft, setParentProfile } = useApplicationForm()

  const handleProfileChange = async (profile) => {
    setParentProfile(profile)
    // Auto-save after each change
    await saveDraft()
  }

  return (
    <form>
      {/* form fields */}
      <input onChange={(e) => handleProfileChange({...})} />
    </form>
  )
}
```

### Pattern 2: Load Saved Schools on Mount

```typescript
// In your saved schools component
import { getSavedSchools } from '@/lib/firebase-data'
import { useEffect, useState } from 'react'

export function SavedSchools() {
  const [schools, setSchools] = useState([])

  useEffect(() => {
    const loadSchools = async () => {
      const saved = await getSavedSchools()
      setSchools(saved)
    }

    loadSchools()
  }, [])

  return (
    <div>
      {schools.map(school => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  )
}
```

### Pattern 3: Toggle Save with Loading State

```typescript
import { saveSchool, removeSavedSchool, isSchoolSaved } from '@/lib/firebase-data'
import { useState } from 'react'

export function SaveSchoolButton({ schoolId, schoolName }) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleSave = async () => {
    setLoading(true)
    try {
      if (isSaved) {
        await removeSavedSchool(schoolId)
        setIsSaved(false)
      } else {
        await saveSchool({
          schoolId,
          schoolName,
        })
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update saved schools')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleToggleSave} disabled={loading}>
      {isSaved ? '❤️ Saved' : '🤍 Save'}
    </button>
  )
}
```

### Pattern 4: Handle Errors Gracefully

```typescript
import { getSavedSchools } from '@/lib/firebase-data'
import { useState, useEffect } from 'react'

export function SavedSchoolsList() {
  const [schools, setSchools] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const saved = await getSavedSchools()
        setSchools(saved)
      } catch (err) {
        setError('Failed to load saved schools')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (error) return <div className="error">{error}</div>
  if (loading) return <div>Loading...</div>
  if (schools.length === 0) return <div>No saved schools</div>

  return (
    <div>
      {schools.map(school => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  )
}
```

---

## 🔐 Authentication

All functions require an authenticated user. Check before calling:

```typescript
import { auth } from '@/lib/firebase'

// Check if user is logged in
if (!auth.currentUser) {
  alert('Please sign in first')
  return
}

// Get current user's ID
const userId = auth.currentUser.uid

// Make the call
await saveSchool({ schoolId: '123', schoolName: 'Test School' })
```

---

## 🚨 Error Handling

All functions throw errors on failure. Always wrap in try-catch:

```typescript
try {
  await saveEnquiry({ /* ... */ })
} catch (error) {
  if (error.message.includes('not authenticated')) {
    // Redirect to login
    router.push('/login')
  } else if (error.message.includes('permission')) {
    // Show permission error
    alert('You do not have permission')
  } else {
    // Generic error
    console.error(error)
  }
}
```

---

## 📱 Usage in Hooks

### Custom Hook Example

```typescript
// hooks/useFirebaseData.ts
import { useState, useEffect } from 'react'
import { getSavedSchools, saveSchool, removeSavedSchool } from '@/lib/firebase-data'

export function useFirebaseData() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    try {
      setLoading(true)
      const data = await getSavedSchools()
      setSchools(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addSchool = async (school) => {
    await saveSchool(school)
    await loadSchools() // Refresh list
  }

  const removeSchool = async (schoolId) => {
    await removeSavedSchool(schoolId)
    await loadSchools() // Refresh list
  }

  return { schools, loading, error, addSchool, removeSchool }
}
```

---

## 🧪 Testing

```typescript
// __tests__/firebase-data.test.ts
import { saveEnquiry, getLastEnquiry } from '@/lib/firebase-data'
import { auth } from '@/lib/firebase'

describe('Firebase Data Service', () => {
  it('should save and retrieve enquiry', async () => {
    // Note: Requires Firebase emulator or real auth
    const enquiry = await saveEnquiry({
      city: 'Delhi',
      class: 'Grade 10',
      searchMode: 'test',
      timestamp: new Date().toISOString(),
    })

    expect(enquiry.id).toBeDefined()

    const last = await getLastEnquiry()
    expect(last.city).toBe('Delhi')
  })
})
```

---

## 🔗 Related Files

- **Service**: [lib/firebase-data.ts](./lib/firebase-data.ts)
- **Auth Setup**: [lib/firebase.ts](./lib/firebase.ts)
- **Hooks Using This**: [hooks/use-saved-schools.tsx](./hooks/use-saved-schools.tsx)
- **Components Using This**: 
  - [components/smart-search-dialog.tsx](./components/smart-search-dialog.tsx)
  - [components/journey/journey-results.tsx](./components/journey/journey-results.tsx)

---

## ❓ FAQ

**Q: What if Firestore fails?**  
A: Most components have fallbacks to localStorage. The system gracefully degrades.

**Q: Can I use this offline?**  
A: Currently, no. To support offline, enable Firestore persistence in `lib/firebase.ts`

**Q: How do I see the data?**  
A: Go to Firebase Console → Firestore → Collection browser to view live data

**Q: Can I delete all user data?**  
A: Yes, delete the user document in Firestore Console or use API

**Q: Is the data encrypted?**  
A: Yes, transit is encrypted by default. Enable encryption at rest in Firebase Console.

---

**Last Updated**: February 20, 2026
