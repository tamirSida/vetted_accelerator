'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function CTASection({ 
  title, 
  description, 
  buttonText, 
  buttonLink 
}: CTASectionProps) {
  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-white via-white to-gray-400">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Content */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
          {title}
        </h2>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 sm:mb-12 max-w-3xl mx-auto">
          {description}
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href={buttonLink}>
            <Button 
              size="lg"
              className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-lg shadow-lg"
            >
              {buttonText}
            </Button>
          </Link>
        </div>

        {/* Bottom Features */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
              <i className="fas fa-users text-lg"></i>
              <span className="text-sm font-medium">Elite Community</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
              <i className="fas fa-graduation-cap text-lg"></i>
              <span className="text-sm font-medium">Proven Curriculum</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
              <i className="fas fa-handshake text-lg"></i>
              <span className="text-sm font-medium">Veteran Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}