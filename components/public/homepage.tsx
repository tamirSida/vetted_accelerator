'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import HeroSection from './hero-section';
import ContentSection from './content-section';
import MissionSection from './mission-section';
import FAQSection from './faq-section';
import BottomNavigation from './bottom-navigation';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import EditableSection from '@/components/admin/editable-section';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import EditModal from '@/components/admin/edit-modal';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EXTERNAL_URLS } from '@/lib/config/urls';
// AdminProvider is now in root layout

import { CMSServiceFactory } from '@/lib/cms/content-services';
import { 
  HeroSection as HeroType, 
  ContentSection as ContentType,
  FAQ,
  MissionSection as MissionSectionType
} from '@/lib/types/cms';
import MissionEditModal from '@/components/admin/mission-edit-modal';

function AlphaBetHomepageContent() {
  const [hero, setHero] = useState<HeroType | null>(null);
  const [contentSections, setContentSections] = useState<ContentType[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [missionSection, setMissionSection] = useState<MissionSectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [dividerWidth, setDividerWidth] = useState(200);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [missionEditModalOpen, setMissionEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  // State to store the current content for each section
  const [sectionContent, setSectionContent] = useState({
    mission: "You've demonstrated courage, discipline, and leadership in the most challenging environments. Now, we're here to help you apply those same traits to the world of entrepreneurship.\n\n• Bridge military experience with entrepreneurial skills\n• Get practical MBA-level education designed for founders  \n• Join a community of battle-tested veteran entrepreneurs\n• Create lasting impact through veteran-led innovation",
    'why-alpha-bet': "• ⁠A Unique Partnership Between U.S. and Israel Veterans: We are the only platform uniting elite U.S. and Israeli operators. This gives our founders a distinct advantage: Israeli startups gain a trusted path to the U.S. market, while American founders get direct access to Israel's deep-tech ecosystem.\n• Recognized as a Proven Platform & Led By People Who've Been There: Our team includes multi-exit, combat veteran entrepreneurs and academics. Veteran Founders choose us for our proven track record and practical, in-the-trenches and purpose-built curriculum.\n• An Unparalleled Network of Mission-Driven Leaders: We connect our students with a curated network of unicorn founders and top executives. Amidst growing support for veterans, these leaders are personally invested in our mission and actively mentor our companies as the premier platform for giving back to this community.",
    'what-you-gain': "• Build a Strong Team: During the program you will work in cross border teams to develop a startup. The program provides an opportunity to meet and work with other mission-driven veterans.\n• Gain Confidence & Knowledge: Learn to translate the skills you gained in your service to a new career in entrepreneurship. You will leave with a practical understanding of the entrepreneurial process, from ideation to venture creation.\n• Not just lessons, gain practical experience: Work in groups on real ideas and present to  investors and industry experts.\n• Priority Application to Version Bravo Accelerator: This gives you a direct path to the next level of funding and mentorship."
  });

  // Enable URL-based admin access
  useUrlAdminAccess();

  // Scroll to section function
  const scrollToSection = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    const section = sectionRefs.current[index];
    if (container && section) {
      const scrollLeft = section.offsetLeft - (container.offsetWidth - section.offsetWidth) / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      setActiveSection(index);
    }
  }, []);

  // Handle scroll to update active section
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    sectionRefs.current.forEach((section, index) => {
      if (section) {
        const sectionCenter = section.offsetLeft + section.offsetWidth / 2;
        const distance = Math.abs(containerCenter - sectionCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    setActiveSection(closestIndex);
  }, []);

  // Keyboard navigation
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && activeSection > 0) {
      scrollToSection(activeSection - 1);
    } else if (e.key === 'ArrowRight' && activeSection < 2) {
      scrollToSection(activeSection + 1);
    }
  }, [activeSection, scrollToSection]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const updateContentSection = useCallback((sectionType: string, newContent: string) => {
    console.log(`Updating ${sectionType} content:`, newContent);
    setSectionContent(prev => ({
      ...prev,
      [sectionType]: newContent
    }));
  }, []);

  const saveContentToDatabase = useCallback(async (sectionType: string, newContent: string) => {
    try {
      // Check if content section already exists in CMS
      const existingContent = contentSections.find(section => section.type === sectionType);
      
      const contentData = {
        title: sectionType === 'mission' ? 'Our Mission' :
               sectionType === 'why-alpha-bet' ? 'Why Alpha-Bet?' :
               sectionType === 'what-you-gain' ? 'What You\'ll Gain' : 'Content Section',
        content: newContent,
        type: sectionType as 'mission' | 'why-alpha-bet' | 'what-you-gain',
        isVisible: true,
        order: existingContent?.order || (contentSections.length + 1)
      };

      if (existingContent && existingContent.id) {
        // Update existing content section
        await CMSServiceFactory.getContentSectionService().update(existingContent.id, contentData);
        console.log(`Updated existing ${sectionType} content in database`);
      } else {
        // Create new content section
        await CMSServiceFactory.getContentSectionService().create(contentData);
        console.log(`Created new ${sectionType} content in database`);
      }
    } catch (error) {
      console.error(`Error saving ${sectionType} content to database:`, error);
      throw error;
    }
  }, [contentSections]);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load content for homepage
      const [
        heroData,
        contentData,
        faqData,
        missionData
      ] = await Promise.all([
        CMSServiceFactory.getHeroService().getActiveHero(),
        CMSServiceFactory.getContentSectionService().getVisible(),
        CMSServiceFactory.getFAQService().getVisible(),
        CMSServiceFactory.getMissionSectionService().getActiveMission()
      ]);

      console.log('Loaded hero data:', heroData);
      setHero(heroData);
      setContentSections(contentData);
      setFaqs(faqData);
      setMissionSection(missionData);
      
      // Load CMS content into local state for sections that exist
      setSectionContent(prev => {
        const newSectionContent = { ...prev };
        contentData.forEach(section => {
          if (section.type && section.content && ['mission', 'why-alpha-bet', 'what-you-gain'].includes(section.type)) {
            newSectionContent[section.type as keyof typeof prev] = section.content;
          }
        });
        return newSectionContent;
      });
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Edit handlers
  const handleEdit = useCallback((type: string, item?: any) => {
    console.log('Opening edit modal for:', type, 'with item:', item); // Debug log
    setEditingType(type);
    setEditingItem(item);
    setEditModalOpen(true);
  }, []);


  const handleEditHighlight = useCallback((sectionType: string, highlight?: any, index?: number) => {
    setEditingType('highlight');
    setEditingItem({
      type: sectionType,
      highlight,
      index,
      text: highlight?.text || ''
    });
    setEditModalOpen(true);
  }, []);

  const handleDeleteHighlight = useCallback(async (sectionType: string, highlight: any, index: number) => {
    if (confirm('Are you sure you want to delete this highlight?')) {
      try {
        const currentContent = sectionContent[sectionType as keyof typeof sectionContent];
        // Parse current content and remove the highlight
        const allLines = currentContent.split('\n');
        const nonBulletLines = allLines.filter(line => 
          !line.trim().startsWith('•') && !line.trim().startsWith('-') && line.trim() !== ''
        );
        const bullets = allLines.filter(line => 
          line.trim().startsWith('•') || line.trim().startsWith('-')
        );
        
        // Remove the highlight at the specified index
        bullets.splice(index, 1);
        
        // Reconstruct content
        let newContent = '';
        if (nonBulletLines.length > 0) {
          newContent = nonBulletLines.join('\n').trim();
          if (bullets.length > 0) {
            newContent += '\n\n' + bullets.join('\n');
          }
        } else {
          newContent = bullets.join('\n');
        }
        
        // Save to database
        await saveContentToDatabase(sectionType, newContent);
        
        // Update local state
        updateContentSection(sectionType, newContent);
      } catch (error) {
        console.error('Error deleting highlight:', error);
        alert('Failed to delete highlight. Please try again.');
      }
    }
  }, [sectionContent, updateContentSection, saveContentToDatabase]);

  const handleAddHighlight = useCallback((sectionType: string) => {
    setEditingType('highlight');
    setEditingItem({
      type: sectionType,
      isNew: true,
      text: ''
    });
    setEditModalOpen(true);
  }, []);

  const handleEditMission = useCallback(() => {
    setMissionEditModalOpen(true);
  }, []);

  const handleSaveMission = useCallback(async (data: Partial<MissionSectionType>) => {
    try {
      if (missionSection && missionSection.id) {
        // Update existing mission
        await CMSServiceFactory.getMissionSectionService().update(missionSection.id, data);
      } else {
        // Create new mission - ensure required fields are provided
        const newMissionData = {
          title: data.title || 'Our Mission',
          description: data.description || 'Our foundation and purpose',
          bullets: data.bullets || [],
          type: 'mission' as const,
          isVisible: data.isVisible ?? true,
          order: data.order || 1
        };
        await CMSServiceFactory.getMissionSectionService().create(newMissionData);
      }
      await loadContent();
    } catch (error) {
      console.error('Error saving mission:', error);
      throw error;
    }
  }, [missionSection, loadContent]);

  const handleEditDescription = useCallback((sectionType: string) => {
    // Find the content section by type
    const contentSection = contentSections.find(section => section.type === sectionType);
    
    // Get the default description for this section type
    const getDefaultDescription = (type: string) => {
      switch (type) {
        case 'mission':
          return 'Our foundation and purpose';
        case 'why-alpha-bet':
          return 'What makes us unique';
        case 'what-you-gain':
          return 'Your transformation journey';
        default:
          return 'Learn more';
      }
    };
    
    setEditingType('section-description'); // Use a separate editing type
    setEditingItem({
      ...contentSection,
      id: contentSection?.id || `default-${sectionType}`,
      title: contentSection?.title || (sectionType === 'mission' ? 'Our Mission' :
              sectionType === 'why-alpha-bet' ? 'Why Alpha-Bet?' :
              sectionType === 'what-you-gain' ? 'What You\'ll Gain' : 'Content Section'),
      content: contentSection?.content || sectionContent[sectionType as keyof typeof sectionContent],
      description: contentSection?.description || getDefaultDescription(sectionType),
      type: sectionType
    });
    setEditModalOpen(true);
  }, [contentSections, sectionContent]);

  const handleDelete = useCallback(async (type: string, item: any) => {
    try {
      if (type === 'faq' && item.id && !item.id.startsWith('faq-')) {
        await CMSServiceFactory.getFAQService().delete(item.id);
        await loadContent();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  }, [loadContent]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'hero') {
        if (editingItem && editingItem.id) {
          await CMSServiceFactory.getHeroService().update(editingItem.id, data);
        } else {
          await CMSServiceFactory.getHeroService().create(data);
        }
      } else if (editingType === 'content') {
        // Fix the Firebase document not existing issue
        if (editingItem && editingItem.id && !editingItem.id.startsWith('default-')) {
          // Update existing content section
          await CMSServiceFactory.getContentSectionService().update(editingItem.id, data);
        } else {
          // Create new content section
          const contentData = {
            ...data,
            isVisible: true,
            order: data.order || contentSections.length + 1
          };
          await CMSServiceFactory.getContentSectionService().create(contentData);
        }
      } else if (editingType === 'highlight') {
        // Handle individual highlight editing
        const { type: sectionType, isNew, index } = editingItem;
        const currentContent = sectionContent[sectionType as keyof typeof sectionContent];
        const allLines = currentContent.split('\n');
        const nonBulletLines = allLines.filter(line => 
          !line.trim().startsWith('•') && !line.trim().startsWith('-') && line.trim() !== ''
        );
        const bullets = allLines.filter(line => 
          line.trim().startsWith('•') || line.trim().startsWith('-')
        );
        
        if (isNew) {
          // Add new highlight
          bullets.push('• ' + data.text.trim());
        } else if (typeof index === 'number') {
          // Edit existing highlight
          bullets[index] = '• ' + data.text.trim();
        }
        
        // Reconstruct content
        let newContent = '';
        if (nonBulletLines.length > 0) {
          newContent = nonBulletLines.join('\n').trim();
          if (bullets.length > 0) {
            newContent += '\n\n' + bullets.join('\n');
          }
        } else {
          newContent = bullets.join('\n');
        }
        
        // Save to database
        await saveContentToDatabase(sectionType, newContent);
        
        // Update local state
        updateContentSection(sectionType, newContent);
      } else if (editingType === 'section-description') {
        // Handle section description editing specifically
        const { type: sectionType } = editingItem;
        const contentData = {
          title: editingItem.title,
          content: editingItem.content,
          description: data.description,
          type: sectionType,
          isVisible: true,
          order: editingItem.order || contentSections.length + 1
        };

        // Fix the Firebase document not existing issue
        if (editingItem && editingItem.id && !editingItem.id.startsWith('default-')) {
          // Update existing content section
          await CMSServiceFactory.getContentSectionService().update(editingItem.id, contentData);
        } else {
          // Create new content section
          await CMSServiceFactory.getContentSectionService().create(contentData);
        }
      } else if (editingType === 'faq') {
        if (editingItem && editingItem.id && !editingItem.id.startsWith('faq-')) {
          await CMSServiceFactory.getFAQService().update(editingItem.id, data);
        } else {
          const faqData = {
            ...data,
            isVisible: true,
            order: data.order || faqs.length + 1
          };
          await CMSServiceFactory.getFAQService().create(faqData);
        }
      }
      
      await loadContent();
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  }, [editingType, editingItem, contentSections.length, faqs.length, loadContent, sectionContent, saveContentToDatabase, updateContentSection]);

  const getEditFields = useCallback((type: string) => {
    switch (type) {
      case 'hero':
        return [
          { key: 'headline', label: 'Headline', type: 'text' as const, required: true, placeholder: 'Enter the main headline' },
          { key: 'subHeadline', label: 'First Sub-headline', type: 'textarea' as const, required: true, placeholder: 'The only entrepreneurship program for US and Israeli combat veterans.' },
          { key: 'subHeadline2', label: 'Second Sub-headline', type: 'textarea' as const, required: false, placeholder: 'Alpha-Bet equips you with the skills, network, and battle-tested mindset to build a successful startup...' },
          { key: 'applicationWindowOpens', label: 'Application Window Opens', type: 'date' as const, required: false, placeholder: '2025-01-15' },
          { key: 'applicationWindowCloses', label: 'Application Window Closes', type: 'date' as const, required: false, placeholder: '2025-02-28' },
          { key: 'programStartDate', label: 'Program Start Date', type: 'date' as const, required: false, placeholder: '2025-03-15' },
          { key: 'programEndDate', label: 'Program End Date', type: 'date' as const, required: false, placeholder: '2025-05-24' },
          { key: 'ctaText', label: 'Call-to-Action Text', type: 'text' as const, required: true, placeholder: 'e.g., Apply Now' },
          { key: 'ctaLink', label: 'Call-to-Action Link', type: 'text' as const, required: true, placeholder: '/curriculum or https://...' },
          { key: 'backgroundImage', label: 'Background Image URL', type: 'text' as const, required: false, placeholder: '/images/hero.jpeg or https://...' }
        ];
      case 'content':
        return [
          { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Enter section title' },
          { key: 'content', label: 'Content', type: 'textarea' as const, required: true, placeholder: 'Enter section content...' },
          { key: 'description', label: 'Section Description', type: 'text' as const, required: false, placeholder: 'What makes us unique' },
          { key: 'type', label: 'Section Type', type: 'text' as const, required: true, placeholder: 'e.g., mission, why-alpha-bet, what-you-gain' }
        ];
      case 'section-description':
        return [
          { key: 'description', label: 'Section Description', type: 'text' as const, required: false, placeholder: 'What makes us unique' }
        ];
      case 'highlight':
        return [
          { key: 'text', label: 'Highlight Text', type: 'textarea' as const, required: true, placeholder: 'Enter the key highlight...' }
        ];
      case 'faq':
        return [
          { key: 'question', label: 'Question', type: 'text' as const, required: true, placeholder: 'Enter the FAQ question' },
          { key: 'answer', label: 'Answer', type: 'textarea' as const, required: true, placeholder: 'Enter the FAQ answer...' },
          { key: 'order', label: 'Order', type: 'number' as const, required: true, placeholder: '1-10' }
        ];
      default:
        return [];
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    const updateDividerWidth = () => {
      if (subtitleRef.current) {
        const textWidth = subtitleRef.current.scrollWidth;
        const maxWidth = window.innerWidth * 0.9;
        setDividerWidth(Math.min(textWidth, maxWidth));
      }
    };

    // Update width on mount and resize
    updateDividerWidth();
    window.addEventListener('resize', updateDividerWidth);
    
    return () => window.removeEventListener('resize', updateDividerWidth);
  }, [hero?.subHeadline]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  // Fallback hero if no content is found
  const defaultHero = {
    headline: "From Battlefield to Business: Your Next Mission Starts Here.",
    subHeadline: "The only entrepreneurship program for US and Israeli combat veterans.",
    subHeadline2: "Alpha-Bet equips you with the skills, network, and battle-tested mindset to build a successful startup. It's time to channel your experience into innovation.",
    applicationWindowOpens: "2025-01-15",
    applicationWindowCloses: "2025-02-28",
    programStartDate: "2025-03-15",
    programEndDate: "2025-05-24",
    ctaText: "Explore Program",
    ctaLink: "/curriculum"
  };

  const activeHero = hero || defaultHero;

  return (
    <div className="relative">
      {/* Discrete Admin Access Components */}
      <DiscreteAdminAccess />
      <DiscreteAdminDot />
      <SimpleAdminToggle />
      
      {/* Hero Section with Split Layout */}
      <div className="bg-gradient-to-r from-white via-white to-gray-200 relative">
        
        <EditableSection
          sectionName="Hero"
          onEdit={() => handleEdit('hero', activeHero)}
        >
          <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 py-8">
            {/* Military corner accents - hidden on mobile */}
            <div className="hidden lg:block absolute top-8 left-16 w-16 h-16 border-l-4 border-t-4 border-gray-800 opacity-20"></div>
            <div className="hidden lg:block absolute top-8 right-16 w-16 h-16 border-r-4 border-t-4 border-gray-800 opacity-20"></div>
            <div className="hidden lg:block absolute bottom-20 left-16 w-16 h-16 border-l-4 border-b-4 border-gray-800 opacity-20"></div>
            <div className="hidden lg:block absolute bottom-20 right-16 w-16 h-16 border-r-4 border-b-4 border-gray-800 opacity-20"></div>
            
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
              {/* Mobile headline - shows above image on mobile only */}
              <div className="lg:hidden order-1 text-center mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  Alpha-Bet
                </h1>
              </div>
              
              {/* Left side - Hero content */}
              <div className="order-3 lg:order-1 text-center lg:text-left">
                <h1 className="hidden lg:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  {activeHero.headline.includes('By Version Bravo') ? 
                    activeHero.headline.replace(' By Version Bravo', '').replace('By Version Bravo', '') :
                    activeHero.headline
                  }
                </h1>
                <p 
                  ref={subtitleRef}
                  className="text-lg sm:text-xl md:text-2xl text-black font-bold mb-4 leading-relaxed" 
                  style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}
                >
                  {activeHero.subHeadline}
                </p>
                <div className="flex justify-center lg:justify-start mb-4">
                  <div 
                    className="h-1 bg-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${dividerWidth}px` }}
                  ></div>
                </div>
                
                {/* Mobile application status - shows above subHeadline2 on mobile only */}
                {(activeHero.applicationWindowOpens || activeHero.applicationWindowCloses || activeHero.programStartDate) && (
                  <div className="lg:hidden mb-6">
                    {(() => {
                      const now = new Date();
                      const openDate = activeHero.applicationWindowOpens ? new Date(activeHero.applicationWindowOpens) : null;
                      const closeDate = activeHero.applicationWindowCloses ? new Date(activeHero.applicationWindowCloses) : null;
                      const startDate = activeHero.programStartDate ? new Date(activeHero.programStartDate) : null;
                      
                      const programMonth = startDate ? startDate.toLocaleDateString('en-US', { month: 'long' }) : 'Spring';
                      
                      let isActive = false;
                      let statusText = "Unavailable";
                      let statusColor = "text-red-500";
                      let dotColor = "bg-red-500";
                      let message = `Application window for ${programMonth} Class has closed`;
                      
                      if (!openDate || !closeDate) {
                        message = `Applications for ${programMonth} Class will be announced soon`;
                        statusText = "Pending";
                        statusColor = "text-gray-500";
                        dotColor = "bg-gray-500";
                      } else if (now < openDate) {
                        const startDateFormatted = startDate ? startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                        const endDate = activeHero.programEndDate ? new Date(activeHero.programEndDate) : null;
                        const endDateFormatted = endDate ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                        
                        message = `Applications for ${programMonth} Class open on ${openDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                        if (activeHero.programStartDate && activeHero.programEndDate) {
                          message += `<br>Program Start Date: ${startDateFormatted}<br>Program End Date: ${endDateFormatted}`;
                        }
                        statusText = "Opening Soon";
                        statusColor = "text-yellow-500";
                        dotColor = "bg-yellow-500";
                      } else if (now >= openDate && now <= closeDate) {
                        const startDateFormatted = startDate ? startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                        const endDate = activeHero.programEndDate ? new Date(activeHero.programEndDate) : null;
                        const endDateFormatted = endDate ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                        
                        message = `Applications for ${programMonth} Class are open<br>until ${closeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                        if (startDateFormatted && endDateFormatted) {
                          message += `<br>Program Start Date: ${startDateFormatted}<br>Program End Date: ${endDateFormatted}`;
                        }
                        isActive = true;
                        statusText = "Active";
                        statusColor = "text-green-500";
                        dotColor = "bg-green-500";
                      }
                      
                      return (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 mb-6 shadow-lg">
                          <div id="application-status-mobile" className="text-center">
                            <div 
                              className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed mb-3" 
                              style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}
                              dangerouslySetInnerHTML={{ __html: message }}
                            />
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-2 h-2 ${dotColor} rounded-full ${isActive ? 'animate-pulse' : ''}`}></div>
                              <span className={`text-xs font-medium ${statusColor}`}>Status: {statusText}</span>
                            </div>
                            <div className="mt-4">
                              <Link href={EXTERNAL_URLS.APPLY_FORM}>
                                <Button 
                                  size="sm"
                                  className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                >
                                  Apply Now
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {activeHero.subHeadline2 && (
                  <p className="hidden lg:block text-base sm:text-lg text-black mb-6 leading-relaxed">
                    {activeHero.subHeadline2}
                  </p>
                )}
                
                {/* Info Session Button */}
                <div className="mb-6">
                  <Link href="/info-session">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer" style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}>
                      Live & Pre-Recorded Info Sessions
                    </button>
                  </Link>
                </div>
                {(activeHero.applicationWindowOpens || activeHero.applicationWindowCloses || activeHero.programStartDate) && (
                  <div className="hidden lg:block">
                    {(() => {
                    const now = new Date();
                    const openDate = activeHero.applicationWindowOpens ? new Date(activeHero.applicationWindowOpens) : null;
                    const closeDate = activeHero.applicationWindowCloses ? new Date(activeHero.applicationWindowCloses) : null;
                    const startDate = activeHero.programStartDate ? new Date(activeHero.programStartDate) : null;
                    
                    const programMonth = startDate ? startDate.toLocaleDateString('en-US', { month: 'long' }) : 'Spring';
                    
                    let isActive = false;
                    let statusText = "Unavailable";
                    let statusColor = "text-red-500";
                    let dotColor = "bg-red-500";
                    let message = `Application window for ${programMonth} Class has closed`;
                    
                    if (!openDate || !closeDate) {
                      message = `Applications for ${programMonth} Class will be announced soon`;
                      statusText = "Pending";
                      statusColor = "text-gray-500";
                      dotColor = "bg-gray-500";
                    } else if (now < openDate) {
                      const startDateFormatted = startDate ? startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                      const endDate = activeHero.programEndDate ? new Date(activeHero.programEndDate) : null;
                      const endDateFormatted = endDate ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                      
                      message = `Applications for ${programMonth} Class open on ${openDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                      if (activeHero.programStartDate && activeHero.programEndDate) {
                        message += `<br>Program Start Date: ${startDateFormatted}<br>Program End Date: ${endDateFormatted}`;
                      }
                      statusText = "Opening Soon";
                      statusColor = "text-yellow-500";
                      dotColor = "bg-yellow-500";
                    } else if (now >= openDate && now <= closeDate) {
                      const startDateFormatted = startDate ? startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                      const endDate = activeHero.programEndDate ? new Date(activeHero.programEndDate) : null;
                      const endDateFormatted = endDate ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                      
                      message = `Applications for ${programMonth} class are open until ${closeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                      if (startDateFormatted && endDateFormatted) {
                        message += `<br>Program Start Date: ${startDateFormatted}<br>Program End Date: ${endDateFormatted}`;
                      }
                      isActive = true;
                      statusText = "Active";
                      statusColor = "text-green-500";
                      dotColor = "bg-green-500";
                    }
                    
                    return (
                      <div id="application-status" className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-3 mb-6">
                        <div className="text-center lg:text-left">
                          <div 
                            className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed mb-3" 
                            style={{ fontFamily: "'Gunplay', 'Black Ops One', cursive" }}
                            dangerouslySetInnerHTML={{ __html: message }}
                          />
                          <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                            <div className={`w-2 h-2 ${dotColor} rounded-full ${isActive ? 'animate-pulse' : ''}`}></div>
                            <span className={`text-xs font-medium ${statusColor}`}>Status: {statusText}</span>
                          </div>
                          <div className="flex justify-center lg:justify-start">
                            <Link href={EXTERNAL_URLS.APPLY_FORM}>
                              <Button 
                                size="sm"
                                className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                              >
                                Apply Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  </div>
                )}
              </div>
              
              {/* Right side - Hero image */}
              <div className="order-2 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md lg:max-w-lg">
                  <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                    {(() => {
                      const imageUrl = hero?.backgroundImage;
                      console.log('Hero backgroundImage:', imageUrl);
                      
                      // Check if it's a valid image path and normalize it
                      const normalizeImageUrl = (url: string): string | null => {
                        if (!url) return null;
                        
                        // If it starts with 'public/', convert to proper local path
                        if (url.startsWith('public/')) {
                          return '/' + url.substring(7); // Remove 'public/' and add leading slash
                        }
                        
                        // If it starts with /, it's already a proper local path
                        if (url.startsWith('/')) return url;
                        
                        // Check if it's a valid URL
                        try {
                          new URL(url);
                          return url;
                        } catch {
                          return null;
                        }
                      };
                      
                      const normalizedUrl = normalizeImageUrl(imageUrl || '');
                      console.log('Normalized URL:', normalizedUrl, 'from original:', imageUrl);
                      
                      if (normalizedUrl) {
                        console.log('Rendering Image component with src:', normalizedUrl);
                        return (
                          <Image
                            src={normalizedUrl}
                            alt="Alpha-Bet Program"
                            fill
                            className="object-cover object-[80%_75%]"
                            priority
                            onError={(e) => {
                              console.error('Image failed to load:', normalizedUrl, e);
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', normalizedUrl);
                            }}
                          />
                        );
                      }
                      
                      // Show placeholder if no valid image
                      return (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
                          <div className="text-center text-white p-8">
                            <i className="fas fa-shield-alt text-6xl mb-4 opacity-80"></i>
                            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Black Ops One', cursive" }}>
                            Combat Veterans
                          </h3>
                          <p className="text-lg opacity-90">
                            Building Tomorrow's Startups
                          </p>
                        </div>
                      </div>
                      );
                    })()}
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full opacity-30 animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </section>
        </EditableSection>

        {/* Horizontal Scrollable Content Sections */}
        <div className="relative">
          {/* Navigation Indicators */}
          <div className="flex justify-center mb-3 lg:mb-6 px-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              {['Our Mission', 'Why Alpha-Bet?', 'What You\'ll Gain'].map((title, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${
                    activeSection === index 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    activeSection === index ? 'bg-white' : 'bg-gray-400'
                  }`}></div>
                  <span className="hidden sm:inline text-sm font-medium">{title}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'manipulation' }}
            onScroll={handleScroll}
          >
            {/* Mission Section */}
            <div 
              ref={el => { sectionRefs.current[0] = el; }}
              className="min-w-full snap-center"
            >
              <EditableSection
                sectionName="Mission"
                onEdit={handleEditMission}
              >
                {missionSection ? (
                  <MissionSection 
                    mission={missionSection}
                    onEdit={handleEditMission}
                  />
                ) : (
                  <div className="py-16 text-center">
                    <div className="text-gray-500 mb-4">
                      <i className="fas fa-bullseye text-4xl opacity-30"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Mission Section</h3>
                    <p className="text-gray-500 mb-6">Create your mission section to get started.</p>
                    <button
                      onClick={handleEditMission}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Mission Section
                    </button>
                  </div>
                )}
              </EditableSection>
            </div>

            {/* Why Alpha-Bet Section */}
            <div 
              ref={el => { sectionRefs.current[1] = el; }}
              className="min-w-full snap-center"
            >
              <EditableSection
                sectionName="Why Alpha-Bet"
                onEdit={() => {
                  const contentSection = contentSections.find(section => section.type === 'why-alpha-bet');
                  const getDefaultDescription = (type: string) => {
                    switch (type) {
                      case 'mission': return 'Our foundation and purpose';
                      case 'why-alpha-bet': return 'What makes us unique';
                      case 'what-you-gain': return 'Your transformation journey';
                      default: return 'Learn more';
                    }
                  };
                  
                  handleEdit('content', {
                    ...contentSection,
                    id: contentSection?.id || "default-why-alpha-bet",
                    title: contentSection?.title || "Why Alpha-Bet?",
                    content: contentSection?.content || "This isn't a traditional classroom. This is a community of like-minded individuals who share your unique experiences and understand the 'battle-tested' approach to problem-solving.\n\n• Proven Network: Access to Version Bravo ecosystem with US and Israeli operators\n• Veteran-to-Veteran Mentorship: Learn from successful entrepreneur combat veterans\n• Fast-Track to Success: Priority application to Version Bravo accelerator with investment",
                    description: contentSection?.description || getDefaultDescription('why-alpha-bet'),
                    type: "why-alpha-bet"
                  });
                }}
              >
                <ContentSection
                  title="Why Alpha-Bet?"
                  content={sectionContent['why-alpha-bet']}
                  type="why-alpha-bet"
                  description={contentSections.find(section => section.type === 'why-alpha-bet')?.description}
                  onEditHighlight={(highlight, index) => handleEditHighlight('why-alpha-bet', highlight, index)}
                  onDeleteHighlight={(highlight, index) => handleDeleteHighlight('why-alpha-bet', highlight, index)}
                  onAddHighlight={() => handleAddHighlight('why-alpha-bet')}
                  onEditDescription={() => handleEditDescription('why-alpha-bet')}
                />
              </EditableSection>
            </div>

            {/* What You'll Gain Section */}
            <div 
              ref={el => { sectionRefs.current[2] = el; }}
              className="min-w-full snap-center"
            >
              <EditableSection
                sectionName="What You'll Gain"
                onEdit={() => {
                  const contentSection = contentSections.find(section => section.type === 'what-you-gain');
                  const getDefaultDescription = (type: string) => {
                    switch (type) {
                      case 'mission': return 'Our foundation and purpose';
                      case 'why-alpha-bet': return 'What makes us unique';
                      case 'what-you-gain': return 'Your transformation journey';
                      default: return 'Learn more';
                    }
                  };
                  
                  handleEdit('content', {
                    ...contentSection,
                    id: contentSection?.id || "default-what-you-gain",
                    title: contentSection?.title || "What You'll Gain",
                    content: contentSection?.content || "Transform your military experience into entrepreneurial success through our comprehensive 10-week program.\n\n• Build a Strong Team: Connect and develop startups with mission-driven veteran peers\n• Gain Confidence & Knowledge: Master the entrepreneurial process from ideation to venture creation\n• Experience Real-World Pitching: Present your startup to actual investors\n• Receive Priority for Acceleration: Direct path to Version Bravo accelerator with investment opportunity",
                    description: contentSection?.description || getDefaultDescription('what-you-gain'),
                    type: "what-you-gain"
                  });
                }}
              >
                <ContentSection
                  title="What You'll Gain"
                  content={sectionContent['what-you-gain']}
                  type="what-you-gain"
                  description={contentSections.find(section => section.type === 'what-you-gain')?.description}
                  onEditHighlight={(highlight, index) => handleEditHighlight('what-you-gain', highlight, index)}
                  onDeleteHighlight={(highlight, index) => handleDeleteHighlight('what-you-gain', highlight, index)}
                  onAddHighlight={() => handleAddHighlight('what-you-gain')}
                  onEditDescription={() => handleEditDescription('what-you-gain')}
                />
              </EditableSection>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => activeSection > 0 && scrollToSection(activeSection - 1)}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeSection > 0 
                ? 'bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={activeSection <= 0}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button 
            onClick={() => activeSection < 2 && scrollToSection(activeSection + 1)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeSection < 2 
                ? 'bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={activeSection >= 2}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <EditableSection
        sectionName="FAQ"
        onEdit={() => handleEdit('faq')}
      >
        <FAQSection 
          faqs={faqs} 
          onEdit={(faq) => handleEdit('faq', faq)}
          onDelete={(faq) => handleDelete('faq', faq)}
        />
      </EditableSection>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="home" />

      {/* Edit Modal */}
      <EditModal
        key={editingItem?.id || 'new'} // Force re-render when editing different items
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
          setEditingType('');
        }}
        onSave={handleSave}
        title={`Edit ${editingType}`}
        fields={editingType ? getEditFields(editingType) : []}
        initialData={editingItem}
        loading={loading}
      />

      {/* Mission Edit Modal */}
      <MissionEditModal
        isOpen={missionEditModalOpen}
        onClose={() => setMissionEditModalOpen(false)}
        onSave={handleSaveMission}
        initialData={missionSection}
        loading={loading}
      />

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Export directly - AdminProvider is already in the app layout
export default function AlphaBetHomepage() {
  return <AlphaBetHomepageContent />;
}