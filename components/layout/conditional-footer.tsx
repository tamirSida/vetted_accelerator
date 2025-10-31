'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/public/footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Show footer on all pages now that splash page is removed
  return <Footer />;
}