'use client';

import { useState, useEffect } from 'react';
import ContentEditor from '@/components/cms/content-editor';
import { TeamMember } from '@/lib/types/cms';
import { CMSServiceFactory } from '@/lib/cms/content-services';

const teamFields = [
  {
    key: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter team member name'
  },
  {
    key: 'role',
    label: 'Role/Title',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g., Founder & CEO'
  },
  {
    key: 'bio',
    label: 'Bio',
    type: 'textarea' as const,
    required: true,
    placeholder: 'Enter bio/description...'
  },
  {
    key: 'image',
    label: 'Image URL',
    type: 'url' as const,
    required: false,
    placeholder: 'https://...'
  },
  {
    key: 'linkedinUrl',
    label: 'LinkedIn URL',
    type: 'url' as const,
    required: false,
    placeholder: 'https://linkedin.com/in/...'
  }
];

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const teamService = CMSServiceFactory.getTeamMemberService();

  const fetchMembers = async () => {
    try {
      const data = await teamService.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSave = async (data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await teamService.create(data);
      await fetchMembers();
    } catch (error) {
      console.error('Error creating team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<TeamMember>) => {
    setLoading(true);
    try {
      await teamService.update(id, data);
      await fetchMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await teamService.delete(id);
      await fetchMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (items: { id: string; order: number }[]) => {
    setLoading(true);
    try {
      await teamService.updateOrder(items);
      await fetchMembers();
    } catch (error) {
      console.error('Error reordering team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentEditor
      title="Team Members"
      items={members}
      fields={teamFields}
      onSave={handleSave}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onReorder={handleReorder}
      loading={loading}
    />
  );
}