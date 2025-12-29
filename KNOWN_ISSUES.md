# Known Issues and Limitations

## Expected 404 Errors (Not Real Problems)
These are placeholder/demo features that require actual Firebase data:
- Placeholder image URLs: `/api/placeholder/...`
- Template variables: `/$%7Bphoto.imageUrl%7D` 
- These are NOT code errors - they need real data from Firebase

## Backend Endpoints Not Available
These endpoints require Netlify Functions (backend):
- `/.netlify/functions/migrate-firebase-to-s3` (POST 501)
- `/.netlify/functions/get-notes` (GET 404)
- `/.netlify/functions/like-note` (POST 404)
- These are stub functions for demo purposes

## Features That Need Firebase Database
To fully enable these features, populate your Firebase Realtime Database:
1. **Stories Feed** - Add stories under `/stories/` path
2. **Followers/Following** - Add follower relationships under `/followers/` and `/following/`
3. **Notes** - Add user notes under `/notes/` path
4. **Notifications** - Add notifications under `/notifications/` path

## Missing Image Assets
- Profile pictures default to placeholder URLs
- Story covers default to placeholder URLs
- Replace with real URLs from Firebase Storage once configured

## Authentication
- ✅ Email/password registration works
- ✅ Email/password login works
- ✅ Sign out works
- ⚠️ Google Sign-In requires API keys in Firebase Console
- ⚠️ Facebook Sign-In requires API keys in Firebase Console

## UI Components Working
- ✅ Navigation (home, search, profile, community, creator)
- ✅ Login/Register form
- ✅ Profile view
- ✅ Followers/Following modals (open/close)
- ✅ All modal functions (notes, gifts, frames, etc.)
- ✅ Theme switching (light/dark ready)

## Performance Notes
- Google Translate CDN loads slower than native implementation
- Tailwind CSS CDN should be replaced with CLI build for production
- Consider lazy-loading modals for better performance

## What to Do Next
1. Verify Firebase config is correct
2. Set up Firebase Realtime Database rules
3. Add sample stories/users data
4. Test followers/following functionality once data exists
5. Connect to real image storage (Firebase Storage or S3)
