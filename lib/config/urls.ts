// Global URL configuration for Alpha-Bet website
// Update these URLs as needed for external links

export const EXTERNAL_URLS = {
  // Application form - Alpha-Bet application URL
  APPLY_FORM: 'https://application.alphabet.vbv.vc',
  
  // Social media links
  LINKEDIN: 'https://www.linkedin.com/school/versionbravo/posts/?feedView=all',
  
  // Contact email
  CONTACT_EMAIL: 'info@vbv.vc',
} as const;

// Type for external URLs
export type ExternalURLs = typeof EXTERNAL_URLS;