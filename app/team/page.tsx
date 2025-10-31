'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import UnifiedTeamSection from '@/components/public/unified-team-section';
import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import EditModal from '@/components/admin/edit-modal';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { TeamMember, TeamHeader, TeamMemberTitle } from '@/lib/types/cms';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'member' | 'header'>('member');

  // Enable URL-based admin access
  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      // Only load from the unified team collection
      const unifiedTeamData = await CMSServiceFactory.getAlphaBetTeamService().getAllTeamMembers();
      setTeamMembers(unifiedTeamData);
    } catch (error) {
      console.error('Error loading team content:', error);
      setTeamMembers([]); // Set empty array if loading fails
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = useCallback((item?: TeamMember) => {
    // Prepare the item for editing - titles are already in the correct array format
    const editingData = item ? {
      ...item,
      // Ensure titles is an array - convert from old format if needed
      titles: item.titles || (item.role ? [{ id: `title-${item.id}`, title: item.role }] : [])
    } : {
      // Default new member structure
      titles: []
    };
    
    setEditingItem(editingData);
    setEditingType('member');
    setEditModalOpen(true);
  }, []);

  const handleEditHeader = useCallback(() => {
    // For now, use default header data. In a full implementation, load from CMS
    const defaultHeader = {
      id: 'team-header-1',
      label: "LEADERSHIP TEAM",
      title: "Alpha-Bet Team",
      description: "Battle-tested leaders and mentors who understand your journey and are committed to your success",
      isVisible: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEditingItem(defaultHeader);
    setEditingType('header');
    setEditModalOpen(true);
  }, []);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'header') {
        // Save header data (for now, just log - in full implementation would save to CMS)
        console.log('Saving header data:', data);
        // await CMSServiceFactory.getTeamHeaderService().update('team-header-1', data);
      } else {
        // Use the titles array directly from the form
        const titles: TeamMemberTitle[] = data.titles || [];

        const memberData = {
          ...data,
          titles,
          role: titles.length > 0 ? titles[0].title : 'Team Member', // Fallback for compatibility
          isVisible: true,
          order: editingItem?.order || teamMembers.length + 1
        };

        const service = CMSServiceFactory.getAlphaBetTeamService();

        if (editingItem && editingItem.id) {
          await service.update(editingItem.id, memberData);
        } else {
          await service.create(memberData);
        }
        await loadContent();
      }
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  }, [editingItem, editingType, teamMembers.length, loadContent]);

  const handleDelete = useCallback(async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const service = CMSServiceFactory.getAlphaBetTeamService();
        await service.delete(memberId);
        await loadContent();
      } catch (error: unknown) {
        console.error('Error deleting team member:', error);
        alert(`Failed to delete team member. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [loadContent]);

  const handleReorder = useCallback(async (reorderedMembers: TeamMember[]) => {
    try {
      const service = CMSServiceFactory.getAlphaBetTeamService();
      
      // Update each team member's order in Firebase
      const updatePromises = reorderedMembers.map(member =>
        service.update(member.id, { ...member, order: member.order })
      );
      
      await Promise.all(updatePromises);
      
      // Reload content to ensure consistency
      await loadContent();
    } catch (error: unknown) {
      console.error('Error reordering team members:', error);
      alert(`Failed to reorder team members. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Reload content to revert any local changes
      await loadContent();
    }
  }, [loadContent]);

  const memberFields = useMemo(() => [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, placeholder: 'Enter full name' },
    { 
      key: 'titles', 
      label: 'Titles/Positions', 
      type: 'titles-list' as const, 
      required: false, 
      placeholder: '' 
    },
    { key: 'military', label: 'Military Background', type: 'text' as const, required: false, placeholder: 'e.g., Navy SEALs, IDF Paratrooper, or N/A' },
    { key: 'image', label: 'Profile Image (URL or path)', type: 'text' as const, required: false, placeholder: '/team/image.jpg or https://...' },
    { key: 'linkedinUrl', label: 'LinkedIn Profile URL', type: 'url' as const, required: false, placeholder: 'https://linkedin.com/in/...' }
  ], []);

  const headerFields = useMemo(() => [
    { key: 'label', label: 'Section Label', type: 'text' as const, required: true, placeholder: 'e.g., LEADERSHIP TEAM' },
    { key: 'title', label: 'Section Title', type: 'text' as const, required: true, placeholder: 'e.g., Meet the Team' },
    { key: 'description', label: 'Section Description', type: 'textarea' as const, required: true, placeholder: 'Enter section description...' }
  ], []);

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
        title="Meet Our Team - Alpha-Bet Leadership & Mentors"
        description="Meet the Alpha-Bet team: Combat veterans, successful entrepreneurs, and business leaders who mentor participants in our veteran entrepreneurship program. Learn from battle-tested leaders."
        keywords={[
          'Alpha-Bet team',
          'veteran mentors',
          'military entrepreneur mentors',
          'veteran business leaders',
          'combat veteran entrepreneurs',
          'startup mentors veterans',
          'military leadership team',
          'veteran advisor network',
          'entrepreneur mentorship',
          'business mentor veterans'
        ]}
        canonical="/team"
      />
      <div className="relative">
        {/* Discrete Admin Access Components */}
        <DiscreteAdminAccess />
        <DiscreteAdminDot />
        <SimpleAdminToggle />
        
        {/* Unified Team Section */}
        <UnifiedTeamSection 
          teamMembers={teamMembers}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onEditHeader={handleEditHeader} 
          onReorder={handleReorder}
        />

        {/* Bottom Navigation */}
        <BottomNavigation currentPage="team" />

        {/* Edit Modal */}
        <EditModal
          key={editingItem?.id || 'new'}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          title={editingType === 'header' ? "Edit Team Section Header" : (editingItem?.name ? `Edit ${editingItem.name}` : 'Add New Team Member')}
          fields={editingType === 'header' ? headerFields : memberFields}
          initialData={editingItem}
          loading={loading}
        />
      </div>
    </>
  );
}