import type { Metadata } from "next";
import { Inter, Black_Ops_One } from "next/font/google";
import { AdminProvider } from "@/lib/cms/admin-context";
import ConditionalNavigation from "@/components/layout/conditional-navigation";
import ConditionalFooter from "@/components/layout/conditional-footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-ops-one",
});

export const metadata: Metadata = {
  title: "The Vetted Accelerator",
  description: "The Vetted Accelerator: Elite 10-week startup accelerator for veteran entrepreneurs. Join the global network of combat veteran founders building world-class companies in Israel and Miami.",
  keywords: "version bravo, the vetted, vetted accelerator, veteran entrepreneurs, combat veteran startup, military startup accelerator, veteran founded companies, veteran business program, elite veteran founders, startup program veterans, veteran investment fund, military entrepreneur accelerator, combat veteran entrepreneurs, veteran startup fund, israeli veteran startups, us veteran startups, version bravo accelerator",
  authors: [{ name: "The Vetted Accelerator" }],
  creator: "The Vetted Accelerator",
  publisher: "Thevetted.vc",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "The Vetted Accelerator | Combat Veteran Startup Program",
    description: "The Vetted : Elite 10-week startup accelerator for veteran entrepreneurs. Join the global network of combat veteran founders building world-class companies.",
    url: "https://accelerator.thevetted.vc",
    siteName: "The Vetted Accelerator",
    type: "website",
    locale: "en_US",
    images: [{
      url: "https://accelerator.thevetted.vc/og-image.png",
      width: 1200,
      height: 630,
      alt: "The Vetted Accelerator"
    }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thevetted",
    creator: "@versionbravo",
    title: "The Vetted Accelerator",
    description: "The Vetted Accelerator: Elite 10-week startup accelerator for veteran entrepreneurs. Join the global network of combat veteran founders.",
    images: ["https://accelerator.thevetted.vc/twitter-image.png"],
  },
  alternates: {
    canonical: "https://accelerator.thevetted.vc", // Primary canonical domain
  },
  verification: {
    google: "jwFpNC478fhLXbjU5t50WNILIPTgFK2FM3XgS8MCqSs",
    other: {
      "google-site-verification": [
        "jwFpNC478fhLXbjU5t50WNILIPTgFK2FM3XgS8MCqSs", // .vc domain
        "0nzQVLTmamwv378KMyINOymfNhUfmj-55Np2mOGtQZs" // .org domain
      ]
    }
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Additional SEO Keywords for Target Terms */}
        <meta name="description" content="The Vetted Accelerator: Elite 10-week startup accelerator for veteran entrepreneurs. Join the global network of combat veteran founders building world-class companies in Israel and Miami." />
        <meta name="keywords" content="version bravo, the vetted, vetted accelerator, veteran entrepreneurs, combat veteran startup, military startup accelerator, veteran founded companies, veteran business program, elite veteran founders, startup program veterans, veteran investment fund, military entrepreneur accelerator, combat veteran entrepreneurs, veteran startup fund, israeli veteran startups, us veteran startups, version bravo accelerator" />
        <meta name="subject" content="Combat Veteran Startup Accelerator Program" />
        <meta name="copyright" content="The Vetted by Accelerator" />
        <meta name="abstract" content="The Vetted accelerator program exclusively for elite combat veterans building startups" />
        <meta name="topic" content="Veteran entrepreneurship and startup acceleration" />
        <meta name="summary" content="10-week accelerator program for veteran-founded startups with global network and funding" />
        <meta name="Classification" content="Business" />
        <meta name="designer" content="The Vetted" />
        <meta name="reply-to" content="info@thevetted.vc" />
        <meta name="owner" content="Thevetted.vc" />
        <meta name="url" content="https://accelerator.thevetted.vc" />
        <meta name="identifier-URL" content="https://accelerator.thevetted.vc" />
        <meta name="directory" content="submission" />
        <meta name="category" content="Business, Startups, Veterans, Military, Entrepreneurship" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        
        {/* Geo Meta Tags */}
        <meta name="ICBM" content="25.7617, -80.1918" />
        <meta name="geo.position" content="25.7617;-80.1918" />
        <meta name="geo.region" content="US-FL" />
        <meta name="geo.placename" content="Miami, Florida" />
        
        {/* Web App Meta */}
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap"
          rel="stylesheet"
        />
        
        {/* Google Analytics - Replace GA_MEASUREMENT_ID with your actual ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'The Vetted Accelerator',
                custom_map: {
                  'custom_parameter': 'version_bravo'
                }
              });
            `,
          }}
        />
        
        {/* Google Tag Manager - Replace GTM-XXXXXXX with your actual GTM ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
        
        {/* Microsoft Clarity - Replace 'PROJECT_ID' with your actual ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "PROJECT_ID");
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "The Vetted Accelerator",
              "alternateName": ["Version Bravo", "The Vetted", "Vetted"],
              "description": "The Vetted by Accelerator is an elite 10-week startup accelerator program exclusively for combat veteran entrepreneurs from the US and Israel",
              "url": "https://accelerator.thevetted.vc",
              "logo": "https://accelerator.thevetted.vc/logo.png",
              "image": "https://accelerator.thevetted.vc/og-image.png",
              "sameAs": [
                "https://linkedin.com/company/thevetted",
                "https://twitter.com/thevetted"
              ],
              "parentOrganization": {
                "@type": "Organization",
                "name": "Thevetted.vc",
                "url": "https://versionbravo.vc"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "The Vetted Accelerator Programs",
                "itemListElement": [
                  {
                    "@type": "Course",
                    "name": "The Vetted 10-Week Combat Veteran Startup Accelerator",
                    "description": "Elite accelerator program for veteran entrepreneurs with global network, mentorship, and funding opportunities",
                    "provider": {
                      "@type": "Organization",
                      "name": "The Vetted Accelerator"
                    },
                    "courseMode": "Hybrid",
                    "duration": "P10W",
                    "location": [
                      {
                        "@type": "Place",
                        "name": "Israel Bootcamp",
                        "address": {
                          "@type": "PostalAddress",
                          "addressCountry": "IL"
                        }
                      },
                      {
                        "@type": "Place", 
                        "name": "Miami Bootcamp",
                        "address": {
                          "@type": "PostalAddress",
                          "addressLocality": "Miami",
                          "addressRegion": "FL",
                          "addressCountry": "US"
                        }
                      }
                    ],
                    "offers": {
                      "@type": "Offer",
                      "name": "Startup Investment and Mentorship",
                      "description": "Direct investment from the Vetted Fund plus elite mentorship"
                    }
                  }
                ]
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Elite Combat Veterans and Military Entrepreneurs",
                "geographicArea": ["United States", "Israel"]
              },
              "foundingDate": "2024",
              "specialty": "Combat Veteran Startup Acceleration and Investment",
              "keywords": "version bravo, the vetted, veteran entrepreneurs, combat veteran startup, military startup accelerator"
            })
          }}
        />
        
        {/* Additional Schema for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "The Vetted Accelerator",
              "alternateName": "The Vetted Accelerator",
              "description": "Elite startup accelerator program for veteran entrepreneurs",
              "url": "https://accelerator.thevetted.vc",
              "logo": "https://accelerator.thevetted.vc/logo.png",
              "offers": {
                "@type": "EducationalOccupationalProgram",
                "name": "Combat Veteran Entrepreneur Program",
                "description": "10-week accelerator program for veteran-founded startups",
                "provider": {
                  "@type": "Organization",
                  "name": "The Vetted by Accelerator"
                },
                "programType": "Accelerator",
                "timeToComplete": "P10W"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${blackOpsOne.variable} font-sans antialiased`}
      >
        <AdminProvider>
          <ConditionalNavigation />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
        </AdminProvider>
      </body>
    </html>
  );
}
