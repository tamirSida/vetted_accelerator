# Alpha-Bet Program Website

An entrepreneurship program website for US and Israeli combat veterans, built with Next.js 15 and featuring a comprehensive content management system.

## 🎯 Project Overview

Alpha-Bet is a specialized entrepreneurship program designed exclusively for combat veterans from the United States and Israel. This website serves as the primary platform for program information, applications, and curriculum details.

## 🏗️ Architecture

- **Framework**: Next.js 15.4.6 with TypeScript
- **Styling**: Tailwind CSS with custom military-themed design
- **Database**: Firebase/Firestore for content management
- **Authentication**: Firebase Auth for admin access
- **Icons**: Font Awesome integration
- **Fonts**: Custom Gunplay and Black Ops One military fonts

## ✨ Key Features

### 🔐 Comprehensive CMS System
- **Granular Content Management**: Individual editing of all content sections
- **Admin Access**: Multiple discrete authentication methods (`?admin=true`, keyboard shortcuts)
- **Real-time Updates**: Live content editing with Firebase persistence
- **Fallback Content**: Default content when CMS data is empty
- **Drag-and-Drop**: Team member and content reordering

### 📱 Multi-Page Architecture
- **Splash Page**: Video background with 3-second timeout optimization
- **Homepage**: Hero section, mission overview, FAQ, testimonials
- **Team**: Drag-and-drop team member management with classification system
- **Curriculum**: 10-week program timeline with interactive mobile modals
- **Qualifications**: Comprehensive eligibility requirements
- **Service Requirements**: Detailed military service criteria
- **Legal Pages**: Privacy policy and terms of service

### 🎨 Military-Themed Design
- **Color Scheme**: Gray-900 to Black gradients with white accents
- **Visual Elements**: Shield icons, badges, glass morphism effects
- **Typography**: Gunplay and Black Ops One military fonts
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animation Effects**: Pulse animations, hover effects, scaling transforms

### 🛠️ Advanced Features
- **Video Splash Page**: Optimized loading with 3-second timeout and redirect
- **Smart FAQ Navigation**: Custom hash navigation with proper scrolling
- **Team Management**: Drag-and-drop reordering with Firebase integration
- **Lightweight Button CMS**: Toggle between download/navigate modes
- **SEO Optimization**: Comprehensive meta tags and structured data

## 📊 Content Management

### CMS-Enabled Sections
- Hero sections with split subtitles and application windows
- Content sections with add/remove functionality
- Team members with multiple titles and dynamic positions
- Curriculum timeline with week details and badges
- Testimonials with author information
- Call-to-action sections with dual button support
- FAQ items with order and visibility controls
- Qualification requirements and eligibility criteria

### Admin Features
- **Multiple Access Methods**: URL params, keyboard shortcuts, discrete toggles
- **Contextual Editing**: Edit buttons appear on hover in admin mode
- **Form Validation**: Required fields and input type validation
- **Delete Functionality**: Remove items with confirmation dialogs
- **Ordering System**: Drag-and-drop and manual ordering
- **Visibility Controls**: Show/hide content sections

## 🚀 Development

### Prerequisites
- Node.js 18+
- Firebase project setup
- Environment variables configured

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd alpha-bet

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Firebase configuration
```

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint checking
npm run typecheck    # TypeScript validation
```

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🎨 Design System

### Color Palette
- **Primary**: Gray-900 to Black gradients (military theme)
- **Accent**: White for contrast, Blue for interactive elements
- **Text**: High contrast ratios for accessibility
- **Borders**: Gray-600 for subtle separation

### Typography
- **Primary Font**: Gunplay (custom military font)
- **Fallback Font**: Black Ops One
- **Body Text**: System fonts for optimal readability

### Visual Elements
- **Military Aesthetic**: Shield icons, badges, monospace loading screens
- **Glass Morphism**: Backdrop blur effects and transparent overlays
- **Grid Layouts**: 2-column responsive grids for content
- **Animation**: Smooth transitions, hover effects, loading states

## 🔧 Technical Implementation

### Performance Optimizations
- **Video Loading**: 3-second timeout with automatic fallback
- **Image Optimization**: Next.js Image with lazy loading
- **Code Splitting**: Route-based and dynamic imports
- **Efficient Rendering**: Optimized React patterns and state management

### Security Features
- **Firebase Security Rules**: Authenticated write, public read access
- **Input Sanitization**: Form validation and XSS protection
- **Admin Authentication**: Secure login flow with session management

## 📱 User Experience

### Desktop Features
- **Hover Effects**: Interactive elements with visual feedback
- **Keyboard Navigation**: Full keyboard accessibility support
- **Admin Interface**: Contextual edit buttons and management tools

### Mobile Optimizations
- **Touch Gestures**: Swipe navigation and touch-friendly interactions
- **Responsive Modals**: Full-screen overlays for curriculum details
- **Mobile-First Design**: Optimized layouts for all screen sizes

## 🎯 Content Structure

### Page Flow
1. **Splash Page** (`/`) - Video introduction with timeout
2. **Homepage** (`/home`) - Main content and navigation
3. **Team** (`/team`) - Staff and mentor profiles
4. **Curriculum** (`/curriculum`) - 10-week program details
5. **Qualifications** (`/qualifications`) - Eligibility requirements
6. **Service Requirements** (`/service-requirements`) - Military criteria
7. **Legal Pages** (`/privacy`, `/terms`) - Policies and terms

### Content Types
- Hero sections with customizable messaging
- Dynamic content blocks with highlights
- Team member profiles with drag-and-drop ordering
- Interactive curriculum timeline
- FAQ system with fallback content
- Testimonials and success stories

## 🔐 Admin Access

### Access Methods
- **URL Parameter**: Add `?admin=true` to any URL
- **Keyboard Shortcut**: Press `Ctrl+Shift+A` for login dialog
- **ALPHABET Sequence**: Type "ALPHABET" on any page
- **Discrete Dot**: Click admin dot in top-right corner

### Admin Capabilities
- Edit all content sections in real-time
- Manage team member ordering and classification
- Configure FAQ visibility and ordering
- Upload and manage images via URLs
- Toggle content visibility across the site

## 🚢 Deployment

### Supported Platforms
- **Vercel** (recommended) - Automatic deployments from Git
- **Netlify** - JAMstack-optimized hosting
- **Firebase Hosting** - Integrated with Firebase backend
- **Any Node.js Platform** - Standard Next.js deployment

### Firebase Setup
- **Collections**: Comprehensive content type collections
- **Authentication**: Admin user management
- **Security Rules**: Proper access control
- **External Images**: LinkedIn and media domain support

## 🎖️ Target Audience

This platform serves combat veterans who are:
- Exploring entrepreneurship opportunities
- Looking to transition military leadership into business success
- Seeking structured learning and mentorship
- Ready to commit to a 10-week intensive program

## 🏅 Military Heritage

The design and functionality honor the military background of participants through:
- Battle-tested visual metaphors and military styling
- Mission-oriented language and structure
- Emphasis on discipline and excellence in user experience
- Community and brotherhood themes throughout

---

**Built with precision, designed for veterans, powered by innovation.**

*For detailed technical documentation, see `CLAUDE.md`*