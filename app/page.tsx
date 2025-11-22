import { Metadata } from 'next';
import AlphaBetHomepage from '@/components/public/homepage';

export const metadata: Metadata = {
  title: "The Vetted Accelerator | Version Bravo Elite Combat Veteran Startup Program",
  description: "The Vetted by Version Bravo: Elite startup accelerator exclusively for combat veteran entrepreneurs. Join our global network building world-class companies. 10-week program in Israel & Miami.",
  keywords: "version bravo, the vetted, vetted accelerator, veteran entrepreneurs, combat veteran startup, military startup accelerator, elite veteran founders, veteran founded companies, startup program veterans, veteran investment fund, israeli veteran startups, us veteran startups, combat veteran entrepreneurs, military entrepreneur accelerator",
  openGraph: {
    title: "The Vetted Accelerator | Version Bravo Elite Combat Veteran Startup Program",
    description: "The Vetted by Version Bravo: Elite startup accelerator exclusively for combat veteran entrepreneurs. Join our global network building world-class companies.",
    url: "https://accelerator.thevetted.vc",
    type: "website",
    images: [{
      url: "https://accelerator.thevetted.vc/og-image.png",
      width: 1200,
      height: 630,
      alt: "The Vetted Accelerator - Version Bravo"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vetted Accelerator | Version Bravo Elite Combat Veteran Startup Program",
    description: "The Vetted by Version Bravo: Elite startup accelerator exclusively for combat veteran entrepreneurs.",
    images: ["https://accelerator.thevetted.vc/twitter-image.png"],
  },
  alternates: {
    canonical: "https://accelerator.thevetted.vc",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <AlphaBetHomepage />;
}
