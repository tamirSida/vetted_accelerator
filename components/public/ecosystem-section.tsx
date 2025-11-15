'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { EcosystemSection, EcosystemCard } from '@/lib/types/cms';
import EditableSection from '@/components/admin/editable-section';

interface EcosystemSectionProps {
  ecosystemSection: EcosystemSection | null;
  ecosystemCards: EcosystemCard[];
  onEditSection?: (section: EcosystemSection) => void;
  onEditCard?: (card: EcosystemCard) => void;
  onAddCard?: () => void;
  onDeleteCard?: (card: EcosystemCard) => void;
}

export default function EcosystemSectionComponent({ 
  ecosystemSection, 
  ecosystemCards, 
  onEditSection,
  onEditCard,
  onAddCard,
  onDeleteCard
}: EcosystemSectionProps) {
  const { isAdminMode } = useAdmin();

  // Default content if no CMS data
  const defaultSection = {
    title: 'Ecosystem',
    subtitle: 'Education. Acceleration. Investment.',
    description: 'Vetted empowers combat veterans to build and scale companies — from first idea to venture funding.'
  };

  const activeSection = ecosystemSection || defaultSection;

  const defaultCards = [
    {
      id: 'default-1',
      title: 'Alpha-Bet',
      description: 'Non-profit school for aspiring founders.',
      icon: 'fas fa-graduation-cap',
      order: 1,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'default-2', 
      title: 'Vetted Accelerator + Fund',
      description: 'Early-stage investment and venture growth.',
      icon: 'fas fa-rocket',
      order: 2,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'default-3',
      title: 'Alumni Network',
      description: 'Lifelong mentorship, funding, and community.',
      icon: 'fas fa-users',
      order: 3,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Merge CMS cards with defaults - CMS cards override hardcoded ones
  const mergeCardsWithDefaults = () => {
    // Filter visible CMS cards and sort by order
    const visibleCmsCards = ecosystemCards
      .filter(card => card.isVisible !== false)
      .sort((a, b) => a.order - b.order);
    
    // Filter hardcoded cards that are NOT overridden by CMS (by ID or title)
    const visibleDefaultCards = defaultCards
      .filter(card => card.isVisible !== false)
      .filter(defaultCard => !visibleCmsCards.some(cmsCard => 
        cmsCard.id === defaultCard.id || cmsCard.title === defaultCard.title
      ))
      .sort((a, b) => a.order - b.order);
    
    // Combine CMS and remaining hardcoded cards, sort by order
    const allCards = [...visibleCmsCards, ...visibleDefaultCards];
    return allCards.sort((a, b) => a.order - b.order);
  };

  const displayCards = mergeCardsWithDefaults();

  return (
    <EditableSection
      sectionName="Ecosystem Section"
      onEdit={() => ecosystemSection && onEditSection?.(ecosystemSection)}
    >
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
              {activeSection.title}
            </h2>
            <p className="text-xl sm:text-2xl font-semibold text-blue-600 mb-6" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}>
              {activeSection.subtitle}
            </p>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {activeSection.description}
            </p>
            
            {/* Admin Controls for Section */}
            {isAdminMode && ecosystemSection && (
              <div className="absolute top-0 right-0">
                <button
                  onClick={() => onEditSection?.(ecosystemSection)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  title="Edit section"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit Section
                </button>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {displayCards.map((card, index) => (
              <div key={card.id} className="group relative">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full border border-gray-200 hover:border-blue-300">
                  {/* Card Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${card.icon} text-2xl text-white`}></i>
                  </div>
                  
                  {/* Card Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 group-hover:text-blue-600 transition-colors duration-300" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}>
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                  
                  {/* Admin Controls for Cards */}
                  {isAdminMode && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => onEditCard?.(card)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        title="Edit card"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {!defaultCards.some(defaultCard => defaultCard.id === card.id || defaultCard.title === card.title) && (
                        <button
                          onClick={() => onDeleteCard?.(card)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          title="Delete card"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Card Button */}
            {isAdminMode && (
              <div className="group">
                <button
                  onClick={() => onAddCard?.()}
                  className="w-full h-full min-h-[280px] bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors duration-300">
                    <i className="fas fa-plus text-2xl text-gray-400 group-hover:text-blue-500"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Add New Card</h3>
                  <p className="text-sm text-center">Click to add a new ecosystem card</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}