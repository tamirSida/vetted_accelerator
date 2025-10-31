'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';

interface Highlight {
  id: string;
  text: string;
  order: number;
}

interface ContentSectionProps {
  title: string;
  content: string;
  type?: string;
  description?: string; // Override the default description
  className?: string;
  onEditHighlight?: (highlight?: Highlight, index?: number) => void;
  onDeleteHighlight?: (highlight: Highlight, index: number) => void;
  onAddHighlight?: () => void;
  onEditDescription?: () => void;
}

export default function ContentSection({ 
  title, 
  content, 
  type,
  description,
  className = '',
  onEditHighlight,
  onDeleteHighlight,
  onAddHighlight,
  onEditDescription
}: ContentSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { isAdminMode } = useAdmin();

  const getTypeConfig = (sectionType?: string) => {
    switch (sectionType) {
      case 'mission':
        return {
          icon: 'fas fa-bullseye',
          accentColor: 'from-blue-500 to-blue-600',
          glowColor: 'shadow-blue-500/20',
          description: 'Our foundation and purpose'
        };
      case 'why-alpha-bet':
        return {
          icon: 'fas fa-star',
          accentColor: 'from-blue-500 to-blue-600',
          glowColor: 'shadow-blue-500/20',
          description: 'What makes us unique'
        };
      case 'what-you-gain':
        return {
          icon: 'fas fa-trophy',
          accentColor: 'from-blue-500 to-blue-600',
          glowColor: 'shadow-blue-500/20',
          description: 'Your transformation journey'
        };
      default:
        return {
          icon: 'fas fa-info-circle',
          accentColor: 'from-gray-500 to-gray-600',
          glowColor: 'shadow-gray-500/20',
          description: 'Learn more'
        };
    }
  };

  const config = getTypeConfig(type);
  // Use custom description if provided, otherwise use default from config
  const displayDescription = description || config.description;

  // Parse content into structured format with titles and descriptions
  const parseContent = (text: string) => {
    const result: { bullets: { title: string; description?: string }[] } = { bullets: [] };
    
    // Look for all bullet points in the entire text (not just sections)
    const allLines = text.split('\n');
    const bulletLines = allLines.filter(line => 
      line.trim().startsWith('•') || line.trim().startsWith('-')
    );
    
    if (bulletLines.length > 0) {
      bulletLines.forEach(line => {
        const cleanLine = line.replace(/^[•-]\s*/, '').trim();
        if (cleanLine.includes(':')) {
          const colonIndex = cleanLine.indexOf(':');
          const title = cleanLine.substring(0, colonIndex).trim();
          const description = cleanLine.substring(colonIndex + 1).trim();
          result.bullets.push({ title, description });
        } else {
          result.bullets.push({ title: cleanLine });
        }
      });
    } else if (text.trim()) {
      // If no bullets found at all, treat as single bullet
      result.bullets = [{ title: text.trim() }];
    }
    
    return result;
  };

  const { bullets } = parseContent(content);

  return (
    <section className={`py-0 px-4 bg-transparent ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Compact Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
            {title}
          </h2>
          
          <div 
            className={`relative inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1 ${isAdminMode && onEditDescription ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''}`}
            onClick={isAdminMode && onEditDescription ? onEditDescription : undefined}
            title={isAdminMode && onEditDescription ? 'Click to edit description' : undefined}
          >
            <span className="text-blue-700 text-xs font-medium tracking-wide uppercase">
              {displayDescription}
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="space-y-6">

          {/* Bullet Points */}
          {bullets.length > 0 && (
            <div className="space-y-3 lg:space-y-4">
              {bullets.map((bullet, index) => {
              const highlight: Highlight = {
                id: `highlight-${index}`,
                text: bullet.title + (bullet.description ? ': ' + bullet.description : ''),
                order: index
              };
              
              return (
                <div
                  key={index}
                  className="group relative bg-gray-100 backdrop-blur-sm rounded-xl border border-gray-300 p-6 hover:bg-gray-200 transition-all duration-300 cursor-default"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  
                  <div className="flex items-start gap-4">
                    <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${config.accentColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 ${hoveredItem === index ? config.glowColor + ' shadow-lg' : ''}`}>
                      <i className="fas fa-check text-white text-sm font-bold"></i>
                      {hoveredItem === index && (
                        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${config.accentColor} opacity-30 animate-ping`}></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl sm:text-2xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive", fontWeight: 'bold' }}>
                        {bullet.title}
                      </h4>
                      {bullet.description && (
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                          {bullet.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover effect border */}
                  <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-to-r ${config.accentColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
              );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}