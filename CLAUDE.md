# Alpha-Bet Project - Claude Context

## Project Overview
Alpha-Bet is an entrepreneurship program for US and Israeli combat veterans, designed to equip them with the skills, network, and battle-tested mindset to build successful startups. This is a Next.js website with a complete CMS system and multi-page architecture.

## Project Structure
- **Framework**: Next.js 15.4.6 with TypeScript and Tailwind CSS
- **Database**: Firebase/Firestore for content management
- **Authentication**: Firebase Auth for admin access
- **Styling**: Tailwind CSS with custom military-themed components
- **Icons**: Font Awesome integration
- **Images**: Next.js Image optimization with custom logo
- **Fonts**: Custom Gunplay and Black Ops One military fonts

## Key Components

### Frontend Components (`/components/public/`)
- `navigation.tsx` - Sticky navigation with mobile hamburger menu, responsive logo, and custom FAQ navigation
- `footer.tsx` - Consistent footer with contact info, navigation links, "Our Partners" section, and service requirements link
- `splash-page.tsx` - Video splash page with 3-second timeout optimization and loading states
- `bottom-navigation.tsx` - Contextual user journey flow between pages
- `hero-section.tsx` - Landing hero with seamless background integration
- `content-section.tsx` - Modern grid-based content with granular CMS, glass morphism effects, and color-coded sections
- `curriculum-timeline.tsx` - Side-to-side curriculum layout with mobile popup modals, lightweight button CMS, and drag-and-drop admin reordering
- `unified-team-section.tsx` - Unified team component with drag-and-drop reordering and team classification (Academic Team vs Program Staff)
- `testimonials-section.tsx` - Dark themed testimonial cards with quote patterns
- `cta-section.tsx` - Final mission briefing style call-to-action
- `faq-section.tsx` - Expandable Q&A component with dark theme, CMS integration, and hardcoded fallbacks
- `who-should-apply-section.tsx` - Clean checklist UI for qualification requirements
- `program-overview-section.tsx` - Comprehensive qualifications page component with participant types and candidate profiles
- `homepage.tsx` - Main page with seamless dark background and granular content CMS

### CMS System (`/components/admin/`)
- `discrete-access.tsx` - URL-based admin access (?admin=true) with keyboard shortcuts (Ctrl+Shift+A, ALPHABET sequence)
- `editable-section.tsx` - Wrapper for CMS editing capability
- `edit-modal.tsx` - Universal edit modal for all content types with form validation
- `simple-admin-toggle.tsx` - Admin mode toggle with Edit Mode, Dashboard navigation (/admin), and Sign Out buttons

### Backend Services (`/lib/cms/`)
- `base-service.ts` - Abstract Firestore service with CRUD operations
- `content-services.ts` - Service factory for all content types (includes all specialized services)
- `admin-context.tsx` - Admin state management with authentication
- `types/cms.ts` - TypeScript interfaces for all CMS content types

## Page Architecture

### Individual Page Routes:
- `/` - Splash page with optimized video loading (3-second timeout, redirect to home)
- `/home` - Homepage with hero, mission/why/what sections, FAQ, and bottom navigation
- `/team` - Team page with unified "Alpha-Bet Team" section, drag-and-drop reordering, and classification system
- `/curriculum` - 10-week program curriculum with military loading animation and lightweight button CMS
- `/qualifications` - Comprehensive eligibility requirements with participant types and candidate profiles
- `/info-session` - Info sessions page with live Q&A events and pre-recorded session management
- `/service-requirements` - Detailed military service eligibility criteria page
- `/privacy` - Privacy policy page with comprehensive data protection information
- `/terms` - Terms of service page with program guidelines and participant responsibilities

### External Links (Configurable via `/lib/config/urls.ts`):
- **Apply Form** - External application form URL
- **LinkedIn** - Program LinkedIn page
- **Contact Email** - Program contact email

## Content Types & CMS Integration

### Fully CMS-Enabled Sections:
1. **Hero Section** - Headline, split sub-headline with dynamic gradient divider, CTA text/link, background image, application window dates with smart status logic
2. **Content Sections** - **GRANULAR CMS**: Individual editing of Mission Brief + Key Highlights with add/remove functionality
3. **Curriculum Timeline** - 10-week program with week number, title, description, icons, editable CTA with lightweight button configuration
4. **Team Members** - Unified "Alpha-Bet Team" with drag-and-drop reordering, team classification, dynamic titles/positions
5. **Qualifications Page** - Program Introduction, Participant Types (Explorers/Builders), Alpha-Bet Candidate profile, Program Exclusions
6. **Info Sessions Page** - Live Q&A events with date/URL management and pre-recorded session with URL configuration
7. **Testimonials** - Quote, author, title, company, profile image
8. **Call to Action** - Title, description, button text/link with dual button support
9. **FAQ Items** - Question, answer with HTML support, order, visibility controls, and hardcoded fallbacks including program eligibility and meeting times
10. **Splash Page** - Headline, sub-headline, redirect URL, timer duration with video optimization
11. **Service Requirements** - Static page with comprehensive military service criteria

### Advanced CMS Features:
- **Fallback Content**: All components show hardcoded defaults when Firebase is empty
- **Granular Editing**: Individual component editing with real-time updates
- **Add/Remove Functionality**: Dynamic content management (highlights, team members, FAQ items)
- **Form Validation**: Required fields, proper input types, radio button support
- **Database Persistence**: Full Firebase/Firestore integration with automatic save
- **Delete Functionality**: Remove items with confirmation dialogs
- **Responsive Editing**: Edit buttons properly positioned and mobile-friendly
- **Drag-and-Drop**: Team member and curriculum reordering with Firebase persistence
- **Lightweight Button CMS**: Toggle between download/navigate modes with URL configuration

