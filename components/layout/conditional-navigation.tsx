'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/public/navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Show navigation on all pages now that splash page is removed
  return <Navigation />;
}