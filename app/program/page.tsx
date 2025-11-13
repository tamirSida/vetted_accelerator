'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { ProgramPhase, ProgramSnapshot, ProgramSnapshotItem, ProgramBenefit, AcceleratorImageSection } from '@/lib/types/cms';
import EditableSection from '@/components/admin/editable-section';
import EditModal from '@/components/admin/edit-modal';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import Image from 'next/image';
import Link from 'next/link';

export default function ProgramPage() {
  const { isAdminMode } = useAdmin();
  const [programPhases, setProgramPhases] = useState<ProgramPhase[]>([]);
  const [programSnapshot, setProgramSnapshot] = useState<ProgramSnapshot | null>(null);
  const [programSnapshotItems, setProgramSnapshotItems] = useState<ProgramSnapshotItem[]>([]);
  const [programBenefits, setProgramBenefits] = useState<ProgramBenefit[]>([]);
  const [acceleratorImageSection, setAcceleratorImageSection] = useState<AcceleratorImageSection | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const snapshotSectionRef = useRef<HTMLElement>(null);

  // Enable URL-based admin access
  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const [phasesData, snapshotData, snapshotItemsData, benefitsData, imageSectionData] = await Promise.all([
        CMSServiceFactory.getProgramPhaseService().getVisible(),
        CMSServiceFactory.getProgramSnapshotService().getActiveSnapshot(),
        CMSServiceFactory.getProgramSnapshotItemService().getVisible(),
        CMSServiceFactory.getProgramBenefitService().getVisible(),
        CMSServiceFactory.getAcceleratorImageSectionService().getActiveSection()
      ]);

      // If no phases exist, create default ones
      if (phasesData.length === 0) {
        const defaultPhases = [
          {
            title: 'ISRAEL',
            subtitle: 'Your journey starts and ends with two 10-day bootcamps on two continents.',
            description: 'Israel: The birthplace of the Startup Nation and the first stop on your journey from operator to founder. For two immersive weeks, founders dive into one of the world\'s most dynamic startup ecosystems, a place defined by speed, ingenuity, and built on grit and resilience.',
            duration: '10 days',
            graphics: [
              {
                id: 'graphic-1',
                title: 'Workshops in Storytelling, Networking Training, Fundraising Strategy, Customer Discovery Workshops',
                description: 'Comprehensive workshop series covering essential startup skills',
                order: 1
              },
              {
                id: 'graphic-2', 
                title: 'Building Lasting Relationships',
                description: 'Visit historical sites around Israel including the Old City of Jerusalem, and forge relationships with other combat veteran founders that will last a lifetime.',
                order: 2
              },
              {
                id: 'graphic-3',
                title: 'Dedicated Mentorship',
                description: 'You\'ll meet your dedicated mentor here, beginning a hands-on partnership that will shape your company\'s next phase and continue well beyond the program.',
                order: 3
              }
            ],
            order: 1,
            isVisible: true
          },
          {
            title: 'Mentorship Phase (6 Weeks)',
            subtitle: 'No one builds alone.',
            description: 'Every founder in the Vetted Accelerator is paired with a dedicated mentor who is a seasoned founder, investor, or operator who\'s not just been in the arena before but is still there now. These mentors aren\'t advisors in name only; they\'re hands-on partners who help you pressure-test your strategy, navigate challenges, and hold you accountable.',
            duration: '6 weeks',
            graphics: [],
            order: 2,
            isVisible: true
          },
          {
            title: 'MIAMI',
            subtitle: 'A new frontier of tech and capital.',
            description: 'Over the last few years, Miami has transformed into one of the fastest-growing startup hubs in the US with an influx of investors, serial entrepreneurs, and startup talent. Vetted has established itself as one of the premier accelerator programs in South Florida by launching its partnership with The LAB Miami.',
            duration: '2 weeks',
            graphics: [],
            order: 3,
            isVisible: true
          }
        ];

        try {
          for (const phase of defaultPhases) {
            await CMSServiceFactory.getProgramPhaseService().create(phase);
          }
          const newPhasesData = await CMSServiceFactory.getProgramPhaseService().getVisible();
          setProgramPhases(newPhasesData);
        } catch (error) {
          console.error('Error creating default phases:', error);
          setProgramPhases([]);
        }
      } else {
        setProgramPhases(phasesData);
      }

      // If no snapshot items exist, create default ones
      if (snapshotItemsData.length === 0) {
        const defaultSnapshotItems = [
          {
            title: 'Stage',
            description: 'Pre-Seed or Pre-Incorporation',
            icon: 'fas fa-seedling',
            order: 1,
            isVisible: true
          },
          {
            title: 'Duration',
            description: '10 weeks',
            icon: 'fas fa-clock',
            order: 2,
            isVisible: true
          },
          {
            title: 'Format',
            description: 'Hybrid (online + two 10-day bootcamps in Israel and Florida)',
            icon: 'fas fa-laptop',
            order: 3,
            isVisible: true
          },
          {
            title: 'Cohort Size',
            description: '16–20 startups',
            icon: 'fas fa-users',
            order: 4,
            isVisible: true
          },
          {
            title: 'Demo Day',
            description: 'The LAB Miami',
            icon: 'fas fa-trophy',
            order: 5,
            isVisible: true
          }
        ];
        
        try {
          for (const item of defaultSnapshotItems) {
            await CMSServiceFactory.getProgramSnapshotItemService().create(item);
          }
          const newSnapshotItemsData = await CMSServiceFactory.getProgramSnapshotItemService().getVisible();
          setProgramSnapshotItems(newSnapshotItemsData);
        } catch (error) {
          console.error('Error creating default snapshot items:', error);
          setProgramSnapshotItems([]);
        }
      } else {
        setProgramSnapshotItems(snapshotItemsData);
      }
      
      // Legacy snapshot support (keep for backwards compatibility)
      setProgramSnapshot(snapshotData);

      // If no benefits exist, create default ones
      if (benefitsData.length === 0) {
        const defaultBenefits = [
          {
            title: 'Integrated Funding Path',
            description: 'Direct investment from the Vetted Fund, plus follow-on opportunities through our LP and investor network.',
            icon: 'fas fa-dollar-sign',
            order: 1,
            isVisible: true
          },
          {
            title: 'Elite Mentorship',
            description: 'Work 1-on-1 with founders, operators, and investors who\'ve built multi-million-dollar companies and served at the highest levels.',
            icon: 'fas fa-user-tie',
            order: 2,
            isVisible: true
          },
          {
            title: 'Battle-Tested Module Program',
            description: 'Hands-on workshops in GTM, product, fundraising, storytelling, and more. (Click to view full module program.).',
            icon: 'fas fa-graduation-cap',
            order: 3,
            isVisible: true
          },
          {
            title: 'The Vetted Network',
            description: 'A global community of veteran founders, investors, and partners in both the U.S. and Israel.',
            icon: 'fas fa-globe',
            order: 4,
            isVisible: true
          },
          {
            title: 'Lifelong Alumni Network',
            description: 'When the 10 weeks end, you have access to the Vetted Alumni Network, where founders, mentors, and investors continue to serve each other for life.',
            icon: 'fas fa-users',
            order: 5,
            isVisible: true
          }
        ];

        try {
          for (const benefit of defaultBenefits) {
            await CMSServiceFactory.getProgramBenefitService().create(benefit);
          }
          const newBenefitsData = await CMSServiceFactory.getProgramBenefitService().getVisible();
          setProgramBenefits(newBenefitsData);
        } catch (error) {
          console.error('Error creating default benefits:', error);
          setProgramBenefits([]);
        }
      } else {
        setProgramBenefits(benefitsData);
      }

      setAcceleratorImageSection(imageSectionData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Scroll-triggered animation for snapshot cards
  useEffect(() => {
    if (programSnapshotItems.length === 0 || !snapshotSectionRef.current) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement;
          const cards = section.querySelectorAll('.snapshot-card');
          console.log('🎬 Triggering animation for', cards.length, 'cards');
          
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-appear');
              console.log(`✨ Animating card ${index + 1}`);
            }, index * 150);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const section = snapshotSectionRef.current;
    if (section) {
      console.log('👀 Setting up observer for snapshot section');
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, [programSnapshotItems]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const handleEditPhase = useCallback((phase: ProgramPhase) => {
    setEditingType('program-phase');
    setEditingItem(phase);
    setEditModalOpen(true);
  }, []);

  const handleEditGraphic = useCallback((phase: ProgramPhase, graphic: any) => {
    setEditingType('program-graphic');
    setEditingItem({ ...graphic, phaseId: phase.id });
    setEditModalOpen(true);
  }, []);

  const handleAddGraphic = useCallback((phase: ProgramPhase) => {
    setEditingType('program-graphic');
    setEditingItem({ phaseId: phase.id });
    setEditModalOpen(true);
  }, []);

  const handleEditSnapshotItem = useCallback((item: ProgramSnapshotItem) => {
    setEditingType('program-snapshot-item');
    setEditingItem(item);
    setEditModalOpen(true);
  }, []);

  const handleAddSnapshotItem = useCallback(() => {
    setEditingType('program-snapshot-item');
    setEditingItem({});
    setEditModalOpen(true);
  }, []);

  const handleDeleteSnapshotItem = useCallback(async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this snapshot item?')) {
      try {
        await CMSServiceFactory.getProgramSnapshotItemService().delete(itemId);
        await loadContent();
      } catch (error) {
        console.error('Error deleting snapshot item:', error);
        alert('Failed to delete snapshot item. Please try again.');
      }
    }
  }, [loadContent]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'program-phase') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getProgramPhaseService().update(editingItem.id, data);
        } else {
          const phaseData = {
            ...data,
            isVisible: true,
            order: programPhases.length + 1,
            graphics: []
          };
          await CMSServiceFactory.getProgramPhaseService().create(phaseData);
        }
      } else if (editingType === 'program-graphic') {
        const phaseId = editingItem.phaseId;
        const phase = programPhases.find(p => p.id === phaseId);
        if (!phase) return;

        let updatedGraphics = [...(phase.graphics || [])];
        
        if (editingItem.id) {
          // Update existing graphic
          const graphicIndex = updatedGraphics.findIndex(g => g.id === editingItem.id);
          if (graphicIndex !== -1) {
            updatedGraphics[graphicIndex] = { ...updatedGraphics[graphicIndex], ...data };
          }
        } else {
          // Add new graphic
          const newGraphic = {
            ...data,
            id: `graphic-${Date.now()}`,
            order: updatedGraphics.length + 1
          };
          updatedGraphics.push(newGraphic);
        }

        await CMSServiceFactory.getProgramPhaseService().update(phaseId, {
          ...phase,
          graphics: updatedGraphics
        });
      } else if (editingType === 'program-snapshot') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getProgramSnapshotService().update(editingItem.id, data);
        } else {
          const snapshotData = {
            ...data,
            isVisible: true,
            order: 1
          };
          await CMSServiceFactory.getProgramSnapshotService().create(snapshotData);
        }
      } else if (editingType === 'program-snapshot-item') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getProgramSnapshotItemService().update(editingItem.id, data);
        } else {
          const snapshotItemData = {
            ...data,
            isVisible: true,
            order: programSnapshotItems.length + 1
          };
          await CMSServiceFactory.getProgramSnapshotItemService().create(snapshotItemData);
        }
      } else if (editingType === 'program-benefit') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getProgramBenefitService().update(editingItem.id, data);
        } else {
          const benefitData = {
            ...data,
            isVisible: true,
            order: programBenefits.length + 1
          };
          await CMSServiceFactory.getProgramBenefitService().create(benefitData);
        }
      } else if (editingType === 'accelerator-image-section') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getAcceleratorImageSectionService().update(editingItem.id, data);
        } else {
          const imageSectionData = {
            ...data,
            isVisible: true,
            order: 1
          };
          await CMSServiceFactory.getAcceleratorImageSectionService().create(imageSectionData);
        }
      }
      
      await loadContent();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [editingType, editingItem, loadContent, programPhases, programBenefits.length, programSnapshotItems.length]);

  const getEditFields = useCallback(() => {
    switch (editingType) {
      case 'program-phase':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., ISRAEL' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' as const, required: true, placeholder: 'e.g., Your journey starts...' },
          { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Enter the phase description...' },
          { key: 'duration', label: 'Duration', type: 'text' as const, required: true, placeholder: 'e.g., 10 days' },
          { key: 'image', label: 'Image URL', type: 'text' as const, required: false, placeholder: 'https://example.com/image.jpg' }
        ];
      case 'program-graphic':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: false, placeholder: 'e.g., Workshops in Storytelling...' },
          { key: 'description', label: 'Description', type: 'textarea' as const, required: false, placeholder: 'Enter the graphic description...' },
          { key: 'image', label: 'Image URL', type: 'text' as const, required: false, placeholder: 'https://example.com/image.jpg' }
        ];
      case 'program-snapshot':
        return [
          { key: 'stage', label: 'Stage', type: 'text' as const, required: true, placeholder: 'e.g., Pre-Seed or Pre-Incorporation' },
          { key: 'duration', label: 'Duration', type: 'text' as const, required: true, placeholder: 'e.g., 10 weeks' },
          { key: 'format', label: 'Format', type: 'text' as const, required: true, placeholder: 'e.g., Hybrid (online + two 10-day bootcamps...)' },
          { key: 'cohortSize', label: 'Cohort Size', type: 'text' as const, required: true, placeholder: 'e.g., 16–20 startups' },
          { key: 'demoDay', label: 'Demo Day', type: 'text' as const, required: true, placeholder: 'e.g., The LAB Miami' }
        ];
      case 'program-snapshot-item':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., Stage, Duration, Format' },
          { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'e.g., Pre-Seed or Pre-Incorporation' },
          { key: 'icon', label: 'Icon (FontAwesome class)', type: 'text' as const, required: true, placeholder: 'e.g., fas fa-seedling' }
        ];
      case 'program-benefit':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., Integrated Funding Path' },
          { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Enter the benefit description...' },
          { key: 'icon', label: 'Icon (FontAwesome class)', type: 'text' as const, required: true, placeholder: 'e.g., fas fa-dollar-sign' }
        ];
      case 'accelerator-image-section':
        return [
          { key: 'title', label: 'Section Title', type: 'text' as const, required: false, placeholder: 'e.g., Our Accelerator in Action' },
          { key: 'description', label: 'Description', type: 'textarea' as const, required: false, placeholder: 'Enter the section description...' },
          { key: 'image', label: 'Image URL', type: 'text' as const, required: true, placeholder: 'https://example.com/image.jpg' }
        ];
      default:
        return [];
    }
  }, [editingType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Controls */}
      <DiscreteAdminAccess />
      <DiscreteAdminDot />
      <SimpleAdminToggle />

      {/* Vetted Accelerator Section */}
      <section className="py-8 sm:py-12 px-4 bg-gradient-to-br from-white via-white to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Text Content - Left Side */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 text-sm font-medium tracking-wide">ACCELERATOR PROGRAM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
                The Vetted Accelerator
              </h1>
              <h2 className="text-lg sm:text-xl text-blue-600 leading-relaxed mb-8" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
                Our #1 Principle: Provide Value to our Founders
              </h2>
              
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  You've led teams, executed under pressure, and thrived where others wouldn't dare.
                </p>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  Now it's time to bring that same mindset to your next mission: building a world-class company.
                </p>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  The Vetted Accelerator is a 10-week venture program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.
                </p>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  This is not a theoretical program. Vetted was designed to help launch your company, connect you with an unmatched network, and give you the tools, funding, and relationships to scale fast.
                </p>
              </div>
            </div>

            {/* Image Section - Right Side */}
            <div className="relative">
              {acceleratorImageSection ? (
                <>
                  {isAdminMode && (
                    <button
                      onClick={() => {
                        setEditingType('accelerator-image-section');
                        setEditingItem(acceleratorImageSection);
                        setEditModalOpen(true);
                      }}
                      className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors z-10"
                      title="Edit image section"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Edit Section
                    </button>
                  )}
                  <Image
                    src={acceleratorImageSection.image}
                    alt={acceleratorImageSection.title || 'Accelerator image'}
                    width={600}
                    height={500}
                    className="rounded-xl shadow-lg object-cover w-full h-[350px] sm:h-[450px]"
                  />
                </>
              ) : isAdminMode ? (
                <div className="text-center">
                  <button
                    onClick={() => {
                      setEditingType('accelerator-image-section');
                      setEditingItem({});
                      setEditModalOpen(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Add Image Section
                  </button>
                </div>
              ) : (
                <div className="w-full h-[350px] sm:h-[450px] bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500">Image coming soon...</span>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* Program Snapshot Section */}
      <section ref={snapshotSectionRef} id="program-snapshot-section" className="py-20 px-4 bg-gradient-to-br from-white via-white to-gray-100 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/3 to-gray-600/3 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-blue-200/50 shadow-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-blue-700 text-sm font-medium tracking-wider uppercase">At a Glance</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black animate-fade-in-up" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Program Snapshot
            </h2>
            
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up delay-200">
              Everything you need to know about the Vetted Accelerator in one powerful overview
            </p>

            {isAdminMode && (
              <button
                onClick={handleAddSnapshotItem}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg font-semibold animate-fade-in-up delay-300"
              >
                <i className="fas fa-plus"></i>
                Add Snapshot Item
              </button>
            )}
          </div>
          
          {programSnapshotItems.length > 0 ? (
            <div className="max-w-7xl mx-auto">
              {/* First Row - First 3 items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 justify-items-center">
                {programSnapshotItems.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group relative snapshot-card opacity-0 translate-y-8 w-full max-w-[350px]"
                    data-index={index}
                  >
                    {/* Subtle Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-gray-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Main Card */}
                    <div className="relative bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 h-full transition-all duration-500 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:transform hover:scale-105 hover:-translate-y-3 group-hover:bg-white/95 min-h-[280px] sm:min-h-[320px]">
                      
                      {/* Admin Controls */}
                      {isAdminMode && (
                        <div className="absolute -top-3 -right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => handleEditSnapshotItem(item)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                            title="Edit snapshot item"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteSnapshotItem(item.id)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                            title="Delete snapshot item"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}

                      {/* Icon Container */}
                      <div className="relative mb-6 sm:mb-8 flex justify-center">
                        <div className="relative">
                          {/* Icon Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 group-hover:scale-125 transition-all duration-500"></div>
                          
                          {/* Icon Circle */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                            <i className={`${item.icon} text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300`}></i>
                          </div>
                          
                          {/* Pulse Ring */}
                          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 group-hover:border-blue-500/50 transition-all duration-500 animate-pulse scale-110"></div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-blue-700 transition-colors duration-300 leading-tight" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors duration-300 px-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Row - Remaining items (centered) */}
              {programSnapshotItems.length > 3 && (
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                  {programSnapshotItems.slice(3).map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group relative snapshot-card opacity-0 translate-y-8 w-full max-w-[350px] sm:w-auto sm:min-w-[280px] sm:max-w-[350px]"
                      data-index={index + 3}
                    >
                      {/* Subtle Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-gray-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Main Card */}
                      <div className="relative bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 h-full transition-all duration-500 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:transform hover:scale-105 hover:-translate-y-3 group-hover:bg-white/95 min-h-[280px] sm:min-h-[320px]">
                        
                        {/* Admin Controls */}
                        {isAdminMode && (
                          <div className="absolute -top-3 -right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={() => handleEditSnapshotItem(item)}
                              className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                              title="Edit snapshot item"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteSnapshotItem(item.id)}
                              className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                              title="Delete snapshot item"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        )}

                        {/* Icon Container */}
                        <div className="relative mb-6 sm:mb-8 flex justify-center">
                          <div className="relative">
                            {/* Icon Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 group-hover:scale-125 transition-all duration-500"></div>
                            
                            {/* Icon Circle */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                              <i className={`${item.icon} text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300`}></i>
                            </div>
                            
                            {/* Pulse Ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 group-hover:border-blue-500/50 transition-all duration-500 animate-pulse scale-110"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-blue-700 transition-colors duration-300 leading-tight" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
                            {item.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors duration-300 px-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg animate-fade-in-up">
              {isAdminMode && (
                <button
                  onClick={handleAddSnapshotItem}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg font-semibold"
                >
                  <i className="fas fa-plus"></i>
                  Add Program Snapshot Items
                </button>
              )}
              {!isAdminMode && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <i className="fas fa-clock text-white text-xl"></i>
                  </div>
                  <p className="text-gray-600">Program snapshot coming soon...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes appear {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
          
          .animate-appear {
            animation: appear 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          .snapshot-card {
            transition: opacity 0.3s ease, transform 0.3s ease;
          }
          
          .delay-200 {
            animation-delay: 200ms;
          }
          
          .delay-300 {
            animation-delay: 300ms;
          }
          
          .delay-1000 {
            animation-delay: 1000ms;
          }
          
          /* Mobile optimizations */
          @media (max-width: 640px) {
            .snapshot-card .group:hover {
              transform: scale(1.02) translateY(-2px);
            }
          }
        `}</style>
      </section>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 px-4 bg-gradient-to-br from-white via-white to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 relative group">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Accelerator Overview
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              A comprehensive 10-week journey from operator to founder, with immersive bootcamps in Israel and Miami.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            
            {programPhases.map((phase, index) => (
              <div key={phase.id} className="relative mb-12">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Content */}
                <div className="ml-20">
                  <div 
                    className="bg-white rounded-xl shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">{phase.duration}</span>
                          <h3 className="text-2xl font-bold text-black mt-1" style={{ fontFamily: "'Black Ops One', cursive" }}>
                            {phase.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdminMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPhase(phase);
                              }}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              title="Edit phase"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          <i className={`fas fa-chevron-${expandedPhase === phase.id ? 'up' : 'down'} text-gray-400`}></i>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{phase.subtitle}</p>
                      
                      {expandedPhase === phase.id && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                          <p className="text-gray-700 leading-relaxed mb-6">{phase.description}</p>
                          
                          {/* Phase Image */}
                          {phase.image && (
                            <div className="mb-6">
                              <Image
                                src={phase.image}
                                alt={phase.title}
                                width={600}
                                height={300}
                                className="w-full h-auto rounded-lg shadow-md object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Graphics/Content Blocks */}
                          {phase.graphics && phase.graphics.length > 0 && (
                            <div className="space-y-4">
                              {phase.graphics.map((graphic, graphicIndex) => (
                                <div key={graphic.id} className="bg-gray-50 rounded-lg p-4 relative">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">
                                      {graphic.title}
                                    </h4>
                                    {isAdminMode && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditGraphic(phase, graphic);
                                        }}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors ml-2"
                                        title="Edit graphic"
                                      >
                                        <i className="fas fa-edit"></i>
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm">{graphic.description}</p>
                                  {graphic.image && (
                                    <div className="mt-3">
                                      <Image
                                        src={graphic.image}
                                        alt={graphic.title || 'Graphic image'}
                                        width={800}
                                        height={500}
                                        className="max-w-2xl h-80 rounded-md object-contain bg-gray-100"
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Add Graphic Button */}
                          {isAdminMode && (
                            <div className="mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddGraphic(phase);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                title="Add new graphic"
                              >
                                <i className="fas fa-plus"></i>
                                Add Graphic
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
              What You'll Get
            </h2>
            {isAdminMode && (
              <button
                onClick={() => {
                  setEditingType('program-benefit');
                  setEditingItem({});
                  setEditModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mt-4"
              >
                <i className="fas fa-plus"></i>
                Add Benefit
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {programBenefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative w-full sm:w-auto sm:min-w-[280px] sm:max-w-[350px]">
                {isAdminMode && (
                  <button
                    onClick={() => {
                      setEditingType('program-benefit');
                      setEditingItem(benefit);
                      setEditModalOpen(true);
                    }}
                    className="absolute top-4 right-4 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    title="Edit benefit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${benefit.icon} text-blue-600 text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-white to-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Ready for the Next Step?</h2>
            <p className="text-gray-800 max-w-2xl mx-auto">Continue exploring the Vetted Accelerator to see how we can help transform your military experience into entrepreneurial success.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link
              href="/curriculum"
              className="group block relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 bg-white text-gray-900 border-white shadow-2xl"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-900 text-white">
                    <i className="fas fa-graduation-cap text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold leading-tight text-gray-900">View Program Modules</h3>
                  </div>
                  <div className="text-gray-900">
                    <i className="fas fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">Explore our comprehensive 16-week curriculum and see what you'll learn.</p>
              </div>
            </Link>
            
            <Link
              href="/team"
              className="group block relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 bg-white/10 text-white border-blue-200 shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-blue-300"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 border border-blue-200 shadow-md group-hover:bg-blue-200 group-hover:shadow-lg">
                    <i className="fas fa-users text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold leading-tight text-blue-600">Meet Our Team</h3>
                  </div>
                  <div className="text-blue-500">
                    <i className="fas fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
                <p className="leading-relaxed text-blue-700">Get to know the experienced veterans and entrepreneurs leading the program.</p>
              </div>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://application.alphabet.vbv.vc"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              <i className="fas fa-rocket"></i>
              <span>Apply to Vetted Accelerator</span>
            </a>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        title={`${editingItem?.id ? 'Edit' : 'Add'} ${
          editingType === 'program-phase' ? 'Program Phase' : 
          editingType === 'program-graphic' ? 'Graphic' : 
          editingType === 'program-snapshot' ? 'Program Snapshot' :
          editingType === 'program-snapshot-item' ? 'Snapshot Item' :
          editingType === 'program-benefit' ? 'Benefit' : 
          'Content'
        }`}
        fields={getEditFields()}
        initialData={editingItem}
      />
    </div>
  );
}