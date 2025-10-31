'use client';

import { useState, useEffect } from 'react';
import ContentEditor from '@/components/cms/content-editor';
import { ContentSection } from '@/lib/types/cms';
import { CMSServiceFactory } from '@/lib/cms/content-services';

const contentFields = [
  {
    key: 'title',
    label: 'Title',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter section title'
  },
  {
    key: 'content',
    label: 'Content',
    type: 'textarea' as const,
    required: true,
    placeholder: 'Enter section content...'
  },
  {
    key: 'type',
    label: 'Section Type',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g., mission, why-alpha-bet, who-should-apply'
  }
];

export default function ContentAdminPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(false);
  const contentService = CMSServiceFactory.getContentSectionService();

  const fetchSections = async () => {
    try {
      const data = await contentService.getAll();
      setSections(data);
    } catch (error) {
      console.error('Error fetching content sections:', error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSave = async (data: Omit<ContentSection, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await contentService.create(data);
      await fetchSections();
    } catch (error) {
      console.error('Error creating content section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<ContentSection>) => {
    setLoading(true);
    try {
      await contentService.update(id, data);
      await fetchSections();
    } catch (error) {
      console.error('Error updating content section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await contentService.delete(id);
      await fetchSections();
    } catch (error) {
      console.error('Error deleting content section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (items: { id: string; order: number }[]) => {
    setLoading(true);
    try {
      await contentService.updateOrder(items);
      await fetchSections();
    } catch (error) {
      console.error('Error reordering content sections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentEditor
      title="Content Sections"
      items={sections}
      fields={contentFields}
      onSave={handleSave}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onReorder={handleReorder}
      loading={loading}
    />
  );
}