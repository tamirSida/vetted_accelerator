'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import EditableSection from '@/components/admin/editable-section';
import EditModal from '@/components/admin/edit-modal';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { LiveQAEvent, PreRecordedSession } from '@/lib/types/cms';

export default function InfoSession() {
  const { isAdminMode } = useAdmin();
  const [liveEvents, setLiveEvents] = useState<LiveQAEvent[]>([]);
  const [preRecordedSession, setPreRecordedSession] = useState<PreRecordedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [embedError, setEmbedError] = useState<string | null>(null);
  
  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        liveEventsData,
        preRecordedData
      ] = await Promise.all([
        CMSServiceFactory.getLiveQAEventService().getVisible(),
        CMSServiceFactory.getPreRecordedSessionService().getActiveSession()
      ]);

      setLiveEvents(liveEventsData);
      setPreRecordedSession(preRecordedData);
    } catch (error) {
      console.error('Error loading info session content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = useCallback((type: string, item?: any) => {
    setEditingType(type);
    setEditingItem(item);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (type: string, item: any) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        if (type === 'live-event') {
          await CMSServiceFactory.getLiveQAEventService().delete(item.id);
        } else if (type === 'pre-recorded') {
          await CMSServiceFactory.getPreRecordedSessionService().delete(item.id);
        }
        await loadContent();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  }, [loadContent]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'live-event') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getLiveQAEventService().update(editingItem.id, data);
        } else {
          const eventData = {
            ...data,
            isVisible: true,
            order: liveEvents.length + 1
          };
          await CMSServiceFactory.getLiveQAEventService().create(eventData);
        }
      } else if (editingType === 'pre-recorded') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getPreRecordedSessionService().update(editingItem.id, data);
        } else {
          const sessionData = {
            ...data,
            isVisible: true,
            order: 1
          };
          await CMSServiceFactory.getPreRecordedSessionService().create(sessionData);
        }
      }
      
      await loadContent();
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  }, [editingType, editingItem, liveEvents.length, loadContent]);

  const getEditFields = useCallback((type: string, currentFormData?: any) => {
    const getTimePreview = (dateString: string) => {
      if (!dateString) return '';
      
      const estDate = new Date(dateString);
      const ilDate = new Date(estDate.getTime() + (7 * 60 * 60 * 1000));
      const pstDate = new Date(estDate.getTime() - (3 * 60 * 60 * 1000));
      
      const formatOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      };

      return `Preview: IL: ${ilDate.toLocaleDateString('en-US', formatOptions)} | PST: ${pstDate.toLocaleDateString('en-US', formatOptions)} | EST: ${estDate.toLocaleDateString('en-US', formatOptions)}`;
    };

    switch (type) {
      case 'live-event':
        const baseHelper = 'Enter time in EST. Will display as IL (EST+7), PST (EST-3), and EST.';
        const preview = currentFormData?.sessionDate ? getTimePreview(currentFormData.sessionDate) : '';
        const fullHelper = preview ? `${baseHelper}\n\n${preview}` : baseHelper;
        
        return [
          { key: 'sessionDate', label: 'Session Date & Time (EST ONLY)', type: 'datetime-local' as const, required: true, placeholder: '2025-01-15T19:00', helper: fullHelper },
          { key: 'sessionUrl', label: 'Session URL', type: 'text' as const, required: true, placeholder: 'https://zoom.us/...' }
        ];
      case 'pre-recorded':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Pre-recorded Info Session' },
          { key: 'sessionUrl', label: 'Video URL', type: 'text' as const, required: true, placeholder: 'https://youtube.com/...' }
        ];
      default:
        return [];
    }
  }, []);

  const formatEventDate = (dateString: string) => {
    const estDate = new Date(dateString);
    
    // Calculate other timezones based on EST
    const ilDate = new Date(estDate.getTime() + (7 * 60 * 60 * 1000)); // EST + 7 hours
    const pstDate = new Date(estDate.getTime() - (3 * 60 * 60 * 1000)); // EST - 3 hours
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };

    const ilTime = ilDate.toLocaleDateString('en-US', formatOptions);
    const pstTime = pstDate.toLocaleDateString('en-US', formatOptions);
    const estTime = estDate.toLocaleDateString('en-US', formatOptions);

    return (
      <div className="space-y-1">
        <div><strong>IL:</strong> {ilTime}</div>
        <div><strong>PST:</strong> {pstTime}</div>
        <div><strong>EST:</strong> {estTime}</div>
      </div>
    );
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    return url; // Return original URL if not a recognized YouTube format
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
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
    <div className="relative">
      {/* Discrete Admin Access Components */}
      <DiscreteAdminAccess />
      <DiscreteAdminDot />
      <SimpleAdminToggle />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-white to-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Info Sessions
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
              Join us to learn more about the Alpha-Bet program and ask questions directly to our team.
            </p>
          </div>

          {/* Live Q&A Section */}
          <EditableSection
            sectionName="Live Q&A Events"
            onEdit={() => handleEdit('live-event')}
          >
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  Sign Up for Live Q&A
                </h2>
                <p className="text-gray-800 max-w-2xl mx-auto">
                  Join our live sessions to ask questions and interact directly with the Alpha-Bet team.
                </p>
              </div>

              {/* Admin Add Button */}
              {isAdminMode && (
                <div className="mb-6 text-center">
                  <button
                    onClick={() => handleEdit('live-event')}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    <i className="fas fa-plus"></i>
                    <span>Add Event</span>
                  </button>
                </div>
              )}

              {/* Live Events */}
              <div className="grid gap-4">
                {liveEvents.length > 0 ? (
                  liveEvents.map((event) => (
                    <div key={event.id} className="relative bg-white/10 backdrop-blur-sm rounded-lg border border-gray-300 p-6 hover:bg-white/20 transition-all duration-300">
                      {/* Admin Buttons */}
                      {isAdminMode && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => handleEdit('live-event', event)}
                            className="w-8 h-8 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete('live-event', event)}
                            className="w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}

                      <div className="text-center">
                        <div className="text-lg font-bold text-black mb-2" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}>
                          {formatEventDate(event.sessionDate)}
                        </div>
                        <a
                          href={event.sessionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                          style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}
                        >
                          Join Live Session
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <i className="fas fa-calendar-alt text-4xl mb-4 opacity-30"></i>
                    <p className="text-lg">No live sessions scheduled at this time.</p>
                    {isAdminMode && (
                      <button
                        onClick={() => handleEdit('live-event')}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </EditableSection>

          {/* Pre-recorded Session Section */}
          <EditableSection
            sectionName="Pre-recorded Session"
            onEdit={() => handleEdit('pre-recorded', preRecordedSession)}
          >
            <section>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  Pre-recorded Info Session
                </h2>
                <p className="text-gray-800 max-w-2xl mx-auto">
                  Watch our comprehensive overview of the Alpha-Bet program at your convenience.
                </p>
              </div>

              <div className="text-center">
                {preRecordedSession ? (
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-lg border border-gray-300 p-8 hover:bg-white/20 transition-all duration-300">
                    {/* Admin Buttons */}
                    {isAdminMode && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleEdit('pre-recorded', preRecordedSession)}
                          className="w-8 h-8 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete('pre-recorded', preRecordedSession)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}

                    <div className="max-w-4xl mx-auto px-4 sm:px-0">
                      {isYouTubeUrl(preRecordedSession.sessionUrl) ? (
                        <>
                          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                            <iframe
                              src={getYouTubeEmbedUrl(preRecordedSession.sessionUrl)}
                              title={preRecordedSession.title || "Alpha-Bet Program Overview"}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                          <h3 className="mt-4 text-lg sm:text-xl font-bold text-black text-center px-2" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}>
                            {preRecordedSession.title}
                          </h3>
                        </>
                      ) : (
                        // Non-YouTube URL - show as button
                        <a
                          href={preRecordedSession.sessionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer text-lg"
                          style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}
                        >
                          {preRecordedSession.title}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <i className="fas fa-play-circle text-4xl mb-4 opacity-30"></i>
                    <p className="text-lg mb-6">No pre-recorded session available.</p>
                    {isAdminMode && (
                      <button
                        onClick={() => handleEdit('pre-recorded')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Pre-recorded Session
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </EditableSection>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
          setEditingType('');
        }}
        onSave={handleSave}
        title={`${editingItem ? 'Edit' : 'Add'} ${editingType === 'live-event' ? 'Live Event' : 'Pre-recorded Session'}`}
        fields={getEditFields(editingType)}
        initialData={editingItem}
        getUpdatedFields={(formData) => getEditFields(editingType, formData)}
        loading={loading}
      />
    </div>
  );
}