# Complete Application Form Fix - Quick Reference

## Problem
```
Error: Function addDoc() called with invalid data. 
Unsupported field value: a custom File object
```
When submitting Common Application form with uploaded documents.

## Solution
Files are now uploaded to **Firebase Cloud Storage** with URLs saved to Firestore.

## Files Changed (3 files)

### 1. `/lib/firebase.ts`
```diff
+ import { getStorage } from 'firebase/storage'
+ const storage = getStorage(app)
- export { app, auth, db }
+ export { app, auth, db, storage }
```

### 2. `/lib/firebase-data.ts`
```typescript
// Added file upload functions
export async function uploadApplicationDocument(userId, file, applicationId)
export async function deleteApplicationDocument(storagePath)

// Updated export to include:
export default {
  uploadApplicationDocument,
  deleteApplicationDocument,
  ...otherFunctions
}
```

### 3. `/hooks/use-application-form.tsx`
```typescript
// Updated DocumentFile interface
export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  file?: File              // Client-side
  url?: string            // ✅ NEW
  storagePath?: string    // ✅ NEW
}

// Updated submitApplication():
// - Upload files first
// - Get URLs
// - Save URLs to Firestore (not File objects)

// Updated saveDraft():
// - Same logic for draft files
```

## Data Flow After Fix

```
User selects file
         ↓
React state (client-side only)
         ↓
User clicks Submit
         ↓
uploadApplicationDocument(file)
         ↓
Upload to Cloud Storage: applications/{userId}/{appId}/
         ↓
Get download URL
         ↓
Save to Firestore: url: "https://..."
         ↓
✅ SUCCESS!
```

## Firebase Structure

### Cloud Storage
```
applications/
  {userId}/
    {applicationId}/
      1708416000000_document.pdf
```

### Firestore
```
users/{userId}/applications/{appId}
  documents: [
    {
      name: "document.pdf",
      type: "application/pdf",
      size: 250000,
      url: "https://firebasestorage.googleapis.com/.../...",
      storagePath: "applications/userId/appId/1708416000000_..."
    }
  ]
```

## Firebase Rules to Apply

### Cloud Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /applications/{userId}/{applicationId}/{fileName=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Firestore Rules
```javascript
match /users/{userId}/applications/{document=**} {
  allow read, write: if request.auth.uid == userId;
}
```

## Testing

### Local (npm run dev)
- ✅ Go to `/common-application`
- ✅ Upload PDF/DOCX
- ✅ Submit application
- ✅ Check Firebase Console → Storage → see file
- ✅ Check Firebase Console → Firestore → see URL

### Production (after git push)
- ✅ Same steps on production domain
- ✅ Verify in production Firebase Console

## Summary

| Before | After |
|--------|-------|
| ❌ File object → Firestore | ✅ URL string → Firestore |
| ❌ Error: "Unsupported field" | ✅ Saves successfully |
| ❌ Files lost | ✅ Files persist in storage |
| ❌ No admin access | ✅ Admin can download |

## Deployment

```bash
# 1. Apply Firebase rules
# → Firebase Console → Storage/Firestore → Publish rules

# 2. Deploy code
git add .
git commit -m "fix: handle file uploads in common application"
git push origin main

# 3. Test on production
# → Go to production domain
# → Upload file
# → Verify in Firebase Console
```

**Status**: ✅ Ready for production!
