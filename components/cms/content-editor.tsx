'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'number';
  required?: boolean;
  placeholder?: string;
}

interface ContentItem {
  id: string;
  isVisible: boolean;
  order: number;
  [key: string]: any;
}

interface ContentEditorProps<T extends ContentItem> {
  title: string;
  items: T[];
  fields: FormField[];
  onSave: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (id: string, item: Partial<T>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: { id: string; order: number }[]) => Promise<void>;
  loading?: boolean;
}

export default function ContentEditor<T extends ContentItem>({
  title,
  items,
  fields,
  onSave,
  onUpdate,
  onDelete,
  onReorder,
  loading = false
}: ContentEditorProps<T>) {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isCreating, setIsCreating] = useState(false);

  const initializeForm = (item?: T) => {
    const initialData: Record<string, any> = {
      isVisible: true,
      order: items.length + 1,
    };

    fields.forEach(field => {
      initialData[field.key] = item?.[field.key] || '';
    });

    if (item) {
      initialData.isVisible = item.isVisible;
      initialData.order = item.order;
    }

    setFormData(initialData);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    initializeForm();
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsCreating(false);
    initializeForm(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isCreating) {
        await onSave(formData as Omit<T, 'id' | 'createdAt' | 'updatedAt'>);
      } else if (editingItem) {
        await onUpdate(editingItem.id, formData as Partial<T>);
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleToggleVisibility = async (item: T) => {
    await onUpdate(item.id, { isVisible: !item.isVisible } as Partial<T>);
  };

  const handleDelete = async (item: T) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await onDelete(item.id);
    }
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={handleCreate} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Form */}
      {(isCreating || editingItem) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? `Add New ${title.slice(0, -1)}` : `Edit ${title.slice(0, -1)}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={4}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <Input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      order: parseInt(e.target.value)
                    }))}
                    min="1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVisible"
                    checked={formData.isVisible || false}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isVisible: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <label htmlFor="isVisible" className="text-sm font-medium">
                    Visible on website
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      <div className="grid gap-4">
        {sortedItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">#{item.order}</span>
                    {item.isVisible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    {fields.slice(0, 2).map((field) => (
                      <div key={field.key}>
                        <span className="text-sm font-medium">{field.label}: </span>
                        <span className="text-sm text-gray-600">
                          {field.type === 'textarea' 
                            ? `${String(item[field.key] || '').substring(0, 100)}...`
                            : String(item[field.key] || '')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleVisibility(item)}
                    disabled={loading}
                  >
                    {item.isVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {sortedItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No items found. Create your first item to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}