## Design System

### Color Scheme:
- **Primary**: Gray-900 to Black gradients (military theme)
- **Accent**: White for contrast and highlights, Blue for interactive elements
- **Text**: White on dark backgrounds, Black/Gray on light backgrounds
- **Borders**: Gray-600 for subtle separation

### Typography:
- **Primary Font**: Gunplay (custom military font)
- **Fallback Font**: Black Ops One
- **Body Text**: System fonts for readability

### Key Design Elements:
- **Military Aesthetic**: Shield icons, badges, monospace fonts for loading screens
- **Seamless Dark Theme**: Continuous gradient backgrounds without page breaks
- **Grid-Based Layouts**: 2-column responsive grids for content highlights
- **Color-Coded Sections**: Blue (Mission), Purple (Why Alpha-Bet), Yellow (What You'll Gain)
- **Glass Morphism**: Backdrop blur effects, transparent overlays, and modern card designs
- **Professional Layout**: Side-to-side alternating curriculum, clean checklist qualifications
- **Responsive Design**: Mobile-first approach with breakpoints and popup modals
- **Animation Effects**: Pulse animations, hover effects, scaling transforms, and loading states

## Technical Optimizations

### Performance Features:
- **Video Loading**: 3-second timeout with loading states and automatic redirect
- **Image Optimization**: Next.js Image with priority loading for above-fold content
- **Smart Navigation**: Custom FAQ navigation with proper hash scrolling and timing
- **Efficient Rendering**: Optimized re-rendering patterns and state management
- **External Image Support**: LinkedIn media domain support in Next.js configuration

### User Experience Enhancements:
- **Touch-Friendly**: Mobile-optimized drag-and-drop and admin controls
- **Loading States**: Comprehensive loading indicators for all async operations
- **Error Handling**: Graceful fallbacks and error boundaries
- **Admin UX**: Discrete admin access with multiple authentication methods
- **Cursor Behaviors**: Context-appropriate cursor states (pointer for clickable elements)

## Development Commands
- `npm run dev` - Development server (usually runs on port 3001)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - ESLint checking
- `npm run typecheck` - TypeScript checking

## Firebase Configuration
- **Collections**: hero-sections, content-sections, curriculum-items, curriculum-headers, call-to-actions, faqs, testimonials, alpha-bet-team, program-intros, participant-types, candidate-profiles, program-exclusions, splash-sections, live-qa-events, pre-recorded-sessions, mission-sections
- **Authentication**: Admin users for CMS access with discrete login methods
- **Security Rules**: Authenticated users have full access, public read access
- **External Images**: LinkedIn and other media domains configured in next.config.ts

## Key Features Implemented:
- ✅ Complete multi-page website architecture with responsive navigation
- ✅ Full CMS system with all content types including comprehensive fallback handling
- ✅ Video splash page with timeout optimization and loading states
- ✅ Drag-and-drop team member reordering with team classification system
- ✅ Mobile-optimized curriculum with popup modals and lightweight button CMS
- ✅ Smart FAQ navigation with proper hash scrolling and timing fixes
- ✅ Admin access control with multiple discrete authentication methods
- ✅ Form validation, error handling, and comprehensive fallback content
- ✅ TypeScript throughout for type safety and developer experience
- ✅ SEO optimization with structured data and meta tags
- ✅ Performance optimizations including image optimization and efficient rendering

## Recent Major Updates:
- **Info Sessions Page**: Complete page with live Q&A event management and pre-recorded session configuration
- **Application Status Logic**: Smart status display based on current date vs application/program dates with dynamic month detection
- **Dynamic Gradient Divider**: Hero subtitle divider now spans the full width of the text dynamically
- **Enhanced FAQ System**: Added new hardcoded FAQs including program eligibility and meeting schedules with HTML formatting support
- **Mobile Footer Optimization**: Moved "Our Partners" section under Legal on mobile devices
- **Hero Layout Improvements**: Better spacing, positioning, and visual hierarchy with military corner accents
- **Touch Scroll Optimization**: Fixed nested scroll issues on mobile for horizontal content sections
- **Video Splash Optimization**: 3-second timeout with loading states and automatic home redirect
- **FAQ Navigation Fix**: Custom navigation handler with proper timing and scrolling behavior
- **Service Requirements Page**: Comprehensive military eligibility criteria with footer integration
- **Admin Dashboard Button**: Added Dashboard button to admin controls for easy navigation to `/admin` route

## Environment Variables Needed:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Admin Access Methods:
- Add `?admin=true` to any URL to enable admin mode
- Use Ctrl+Shift+A keyboard shortcut for admin login dialog
- Type "ALPHABET" sequence on any page for discrete access
- Click the discrete admin dot (appears in top-right corner when available)
- All methods use the same unified login dialog system

## Important Development Notes:
- All CMS components include comprehensive fallback content when Firebase is empty
- Admin edit buttons only appear when in admin mode and are properly positioned
- Mobile-first responsive design with touch-friendly interfaces
- Form validation includes required fields, proper input types, and error handling
- Database operations include error handling and optimistic updates for better UX
- External link management centralized in `/lib/config/urls.ts` for easy updates