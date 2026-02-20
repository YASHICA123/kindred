# Deployment & Testing Checklist ✅

## Pre-Deployment Verification

### Code Changes (3 files)
- [ ] [lib/firebase.ts](lib/firebase.ts) - Storage import added ✓
- [ ] [lib/firebase-data.ts](lib/firebase-data.ts) - Upload functions added ✓
- [ ] [hooks/use-application-form.tsx](hooks/use-application-form.tsx) - Form logic updated ✓

### Documentation Created
- [ ] COMMON_APPLICATION_FIX.md - Overview of fix
- [ ] FILE_UPLOAD_FIX_SUMMARY.md - Summary and benefits
- [ ] FIREBASE_RULES_SETUP.md - How to apply rules
- [ ] IMPLEMENTATION_DETAILS.md - Technical deep dive
- [ ] QUICK_FIX_REFERENCE.md - Quick reference guide
- [ ] This checklist file

---

## Local Testing (npm run dev)

### Setup
- [ ] Run `npm run dev`
- [ ] Navigate to http://localhost:3000/common-application
- [ ] Ensure logged in to Firebase

### Test: Single File Upload
- [ ] Click "Next" through Parent Profile
- [ ] Click "Next" through Student Details
- [ ] On Document Upload step: Select 1 PDF file (< 10 MB)
- [ ] Click "Next: School Selection"
- [ ] Document appears in review showing name ✓
- [ ] Click "Next: Review & Submit"
- [ ] Click "Submit Application"
- [ ] **Expected**: Success message appears
- [ ] **NOT expected**: "Unsupported field value" error ✗

### Test: Multiple Files
- [ ] Go to `/common-application` again
- [ ] Fill profile and student details again
- [ ] On Document Upload: Select 3 files (Resume, Certificate, Marksheet)
- [ ] Verify all 3 appear in list
- [ ] Go through review
- [ ] Submit
- [ ] **Expected**: All files upload, success message

### Test: No Files
- [ ] Go through all steps WITHOUT uploading documents
- [ ] Submit application
- [ ] **Expected**: Application saves successfully (documents optional)

### Test: Large File
- [ ] Try uploading file > 50 MB
- [ ] **Expected**: Upload fails gracefully, error message shown

---

## Firebase Console Verification

### Cloud Storage Check
After submitting an application:
1. Open https://console.firebase.google.com/
2. Select "kindred-c52ce" project
3. Go to "Storage"
4. Should see folder: `applications/`
5. Inside: your user ID folder
6. Inside that: application ID folder
7. Inside that: uploaded files with timestamps ✓

**Example path**:
```
applications/
  Nzc9wK3X6ZzV2pT8mN1qH/
    IiWtBbTzC6ZgQt1sspoZ/
      1708416000000_Resume.pdf
      1708416001000_Certificate.pdf
```

- [ ] Files appear with correct names ✓
- [ ] Timestamps are recent ✓
- [ ] Can preview PDF in console ✓

### Firestore Check
1. Open https://console.firebase.google.com/
2. Select "kindred-c52ce" project
3. Go to "Firestore Database"
4. Navigate to: users → {your user ID} → applications
5. Click your application ID
6. Look for `documents` array
7. Expand to see details

**Expected structure**:
```json
{
  "documents": [
    {
      "name": "Resume.pdf",
      "type": "application/pdf",
      "size": 250000,
      "url": "https://firebasestorage.googleapis.com/...",
      "storagePath": "applications/userId/appId/1708416000000_Resume.pdf"
    }
  ]
}
```

- [ ] `url` field exists ✓
- [ ] `url` starts with `https://firebasestorage.googleapis.com/` ✓
- [ ] `storagePath` field exists ✓
- [ ] **NO `file` field** (File object not saved) ✓

### Test URL Access
1. Copy the `url` value
2. Paste in browser address bar
3. **Expected**: PDF downloads or previews ✓
4. Try another user's URL - **should get 401 error** ✓

---

## Firebase Rules Setup

### Cloud Storage Rules
1. Firebase Console → Storage
2. Click "Rules"
3. Paste rules from [FIREBASE_RULES_SETUP.md](FIREBASE_RULES_SETUP.md)
4. Click "Publish"
5. **Expected**: "Successfully published" message ✓

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

- [ ] Rules published successfully ✓

### Firestore Rules
1. Firebase Console → Firestore Database
2. Click "Rules"
3. Ensure user applications section includes:
   ```javascript
   match /users/{userId}/applications/{document=**} {
     allow read, write: if request.auth.uid == userId;
   }
   ```
4. Click "Publish"

- [ ] Rules published successfully ✓

---

## Before Production Deployment

### Code Review
- [ ] All changes reviewed
- [ ] No syntax errors in TypeScript
- [ ] Imports correct (no circular dependencies)
- [ ] Error handling present

