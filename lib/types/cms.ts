export interface HeroSection {
  id: string;
  headline: string;
  subHeadline: string;
  subHeadline2?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  applicationWindowOpens?: string;
  applicationWindowCloses?: string;
  programStartDate?: string;
  programEndDate?: string;
  cohortNumber?: number;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  description?: string; // Optional custom description for the section
  type: 'mission' | 'why-alpha-bet' | 'who-should-apply' | 'curriculum' | 'what-you-gain';
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberTitle {
  id: string;
  title: string; // e.g., "Academic Director, Alpha-Bet"
  organization?: string; // e.g., "Alpha-Bet", "Version Bravo"
}

export interface TeamMember {
  id: string;
  name: string;
  titles: TeamMemberTitle[]; // Array of multiple titles/positions
  role: string; // For backwards compatibility - will use first title as fallback
  bio?: string;
  image?: string;
  military?: string; // Military background
  linkedinUrl?: string;
  category?: 'staff' | 'mentor'; // Team member category: 'staff' for Program Staff, 'mentor' for Mentors
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  image?: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumItem {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  icon?: string; // Font Awesome icon class (e.g., "fas fa-rocket")
  badge1Text?: string; // First badge text (e.g., "Interactive Sessions")
  badge1Icon?: string; // First badge icon (e.g., "fas fa-clock")
  badge2Text?: string; // Second badge text (e.g., "Peer Collaboration") 
  badge2Icon?: string; // Second badge icon (e.g., "fas fa-users")
  badge3Text?: string; // Third badge text (e.g., "Practical Application")
  badge3Icon?: string; // Third badge icon (e.g., "fas fa-lightbulb")
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallToAction {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumButtonConfig {
  id: string;
  type: 'navigate' | 'download';
  url: string;
  buttonText?: string; // Optional custom button text
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamHeader {
  id: string;
  label: string; // "LEADERSHIP TEAM"
  title: string; // "Meet the Team"
  description: string; // "Battle-tested leaders..."
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Qualification {
  id: string;
  title: string;
  description: string;
  icon: string; // Font Awesome icon class (e.g., "fas fa-shield-alt")
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramIntro {
  id: string;
  title: string;
  description: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParticipantType {
  id: string;
  title: string; // "Explorers" or "Builders"
  description: string;
  highlights: string[]; // Array of bullet points
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateProfile {
  id: string;
  title: string; // "The Alpha-Bet Candidate"
  description: string;
  highlights: string[]; // Array of bullet points
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramExclusions {
  id: string;
  title: string; // "Who This Program Is Not For"
  description: string;
  highlights: string[]; // Array of bullet points
  note?: string; // Optional note at the bottom
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumHeader {
  id: string;
  badge: string; // "10-WEEK CURRICULUM"
  title: string; // "The Alpha-Bet Program"
  description: string; // Description text
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SplashSection {
  id: string;
  headline: string; // "Version Bravo Alphabet"
  subHeadline: string; // "The only entrepreneurship program for US and Israeli combat veterans."
  redirectUrl: string; // Where to redirect after timer
  timerDuration: number; // Timer duration in seconds
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionBullet {
  id: string;
  text: string;
  order: number;
}

export interface MissionSection {
  id: string;
  title: string; // "Our Mission"
  description?: string; // "Our foundation and purpose"
  bullets: MissionBullet[]; // Array of mission bullets
  type: 'mission';
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentType = 
  | 'hero'
  | 'content-section'
  | 'team-member'
  | 'team-header'
  | 'testimonial'
  | 'curriculum-item'
  | 'call-to-action'
  | 'qualification';

export interface CMSUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface LiveQAEvent {
  id: string;
  sessionDate: string; // ISO date string
  sessionUrl: string; // URL to join the session
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreRecordedSession {
  id: string;
  title: string; // "Pre-recorded Info Session"
  sessionUrl: string; // URL to the pre-recorded session
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhyChooseVettedBullet {
  id: string;
  title: string; // "Elite Founders. Global Network. Proven Platform"
  description: string; // Detailed description text
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EcosystemSection {
  id: string;
  title: string; // "Ecosystem"
  subtitle: string; // "Education. Acceleration. Investment."
  description: string; // Main description text
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EcosystemCard {
  id: string;
  title: string; // "Alpha-Bet", "Vetted Accelerator + Fund", "Alumni Network"
  description: string; // Card description
  icon: string; // Font Awesome icon class (e.g., "fas fa-graduation-cap")
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcceleratorHero {
  id: string;
  title: string; // "Where veteran grit meets venture growth."
  content: string; // Main content paragraphs
  image?: string; // Image URL
  secondaryTitle: string; // "Built for Combat Veteran Entrepreneurs..."
  secondaryContent: string; // Secondary content section
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramPhase {
  id: string;
  title: string; // "ISRAEL", "Mentorship Phase (6 Weeks)", "MIAMI"
  subtitle: string; // "Your journey starts and ends with two 10-day bootcamps on two continents."
  description: string; // Main description text
  duration: string; // "10 days", "6 weeks", "2 weeks"
  image?: string; // Main image URL
  graphics: ProgramGraphic[]; // Array of graphics/content blocks
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramGraphic {
  id: string;
  title: string; // "Workshops in Storytelling, Networking Training..."
  description: string; // Content description
  image?: string; // Optional image URL
  order: number;
}

export interface ProgramSnapshot {
  id: string;
  stage: string; // "Pre-Seed or Pre-Incorporation"
  duration: string; // "10 weeks"
  format: string; // "Hybrid (online + two 10-day bootcamps in Israel and Florida)"
  cohortSize: string; // "16–20 startups"
  demoDay: string; // "The LAB Miami"
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramSnapshotItem {
  id: string;
  title: string; // "Stage", "Duration", "Format", etc.
  description: string; // "Pre-Seed or Pre-Incorporation", "10 weeks", etc.
  icon: string; // Font Awesome icon class
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramBenefit {
  id: string;
  title: string; // "Integrated Funding Path"
  description: string; // Benefit description
  icon: string; // Font Awesome icon class
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  description: string;
  logo: string; // URL to company logo
  status: 'exited' | 'fundraising' | 'none';
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcceleratorImageSection {
  id: string;
  title: string; // Section title
  description: string; // Text content
  image: string; // Image URL
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentBase {
  id: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}