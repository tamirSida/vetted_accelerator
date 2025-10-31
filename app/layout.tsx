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
  title: "Alpha-Bet | Entrepreneurship Program for Combat Veterans",
  description: "Entrepreneurship program for US and Israeli combat veterans. From battlefield to business - your next mission starts here.",
  keywords: "veterans, entrepreneurship, startup, combat veterans, business program, Version Bravo, military veterans, veteran business, startup accelerator",
  authors: [{ name: "Alpha-Bet Program" }],
  creator: "Alpha-Bet Program",
  publisher: "Alpha-Bet Program",
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
    title: "Alpha-Bet | Entrepreneurship Program for Combat Veterans",
    description: "Entrepreneurship program for US and Israeli combat veterans. From battlefield to business - your next mission starts here.",
    url: "https://alpha-bet.org",
    siteName: "Alpha-Bet",
    type: "website",
    locale: "en_US",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha-Bet | Entrepreneurship Program for Combat Veterans",
    description: "Entrepreneurship program for US and Israeli combat veterans. From battlefield to business - your next mission starts here.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://alpha-bet.org",
  },
  verification: {
    google: "google-site-verification",
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
        <link rel="manifest" href="/site.webmanifest" />
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
              "@type": "EducationalOrganization",
              "name": "Alpha-Bet",
              "description": "Entrepreneurship program for US and Israeli combat veterans",
              "url": "https://alpha-bet.org",
              "educationalCredentialAwarded": "Entrepreneurship Program Certificate",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Alpha-Bet Programs",
                "itemListElement": [
                  {
                    "@type": "Course",
                    "name": "10-Week Entrepreneurship Program",
                    "description": "Comprehensive entrepreneurship program for combat veterans",
                    "provider": {
                      "@type": "Organization",
                      "name": "Alpha-Bet"
                    }
                  }
                ]
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Combat Veterans",
                "geographicArea": ["United States", "Israel"]
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
