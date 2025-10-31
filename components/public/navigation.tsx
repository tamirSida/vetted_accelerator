'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { EXTERNAL_URLS } from '@/lib/config/urls';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '/team' },
    { name: 'Curriculum', href: '/curriculum' },
    { name: 'Qualifications', href: '/qualifications' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Apply', href: EXTERNAL_URLS.APPLY_FORM, external: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleFAQClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu if open
    
    const scrollToFAQ = (maxAttempts: number = 10) => {
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        console.log('FAQ element found, scrolling...');
        faqElement.scrollIntoView({ behavior: 'smooth' });
        return true;
      } else if (maxAttempts > 0) {
        console.log(`FAQ element not found, retrying... (${maxAttempts} attempts left)`);
        setTimeout(() => scrollToFAQ(maxAttempts - 1), 200);
        return false;
      } else {
        console.error('FAQ element not found after all attempts, trying URL navigation as fallback');
        // Fallback: use URL-based navigation
        window.location.href = '/#faq';
        return false;
      }
    };
    
    if (pathname === '/') {
      // Already on home page, wait a bit then scroll to FAQ
      setTimeout(() => scrollToFAQ(), 100);
    } else {
      // Navigate to home page first, then scroll to FAQ
      router.push('/');
      // Wait longer for navigation to complete
      setTimeout(() => scrollToFAQ(), 500);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-900/95 backdrop-blur-md border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative">
                <Image 
                  src="/logo.png"
                  alt="Alpha-Bet Logo" 
                  width={48}
                  height={48}
                  className="object-contain filter brightness-0 invert" 
                  priority
                  onError={() => console.log('Logo failed to load on mobile')}
                  onLoad={() => console.log('Logo loaded successfully')}
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.name === 'FAQ' ? (
                <button
                  key={item.name}
                  onClick={handleFAQClick}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ) : 'external' in item ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-white"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-800 transition-colors"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <i className="fas fa-times text-lg"></i>
            ) : (
              <i className="fas fa-bars text-lg"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/98 backdrop-blur-md border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              item.name === 'FAQ' ? (
                <button
                  key={item.name}
                  onClick={handleFAQClick}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full text-left cursor-pointer ${
                    isActive(item.href)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-blue-800'
                  }`}
                >
                  {item.name}
                </button>
              ) : 'external' in item ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-300 hover:text-white hover:bg-blue-800"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-blue-800'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}