# Firebase Firestore - Quick Reference Card

## 🚀 Features Migrated

| Feature | Old Location | New Location | Status |
|---------|------------|--------------|--------|
| Search Enquiries | localStorage | Firestore | ✅ Done |
| Saved Schools | localStorage | Firestore | ✅ Done |
| Application Drafts | React State | Firestore | ✅ Done |
| User Sessions | Memory | Firebase Auth | ✅ Already Used |

---

## 📦 Import Map

```typescript
// Data Service
import { 
  saveEnquiry, getLastEnquiry,           // Enquiries
  saveSchool, getSavedSchools,           // Schools
  removeSavedSchool, isSchoolSaved,      // School mgmt
  saveApplicationForm, getApplicationForm // Apps
} from '@/lib/firebase-data'

// Authentication
import { auth } from '@/lib/firebase'

// Types
import type { 
  EnquiryData, SavedSchoolData, ApplicationFormData 
} from '@/lib/firebase-data'
```

---

## 🎯 5-Minute Setup

### 1. Enable Firestore
```
Firebase Console → Firestore → Create Database → Production Mode
```

### 2. Set Security Rules
```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
  match /enquiries/{doc=**} { allow read, write: if request.auth.uid == userId; }
  match /savedSchools/{doc=**} { allow read, write: if request.auth.uid == userId; }
  match /applications/{doc=**} { allow read, write: if request.auth.uid == userId; }
}
```

### 3. Deploy
```bash
git push
```

---

## 💬 Common Code Snippets

### Save Data
```typescript
await saveSchool({
  schoolId: '123',
  schoolName: 'School Name',
  schoolLocation: 'City',
})
```

### Load Data
```typescript
const schools = await getSavedSchools()
```

### Check if Saved
```typescript
const saved = await isSchoolSaved('123')
if (saved) { /* show heart icon */ }
```

### Delete Data
```typescript
await removeSavedSchool('123')
```

### Auto-save Draft
```typescript
const { saveDraft } = useApplicationForm()
await saveDraft()  // Saves current form state
```

---

## 🔑 Database Structure

```
Firestore/
├── users/
│   └── {userId}/
│       ├── enquiries/
│       │   └── {enquiryId}
│       │       ├── city, class, board, feeRange
│       │       ├── timestamp, createdAt, updatedAt
│       │
│       ├── savedSchools/
│       │   └── {schoolId}
│       │       ├── schoolName, schoolImage
│       │       ├── schoolLocation, schoolCity, schoolState
│       │       ├── savedAt, createdAt, updatedAt
│       │
│       └── applications/
│           └── {applicationId}
│               ├── currentStep, parentProfile, studentDetails
│               ├── documents, selectedSchools
│               ├── createdAt, updatedAt
```

---

## ⚡ Performance Tips

1. **Index Creation**: Firestore auto-creates indexes for queries
2. **Pagination**: Add `limit(20)` to queries for large lists
3. **Caching**: Cache results in React state to reduce reads
4. **Real-time**: Use `onSnapshot()` for live updates (advanced)

---

## 🧪 Local Testing

```bash
# Start Firebase emulator
firebase emulators:start

# Point app to emulator (in lib/firebase.ts)
connectFirestoreEmulator(db, 'localhost', 8080)
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Permission denied" | Check Firestore Rules, verify user auth |
| "Operation not allowed" | Enable method in Firebase Console |
| "offline" | User not authenticated, check `auth.currentUser` |
| "Quota exceeded" | Upgrade Firebase plan |
| "Data not saving" | Check browser console for errors |

---

## ✅ Pre-Launch Checklist

- [ ] Firestore Database created
- [ ] Security Rules deployed
- [ ] Firebase credentials in `.env.local`
- [ ] Can read/write in Firestore Console
- [ ] Application tested locally
- [ ] Data visible in Firestore Console
- [ ] Offline handling works
- [ ] Error messages are user-friendly
- [ ] Logs don't expose sensitive data
- [ ] Vercel environment variables set

---

## 🔗 Quick Links

- **Code**: [lib/firebase-data.ts](./lib/firebase-data.ts)
- **Guide**: [FIREBASE_FIRESTORE_MIGRATION.md](./FIREBASE_FIRESTORE_MIGRATION.md)
- **Handbook**: [FIREBASE_DEVELOPER_HANDBOOK.md](./FIREBASE_DEVELOPER_HANDBOOK.md)
- **Firebase Console**: https://console.firebase.google.com/
- **Firestore Docs**: https://firebase.google.com/docs/firestore

---

## 💡 Did You Know?

- ✅ Firestore auto-syncs across tabs
- ✅ Can enable offline caching with persistence
- ✅ Real-time listeners update UI automatically
- ✅ Firebase handles all backups automatically
- ✅ Can scale to billions of documents

---

**Ready to deploy?** Follow [FIREBASE_FIRESTORE_MIGRATION.md](./FIREBASE_FIRESTORE_MIGRATION.md)
