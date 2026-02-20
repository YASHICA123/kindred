# Firebase Firestore Migration Guide

## 🎯 Overview

All localhost data storage has been migrated to **Firebase Firestore**. This ensures:
- ✅ Persistent data across browser sessions
- ✅ Sync across multiple devices
- ✅ Backup and recovery
- ✅ No localStorage limitations

## 📊 What Was Migrated

### 1. **Search Enquiries** (Previously: localStorage)
- **Before**: Stored in `localStorage` as `'lastEnquiry'`
- **After**: Stored in Firestore at `users/{userId}/enquiries/`
- **File Updated**: [components/smart-search-dialog.tsx](../components/smart-search-dialog.tsx)
- **Data Structure**:
  ```
  users/
  ├── {userId}/
      └── enquiries/
          └── {enquiryId}
              ├── city: string
              ├── class: string
              ├── board: string
              ├── feeRange: string
              ├── searchMode: string
              ├── timestamp: string
              ├── createdAt: Timestamp
              └── updatedAt: Timestamp
  ```

### 2. **Saved Schools** (Previously: localStorage)
- **Before**: Stored in `localStorage` as `'savedSchools'`
- **After**: Stored in Firestore at `users/{userId}/savedSchools/`
- **Files Updated**:
  - [components/journey/journey-results.tsx](../components/journey/journey-results.tsx)
  - [hooks/use-saved-schools.tsx](../hooks/use-saved-schools.tsx)
- **Data Structure**:
  ```
  users/
  ├── {userId}/
      └── savedSchools/
          └── {schoolId}
              ├── schoolId: string
              ├── schoolName: string
              ├── schoolImage: string
              ├── schoolLocation: string
              ├── schoolCity: string
              ├── schoolState: string
              ├── notes: string
              ├── savedAt: Timestamp
              ├── createdAt: Timestamp
              └── updatedAt: Timestamp
  ```

### 3. **Application Forms** (Previously: React State only)
- **Before**: Only stored in React context (lost on refresh)
- **After**: Automatically saved to Firestore with draft functionality
- **Files Updated**: [hooks/use-application-form.tsx](../hooks/use-application-form.tsx)
- **Data Structure**:
  ```
  users/
  ├── {userId}/
      └── applications/
          └── {applicationId}
              ├── currentStep: number
              ├── parentProfile: {object}
              ├── studentDetails: {object}
              ├── documents: [{object}]
              ├── selectedSchools: [{object}]
              ├── isSubmitting: boolean
              ├── submissionError: string
              ├── submittedApplicationId: string
              ├── createdAt: Timestamp
              └── updatedAt: Timestamp
  ```

## 🔧 Setup Instructions

### Step 1: Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (kindred-c52ce)
3. Navigate to **Firestore Database** in left sidebar
4. Click **Create Database**
5. Choose **Start in production mode**
6. Select region (recommended: us-central1)
7. Click **Create**

### Step 2: Set Firestore Security Rules

