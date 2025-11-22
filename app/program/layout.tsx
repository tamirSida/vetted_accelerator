import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Vetted Program | Version Bravo Elite 10-Week Accelerator for Veteran Entrepreneurs",
  description: "The Vetted accelerator program by Version Bravo: 10-week elite startup program for combat veterans. Bootcamps in Israel & Miami. Join global network of veteran entrepreneurs building world-class companies.",
  keywords: "version bravo program, the vetted program, veteran accelerator program, combat veteran startup program, military entrepreneur bootcamp, veteran founded startups, israeli veteran program, miami veteran accelerator, elite veteran founders program, veteran startup funding, military startup mentorship",
  openGraph: {
    title: "The Vetted Program | Version Bravo Elite 10-Week Accelerator",
    description: "Elite 10-week startup accelerator program for combat veteran entrepreneurs with bootcamps in Israel & Miami.",
    url: "https://accelerator.thevetted.vc/program",
    type: "website",
    images: [{
      url: "https://accelerator.thevetted.vc/og-program.png",
      width: 1200,
      height: 630,
      alt: "The Vetted Program - Version Bravo Accelerator"
    }],
  },
  alternates: {
    canonical: "https://accelerator.thevetted.vc/program",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}