### Build Test
```bash
npm run build
# Should complete without errors
```
- [ ] Build succeeds ✓
- [ ] No TypeScript errors ✓
- [ ] No warnings ✓

### Git Status
```bash
git status
# Should show:
# - lib/firebase.ts (modified)
# - lib/firebase-data.ts (modified)
# - hooks/use-application-form.tsx (modified)
# - Documentation files (new)
```

- [ ] Correct files changed ✓
- [ ] No accidental changes ✓

---

## Production Deployment

### Step 1: Commit Code
```bash
git add .
git commit -m "fix: handle file uploads in common application form"
git log --oneline -1  # Verify commit
```

- [ ] Commit created ✓
- [ ] Commit message clear ✓

### Step 2: Push to GitHub
```bash
git push origin main
# Should show: "To github.com:owner/repo.git"
# And list the commit being pushed
```

- [ ] Push successful ✓
- [ ] GitHub shows commit ✓

### Step 3: Verify Vercel Deploy
1. Go to https://vercel.com/
2. Select "kindred" project
3. Wait for deployment to complete (usually 2-5 minutes)
4. Should show green checkmark "READY" ✓

- [ ] Deploy shows READY ✓
- [ ] No deployment errors ✓

---

## Production Testing

### Test Form
1. Go to production domain (e.g., kindred.school)
2. Navigate to `/common-application`
3. Fill all steps
4. Upload test document
5. Submit

- [ ] Application submits ✓
- [ ] No error message ✓

### Verify Files in Production
1. Firebase Console (make sure NOT in development)
2. Storage → should see file ✓
3. Firestore → should see URL ✓

- [ ] File in production storage ✓
- [ ] URL in production Firestore ✓

### Download Test
1. Copy URL from Firestore
2. Paste in browser
3. Should download/preview ✓

- [ ] File downloads ✓

---

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor Firebase Console for errors
- [ ] Check application submissions
- [ ] Verify files upload successfully
- [ ] Check for user reports

### Weekly
- [ ] Storage usage (should be growing)
- [ ] Download metrics
- [ ] Error rate (should be 0%)

### Monthly
- [ ] Cleanup old test files
- [ ] Review storage costs
- [ ] Update documentation if needed

---

## Rollback Plan (If Issues)

### Issue: Files won't upload
1. Check Firebase Rules in console
2. Verify `allow write` is present
3. Republish rules

### Issue: URLs not saving to Firestore
1. Check Firestore Rules
2. Verify user is authenticated
3. Check browser console for errors

### Issue: File objects still being saved
1. Check if code deployed successfully
2. Clear browser cache
3. Verify git commit is on main branch

### Rollback Code
```bash
# If needed, revert to previous version
git log --oneline  # Find good commit
git revert <commit-hash>
git push origin main
# Vercel auto-deploys previous version
```

---

## Success Criteria

✅ Application submits successfully
✅ No "Unsupported field value" errors
✅ Files appear in Cloud Storage
✅ URLs stored in Firestore
✅ URLs point to correct files
✅ Files persist after page refresh
✅ Admin can download from URLs
✅ Other users cannot access files
✅ Production deployment successful
✅ No new errors in logs

---

## Documentation Updates

After successful deployment:

### Update README
- [ ] Add section: "Common Application Form"
- [ ] Document file upload feature
- [ ] Add link to QUICK_FIX_REFERENCE.md

### Notify Team
- [ ] Share FILE_UPLOAD_FIX_SUMMARY.md with team
- [ ] Document in team wiki/confluence
- [ ] Add to deployment notes

### Track Issue
- [ ] Close GitHub issue (if any)
- [ ] Add PR comment with summary
- [ ] Update project status

---

## Final Checklist Summary

| Category | Status |
|----------|--------|
| Code Changes | ✅ Complete |
| Local Testing | ⏳ [Your result] |
| Firebase Setup | ⏳ [Your result] |
| Production Deploy | ⏳ [Your result] |
| Production Testing | ⏳ [Your result] |
| Monitoring | ⏳ [Your result] |

---

## Questions?

### Common Q&A

**Q: Why do I get "Permission denied" error?**
A: Cloud Storage rules not published. Go to Firebase Console → Storage → Rules → Publish.

**Q: Can users download each other's files?**
A: No. Rules restrict by userId. Other users get 401 error.

**Q: How long are URLs valid?**
A: Firebase Storage URLs are permanent by default.

**Q: What if upload fails?**
A: Error is caught and displayed. Application not saved. User can retry.

**Q: Can I delete uploaded files?**
A: Yes, via `deleteApplicationDocument()` when application is deleted.

---

## Contact & Support

For questions or issues:
1. Check IMPLEMENTATION_DETAILS.md
2. Review FIREBASE_RULES_SETUP.md
3. Check browser console for errors
4. Contact development team

---

**Status**: Ready for deployment! 🚀
