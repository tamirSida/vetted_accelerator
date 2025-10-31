'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { AcceleratorHero } from '@/lib/types/cms';
import EditableSection from '@/components/admin/editable-section';
import EditModal from '@/components/admin/edit-modal';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';

export default function AcceleratorPage() {
  const { isAdminMode } = useAdmin();
  const [acceleratorHero, setAcceleratorHero] = useState<AcceleratorHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  // Enable URL-based admin access
  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const heroData = await CMSServiceFactory.getAcceleratorHeroService().getActiveHero();
      
      // If no hero exists, create default one
      if (!heroData) {
        const defaultHero = {
          title: 'Where veteran grit meets venture growth.',
          content: `You've led teams, executed under pressure, and thrived where others wouldn't dare.

Now it's time to bring that same mindset to your next mission: building a world-class company.

The Vetted Accelerator is a 10-week venture program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.

Our #1 Principle: Provide Value to our Founders

This is not a theoretical program. Vetted was designed to help launch your company, connect you with an unmatched network, and give you the tools, funding, and relationships to scale fast.`,
          isVisible: true,
          order: 1
        };
        
        try {
          await CMSServiceFactory.getAcceleratorHeroService().create(defaultHero);
          const newHeroData = await CMSServiceFactory.getAcceleratorHeroService().getActiveHero();
          setAcceleratorHero(newHeroData);
        } catch (error) {
          console.error('Error creating default hero:', error);
          setAcceleratorHero(null);
        }
      } else {
        setAcceleratorHero(heroData);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleEditHero = useCallback(() => {
    if (acceleratorHero) {
      setEditingType('accelerator-hero');
      setEditingItem(acceleratorHero);
      setEditModalOpen(true);
    }
  }, [acceleratorHero]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'accelerator-hero') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getAcceleratorHeroService().update(editingItem.id, data);
        } else {
          const heroData = {
            ...data,
            isVisible: true,
            order: 1
          };
          await CMSServiceFactory.getAcceleratorHeroService().create(heroData);
        }
      }
      
      await loadContent();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [editingType, editingItem, loadContent]);

  const getEditFields = useCallback(() => {
    switch (editingType) {
      case 'accelerator-hero':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., Where veteran grit meets venture growth.' },
          { key: 'content', label: 'Content', type: 'textarea' as const, required: true, placeholder: 'Enter the main content...' }
        ];
      default:
        return [];
    }
  }, [editingType]);

  // Default content for display
  const defaultHero = {
    title: 'Where veteran grit meets venture growth.',
    content: `You've led teams, executed under pressure, and thrived where others wouldn't dare.

Now it's time to bring that same mindset to your next mission: building a world-class company.

The Vetted Accelerator is a 10-week venture program and fund investing exclusively in startups founded by elite U.S. and Israeli combat veterans.

Our #1 Principle: Provide Value to our Founders

This is not a theoretical program. Vetted was designed to help launch your company, connect you with an unmatched network, and give you the tools, funding, and relationships to scale fast.`
  };

  const displayHero = acceleratorHero || defaultHero;

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
      <EditableSection
        sectionName="Accelerator Hero"
        onEdit={handleEditHero}
      >
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-white via-white to-gray-200 relative overflow-hidden">
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
                {displayHero.title}
              </h2>
              
              <div className="prose prose-lg max-w-4xl mx-auto">
                {displayHero.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 text-left">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Admin Controls */}
              {isAdminMode && acceleratorHero && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleEditHero}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    title="Edit hero section"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit Hero
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </EditableSection>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        title={`Edit ${editingType === 'accelerator-hero' ? 'Hero Section' : 'Content'}`}
        fields={getEditFields()}
        initialData={editingItem}
      />
    </div>
  );
}