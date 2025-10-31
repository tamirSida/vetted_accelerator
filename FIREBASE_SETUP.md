# Firebase Setup Instructions

## Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/alphabet-e9433/firestore/rules)

2. Replace the existing rules with the contents of `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all content collections
    match /hero-sections/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /content-sections/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /team-members/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /testimonials/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /curriculum-items/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /call-to-actions/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to manage users
    match /cms-users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to all collections (for the public website)
    match /{path=**} {
      allow read: if true;
    }
  }
}
```

3. Click "Publish"

## Authentication Setup

1. Go to [Firebase Console Authentication](https://console.firebase.google.com/project/alphabet-e9433/authentication/providers)

2. Enable **Email/Password** authentication if not already enabled

3. Add authorized users in the **Users** tab

## Database Structure

The app will automatically create these collections:
- `hero-sections` - Hero banners
- `content-sections` - Text content blocks  
- `team-members` - Team profiles
- `testimonials` - User testimonials
- `curriculum-items` - Course curriculum
- `call-to-actions` - CTA buttons
- `cms-users` - User management (auto-created)

## Access Control

- **Any authenticated Firebase user gets admin access**
- No approval workflow needed
- All authenticated users can manage all content
- Public users can read content (for the website)

This simplified approach removes the need for Firestore indexes and complex approval workflows.