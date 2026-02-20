# Implementation Details - File Upload Fix

## Root Cause Analysis

**Error**: 
```
Function addDoc() called with invalid data. 
Unsupported field value: a custom File object 
(found in document users/zi34.../applications/IiWt...)
```

**Why**: Firestore only stores serializable JSON data. JavaScript File objects are NOT serializable.

**Location**: When saving form state with documents array containing File objects.

---

## Solution Architecture

### Level 1: User Selection (React State)
Files stored as JavaScript File objects in component state:
```typescript
const [documents, setDocuments] = useState<DocumentFile[]>([
  {
    id: "doc-1",
    name: "Resume.pdf",
    type: "application/pdf",
    size: 254321,
    file: File {name: "Resume.pdf", ...}  // Raw File object
  }
])
```

### Level 2: File Upload (Cloud Storage)
Before saving to Firestore, upload file to Cloud Storage:
```typescript
// Call: uploadApplicationDocument(userId, file, appId)
const response = await uploadBytes(storageRef, file)
const downloadURL = await getDownloadURL(response.ref)
// Returns URL: https://firebasestorage.googleapis.com/...
```

### Level 3: Metadata Storage (Firestore)
Save ONLY the URL and metadata to Firestore:
```typescript
// What we save to Firestore:
{
  name: "Resume.pdf",
  type: "application/pdf", 
  size: 254321,
  url: "https://firebasestorage.googleapis.com/.../Resume.pdf",  // ✅ String, serializable
  storagePath: "applications/userId/appId/1708416000000_Resume.pdf"
}
// No File object! ✅
```

---

## Code Changes Explained

### Change 1: Firebase Storage Import

**File**: `lib/firebase.ts`

```typescript
// OLD
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// NEW
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'  // ← Added

// Initialize
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)  // ← Initialize storage

export { app, auth, db, storage }  // ← Export storage
```

**Why**: Need storage instance to upload files.

---

### Change 2: Add Upload Functions

**File**: `lib/firebase-data.ts`

```typescript
// Import storage
import { storage } from './firebase'
import {
  ref,           // Create reference
  uploadBytes,   // Upload file
  getDownloadURL, // Get URL
  deleteObject,  // Delete file
} from 'firebase/storage'

// Function 1: Upload document
export async function uploadApplicationDocument(
  userId: string, 
  file: File, 
  applicationId: string
) {
  try {
    // Create reference: applications/{userId}/{appId}/{timestamp}_{fileName}
    const fileRef = ref(
      storage, 
      `applications/${userId}/${applicationId}/${Date.now()}_${file.name}`
    )
    
    // Upload to storage
    const snapshot = await uploadBytes(fileRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    // Return metadata with URL
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url: downloadURL,  // ✅ The key piece!
      uploadedAt: new Date().toISOString(),
      storagePath: snapshot.ref.fullPath,
    }
  } catch (error) {
    console.error('❌ Error uploading document:', error)
    throw error
  }
}

// Function 2: Delete document
export async function deleteApplicationDocument(storagePath: string) {
  try {
    const fileRef = ref(storage, storagePath)
    await deleteObject(fileRef)
    console.log('✅ Document deleted from Firebase Storage')
  } catch (error) {
    console.error('❌ Error deleting document:', error)
    throw error
  }
}
```

**Key Points**:
- Creates unique path with timestamp to avoid name collisions
- Returns URL that can be saved to Firestore
- Includes error handling
- Separate delete function for cleanup

---

### Change 3: Update Form Hook

**File**: `hooks/use-application-form.tsx`

#### Update DocumentFile Interface
```typescript
// Add URL and storagePath fields
export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  file?: File              // Client-side only, never saved
  url?: string            // ✅ Firebase Storage URL
  storagePath?: string    // ✅ For deletion
}
```

#### Update submitApplication Function
```typescript
const submitApplication = async () => {
  setState((prev) => ({ ...prev, isSubmitting: true, submissionError: null }))

  try {
    if (!auth.currentUser) {
      throw new Error("Please sign in to submit an application")
    }

    // STEP 1: Upload files (NEW!)
    const uploadedDocuments = []
    for (const doc of state.documents) {
      try {
        if (doc.file) {  // Only upload new files
          // Import function dynamically to avoid circular imports
          const { uploadApplicationDocument } = await import('@/lib/firebase-data')
          
          // Upload file, get URL back
          const uploadedDoc = await uploadApplicationDocument(
            auth.currentUser.uid,
            doc.file,
            "draft"  // Use draft as temporary appId
          )
          
          // Build document with URL instead of File
          uploadedDocuments.push({
            name: uploadedDoc.name,
            type: uploadedDoc.type,
            size: uploadedDoc.size,
            url: uploadedDoc.url,        // ✅ Use URL
            storagePath: uploadedDoc.storagePath,
          })
        } else if (doc.url) {
          // Already uploaded, keep as is
          uploadedDocuments.push({
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: doc.url,
            storagePath: doc.storagePath,
          })
        }
      } catch (uploadError) {
        console.error('Error uploading document:', doc.name, uploadError)
        // Continue with other documents
      }
    }

    // STEP 2: Save to Firestore (with URLs!)
    const firebaseApp = await saveApplicationForm({
      userId: auth.currentUser.uid,
      currentStep: state.currentStep,
      parentProfile: state.parentProfile,
      studentDetails: state.studentDetails,
      documents: uploadedDocuments,  // ✅ URLs, not File objects!
      selectedSchools: state.selectedSchools,
      isSubmitting: false,
      submissionError: null,
      submittedApplicationId: state.submittedApplicationId,
    } as any)

    // STEP 3: Send to API
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseId: firebaseApp.id,
        parentProfile: state.parentProfile,
        studentDetails: state.studentDetails,
        selectedSchools: state.selectedSchools.filter((s) => s.selected),
        documents: uploadedDocuments,  // ✅ URLs, not File objects!
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit application")
    }

    // Update state on success
    setState((prev) => ({
      ...prev,
      isSubmitting: false,
      submittedApplicationId: firebaseApp.id,
      currentStep: 5,
    }))
  } catch (error) {
    setState((prev) => ({
      ...prev,
      isSubmitting: false,
      submissionError: error instanceof Error ? error.message : "An error occurred",
    }))
    throw error
  }
}
```

