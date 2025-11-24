'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EXTERNAL_URLS } from '@/lib/config/urls';
import { formatDateForDisplay, getProgramStartMonth, legacyDateToUTC } from '@/lib/utils/timezone';

interface HeroSectionProps {
  headline: string;
  subHeadline: string;
  subHeadline2?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  applicationWindowOpens?: string;
  applicationWindowCloses?: string;
  programStartDate?: string;
  programEndDate?: string;
  cohortNumber?: number;
}

export default function HeroSection({
  headline,
  subHeadline,
  subHeadline2,
  ctaText,
  ctaLink,
  backgroundImage,
  applicationWindowOpens,
  applicationWindowCloses,
  programStartDate,
  programEndDate,
  cohortNumber
}: HeroSectionProps) {
  const [dividerWidth, setDividerWidth] = useState(200);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Convert legacy dates to UTC format for consistency
  const normalizeDate = (dateString: string) => {
    if (!dateString) return '';
    return legacyDateToUTC(dateString);
  };

  // Get application status and message
  const getApplicationStatus = () => {
    const now = new Date();
    const openDate = applicationWindowOpens ? new Date(normalizeDate(applicationWindowOpens)) : null;
    const closeDate = applicationWindowCloses ? new Date(normalizeDate(applicationWindowCloses)) : null;
    const startDate = programStartDate ? new Date(normalizeDate(programStartDate)) : null;
    
    const cohortText = cohortNumber ? `Cohort ${cohortNumber}` : 'Spring Class';
    
    if (!openDate || !closeDate) {
      return {
        message: `Applications for ${cohortText} will be announced soon`,
        status: 'Pending',
        isActive: false,
        statusColor: 'text-gray-500',
        dotColor: 'bg-gray-500'
      };
    }
    
    if (now < openDate) {
      const startDateFormatted = programStartDate ? formatDateForDisplay(normalizeDate(programStartDate)) : '';
      const endDateFormatted = programEndDate ? formatDateForDisplay(normalizeDate(programEndDate)) : '';
      
      let message = `Applications for ${cohortText} open on ${formatDateForDisplay(normalizeDate(applicationWindowOpens || ''))}`;
      if (programStartDate && programEndDate) {
        message += `<br>Program Start Date: ${startDateFormatted}<br>Program End Date: ${endDateFormatted}`;
      }
      
      return {
        message,
        status: 'Opening Soon',
        isActive: false,
        statusColor: 'text-yellow-500',
        dotColor: 'bg-yellow-500'
      };
    } else if (now >= openDate && now <= closeDate) {
      const startDateFormatted = programStartDate ? formatDateForDisplay(normalizeDate(programStartDate)) : '';
      const endDateFormatted = programEndDate ? formatDateForDisplay(normalizeDate(programEndDate)) : '';
      
      let message = `Applications for ${cohortText} are open until ${formatDateForDisplay(normalizeDate(applicationWindowCloses || ''))}`;
      if (startDateFormatted && endDateFormatted) {
        message += `<br>Program Start Date: ${startDateFormatted}<br>Program End Date: ${endDateFormatted}`;
      }
      
      return {
        message,
        status: 'Active',
        isActive: true,
        statusColor: 'text-green-500',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        message: `Application window for ${cohortText} has closed`,
        status: 'Unavailable',
        isActive: false,
        statusColor: 'text-red-500',
        dotColor: 'bg-red-500'
      };
    }
  };

  useEffect(() => {
    const updateDividerWidth = () => {
      if (subtitleRef.current) {
        const textWidth = subtitleRef.current.scrollWidth;
        const maxWidth = window.innerWidth * 0.9;
        setDividerWidth(Math.min(textWidth, maxWidth));
      }
    };

    // Update width on mount and resize
    updateDividerWidth();
    window.addEventListener('resize', updateDividerWidth);
    
    return () => window.removeEventListener('resize', updateDividerWidth);
  }, [subHeadline]);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-4 py-16"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
          {headline.includes('By Version Bravo') ? 
            headline.replace(' By Version Bravo', '').replace('By Version Bravo', '') :
            headline
          }
        </h1>
        {/* First subtitle line */}
        <p 
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-black font-bold mb-4 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Black Ops One', cursive" }}
        >
          {subHeadline}
        </p>
        
        {/* Gradient divider that matches first subtitle width */}
        <div className="flex justify-center mb-4">
          <div 
            className="h-1 bg-blue-700 rounded-full transition-all duration-300"
            style={{ width: `${dividerWidth}px` }}
          ></div>
        </div>
        
        {/* Second subtitle line */}
        {subHeadline2 && (
          <p className="text-lg sm:text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto leading-relaxed">
            {subHeadline2}
          </p>
        )}
        
        {/* Application Status Message */}
        {(applicationWindowOpens || applicationWindowCloses || programStartDate) && (
          <div id="application-status" className="bg-gradient-to-r from-blue-500/10 to-gray-500/10 backdrop-blur-md rounded-xl border border-gray-400/30 px-4 sm:px-8 py-3 sm:py-5 mb-6 max-w-3xl mx-auto shadow-lg">
            <div className="text-center">
              <div 
                className="text-sm sm:text-lg text-black font-medium leading-relaxed mb-3" 
                style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}
                dangerouslySetInnerHTML={{ __html: getApplicationStatus().message }}
              />
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 ${getApplicationStatus().dotColor} rounded-full ${getApplicationStatus().isActive ? 'animate-pulse' : ''}`}></div>
                <span className={`text-xs font-medium ${getApplicationStatus().statusColor}`}>Status: {getApplicationStatus().status}</span>
              </div>
              <div className="mt-4">
                <Link href={EXTERNAL_URLS.APPLY_FORM}>
                  <Button 
                    size="sm"
                    className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={ctaLink}>
            <Button 
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
      
    </section>
  );
}