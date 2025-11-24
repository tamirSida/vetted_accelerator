'use client';

import { useState, useEffect, useRef } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import Footer from '@/components/public/footer';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { ServiceRequirementsContent } from '@/lib/types/cms';

interface EditableTextProps {
  content: string;
  onChange: (newContent: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}

function EditableText({ content, onChange, className = '', placeholder = '', multiline = false, style }: EditableTextProps) {
  const { isAdminMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  if (isEditing && isAdminMode) {
    return (
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className={`w-full resize-none border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:border-blue-600 ${className}`}
          style={{ ...style, minHeight: multiline ? '100px' : 'auto' }}
          placeholder={placeholder}
        />
        <div className="absolute -right-2 -top-2 flex gap-1">
          <button
            onClick={handleSave}
            className="w-6 h-6 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 flex items-center justify-center"
            title="Save (Ctrl+Enter)"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
            title="Cancel (Esc)"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={divRef}
      className={`${className} ${isAdminMode ? 'hover:bg-blue-50 hover:border hover:border-blue-200 rounded-md p-1 cursor-text transition-all' : ''} relative group`}
      onClick={() => isAdminMode && setIsEditing(true)}
      style={style}
    >
      {content || placeholder}
      {isAdminMode && (
        <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 flex items-center justify-center"
            title="Edit"
          >
            ✎
          </button>
        </div>
      )}
    </div>
  );
}

interface EditableBulletListProps {
  bullets: string[];
  onChange: (newBullets: string[]) => void;
  className?: string;
}

function EditableBulletList({ bullets, onChange, className = '' }: EditableBulletListProps) {
  const { isAdminMode } = useAdmin();

  const updateBullet = (index: number, newContent: string) => {
    const newBullets = [...bullets];
    newBullets[index] = newContent;
    onChange(newBullets);
  };

  const addBullet = () => {
    onChange([...bullets, 'New bullet point']);
  };

  const removeBullet = (index: number) => {
    const newBullets = bullets.filter((_, i) => i !== index);
    onChange(newBullets);
  };

  return (
    <ul className={`ml-6 space-y-1 text-gray-700 ${className}`}>
      {bullets.map((bullet, index) => (
        <li key={index} className="flex items-start group">
          <span className="mr-2 mt-1">•</span>
          <div className="flex-1">
            <EditableText
              content={bullet}
              onChange={(newContent) => updateBullet(index, newContent)}
              multiline={true}
              className="text-gray-700"
            />
          </div>
          {isAdminMode && (
            <button
              onClick={() => removeBullet(index)}
              className="ml-2 opacity-0 group-hover:opacity-100 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center transition-opacity"
              title="Remove bullet"
            >
              ✕
            </button>
          )}
        </li>
      ))}
      {isAdminMode && (
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <button
            onClick={addBullet}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            + Add bullet point
          </button>
        </li>
      )}
    </ul>
  );
}

export default function ServiceRequirementsPage() {
  const { isAdminMode } = useAdmin();
  const [content, setContent] = useState<ServiceRequirementsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Default fallback content
  const defaultContent: ServiceRequirementsContent = {
    id: 'default',
    title: 'Service Requirements',
    subtitle: 'Military service criteria for The Vetted Accelerator program eligibility',
    lastUpdated: 'November 13, 2025',
    programEligibilityTitle: 'Program Eligibility',
    programEligibilityDescription: 'To ensure alignment between participants and the program\'s mission, applicants must meet the following service requirements.',
    sections: [
      {
        id: 'section-1',
        title: '1. Honorable Service',
        content: 'Received an honorable discharge or its equivalent from the United States Armed Forces or the Israel Defense Forces (IDF).',
        order: 1
      },
      {
        id: 'section-2',
        title: '2. Combat Unit Service',
        content: 'Must have served in an officially recognized combat-designated unit:',
        subsections: [
          {
            id: 'subsection-2a',
            title: 'a) Israel (IDF)',
            bulletPoints: [
              'Infantry brigades: Golani, Givati, Paratroopers',
              'Special Forces: Shayetet 13, Sayeret Matkal, Duvdevan, Shaldag, Unit 669',
              'Equivalent combat roles in officially designated combat units'
            ],
            order: 1
          },
          {
            id: 'subsection-2b',
            title: 'b) United States',
            bulletPoints: [
              'U.S. Special Operations: SEALs, Green Berets, Delta, Rangers, Marine Raiders, PJs, CCTs, SR, TACP',
              'Combat Arms: Infantry, Marine Infantry, and equivalent frontline roles'
            ],
            order: 2
          }
        ],
        order: 2
      },
      {
        id: 'section-3',
        title: '3. Primary Combat Role',
        content: 'Served in a unit whose core mission involved direct engagement with opposing forces. Examples include:',
        bulletPoints: ['Infantry', 'Special operations', 'Armor', 'Combat engineering', 'Field artillery'],
        order: 3
      },
      {
        id: 'section-4',
        title: '4. Assigned to a Combat Unit',
        content: 'Veterans from combat support specialties are eligible if they were formally assigned or attached to a front-line combat unit and routinely operated in a forward, hostile environment as part of their primary duties.',
        order: 4
      },
      {
        id: 'section-5',
        title: '5. Active Reserve Status (Israel Specific Requirement)',
        content: 'Israeli applicants must be currently serving as a combat-designated reservist or equivalent active reserve status.',
        order: 5
      },
      {
        id: 'section-6',
        title: '6. Entrepreneurial Alignment',
        content: 'Commitment to applying combat-honed leadership, resilience, and problem-solving skills to entrepreneurial ventures. Participants should demonstrate genuine interest in:',
        bulletPoints: [
          'Translating military leadership experience into business contexts',
          'Building innovative solutions and startups',
          'Contributing to the veteran entrepreneurship community',
          'Continuous learning and professional development'
        ],
        order: 6
      }
    ],
    documentationTitle: 'Documentation Requirements / Verifiable Service Record:',
    documentationContent: 'Service and unit assignment must be verifiable through official documentation (e.g., DD-214 for U.S. veterans, \'Teudat Shichrur\' for Israeli veterans, or other relevant service records) and provided during the application process.',
    documentationNote: 'Note: Service records will be kept confidential and used solely for program eligibility verification.',
    contactTitle: 'Contact for Questions',
    contactDescription: 'For questions about service requirements or eligibility:',
    contactEmail: 'info@thevetted.vc',
    closingStatement: 'These requirements ensure that The Vetted Accelerator serves those who have demonstrated the courage, discipline, and leadership that comes from frontline military service, creating a cohort united by shared experiences and values.',
    isVisible: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  useUrlAdminAccess();

  // Load content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const serviceRequirements = await CMSServiceFactory.getServiceRequirementsService().getActiveServiceRequirements();
        setContent(serviceRequirements || defaultContent);
      } catch (error) {
        console.error('Error loading service requirements:', error);
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  // Save to database with debouncing
  const saveToDatabase = async (newContent: ServiceRequirementsContent) => {
    if (saving) return;
    
    try {
      setSaving(true);
      if (newContent.id === 'default') {
        // Create new content
        const { id, ...dataToSave } = newContent;
        await CMSServiceFactory.getServiceRequirementsService().create(dataToSave);
      } else {
        // Update existing content
        await CMSServiceFactory.getServiceRequirementsService().update(newContent.id, newContent);
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    const newContent = { ...pageData, [field]: value };
    setContent(newContent);
    if (isAdminMode) {
      saveToDatabase(newContent);
    }
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...pageData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    const newContent = { ...pageData, sections: newSections };
    setContent(newContent);
    if (isAdminMode) {
      saveToDatabase(newContent);
    }
  };

  const updateSubsection = (sectionIndex: number, subsectionIndex: number, field: string, value: any) => {
    const newSections = [...pageData.sections];
    const section = { ...newSections[sectionIndex] };
    if (section.subsections) {
      section.subsections = [...section.subsections];
      section.subsections[subsectionIndex] = { ...section.subsections[subsectionIndex], [field]: value };
    }
    newSections[sectionIndex] = section;
    const newContent = { ...pageData, sections: newSections };
    setContent(newContent);
    if (isAdminMode) {
      saveToDatabase(newContent);
    }
  };

  const pageData = content || defaultContent;

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
        title={`${pageData.title} - The Vetted Accelerator`}
        description={pageData.subtitle}
        noindex={true}
      />
      <div className="relative">
        <DiscreteAdminAccess />
        <DiscreteAdminDot />
        <SimpleAdminToggle />
        
        {isAdminMode && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
            📝 Google Docs Mode: Click any text to edit • Ctrl+Enter to save • Esc to cancel
            {saving && <span className="ml-2">💾 Saving...</span>}
          </div>
        )}
        
        {/* Header */}
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-white via-white to-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <EditableText
              content={pageData.title}
              onChange={(value) => updateField('title', value)}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black"
              style={{ fontFamily: "'Black Ops One', cursive" }}
              placeholder="Page Title"
            />
            <EditableText
              content={pageData.subtitle}
              onChange={(value) => updateField('subtitle', value)}
              className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
              multiline={true}
              placeholder="Page subtitle"
            />
            <div className="mt-8 text-sm text-gray-600">
              Last Updated: <EditableText
                content={pageData.lastUpdated}
                onChange={(value) => updateField('lastUpdated', value)}
                className="inline"
                placeholder="Date"
              />
            </div>
          </div>
        </section>

        {/* Service Requirements Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <EditableText
                content={pageData.programEligibilityTitle}
                onChange={(value) => updateField('programEligibilityTitle', value)}
                className="text-xl font-bold text-blue-900 mb-2"
                placeholder="Program Eligibility Title"
              />
              <EditableText
                content={pageData.programEligibilityDescription}
                onChange={(value) => updateField('programEligibilityDescription', value)}
                className="text-blue-800 mb-0"
                multiline={true}
                placeholder="Program eligibility description"
              />
            </div>

            <div className="space-y-8">
              {pageData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <EditableText
                    content={section.title}
                    onChange={(value) => updateSection(sectionIndex, 'title', value)}
                    className="text-2xl font-bold text-gray-900 mb-4"
                    placeholder="Section title"
                  />
                  <div className="ml-6">
                    <EditableText
                      content={section.content}
                      onChange={(value) => updateSection(sectionIndex, 'content', value)}
                      className="text-gray-700 leading-relaxed mb-4"
                      multiline={true}
                      placeholder="Section content"
                    />
                    
                    {/* Subsections */}
                    {section.subsections && (
                      <div className="space-y-4">
                        {section.subsections.map((subsection, subsectionIndex) => (
                          <div key={subsectionIndex}>
                            <EditableText
                              content={subsection.title}
                              onChange={(value) => updateSubsection(sectionIndex, subsectionIndex, 'title', value)}
                              className="text-lg font-semibold text-gray-800 mb-2"
                              placeholder="Subsection title"
                            />
                            <EditableBulletList
                              bullets={subsection.bulletPoints || []}
                              onChange={(bullets) => updateSubsection(sectionIndex, subsectionIndex, 'bulletPoints', bullets)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Direct bullet points */}
                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                      <EditableBulletList
                        bullets={section.bulletPoints}
                        onChange={(bullets) => updateSection(sectionIndex, 'bulletPoints', bullets)}
                      />
                    )}
                    
                    {/* Add bullets button for sections without bullets */}
                    {isAdminMode && (!section.bulletPoints || section.bulletPoints.length === 0) && !section.subsections && (
                      <button
                        onClick={() => updateSection(sectionIndex, 'bulletPoints', ['New bullet point'])}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium ml-6"
                      >
                        + Add bullet points
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-8" />

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <EditableText
                content={pageData.documentationTitle}
                onChange={(value) => updateField('documentationTitle', value)}
                className="text-lg font-bold text-amber-900 mb-2"
                placeholder="Documentation title"
              />
              <EditableText
                content={pageData.documentationContent}
                onChange={(value) => updateField('documentationContent', value)}
                className="text-amber-800 mb-2"
                multiline={true}
                placeholder="Documentation content"
              />
              <EditableText
                content={pageData.documentationNote}
                onChange={(value) => updateField('documentationNote', value)}
                className="text-amber-800 mb-0"
                multiline={true}
                placeholder="Documentation note"
              />
            </div>

            <EditableText
              content={pageData.contactTitle}
              onChange={(value) => updateField('contactTitle', value)}
              className="text-2xl font-bold text-gray-900"
              placeholder="Contact title"
            />
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <EditableText
                content={pageData.contactDescription}
                onChange={(value) => updateField('contactDescription', value)}
                className="mb-4"
                multiline={true}
                placeholder="Contact description"
              />
              <ul className="space-y-2">
                <li>
                  <strong>Email:</strong> <EditableText
                    content={pageData.contactEmail}
                    onChange={(value) => updateField('contactEmail', value)}
                    className="text-blue-600 inline"
                    placeholder="Contact email"
                  />
                </li>
              </ul>
            </div>

            <hr className="my-8" />
            
            <div className="text-center text-gray-600">
              <EditableText
                content={pageData.closingStatement}
                onChange={(value) => updateField('closingStatement', value)}
                multiline={true}
                placeholder="Closing statement"
              />
            </div>

          </div>
        </section>

        <BottomNavigation currentPage="home" />
      </div>
    </>
  );
}