'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { ProgramPhase, ProgramSnapshot, ProgramBenefit, AcceleratorImageSection } from '@/lib/types/cms';
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
  const [programBenefits, setProgramBenefits] = useState<ProgramBenefit[]>([]);
  const [acceleratorImageSection, setAcceleratorImageSection] = useState<AcceleratorImageSection | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  // Enable URL-based admin access
  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const [phasesData, snapshotData, benefitsData, imageSectionData] = await Promise.all([
        CMSServiceFactory.getProgramPhaseService().getVisible(),
        CMSServiceFactory.getProgramSnapshotService().getActiveSnapshot(),
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

      // If no snapshot exists, create default one
      if (!snapshotData) {
        const defaultSnapshot = {
          stage: 'Pre-Seed or Pre-Incorporation',
          duration: '10 weeks',
          format: 'Hybrid (online + two 10-day bootcamps in Israel and Florida)',
          cohortSize: '16–20 startups',
          demoDay: 'The LAB Miami',
          isVisible: true,
          order: 1
        };
        
        try {
          await CMSServiceFactory.getProgramSnapshotService().create(defaultSnapshot);
          const newSnapshotData = await CMSServiceFactory.getProgramSnapshotService().getActiveSnapshot();
          setProgramSnapshot(newSnapshotData);
        } catch (error) {
          console.error('Error creating default snapshot:', error);
          setProgramSnapshot(null);
        }
      } else {
        setProgramSnapshot(snapshotData);
      }

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
            title: 'Battle-Tested Curriculum',
            description: 'Hands-on workshops in GTM, product, fundraising, storytelling, and more. (Click to view full curriculum.)',
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
  }, [editingType, editingItem, loadContent, programPhases, programBenefits.length]);

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
          <div className="text-center mb-16 relative group">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700 text-sm font-medium tracking-wide">ACCELERATOR PROGRAM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
              The Vetted Accelerator
            </h1>
            <h2 className="text-lg sm:text-xl text-blue-600 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
              Our #1 Principle: Provide Value to our Founders
            </h2>
            
            <div className="prose prose-lg max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 text-left">
                You've led teams, executed under pressure, and thrived where others wouldn't dare.
              </p>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 text-left">
                Now it's time to bring that same mindset to your next mission: building a world-class company.
              </p>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 text-left">
                The Vetted Accelerator is a 10-week venture program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.
              </p>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 text-left">
                This is not a theoretical program. Vetted was designed to help launch your company, connect you with an unmatched network, and give you the tools, funding, and relationships to scale fast.
              </p>
            </div>

            {/* Image Section */}
            {acceleratorImageSection ? (
              <div className="mt-16 relative">
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {(acceleratorImageSection.title || acceleratorImageSection.description) && (
                    <div>
                      {acceleratorImageSection.title && (
                        <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
                          {acceleratorImageSection.title}
                        </h3>
                      )}
                      {acceleratorImageSection.description && (
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {acceleratorImageSection.description}
                        </p>
                      )}
                    </div>
                  )}
                  <div className={`relative ${!(acceleratorImageSection.title || acceleratorImageSection.description) ? 'lg:col-span-2 max-w-4xl mx-auto' : 'max-w-lg mx-auto'}`}>
                    <Image
                      src={acceleratorImageSection.image}
                      alt={acceleratorImageSection.title || 'Accelerator image'}
                      width={600}
                      height={500}
                      className="rounded-xl shadow-lg object-cover w-full h-[350px] sm:h-[450px]"
                    />
                  </div>
                </div>
              </div>
            ) : isAdminMode ? (
              <div className="mt-16 text-center">
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
            ) : null}
          </div>
        </div>
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

      {/* Program Snapshot Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Program Snapshot
            </h2>
          </div>
          
          {programSnapshot ? (
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              {isAdminMode && (
                <button
                  onClick={() => {
                    setEditingType('program-snapshot');
                    setEditingItem(programSnapshot);
                    setEditModalOpen(true);
                  }}
                  className="absolute top-4 right-4 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  title="Edit snapshot"
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
              
              <div className="space-y-6">
                {/* First Row - 3 items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-seedling text-blue-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Stage</h3>
                    <p className="text-gray-600">{programSnapshot.stage}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-clock text-blue-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                    <p className="text-gray-600">{programSnapshot.duration}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-laptop text-blue-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
                    <p className="text-gray-600">{programSnapshot.format}</p>
                  </div>
                </div>
                
                {/* Second Row - 2 items, centered */}
                <div className="flex justify-center gap-6">
                  <div className="text-center w-full max-w-[200px]">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-users text-blue-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cohort Size</h3>
                    <p className="text-gray-600">{programSnapshot.cohortSize}</p>
                  </div>
                  
                  <div className="text-center w-full max-w-[200px]">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-trophy text-blue-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Demo Day</h3>
                    <p className="text-gray-600">{programSnapshot.demoDay}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              {isAdminMode && (
                <button
                  onClick={() => {
                    setEditingType('program-snapshot');
                    setEditingItem({});
                    setEditModalOpen(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Add Program Snapshot
                </button>
              )}
              {!isAdminMode && <p className="text-gray-500">Program snapshot coming soon...</p>}
            </div>
          )}
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
            <p className="text-gray-800 max-w-2xl mx-auto">Continue exploring the Vetted Accelerator program to see how we can help transform your military experience into entrepreneurial success.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link
              href="/accelerator"
              className="group block relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 bg-white text-gray-900 border-white shadow-2xl"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-900 text-white">
                    <i className="fas fa-rocket text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold leading-tight text-gray-900">Accelerator Overview</h3>
                  </div>
                  <div className="text-gray-900">
                    <i className="fas fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">Learn about the Vetted Accelerator program and what makes us different.</p>
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
          editingType === 'program-benefit' ? 'Benefit' : 
          'Content'
        }`}
        fields={getEditFields()}
        initialData={editingItem}
      />
    </div>
  );
}