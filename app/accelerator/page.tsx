'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { AcceleratorHero } from '@/lib/types/cms';
import EditableSection from '@/components/admin/editable-section';
import EditModal from '@/components/admin/edit-modal';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import Image from 'next/image';
import Link from 'next/link';
import { EXTERNAL_URLS } from '@/lib/config/urls';

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
          secondaryTitle: 'Built for Combat Veteran Entrepreneurs, by Combat Veteran Entrepreneurs',
          secondaryContent: 'We believe in immersive experiences mixed with culture, education, mentorship and most importantly direct application of lessons learned to your businesses.',
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
          { key: 'content', label: 'Content', type: 'textarea' as const, required: true, placeholder: 'Enter the main content...' },
          { key: 'image', label: 'Image URL', type: 'text' as const, required: false, placeholder: 'https://example.com/image.jpg' },
          { key: 'secondaryTitle', label: 'Secondary Title', type: 'text' as const, required: false, placeholder: 'e.g., Built for Combat Veteran Entrepreneurs...' },
          { key: 'secondaryContent', label: 'Secondary Content', type: 'textarea' as const, required: true, placeholder: 'Enter the secondary content...' }
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

This is not a theoretical program. Vetted was designed to help launch your company, connect you with an unmatched network, and give you the tools, funding, and relationships to scale fast.`,
    secondaryTitle: 'Built for Combat Veteran Entrepreneurs, by Combat Veteran Entrepreneurs',
    secondaryContent: 'We believe in immersive experiences mixed with culture, education, mentorship and most importantly direct application of lessons learned to your businesses.'
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

      {/* Image Section */}
      {displayHero.image && (
        <section className="py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Image
                src={displayHero.image}
                alt="Accelerator Program"
                width={800}
                height={500}
                className="w-full h-auto rounded-2xl shadow-xl object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Secondary Text Section */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-tight tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
            {displayHero.secondaryTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {displayHero.secondaryContent}
          </p>
        </div>
      </section>

      {/* Bottom Navigation Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-white to-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Ready for the Next Step?</h2>
            <p className="text-gray-800 max-w-2xl mx-auto">Continue exploring the Alpha-Bet program to see how we can help transform your military experience into entrepreneurial success.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link
              href="/program"
              className="group block relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 bg-white text-gray-900 border-white shadow-2xl"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-900 text-white">
                    <i className="fas fa-graduation-cap text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold leading-tight text-gray-900">Program Details</h3>
                  </div>
                  <div className="text-gray-900">
                    <i className="fas fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-700">Explore the complete Alpha-Bet program structure and curriculum details.</p>
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
              href={EXTERNAL_URLS.APPLY_FORM}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              <i className="fas fa-rocket"></i>
              <span>Apply to Alpha-Bet</span>
            </a>
          </div>
        </div>
      </section>

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