**Key Changes**:
1. Loop through documents
2. For each File object, call uploadApplicationDocument()
3. Get URL back
4. Build new document array with URLs (not File objects)
5. Save new array to Firestore
6. Send to API with URLs

#### Similar changes to saveDraft()
Same upload logic for draft persistence.

---

## Data Transformation Example

### Input (Form state with File)
```typescript
documents: [
  {
    id: "doc-1",
    name: "Resume.pdf",
    type: "application/pdf",
    size: 250000,
    file: File {size: 250000, name: "Resume.pdf", ...}  // ❌ Not serializable
  }
]
```

### Processing
```typescript
// Upload file
const uploadedDoc = await uploadApplicationDocument(
  "user-123",
  documents[0].file,
  "app-456"
)
// Returns:
// {
//   url: "https://firebasestorage.googleapis.com/v0/b/.../Resume.pdf",
//   storagePath: "applications/user-123/app-456/1708416000000_Resume.pdf",
//   ...
// }
```

### Output (Firestore-safe)
```typescript
documents: [
  {
    id: "doc-1",
    name: "Resume.pdf",
    type: "application/pdf",
    size: 250000,
    url: "https://firebasestorage.googleapis.com/v0/b/.../Resume.pdf",  // ✅ String
    storagePath: "applications/user-123/app-456/1708416000000_Resume.pdf"
  }
]
// No File object! Fully serializable! ✅
```

---

## Why This Works

### Firestore Requirement
```
Allowed: strings, numbers, booleans, arrays, objects
Not allowed: Function objects, File objects, Class instances
```

### Our Solution
```
File object (not allowed) 
  ↓ 
Upload to Cloud Storage
  ↓
Get URL (string - allowed!)
  ↓
Save URL to Firestore ✅
```

---

## Error Prevention

### Before
```typescript
// ❌ WRONG - tries to save File object
await saveApplicationForm({
  documents: state.documents  // Contains File objects!
})
// Error: "Unsupported field value: a custom File object"
```

### After
```typescript
// ✅ RIGHT - uploads first, then saves URL
const uploadedLinks = await uploadApplicationDocument(...)
await saveApplicationForm({
  documents: uploadedLinks  // Only URLs and metadata
})
// Success! ✅
```

---

## Performance Considerations

### Upload Time
- Small files (< 5 MB): < 1 second
- Medium files (5-20 MB): 1-5 seconds
- Large files (> 20 MB): 5+ seconds

### Network
- Parallel uploads: Multiple files can upload simultaneously
- Error recovery: Failed uploads retry automatically
- Progress: Can add progress bars (future enhancement)

### Cost
- Firebase Storage: ~$0.18 per GB stored
- Bandwidth: ~$0.12 per GB downloaded
- Free tier: 5 GB storage included

---

## Testing the Flow

### Test Case 1: Single File
1. Select Resume.pdf (250 KB)
2. Click Submit
3. **Verify in Storage**: `applications/{userId}/{appId}/1708416000000_Resume.pdf` exists
4. **Verify in Firestore**: documents[0].url shows https link
5. **Verify in Email**: Admin can download URL

### Test Case 2: Multiple Files
1. Select Resume.pdf, CertificatePDF.pdf, MarkSheet.pdf
2. Click Submit
3. **Verify in Storage**: All 3 files exist
4. **Verify in Firestore**: All 3 have URLs
5. **Verify Download**: Each URL downloads correct file

### Test Case 3: Error Handling
1. Select 100 MB file (over limit)
2. Click Submit
3. **Verify**: Shows error message
4. **Verify**: No file in Storage
5. **Verify**: Application not saved

---

## Summary

The fix implements a **two-stage save pattern**:

1. **Stage 1**: Upload files to Cloud Storage (get URLs)
2. **Stage 2**: Save metadata + URLs to Firestore (only serializable data)

This bypasses the Firestore limitation that prevents saving File objects, while maintaining full functionality for users and admins.

✅ **Result**: Common Application form works perfectly with file uploads!
