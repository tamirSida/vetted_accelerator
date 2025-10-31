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
  title: "Vetted Accelerator | Elite Combat Veteran Startup Program",
  description: "Where veteran grit meets venture growth. A 10-week accelerator program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.",
  keywords: "veteran startup accelerator, combat veteran entrepreneurs, military startup program, veteran founded startups, startup accelerator, veteran business, military entrepreneurs, startup fund, veteran investment",
  authors: [{ name: "Vetted Accelerator" }],
  creator: "Vetted Accelerator",
  publisher: "Vetted Accelerator",
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
    title: "Vetted Accelerator | Elite Combat Veteran Startup Program",
    description: "Where veteran grit meets venture growth. A 10-week accelerator program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.",
    url: "https://vetted-accelerator.com",
    siteName: "Vetted Accelerator",
    type: "website",
    locale: "en_US",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vetted Accelerator | Elite Combat Veteran Startup Program",
    description: "Where veteran grit meets venture growth. A 10-week accelerator program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://vetted-accelerator.com",
  },
  verification: {
    google: "google-site-verification",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vetted Accelerator",
              "description": "A 10-week accelerator program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans",
              "url": "https://vetted-accelerator.com",
              "logo": "https://vetted-accelerator.com/logo.png",
              "sameAs": [],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Vetted Accelerator Programs",
                "itemListElement": [
                  {
                    "@type": "Course",
                    "name": "10-Week Veteran Startup Accelerator",
                    "description": "Elite accelerator program for combat veteran entrepreneurs with funding and mentorship",
                    "provider": {
                      "@type": "Organization",
                      "name": "Vetted Accelerator"
                    },
                    "courseMode": "Hybrid",
                    "duration": "P10W"
                  }
                ]
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Elite Combat Veterans",
                "geographicArea": ["United States", "Israel"]
              },
              "foundingDate": "2024",
              "specialty": "Veteran Startup Acceleration and Investment"
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