Replace the default security rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Enquiries subcollection
      match /enquiries/{enquiryId} {
        allow read, write: if request.auth.uid == userId;
      }
      
      // Saved Schools subcollection
      match /savedSchools/{schoolId} {
        allow read, write: if request.auth.uid == userId;
      }
      
      // Applications subcollection
      match /applications/{applicationId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

**Steps to apply:**
1. In Firebase Console → Firestore → **Rules** tab
2. Replace all content with the above code
3. Click **Publish**

### Step 3: Verify Firestore Integration

Test in your Next.js app:

```typescript
// In a component
import { getSavedSchools } from '@/lib/firebase-data'

// This will fetch from Firestore
const savedSchools = await getSavedSchools()
console.log('Saved schools from Firestore:', savedSchools)
```

## 📝 How to Use

### Saving an Enquiry
```typescript
import { saveEnquiry } from '@/lib/firebase-data'

await saveEnquiry({
  city: 'Delhi NCR',
  class: 'Grade 10',
  board: 'CBSE',
  feeRange: '₹5L - ₹10L',
  searchMode: 'smart-search',
  timestamp: new Date().toISOString()
})
```

### Getting Last Enquiry
```typescript
import { getLastEnquiry } from '@/lib/firebase-data'

const lastEnquiry = await getLastEnquiry()
if (lastEnquiry) {
  console.log('Last search was in:', lastEnquiry.city)
}
```

### Saving a School
```typescript
import { saveSchool } from '@/lib/firebase-data'

await saveSchool({
  schoolId: '123',
  schoolName: 'Delhi Public School',
  schoolImage: 'https://...',
  schoolLocation: 'Delhi NCR',
  schoolCity: 'Delhi',
  schoolState: 'Delhi',
  notes: 'Great STEM program'
})
```

### Getting Saved Schools
```typescript
import { getSavedSchools } from '@/lib/firebase-data'

const schools = await getSavedSchools()
schools.forEach(school => {
  console.log(`${school.schoolName} - Saved at ${school.savedAt}`)
})
```

### Saving Application Form
```typescript
import { saveApplicationForm } from '@/lib/firebase-data'

await saveApplicationForm({
  userId: auth.currentUser.uid,
  currentStep: 2,
  parentProfile: { /* ... */ },
  studentDetails: { /* ... */ },
  documents: [],
  selectedSchools: [],
})
```

### Saving Application Draft (Auto-save)
```typescript
// In use-application-form hook
const { saveDraft } = useApplicationForm()

// Called automatically on step changes
await saveDraft()
```

## 🔄 Migration from localStorage

The system maintains **backward compatibility**:
1. All new data is saved to Firestore first
2. If Firestore fails, falls back to localStorage
3. On page load, fetches from Firestore first
4. If Firestore is empty, checks localStorage

## 📊 Data Flow

```
Component User Action
         ↓
Firebase Auth Check
         ↓
Firestore Save/Update
         ↓
localStorage (Fallback)
         ↓
Update React State
         ↓
Re-render UI
```

## ✅ Verification Checklist

- [ ] Firestore Database created in Firebase Console
- [ ] Security Rules applied
- [ ] Users can log in with Firebase Auth
- [ ] Can view Firestore data in Firebase Console
- [ ] Saving schools shows data in Firestore
- [ ] Application form saves drafts to Firestore
- [ ] Data persists across page refreshes
- [ ] Works offline (React state) and syncs when online

## 🐛 Troubleshooting

### "Permission denied" errors
**Solution**: Check Firestore Security Rules and ensure you're logged in

### Data not appearing in Firestore
**Solution**: 
1. Check browser console for auth errors
2. Verify user is authenticated (`auth.currentUser` exists)
3. Check Firestore Rules tab in Firebase Console

### Slow data loading
**Solution**: 
1. Consider adding Firestore indexes
2. Cache frequently accessed data in React context
3. Use pagination for large lists

### Data lost on logout
**This is expected behavior** - Firestore only stores data for authenticated users. To keep data:
1. Implement "Remember my choices" feature
2. Store anonymously if needed (advanced)

## 📚 Files Modified

1. **Created**: [lib/firebase-data.ts](../lib/firebase-data.ts) - Main Firestore service
2. **Updated**: [components/smart-search-dialog.tsx](../components/smart-search-dialog.tsx) - Enquiries
3. **Updated**: [components/journey/journey-results.tsx](../components/journey/journey-results.tsx) - Saved schools
4. **Updated**: [hooks/use-saved-schools.tsx](../hooks/use-saved-schools.tsx) - Saved schools provider
5. **Updated**: [hooks/use-application-form.tsx](../hooks/use-application-form.tsx) - Application forms with draft save

## 🎓 Next Steps

1. **Enable Firestore Persistence** (optional):
   ```typescript
   // In lib/firebase.ts
   import { enableIndexedDbPersistence } from 'firebase/firestore'
   
   enableIndexedDbPersistence(db).catch((err) => {
     if (err.code == 'failed-precondition') {
       // Multiple tabs open
     } else if (err.code == 'unimplemented') {
         // Browser doesn't support persistence
     }
   })
   ```

2. **Add Real-time Listeners** (optional):
   ```typescript
   // Listen to saved schools changes in real-time
   const unsubscribe = onSnapshot(
     collection(db, 'users', userId, 'savedSchools'),
     (snapshot) => {
       const schools = snapshot.docs.map(doc => doc.data())
       // Update UI with real-time changes
     }
   )
   ```

3. **Implement Offline Support**:
   - Use `enableIndexedDbPersistence()` for offline caching
   - Implement sync queue for offline changes

---

**Status**: ✅ All localhost data migrated to Firebase Firestore
**Last Updated**: February 20, 2026
