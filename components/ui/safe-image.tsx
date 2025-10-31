'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallback?: React.ReactNode;
}

export default function SafeImage({ 
  src, 
  alt, 
  fill, 
  className, 
  priority, 
  fallback 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Validate and normalize the src
  const getSafeSrc = (src: string): string | null => {
    if (!src) return null;
    
    // If it starts with /, it's a local path - make sure it's correct
    if (src.startsWith('/')) {
      return src;
    }
    
    // If it starts with public/, fix it to be a proper local path
    if (src.startsWith('public/')) {
      return '/' + src.substring(7); // Remove 'public/' and add leading slash
    }
    
    // If it's a full URL, validate it
    try {
      new URL(src);
      return src;
    } catch {
      return null;
    }
  };

  const safeSrc = getSafeSrc(src);

  // If no valid src or error occurred, show fallback
  if (!safeSrc || hasError) {
    return fallback || (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="text-center text-white p-8">
          <i className="fas fa-image text-4xl mb-2 opacity-60"></i>
          <p className="text-sm opacity-80">Image failed to load</p>
          {src && (
            <p className="text-xs opacity-60 mt-1">Path: {src}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
      unoptimized={safeSrc.startsWith('/')}
    />
  );
}