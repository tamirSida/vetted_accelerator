'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, Undo, Redo, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'number' | 'radio' | 'date' | 'datetime-local' | 'titles-list';
  required?: boolean;
  placeholder?: string;
  value?: string;
  options?: { label: string; value: string | boolean }[];
  helper?: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  title: string;
  fields: FormField[];
  initialData?: any;
  loading?: boolean;
  getUpdatedFields?: (formData: any) => FormField[];
}

export default function EditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  fields,
  initialData = {},
  loading = false,
  getUpdatedFields
}: EditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<FormField[]>(fields);
  
  // Undo/Redo state
  const [formHistory, setFormHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Create a stable key for dependencies
  const dependencyKey = useMemo(() => {
    return JSON.stringify({
      isOpen,
      fieldsLength: fields.length,
      initialId: initialData?.id || 'new',
      initialName: initialData?.name || '',
      fieldsKeys: fields.map(f => f.key).join(',')
    });
  }, [isOpen, fields.length, initialData?.id, initialData?.name, fields]);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && fields.length > 0) {
      const initData: any = {};
      
      // First, set all field values from initialData or defaults
      fields.forEach(field => {
        initData[field.key] = initialData?.[field.key] || field.value || '';
      });
      
      // Then set the standard fields
      initData.isVisible = initialData?.isVisible ?? true;
      initData.order = initialData?.order ?? 1;
      
      console.log('Initializing form data with:', initData, 'from initialData:', initialData);
      setFormData(initData);
      
      // Initialize dynamic fields
      if (getUpdatedFields) {
        setDynamicFields(getUpdatedFields(initData));
      } else {
        setDynamicFields(fields);
      }
      
      // Initialize history with the initial state
      setFormHistory([initData]);
      setHistoryIndex(0);
    }
  }, [dependencyKey]);

  // Reset form data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({});
      setFormHistory([]);
      setHistoryIndex(0);
    }
  }, [isOpen]);

  // Enhanced form data setter that tracks history
  const updateFormData = useCallback((newData: any) => {
    setFormData(newData);
    
    // Update dynamic fields if function provided
    if (getUpdatedFields) {
      setDynamicFields(getUpdatedFields(newData));
    }
    
    // Add to history (remove any future history if we're not at the end)
    const newHistory = formHistory.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setFormHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [formHistory, historyIndex, getUpdatedFields]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setFormData(formHistory[prevIndex]);
    }
  }, [historyIndex, formHistory]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < formHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setFormData(formHistory[nextIndex]);
    }
  }, [historyIndex, formHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          
          {/* Undo/Redo Controls */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={saving || historyIndex === 0}
              className="flex items-center gap-1"
            >
              <Undo className="h-4 w-4" />
              Undo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={saving || historyIndex >= formHistory.length - 1}
              className="flex items-center gap-1"
            >
              <Redo className="h-4 w-4" />
              Redo
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              disabled={saving}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {dynamicFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => updateFormData({
                      ...formData,
                      [field.key]: e.target.value
                    })}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="w-full"
                  />
                ) : field.type === 'radio' ? (
                  <div className="flex gap-4">
                    {field.options?.map((option) => (
                      <label key={String(option.value)} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={field.key}
                          value={String(option.value)}
                          checked={String(formData[field.key]) === String(option.value)}
                          onChange={(e) => updateFormData({
                            ...formData,
                            [field.key]: option.value
                          })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : field.type === 'titles-list' ? (
                  <div className="space-y-3">
                    {/* Titles List */}
                    {(formData[field.key] || []).map((titleItem: any, index: number) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input
                            type="text"
                            placeholder="Title (e.g., Academic Director)"
                            value={titleItem?.title || ''}
                            onChange={(e) => {
                              const newTitles = [...(formData[field.key] || [])];
                              newTitles[index] = {
                                ...newTitles[index],
                                id: newTitles[index]?.id || `title-${Date.now()}-${index}`,
                                title: e.target.value
                              };
                              updateFormData({
                                ...formData,
                                [field.key]: newTitles
                              });
                            }}
                            className="w-full"
                          />
                          <Input
                            type="text"
                            placeholder="Organization (e.g., Alpha-Bet)"
                            value={titleItem?.organization || ''}
                            onChange={(e) => {
                              const newTitles = [...(formData[field.key] || [])];
                              newTitles[index] = {
                                ...newTitles[index],
                                id: newTitles[index]?.id || `title-${Date.now()}-${index}`,
                                organization: e.target.value
                              };
                              updateFormData({
                                ...formData,
                                [field.key]: newTitles
                              });
                            }}
                            className="w-full"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newTitles = [...(formData[field.key] || [])];
                            newTitles.splice(index, 1);
                            updateFormData({
                              ...formData,
                              [field.key]: newTitles
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add New Title Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTitles = [...(formData[field.key] || [])];
                        newTitles.push({
                          id: `title-${Date.now()}-${newTitles.length}`,
                          title: '',
                          organization: ''
                        });
                        updateFormData({
                          ...formData,
                          [field.key]: newTitles
                        });
                      }}
                      className="w-full border-dashed border-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Title
                    </Button>
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => updateFormData({
                      ...formData,
                      [field.key]: e.target.value
                    })}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full"
                  />
                )}
                {field.helper && (
                  <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">{field.helper}</p>
                )}
              </div>
            ))}

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible !== false}
                onChange={(e) => updateFormData({
                  ...formData,
                  isVisible: e.target.checked
                })}
                className="rounded"
              />
              <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
                Visible on website
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving || loading}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}