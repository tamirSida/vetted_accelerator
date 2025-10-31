'use client';

import { useState, useEffect, useCallback } from 'react';
import CurriculumTimeline from '@/components/public/curriculum-timeline';
import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import EditableSection from '@/components/admin/editable-section';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import EditModal from '@/components/admin/edit-modal';
import CurriculumOrdering from '@/components/admin/curriculum-ordering';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { CurriculumItem, CurriculumHeader } from '@/lib/types/cms';
import { useAdmin } from '@/lib/cms/admin-context';

export default function CurriculumPage() {
  const { isAdminMode } = useAdmin();
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [curriculumHeader, setCurriculumHeader] = useState<CurriculumHeader | null>(null);
  const [curriculumCTA, setCurriculumCTA] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'curriculum' | 'header' | 'cta'>('curriculum');

  // Enable URL-based admin access
  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const [curriculumData, headerData, ctaData] = await Promise.all([
        CMSServiceFactory.getCurriculumService().getVisible(),
        CMSServiceFactory.getCurriculumHeaderService().getActiveHeader(),
        CMSServiceFactory.getCallToActionService().getActiveCallToAction()
      ]);
      setCurriculum(curriculumData);
      setCurriculumHeader(headerData);
      setCurriculumCTA(ctaData);
    } catch (error) {
      console.error('Error loading curriculum content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = useCallback((item?: CurriculumItem) => {
    setEditingItem(item);
    setEditingType('curriculum');
    setEditModalOpen(true);
  }, []);

  const handleEditHeader = useCallback(() => {
    const headerToEdit = curriculumHeader || {
      badge: '10-WEEK CURRICULUM',
      title: 'The Alpha-Bet Program',
      description: 'A practical MBA for founders, designed to turn your idea into a viable business.'
    };
    setEditingItem(headerToEdit);
    setEditingType('header');
    setEditModalOpen(true);
  }, [curriculumHeader]);

  const handleEditCTA = useCallback(() => {
    const defaultCTA = {
      title: 'Your Entrepreneurial Journey Awaits',
      description: 'Transform 10 weeks of intensive learning into a lifetime of entrepreneurial success. Each week builds on the last, creating a comprehensive foundation for your startup journey.',
      buttonText: 'Start Your Journey',
      buttonLink: '/qualifications'
    };
    
    // Use CMS data or defaults for editing
    const ctaToEdit = curriculumCTA || defaultCTA;
    
    setEditingItem(ctaToEdit);
    setEditingType('cta');
    setEditModalOpen(true);
  }, [curriculumCTA]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'header') {
        // Save header data to database
        const headerData = {
          badge: data.badge,
          title: data.title,
          description: data.description,
          isVisible: true,
          order: 1
        };

        if (curriculumHeader && curriculumHeader.id) {
          // Update existing header
          await CMSServiceFactory.getCurriculumHeaderService().update(curriculumHeader.id, headerData);
        } else {
          // Create new header
          await CMSServiceFactory.getCurriculumHeaderService().create(headerData);
        }
        await loadContent();
      } else if (editingType === 'cta') {
        // Save CTA data to database
        const ctaData = {
          title: data.title,
          description: data.description,
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          isVisible: true,
          order: 1
        };

        if (curriculumCTA && curriculumCTA.id) {
          // Update existing CTA
          await CMSServiceFactory.getCallToActionService().update(curriculumCTA.id, ctaData);
        } else {
          // Create new CTA
          await CMSServiceFactory.getCallToActionService().create(ctaData);
        }
        await loadContent();
      } else {
        // Save curriculum week data
        if (editingItem && editingItem.id && !editingItem.id.startsWith('week-')) {
          // Existing Firestore document - update it
          await CMSServiceFactory.getCurriculumService().update(editingItem.id, data);
        } else {
          // New document or default data - create it
          const curriculumData = {
            ...data,
            isVisible: true,
            order: data.order || data.weekNumber || 1
          };
          await CMSServiceFactory.getCurriculumService().create(curriculumData);
        }
        await loadContent();
      }
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  }, [editingItem, editingType, loadContent, curriculumHeader, curriculumCTA]);

  const handleReorder = useCallback(async (reorderedItems: CurriculumItem[]) => {
    try {
      // Update the local state immediately for better UX
      setCurriculum(reorderedItems);
      
      // Update the order field for all items in the database
      const updatePromises = reorderedItems.map((item) => {
        if (item.id && !item.id.startsWith('week-')) {
          // Only update Firestore documents, not default data
          return CMSServiceFactory.getCurriculumService().update(item.id, { order: item.order });
        }
        return Promise.resolve();
      });
      
      await Promise.all(updatePromises.filter(Boolean));
      // Reload content to ensure consistency
      await loadContent();
    } catch (error) {
      console.error('Error reordering curriculum items:', error);
      // Reload content on error to restore previous state
      await loadContent();
    }
  }, [loadContent]);

  const getEditFields = () => {
    if (editingType === 'header') {
      return [
        { key: 'badge', label: 'Badge Text', type: 'text' as const, required: true, placeholder: 'e.g., 10-WEEK CURRICULUM' },
        { key: 'title', label: 'Main Title', type: 'text' as const, required: true, placeholder: 'e.g., The Alpha-Bet Program' },
        { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Enter section description...' }
      ];
    } else if (editingType === 'cta') {
      return [
        { key: 'title', label: 'CTA Title', type: 'text' as const, required: true, placeholder: 'e.g., Your Entrepreneurial Journey Awaits' },
        { key: 'description', label: 'CTA Description', type: 'textarea' as const, required: true, placeholder: 'Enter CTA description...' },
        { key: 'buttonText', label: 'Primary Button Text', type: 'text' as const, required: true, placeholder: 'e.g., Start Your Journey' },
        { key: 'buttonLink', label: 'Primary Button Link', type: 'text' as const, required: true, placeholder: 'e.g., /qualifications' }
      ];
    }
    return [
      { key: 'weekNumber', label: 'Week Number', type: 'number' as const, required: true, placeholder: '1-10' },
      { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Enter week title' },
      { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Enter week description...' },
      { key: 'icon', label: 'Font Awesome Icon', type: 'text' as const, required: false, placeholder: 'e.g., fas fa-rocket' },
      { key: 'badge1Text', label: 'Badge 1 Text', type: 'text' as const, required: false, placeholder: 'e.g., Interactive Sessions' },
      { key: 'badge1Icon', label: 'Badge 1 Icon', type: 'text' as const, required: false, placeholder: 'e.g., fas fa-clock' },
      { key: 'badge2Text', label: 'Badge 2 Text', type: 'text' as const, required: false, placeholder: 'e.g., Peer Collaboration' },
      { key: 'badge2Icon', label: 'Badge 2 Icon', type: 'text' as const, required: false, placeholder: 'e.g., fas fa-users' },
      { key: 'badge3Text', label: 'Badge 3 Text', type: 'text' as const, required: false, placeholder: 'e.g., Practical Application' },
      { key: 'badge3Icon', label: 'Badge 3 Icon', type: 'text' as const, required: false, placeholder: 'e.g., fas fa-lightbulb' }
    ];
  };

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="10-Week Curriculum - Alpha-Bet Entrepreneurship Program"
        description="Explore Alpha-Bet's comprehensive 10-week curriculum: From idea to business plan. Learn lean methodology, customer discovery, networking, market analysis, and presentation skills designed for combat veterans."
        keywords={[
          '10-week entrepreneurship curriculum',
          'startup curriculum veterans',
          'business training program',
          'lean methodology training',
          'customer discovery course',
          'business plan development',
          'startup accelerator curriculum',
          'entrepreneur training syllabus',
          'military entrepreneur education',
          'veteran business course'
        ]}
        canonical="/curriculum"
      />
      <div className="relative">
        {/* Discrete Admin Access Components */}
        <DiscreteAdminAccess />
        <DiscreteAdminDot />
        <SimpleAdminToggle />
        

        {/* Curriculum Timeline */}
        <CurriculumTimeline 
          items={curriculum} 
          header={curriculumHeader}
          cta={curriculumCTA}
          onEdit={(item) => handleEdit(item)}
          onEditHeader={handleEditHeader}
          onEditCTA={handleEditCTA}
        />

        {/* Bottom Navigation */}
        <BottomNavigation currentPage="curriculum" />

        {/* Edit Modal */}
        <EditModal
          key={editingItem?.id || 'new'}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          title={editingType === 'header' ? "Edit Curriculum Header" : editingType === 'cta' ? "Edit Curriculum CTA" : "Edit Curriculum Week"}
          fields={getEditFields()}
          initialData={editingItem}
          loading={loading}
        />
      </div>
    </>
  );
}