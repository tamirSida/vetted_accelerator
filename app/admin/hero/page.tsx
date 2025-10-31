'use client';

import { useState, useEffect } from 'react';
import ContentEditor from '@/components/cms/content-editor';
import { HeroSection } from '@/lib/types/cms';
import { CMSServiceFactory } from '@/lib/cms/content-services';

const heroFields = [
  {
    key: 'headline',
    label: 'Headline',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter the main headline'
  },
  {
    key: 'subHeadline',
    label: 'Sub-headline',
    type: 'textarea' as const,
    required: true,
    placeholder: 'Enter the sub-headline description'
  },
  {
    key: 'ctaText',
    label: 'Call-to-Action Text',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g., Apply Now'
  },
  {
    key: 'ctaLink',
    label: 'Call-to-Action Link',
    type: 'url' as const,
    required: true,
    placeholder: 'https://...'
  },
  {
    key: 'backgroundImage',
    label: 'Background Image URL',
    type: 'url' as const,
    required: false,
    placeholder: 'https://...'
  }
];

export default function HeroAdminPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(false);
  const heroService = CMSServiceFactory.getHeroService();

  const fetchHeroes = async () => {
    try {
      const data = await heroService.getAll();
      setHeroes(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleSave = async (data: Omit<HeroSection, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await heroService.create(data);
      await fetchHeroes();
    } catch (error) {
      console.error('Error creating hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<HeroSection>) => {
    setLoading(true);
    try {
      await heroService.update(id, data);
      await fetchHeroes();
    } catch (error) {
      console.error('Error updating hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await heroService.delete(id);
      await fetchHeroes();
    } catch (error) {
      console.error('Error deleting hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (items: { id: string; order: number }[]) => {
    setLoading(true);
    try {
      await heroService.updateOrder(items);
      await fetchHeroes();
    } catch (error) {
      console.error('Error reordering heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentEditor
      title="Hero Sections"
      items={heroes}
      fields={heroFields}
      onSave={handleSave}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onReorder={handleReorder}
      loading={loading}
    />
  );
}