import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
}

const defaultKeywords = [
  'Alpha-Bet',
  'Alpha Bet',
  'Version Bravo',
  'veteran entrepreneurship',
  'combat veteran business program',
  'military entrepreneur training',
  'startup accelerator veterans',
  'business program veterans',
  'entrepreneurial training',
  'veteran business development',
  'military to business transition',
  'veteran startup program',
  'entrepreneurship program',
  'veteran entrepreneurship training',
  'military startup incubator',
  'veteran business accelerator',
  'combat veteran startup',
  'military entrepreneur mentorship',
  'veteran founder program',
  'startup program veterans',
  'business training veterans',
  'entrepreneurial development',
  'veteran business education',
  'military business transition',
  'veteran startup support'
];

export default function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/logo.png',
  ogType = 'website',
  structuredData,
  noindex = false
}: SEOProps) {
  const siteTitle = 'Alpha-Bet - Entrepreneurship Program for Combat Veterans';
  const siteDescription = 'Alpha-Bet: Free 10-week entrepreneurship program for US and Israeli combat veterans. Transform military experience into startup success with expert mentorship, proven frameworks, and veteran network.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alpha-bet.org';
  
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const fullDescription = description || siteDescription;
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Default structured data for the organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Version Bravo",
        "alternateName": ["Version Bravo Veterans", "VBV"],
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`,
          "width": 200,
          "height": 200
        },
        "description": "Version Bravo provides entrepreneurship programs and business development for combat veterans",
        "foundingDate": "2020",
        "sameAs": [
          "https://www.linkedin.com/school/versionbravo/posts/?feedView=all"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "info@vbv.vc"
        }
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#educational-program`,
        "name": "Alpha-Bet Program",
        "alternateName": ["Alpha Bet", "Alpha-Bet Entrepreneurship Program"],
        "description": "10-week intensive entrepreneurship program designed specifically for US and Israeli combat veterans",
        "provider": {
          "@id": `${siteUrl}/#organization`
        },
        "courseMode": "online",
        "educationalCredentialAwarded": "Program Completion Certificate",
        "timeRequired": "P10W",
        "audience": {
          "@type": "Audience",
          "audienceType": "Combat Veterans",
          "geographicArea": ["United States", "Israel"]
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Entrepreneurship program for qualifying veterans"
        }
      },
      {
        "@type": "Course",
        "@id": `${siteUrl}/#course`,
        "name": "Alpha-Bet 10-Week Entrepreneurship Program",
        "description": "Comprehensive business development program covering ideation, lean methodology, customer discovery, networking, market analysis, business planning, branding, and presentation skills",
        "provider": {
          "@id": `${siteUrl}/#organization`
        },
        "coursePrerequisites": "Combat veteran status (US or Israeli military)",
        "educationalLevel": "Professional Development",
        "timeRequired": "P10W",
        "courseMode": "online",
        "inLanguage": "en",
        "isAccessibleForFree": true,
        "syllabusSections": [
          {
            "@type": "Syllabus",
            "name": "Week 1: Orientation",
            "description": "Set the foundation for your entrepreneurial journey"
          },
          {
            "@type": "Syllabus", 
            "name": "Week 2: Choosing Partners",
            "description": "Learn to build a strong, reliable team"
          },
          {
            "@type": "Syllabus",
            "name": "Week 3: Ideation Process", 
            "description": "Develop and refine your business idea"
          },
          {
            "@type": "Syllabus",
            "name": "Week 4: Lean Model Canvas",
            "description": "Master the fundamental framework for a startup"
          },
          {
            "@type": "Syllabus",
            "name": "Week 5: Customer Discovery",
            "description": "Understand your market and find product-market fit"
          },
          {
            "@type": "Syllabus",
            "name": "Week 6: Networking",
            "description": "Build powerful connections with investors, mentors, and peers"
          },
          {
            "@type": "Syllabus", 
            "name": "Week 7: Market Analysis",
            "description": "Validate your concept with data-driven insights"
          },
          {
            "@type": "Syllabus",
            "name": "Week 8: Business Plan",
            "description": "Create a clear, actionable roadmap for growth"
          },
          {
            "@type": "Syllabus",
            "name": "Week 9: Storytelling & Branding", 
            "description": "Learn to communicate your mission and vision effectively"
          },
          {
            "@type": "Syllabus",
            "name": "Week 10: Presentations",
            "description": "Prepare to pitch your business with confidence"
          }
        ]
      }
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Version Bravo" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Alpha-Bet Logo - Entrepreneurship Program for Veterans" />
      <meta property="og:site_name" content="Alpha-Bet" />
      <meta property="og:locale" content="en_US" />
      
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#111827" />
      <meta name="msapplication-TileColor" content="#111827" />
      <meta name="application-name" content="Alpha-Bet" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      {finalStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(finalStructuredData)
          }}
        />
      )}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="target" content="combat veterans, military veterans, entrepreneurs, startups" />
      <meta name="audience" content="combat veterans" />
      <meta name="subject" content="entrepreneurship training for veterans" />
      <meta name="copyright" content="Version Bravo" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
    </Head>
  );
}