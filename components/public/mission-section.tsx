'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { MissionSection as MissionSectionType } from '@/lib/types/cms';

interface MissionSectionProps {
  mission: MissionSectionType;
  onEdit: () => void;
}

export default function MissionSection({ mission, onEdit }: MissionSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { isAdminMode } = useAdmin();

  const config = {
    icon: 'fas fa-bullseye',
    accentColor: 'from-blue-500 to-blue-600',
    glowColor: 'shadow-blue-500/20'
  };

  return (
    <section className="py-16 sm:py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Compact Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
            {mission.title}
          </h2>
          
          <div 
            className={`relative inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1 ${isAdminMode ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''}`}
            onClick={isAdminMode ? onEdit : undefined}
            title={isAdminMode ? 'Click to edit mission' : undefined}
          >
            <span className="text-blue-700 text-xs font-medium tracking-wide uppercase">
              {mission.description || 'Our foundation and purpose'}
            </span>
          </div>
        </div>

        {/* Mission Bullets */}
        <div className="space-y-6">
          <div className="space-y-4">
            {mission.bullets.map((bullet, index) => (
              <div
                key={bullet.id}
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
                    <h4 className="text-xl sm:text-2xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}>
                      {bullet.text}
                    </h4>
                  </div>
                </div>
                
                {/* Hover effect border */}
                <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-to-r ${config.accentColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              </div>
            ))}
            
            {mission.bullets.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-bullseye text-4xl mb-4 opacity-30"></i>
                <p className="text-lg font-medium">No mission bullets added yet.</p>
                {isAdminMode && (
                  <button
                    onClick={onEdit}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Mission Bullets
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}