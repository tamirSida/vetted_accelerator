'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { ProgramPhase, ProgramSnapshot, ProgramBenefit } from '@/lib/types/cms';
import EditableSection from '@/components/admin/editable-section';
import EditModal from '@/components/admin/edit-modal';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import Image from 'next/image';

export default function ProgramPage() {
  const { isAdminMode } = useAdmin();
  const [programPhases, setProgramPhases] = useState<ProgramPhase[]>([]);
  const [programSnapshot, setProgramSnapshot] = useState<ProgramSnapshot | null>(null);
  const [programBenefits, setProgramBenefits] = useState<ProgramBenefit[]>([]);
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
      const [phasesData, snapshotData, benefitsData] = await Promise.all([
        CMSServiceFactory.getProgramPhaseService().getVisible(),
        CMSServiceFactory.getProgramSnapshotService().getActiveSnapshot(),
        CMSServiceFactory.getProgramBenefitService().getVisible()
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

      setProgramSnapshot(snapshotData);
      setProgramBenefits(benefitsData);
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
      }
      
      await loadContent();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [editingType, editingItem, loadContent, programPhases]);

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

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-white via-white to-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-8 leading-tight tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
            Program Overview
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            A comprehensive 10-week journey from operator to founder, with immersive bootcamps in Israel and Miami.
          </p>
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

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        title={`${editingItem?.id ? 'Edit' : 'Add'} ${editingType === 'program-phase' ? 'Program Phase' : editingType === 'program-graphic' ? 'Graphic' : 'Content'}`}
        fields={getEditFields()}
        initialData={editingItem}
      />
    </div>
  );
}