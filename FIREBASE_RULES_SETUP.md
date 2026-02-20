# Firebase Rules Configuration for File Uploads

## Cloud Storage Rules

Apply these rules so file uploads work correctly:

### Step 1: Open Firebase Console
1. Go to https://firebase.google.com/
2. Click "Go to Console"
3. Select "kindred-c52ce" project

### Step 2: Navigate to Storage Rules
1. Left sidebar → "Storage"
2. Click "Rules" tab at top

### Step 3: Replace Rules

**Delete existing rules** and paste:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // User's own application documents
    match /applications/{userId}/{applicationId}/{fileName=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Step 4: Publish
Click "Publish" button

---

## Firestore Rules

Update Firestore rules to allow applications with documents:

### Step 1: Navigate to Firestore Rules
1. Left sidebar → "Firestore Database"
2. Click "Rules" tab

### Step 2: Update Applications Rules

Find this section:
```javascript
match /users/{userId}/applications/{document=**} {
  allow read, write: if request.auth.uid == userId;
}
```

**Ensure it looks like this:**
```javascript
match /users/{userId}/applications/{applicationId} {
  allow read, write: if request.auth.uid == userId;
  
  // Allow reading application drafts
  match /{document=**} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

### Step 3: Publish
Click "Publish" button

---

## Complete Firestore Rules

Here's the complete recommended rules file:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // User-scoped collections - strict privacy
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // All user subcollections
      match /{collection}/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Public contact form submissions
    match /contactSubmissions/{document=**} {
      allow create: if true;           // Anyone can submit
      allow read, write: if false;     // Private to backend only
    }
    
    // Public counselling bookings
    match /freeCounsellingBookings/{document=**} {
      allow create: if true;           // Anyone can book
      allow read, write: if false;     // Private to backend only
    }
  }
}
```

---

## Complete Cloud Storage Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Application documents - user can access own files
    match /applications/{userId}/{applicationId}/{fileName=**} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Public files (if any)
    match /public/{fileName=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Verification Steps

After applying rules:

### Test Upload
1. Go to `/common-application` on local (`npm run dev`)
2. Upload a test document
3. Submit application
4. **Should succeed** ✅

### Check Cloud Storage
1. Firebase Console → Storage
2. Should see file in `applications/` folder ✅

### Check Firestore
1. Firebase Console → Firestore Database
2. `users/{yourUserId}/applications/{applicationId}`
3. Documents array should have URL ✅

### Check File Access
1. Copy URL from Firestore document
2. Open in browser
3. Should download file ✅

---

## Common Rule Issues & Fixes

### Issue: "Permission denied" when uploading
**Cause**: Storage rules don't allow write
**Fix**: Check `allow write:` includes your user (`request.auth.uid == userId`)

### Issue: "File saved but can't access from Firestore"
**Cause**: URL not stored
**Fix**: Verify `uploadApplicationDocument()` returns URL

### Issue: "Application saves but no documents"
**Cause**: Documents array empty
**Fix**: Check application form submits uploaded documents

### Issue: "Other users can see my files"
**Cause**: Storage rules not restricting access
**Fix**: Add `{userId}` check - only allow owner to read/write

---

## Testing with curl

Once rules are published, you can test with:

```bash
# Get a valid auth token first (from browser console)
# Then test storage access:

curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://firebasestorage.googleapis.com/v0/b/kindred-c52ce.appspot.com/o/applications%2Fuser-id%2Fapp-id%2Ffile.pdf?alt=media

# Should return file content if authorized ✅
# Should return 401 error if not authorized ✅
```

---

## Mobile/Web Testing

### Web Browser
1. `npm run dev` → http://localhost:3000
2. Go to `/common-application`
3. Upload file → Check rules work ✅

### Production
1. Deploy to Vercel
2. Test on kindred.school (or your domain)
3. Upload file → Verify in Firebase Console ✅

---

## Monitoring Rules

### View Rule Activity
Firebase Console → Storage → Rules → "View Metadata"

Shows:
- Last publish date
- Number of rules
- Validation status

### Debug Permissions
Add logging to rules:

```javascript
match /applications/{userId}/{applicationId}/{fileName=**} {
  allow read, write: if request.auth.uid == userId;
  
  // Debug: log access attempts
  // limit 1 per second per user
}
```

---

## Production Checklist

- [ ] Cloud Storage rules published
- [ ] Firestore rules published
- [ ] Local testing: upload works ✅
- [ ] Firebase Console: files appear ✅
- [ ] Firestore: URLs stored ✅
- [ ] Download: URLs work ✅
- [ ] Production deploy: git push ✅
- [ ] Production testing: verify again ✅

---

## Support

If rules fail to publish:

1. **Syntax error**: Check for typos, missing braces
2. **Invalid region**: Use `{bucket}` - don't hard-code
3. **Auth issue**: Ensure `request.auth` is available (user must be logged in)
4. **Permission denied**: User ID mismatch or rules not published yet

---

## Summary

✅ **Apply Cloud Storage rules** - Allow file uploads
✅ **Apply Firestore rules** - Allow user data
✅ **Test locally** - Verify rules work
✅ **Deploy to production** - Push to Vercel
✅ **Test on production** - Final validation

Common Application form will now work perfectly with file uploads!
