# BeaBoo - Story Sharing Platform

## Overview
BeaBoo is a Spanish-language story sharing and social platform built as a single-page HTML application with Firebase backend integration.

## Project Status
✅ **Fixed and Running**
- Removed JavaScript code that was incorrectly placed within CSS blocks (lines 398-423 and 4481-4538 in original HTML)
- Created `stories.js` file with core JavaScript functions
- Server is running successfully on port 5000
- Static HTML deployment configured

## Project Structure
```
.
├── index.html         - Main application file (~13,202 lines)
├── stories.js         - JavaScript functions for story/chapter management
└── replit.md         - This file
```

## Key Issues Fixed
1. **CSS/JavaScript Mixing**: Removed JavaScript function definitions (`saveScheduledChapter`, `checkScheduledChapters`, `handleNoteLike`) that were nested inside `<style>` blocks
2. **Missing JavaScript File**: Created `stories.js` with essential functions:
   - `saveScheduledChapter()` - Schedule chapters for later publication
   - `checkScheduledChapters()` - Auto-publish scheduled chapters
   - `handleNoteLike()` - Handle note like functionality
   - `likePhoto()` - Like photo functionality
3. **Syntax Errors**: Fixed malformed CSS keyframes and unclosed style blocks

## Technologies
- **Frontend**: Single-page HTML with embedded CSS and JavaScript
- **Styling**: Tailwind CSS (CDN), Font Awesome (CDN)
- **Backend**: Firebase (Authentication, Realtime Database, Storage)
- **Additional**: Google Translate API, Google AdSense

## Firebase Configuration
The app uses the following Firebase project:
- Project ID: `noble-amp-458106-g0`
- Database: Realtime Database at `https://noble-amp-458106-g0-default-rtdb.firebaseio.com`
- Auth: Email/Password and other Firebase Auth methods
- Storage: Firebase Storage for media uploads

## Running the Application
```bash
python3 -m http.server 5000 --bind 0.0.0.0
```

The application is accessible at `http://0.0.0.0:5000`

## Deployment Configuration
- **Type**: Static deployment
- **Public Directory**: Root directory (.)
- **Port**: 5000

## Known Issues
- Some placeholder images return 404 (expected behavior - these need to be provided by backend/Firebase)
- Google Translate banner hidden via CSS (functionality maintained)
- Tailwind CSS CDN warning (appropriate for development, should use CLI build for production)

## Next Steps for User
1. Test search functionality and community features
2. Configure Firebase credentials if not already done
3. Replace placeholder image URLs with actual media from Firebase Storage
4. For production: Consider using Tailwind CLI build instead of CDN
