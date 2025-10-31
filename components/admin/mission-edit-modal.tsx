'use client';

import { useState, useEffect } from 'react';
import { MissionSection, MissionBullet } from '@/lib/types/cms';

interface MissionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MissionSection>) => Promise<void>;
  initialData: MissionSection | null;
  loading?: boolean;
}

export default function MissionEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false
}: MissionEditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bullets, setBullets] = useState<MissionBullet[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setBullets(initialData.bullets || []);
    } else {
      // Default values for new mission with your content
      setTitle('Our Mission');
      setDescription('Our foundation and purpose');
      setBullets([
        {
          id: '1',
          text: "You've demonstrated courage, discipline, and leadership in the most challenging environments. Help you translate the skills you acquired in combat to becoming an entrepreneur.",
          order: 1
        },
        {
          id: '2', 
          text: "The Alpha-Bet program is a non-profit initiative dedicated to empowering combat veterans.",
          order: 2
        },
        {
          id: '3',
          text: "We provide a practical, hands-on education in entrepreneurship, giving you the foundation of a top-tier MBA, but with a curriculum built for founders.",
          order: 3
        },
        {
          id: '4',
          text: "Our goal is to bridge the gap between military service and the startup ecosystem, creating a new generation of veteran-led companies that drive innovation and create a lasting impact.",
          order: 4
        }
      ]);
    }
  }, [initialData]);

  const addBullet = () => {
    const newBullet: MissionBullet = {
      id: Date.now().toString(),
      text: '',
      order: bullets.length + 1
    };
    setBullets([...bullets, newBullet]);
  };

  const updateBullet = (id: string, newText: string) => {
    setBullets(bullets.map(bullet =>
      bullet.id === id ? { ...bullet, text: newText } : bullet
    ));
  };

  const deleteBullet = (id: string) => {
    const updatedBullets = bullets
      .filter(bullet => bullet.id !== id)
      .map((bullet, index) => ({ ...bullet, order: index + 1 }));
    setBullets(updatedBullets);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data: Partial<MissionSection> = {
        title,
        description,
        bullets: bullets.filter(bullet => bullet.text.trim() !== ''),
        type: 'mission',
        isVisible: true,
        order: 1
      };
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving mission:', error);
      alert('Failed to save mission. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Mission Section</h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Our Mission"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Our foundation and purpose"
            />
          </div>

          {/* Mission Bullets */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mission Bullets
              </label>
              <button
                type="button"
                onClick={addBullet}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i className="fas fa-plus"></i>
                Add Bullet
              </button>
            </div>

            <div className="space-y-3">
              {bullets.map((bullet, index) => (
                <div key={bullet.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 mt-1">
                    {index + 1}
                  </div>
                  <textarea
                    value={bullet.text}
                    onChange={(e) => updateBullet(bullet.id, e.target.value)}
                    placeholder="Enter mission bullet text..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => deleteBullet(bullet.id)}
                    className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
              
              {bullets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No bullets added yet.</p>
                  <p className="text-sm">Click "Add Bullet" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <i className="fas fa-spinner animate-spin"></i>
                Saving...
              </span>
            ) : (
              'Save Mission'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}