'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/lib/cms/admin-context';
import { CurriculumItem, CurriculumHeader, CurriculumButtonConfig } from '@/lib/types/cms';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { EXTERNAL_URLS } from '@/lib/config/urls';

interface CurriculumTimelineProps {
  items: CurriculumItem[];
  header?: CurriculumHeader | null;
  cta?: any;
  onEdit?: (item?: CurriculumItem) => void;
  onDelete?: (itemId: string) => void;
  onEditHeader?: () => void;
  onEditCTA?: () => void;
}

export default function CurriculumTimeline({ items, header, cta, onEdit, onDelete, onEditHeader, onEditCTA }: CurriculumTimelineProps) {
  const { isAdminMode } = useAdmin();
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  
  // Button configuration state
  const [buttonConfig, setButtonConfig] = useState({
    type: 'navigate' as 'navigate' | 'download',
    url: '/sched.pdf'
  });
  const [buttonConfigData, setButtonConfigData] = useState<CurriculumButtonConfig | null>(null);
  const [showButtonEdit, setShowButtonEdit] = useState(false);
  const [savingButton, setSavingButton] = useState(false);
  
  // Default header values with fallback to CMS data
  const activeHeader = {
    badge: header?.badge || '16-WEEK CURRICULUM',
    title: header?.title || 'Vetted Accelerator Curriculum',
    description: header?.description || ''
  };
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING...');
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [mobileModalItem, setMobileModalItem] = useState<CurriculumItem | null>(null);
  
  // Default curriculum data from your specification
  const defaultCurriculum = [
    { 
      id: 'week-1', 
      weekNumber: 1, 
      title: 'Ideation, Research, Customer Discovery & Segmentation', 
      description: 'Learn to stress-test your idea like an operator planning a mission. You\'ll validate your concept through structured research, customer interviews, and market analysis ensuring you\'re building something people actually need.', 
      icon: 'fas fa-lightbulb', 
      badge1Text: 'Market Research',
      badge1Icon: 'fas fa-search',
      badge2Text: 'Customer Interviews', 
      badge2Icon: 'fas fa-users',
      badge3Text: 'Validation',
      badge3Icon: 'fas fa-check-circle',
      order: 1, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-2', 
      weekNumber: 2, 
      title: 'Choosing Your Partners, Employees, & Advisors', 
      description: 'Discover how to recruit your A-team. From co-founder alignment to early hires and advisor selection, you\'ll learn to build teams that share your mission and complement your strengths.', 
      icon: 'fas fa-handshake', 
      badge1Text: 'Co-founder Alignment',
      badge1Icon: 'fas fa-user-friends',
      badge2Text: 'Early Hires', 
      badge2Icon: 'fas fa-users',
      badge3Text: 'Advisor Selection',
      badge3Icon: 'fas fa-user-tie',
      order: 2, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-3', 
      weekNumber: 3, 
      title: 'Comprehensive Business Plan + Product Strategy', 
      description: 'Transform your idea into a battle-ready business plan. You\'ll define your value proposition, customer segments, and product roadmap creating a clear playbook for execution and fundraising.', 
      icon: 'fas fa-map', 
      badge1Text: 'Value Proposition',
      badge1Icon: 'fas fa-bullseye',
      badge2Text: 'Customer Segments', 
      badge2Icon: 'fas fa-users',
      badge3Text: 'Product Roadmap',
      badge3Icon: 'fas fa-road',
      order: 3, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-4', 
      weekNumber: 4, 
      title: 'Product Development & Design', 
      description: 'Learn how to translate insight into MVP. This module walks you through rapid prototyping, user feedback loops, and prioritizing features that move the needle.', 
      icon: 'fas fa-cogs', 
      badge1Text: 'MVP Development',
      badge1Icon: 'fas fa-rocket',
      badge2Text: 'Rapid Prototyping', 
      badge2Icon: 'fas fa-tools',
      badge3Text: 'User Feedback',
      badge3Icon: 'fas fa-comments',
      order: 4, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-5', 
      weekNumber: 5, 
      title: 'Product Marketing & Customer Acquisition', 
      description: 'You\'ll build your go-to-market strategy, master messaging, and design your first growth campaigns. Leave with a clear customer funnel and tools to track early traction.', 
      icon: 'fas fa-chart-line', 
      badge1Text: 'Go-to-Market Strategy',
      badge1Icon: 'fas fa-bullhorn',
      badge2Text: 'Growth Campaigns', 
      badge2Icon: 'fas fa-chart-bar',
      badge3Text: 'Customer Funnel',
      badge3Icon: 'fas fa-filter',
      order: 5, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-6', 
      weekNumber: 6, 
      title: 'Corporate Governance & Legal Considerations', 
      description: 'Understand the legal foundation of your company. From entity setup to cap tables, equity distribution, and IP protection — this session ensures your structure is as strong as your strategy.', 
      icon: 'fas fa-balance-scale', 
      badge1Text: 'Entity Setup',
      badge1Icon: 'fas fa-building',
      badge2Text: 'Cap Tables', 
      badge2Icon: 'fas fa-table',
      badge3Text: 'IP Protection',
      badge3Icon: 'fas fa-shield-alt',
      order: 6, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-7', 
      weekNumber: 7, 
      title: 'Fundraising & Investment Strategy', 
      description: 'Learn how to raise capital like a seasoned entrepreneur. You\'ll master investor targeting, pitch materials, valuation basics, and negotiation tactics straight from founders who\'ve closed rounds.', 
      icon: 'fas fa-dollar-sign', 
      badge1Text: 'Investor Targeting',
      badge1Icon: 'fas fa-crosshairs',
      badge2Text: 'Pitch Materials', 
      badge2Icon: 'fas fa-presentation',
      badge3Text: 'Valuation Basics',
      badge3Icon: 'fas fa-calculator',
      order: 7, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-8', 
      weekNumber: 8, 
      title: 'Building & Leading a Team', 
      description: 'Leadership looks different in startups, but the principles stay the same. You\'ll refine your leadership style and learn how to keep your people aligned and motivated under pressure.', 
      icon: 'fas fa-users-cog', 
      badge1Text: 'Leadership Style',
      badge1Icon: 'fas fa-crown',
      badge2Text: 'Team Alignment', 
      badge2Icon: 'fas fa-users',
      badge3Text: 'Motivation',
      badge3Icon: 'fas fa-fire',
      order: 8, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-9', 
      weekNumber: 9, 
      title: 'Business Operations & Scalability', 
      description: 'Set up the systems that let you scale. This module covers financial operations, process automation, and metrics-driven decision-making, the backbone of sustainable growth.', 
      icon: 'fas fa-cogs', 
      badge1Text: 'Financial Operations',
      badge1Icon: 'fas fa-calculator',
      badge2Text: 'Process Automation', 
      badge2Icon: 'fas fa-robot',
      badge3Text: 'Metrics-Driven',
      badge3Icon: 'fas fa-chart-bar',
      order: 9, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-10', 
      weekNumber: 10, 
      title: 'Storytelling & Pitching', 
      description: 'Craft the narrative investors can\'t ignore. You\'ll build a pitch that blends mission and metrics, backed by live practice sessions with real feedback from expert storytellers, mentors, and VCs.', 
      icon: 'fas fa-bullhorn', 
      badge1Text: 'Narrative Building',
      badge1Icon: 'fas fa-book',
      badge2Text: 'Live Practice', 
      badge2Icon: 'fas fa-microphone',
      badge3Text: 'Expert Feedback',
      badge3Icon: 'fas fa-comments',
      order: 10, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-11', 
      weekNumber: 11, 
      title: 'Budgeting & Financial Planning', 
      description: 'Turn numbers into strategy. You\'ll learn startup budgeting, cash flow management, and forecasting so you can make informed decisions and extend your runway.', 
      icon: 'fas fa-calculator', 
      badge1Text: 'Startup Budgeting',
      badge1Icon: 'fas fa-chart-pie',
      badge2Text: 'Cash Flow Management', 
      badge2Icon: 'fas fa-coins',
      badge3Text: 'Forecasting',
      badge3Icon: 'fas fa-chart-line',
      order: 11, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-12', 
      weekNumber: 12, 
      title: 'Software Tools + AI + Prompt Engineering', 
      description: 'Operate like a modern founder. Discover how to integrate automation, AI tools, and prompt workflows that save time, reduce costs, and sharpen execution.', 
      icon: 'fas fa-robot', 
      badge1Text: 'Automation',
      badge1Icon: 'fas fa-cogs',
      badge2Text: 'AI Tools', 
      badge2Icon: 'fas fa-brain',
      badge3Text: 'Prompt Engineering',
      badge3Icon: 'fas fa-code',
      order: 12, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-13', 
      weekNumber: 13, 
      title: 'Company Culture & Organizational Structure', 
      description: 'Shape a culture that scales. You\'ll design the org structure, values, and rituals that create alignment and learn how to protect culture as you grow.', 
      icon: 'fas fa-sitemap', 
      badge1Text: 'Org Structure',
      badge1Icon: 'fas fa-network-wired',
      badge2Text: 'Company Values', 
      badge2Icon: 'fas fa-heart',
      badge3Text: 'Culture Building',
      badge3Icon: 'fas fa-people-arrows',
      order: 13, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-14', 
      weekNumber: 14, 
      title: 'M&A / Exit Strategy', 
      description: 'Plan your endgame from day one. Understand acquisition dynamics, strategic positioning, and how to maximize outcomes when opportunity knocks.', 
      icon: 'fas fa-handshake', 
      badge1Text: 'Acquisition Dynamics',
      badge1Icon: 'fas fa-exchange-alt',
      badge2Text: 'Strategic Positioning', 
      badge2Icon: 'fas fa-chess',
      badge3Text: 'Exit Planning',
      badge3Icon: 'fas fa-door-open',
      order: 14, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-15', 
      weekNumber: 15, 
      title: 'Investor Relations', 
      description: 'Keep your backers close and informed. You\'ll learn how to manage investor communications, track performance, and turn your investors into long-term allies.', 
      icon: 'fas fa-chart-line', 
      badge1Text: 'Investor Communications',
      badge1Icon: 'fas fa-envelope',
      badge2Text: 'Performance Tracking', 
      badge2Icon: 'fas fa-chart-bar',
      badge3Text: 'Relationship Building',
      badge3Icon: 'fas fa-handshake',
      order: 15, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 'week-16', 
      weekNumber: 16, 
      title: 'Negotiation Workshop', 
      description: 'Hone your negotiation instincts. This hands-on session covers deal-making, equity terms, and partnership agreements giving you the confidence to close on your terms.', 
      icon: 'fas fa-gavel', 
      badge1Text: 'Deal-Making',
      badge1Icon: 'fas fa-handshake',
      badge2Text: 'Equity Terms', 
      badge2Icon: 'fas fa-percentage',
      badge3Text: 'Partnership Agreements',
      badge3Icon: 'fas fa-file-contract',
      order: 16, 
      isVisible: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }
  ];

  // Merge CMS items with hardcoded data - show CMS where it exists, hardcoded elsewhere
  const getDisplayedItems = () => {
    const merged = [...defaultCurriculum];
    
    // Replace hardcoded weeks with CMS weeks where they exist
    items.forEach(cmsItem => {
      const defaultIndex = merged.findIndex(defaultItem => 
        defaultItem.weekNumber === cmsItem.weekNumber
      );
      if (defaultIndex !== -1) {
        // Replace the hardcoded week with the CMS week, ensuring all required fields are present
        const defaultItem = merged[defaultIndex];
        merged[defaultIndex] = {
          ...defaultItem,
          ...cmsItem,
          // Ensure required fields have fallback values
          icon: cmsItem.icon || defaultItem.icon,
          badge1Text: cmsItem.badge1Text || defaultItem.badge1Text,
          badge1Icon: cmsItem.badge1Icon || defaultItem.badge1Icon,
          badge2Text: cmsItem.badge2Text || defaultItem.badge2Text,
          badge2Icon: cmsItem.badge2Icon || defaultItem.badge2Icon,
          badge3Text: cmsItem.badge3Text || defaultItem.badge3Text,
          badge3Icon: cmsItem.badge3Icon || defaultItem.badge3Icon,
        };
      }
    });
    
    // Sort by weekNumber and filter visible items
    return merged.sort((a, b) => a.weekNumber - b.weekNumber).filter(item => item.isVisible);
  };

  const sortedItems = getDisplayedItems();

  // Load button configuration from database
  const loadButtonConfig = async () => {
    try {
      const config = await CMSServiceFactory.getCurriculumButtonConfigService().getActiveConfig();
      if (config) {
        setButtonConfigData(config);
        setButtonConfig({
          type: config.type,
          url: config.url
        });
      }
    } catch (error) {
      console.error('Error loading button config:', error);
    }
  };

  // Save button configuration to database
  const saveButtonConfig = async () => {
    try {
      setSavingButton(true);
      const configData = {
        type: buttonConfig.type,
        url: buttonConfig.url,
        buttonText: '16-Week Program',
        isVisible: true,
        order: 1
      };

      if (buttonConfigData && buttonConfigData.id) {
        // Update existing config
        await CMSServiceFactory.getCurriculumButtonConfigService().update(buttonConfigData.id, configData);
      } else {
        // Create new config
        await CMSServiceFactory.getCurriculumButtonConfigService().create(configData);
      }
      
      // Reload config to get updated data
      await loadButtonConfig();
      setShowButtonEdit(false);
    } catch (error) {
      console.error('Error saving button config:', error);
      alert('Failed to save button configuration');
    } finally {
      setSavingButton(false);
    }
  };

  // Load button config on component mount
  useEffect(() => {
    loadButtonConfig();
  }, []);

  // Trigger decrypting animation on component mount (page load)
  useEffect(() => {
    const loadingStages = [
      { progress: 0, text: 'Initiating Mission Briefing...', duration: 300 },
      { progress: 25, text: 'Accessing Training Materials...', duration: 300 },
      { progress: 50, text: 'Securing Communications...', duration: 300 },
      { progress: 75, text: 'Finalizing Mission Prep...', duration: 300 },
      { progress: 100, text: 'Mission Ready - Stand By', duration: 400 }
    ];

    let currentStage = 0;
    const progressInterval = setInterval(() => {
      if (currentStage < loadingStages.length) {
        const stage = loadingStages[currentStage];
        setLoadingProgress(stage.progress);
        setLoadingText(stage.text);
        currentStage++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsDecrypting(false);
          setIsLoaded(true);
        }, 500);
      }
    }, 350);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);


  // Handle week click to open mobile modal
  const handleWeekClick = (weekNumber: number) => {
    if (!isLoaded) return; // Don't allow clicks during decrypting
    
    // Open modal for mobile
    const displayItems = getDisplayedItems();
    const item = displayItems.find(item => item.weekNumber === weekNumber);
    if (item) {
      setMobileModalItem(item);
      setMobileModalOpen(true);
    }
  };

  // Handle edit click
  const handleEditClick = (item: CurriculumItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(item);
    }
  };


  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-white via-white to-gray-400 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 relative group">
          {/* Header Edit Button */}
          {isAdminMode && onEditHeader && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditHeader();
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
              title="Edit curriculum header"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span className="text-blue-600 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium tracking-wide">{activeHeader.badge}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
            {activeHeader.title}
          </h2>
          
          {activeHeader.description && (
            <p className="text-base sm:text-lg text-blue-600 max-w-2xl mx-auto leading-relaxed">
              {activeHeader.description}
            </p>
          )}
        </div>

        {/* Military Loading Screen */}
        {isDecrypting && (
          <div className="fixed inset-0 bg-gradient-to-r from-white via-white to-gray-400 flex items-center justify-center z-50">
            {/* Military grid overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
            
            {/* Fixed-size container to prevent resizing */}
            <div className="relative bg-blue-900/90 border-2 border-blue-400 rounded-lg p-8 text-center w-96 h-80 flex flex-col justify-between shadow-2xl">
              {/* Military Header */}
              <div className="border-b border-gray-600 pb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center relative">
                    <Image 
                      src="/logo.png"
                      alt="Alpha-Bet Logo" 
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-lg tracking-wider font-mono">ALPHA-BET</div>
                    <div className="text-gray-400 text-xs font-mono tracking-widest">PROGRAM INITIALIZE</div>
                  </div>
                </div>
              </div>

              {/* Mission Status */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-gray-300 text-sm font-mono mb-4 uppercase tracking-wide">
                  {loadingText}
                </div>

                {/* Military-style progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-gray-400 text-xs font-mono mb-2 uppercase tracking-wider">
                    <span>Mission Progress</span>
                    <span>{loadingProgress}%</span>
                  </div>
                  
                  <div className="w-full h-4 bg-gray-800 border border-gray-600 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-gray-500 to-gray-300 transition-all duration-500 ease-out relative"
                      style={{ width: `${loadingProgress}%` }}
                    >
                      {/* Military-style scan line */}
                      <div className="absolute top-0 right-0 w-1 h-full bg-white opacity-75"></div>
                    </div>
                  </div>
                </div>

                {/* Mission checklist */}
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>◦ SYSTEMS CHECK</span>
                    <span className="text-gray-300">{loadingProgress > 0 ? '[✓]' : '[○]'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>◦ SECURE CONNECTION</span>
                    <span className="text-gray-300">{loadingProgress > 25 ? '[✓]' : '[○]'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>◦ MISSION BRIEF READY</span>
                    <span className="text-gray-300">{loadingProgress > 75 ? '[✓]' : '[○]'}</span>
                  </div>
                </div>
              </div>

              {/* Military footer */}
              <div className="border-t border-gray-600 pt-4">
                <div className="text-gray-500 text-xs font-mono tracking-widest">
                  VETERAN AUTHORIZED ACCESS
                </div>
                {/* Tactical indicator dots */}
                <div className="flex justify-center items-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-gray-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Timeline - Side-to-Side Layout */}
        <div className={`space-y-8 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-30'}`}>
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } transition-all duration-300`}
              onMouseEnter={() => isLoaded && setHoveredWeek(item.weekNumber)}
              onMouseLeave={() => isLoaded && setHoveredWeek(null)}
            >
              {/* Week Number Circle */}
              <div className="flex-shrink-0 relative">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
                  isLoaded ? 'md:cursor-default cursor-pointer' : 'cursor-not-allowed'
                } ${
                  hoveredWeek === item.weekNumber && isLoaded
                    ? 'bg-gradient-to-br from-white via-blue-50 to-blue-100 scale-110' 
                    : 'bg-white'
                }`}
                onClick={() => handleWeekClick(item.weekNumber)}>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Week</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{item.weekNumber}</div>
                  </div>
                </div>
                <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-500 ${
                  hoveredWeek === item.weekNumber ? 'bg-blue-200/40' : 'bg-white/20'
                }`}></div>
                
                {/* Progress indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 relative group">
                {/* Admin Buttons */}
                {isAdminMode && (
                  <div className="absolute -top-2 -right-2 flex gap-2 z-20">
                    <button
                      onClick={(e) => handleEditClick(item, e)}
                      className="w-8 h-8 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                      title="Edit this week"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete Week ${item.weekNumber}?`)) {
                            onDelete(item.id);
                          }
                        }}
                        className="w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                        title="Delete this week"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                )}
                
                <div className={`relative overflow-hidden rounded-2xl border shadow-xl transition-all duration-500 ${
                  isLoaded ? 'md:cursor-default cursor-pointer' : 'cursor-not-allowed'
                } ${
                  hoveredWeek === item.weekNumber && isLoaded
                    ? 'bg-gradient-to-br from-white/15 via-white/10 to-white/5 border-white/30 shadow-2xl scale-105'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                } backdrop-blur-md`}
                onClick={() => handleWeekClick(item.weekNumber)}>
                  
                  {/* Gradient overlay for extra visual interest */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-6 sm:p-8">
                    {/* Icon and Week Indicator */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        hoveredWeek === item.weekNumber 
                          ? 'bg-white/30 scale-110' 
                          : 'bg-white/20 group-hover:scale-105'
                      }`}>
                        <i className={`${item.icon} text-xl text-blue-600`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-medium uppercase tracking-wider mb-1">
                          Week {item.weekNumber} of 16
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight group-hover:text-gray-800 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Quick preview badges */}
                    <div className="flex flex-wrap gap-2">
                      {item.badge1Text && (
                        <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-200">
                          {item.badge1Icon && <i className={`${item.badge1Icon} mr-1`}></i>}
                          {item.badge1Text}
                        </span>
                      )}
                      {item.badge2Text && (
                        <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-200">
                          {item.badge2Icon && <i className={`${item.badge2Icon} mr-1`}></i>}
                          {item.badge2Text}
                        </span>
                      )}
                      {item.badge3Text && (
                        <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-200">
                          {item.badge3Icon && <i className={`${item.badge3Icon} mr-1`}></i>}
                          {item.badge3Text}
                        </span>
                      )}
                    </div>

                    {/* Mobile tap indicator */}
                    <div className="block md:hidden mt-4 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
                        <i className="fas fa-hand-pointer"></i>
                        <span>Tap to view full details</span>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* Connecting Line (except for last item) */}
                {index < sortedItems.length - 1 && (
                  <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-6">
                    <div className="w-px h-16 bg-gradient-to-b from-white/30 via-white/20 to-transparent"></div>
                  </div>
                )}
              </div>
              
            </div>
          ))}

          {/* Add Week Button */}
          {isAdminMode && onEdit && (
            <div className="text-center mt-8">
              <button
                onClick={() => onEdit()}
                className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title="Add new week"
              >
                <i className="fas fa-plus"></i>
                <span>Add New Week</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Summary */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl relative group">
            {/* CTA Edit Button */}
            {isAdminMode && onEditCTA && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditCTA();
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 hover:bg-purple-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
                title="Edit curriculum CTA section"
              >
                <i className="fas fa-edit"></i>
              </button>
            )}
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <i className="fas fa-rocket text-white text-lg"></i>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black">
                {cta?.title || 'Your Entrepreneurial Journey Awaits'}
              </h3>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
              {cta?.description || 'Transform 16 weeks of intensive learning into a lifetime of entrepreneurial success. Each week builds on the last, creating a comprehensive foundation for your startup journey.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">16</div>
                <div className="text-black font-medium">Intensive Weeks</div>
                <div className="text-gray-700 text-sm">Structured Learning Path</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                <div className="text-black font-medium">Practical Hours</div>
                <div className="text-gray-700 text-sm">Hands-On Experience</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                <div className="text-black font-medium">Network Value</div>
                <div className="text-gray-700 text-sm">Lifelong Connections</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href={cta?.buttonLink || EXTERNAL_URLS.APPLY_FORM}
                className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 text-gray-900 font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-graduation-cap"></i>
                <span>{cta?.buttonText || 'Apply Now'}</span>
              </a>
              <div className="relative">
                {buttonConfig.type === 'download' ? (
                  <a 
                    href={`/api/download?url=${encodeURIComponent(buttonConfig.url)}&filename=Alpha-Bet-10-Week-Program.pdf`}
                    className="inline-flex items-center gap-2 bg-white/10 text-blue-700 border-blue-200 shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-blue-300 rounded-full px-6 py-3 font-semibold transition-all duration-300"
                  >
                    <i className="fas fa-download"></i>
                    <span>10-Week Program</span>
                  </a>
                ) : (
                  <a 
                    href={buttonConfig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 text-blue-700 border-blue-200 shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-blue-300 rounded-full px-6 py-3 font-semibold transition-all duration-300"
                  >
                    <i className="fas fa-calendar-alt"></i>
                    <span>10-Week Program</span>
                  </a>
                )}
                
                {/* Admin Edit Button */}
                {isAdminMode && (
                  <button
                    onClick={() => setShowButtonEdit(true)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 hover:bg-purple-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-10"
                    title="Edit button configuration"
                  >
                    <i className="fas fa-cog text-xs"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Modal for Week Details */}
      {mobileModalOpen && mobileModalItem && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm md:hidden flex items-center justify-center z-50 p-4"
          onClick={() => setMobileModalOpen(false)}
        >
          <div 
            className="bg-white backdrop-blur-md rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-gray-300 shadow-2xl transform transition-all duration-300 ease-out animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup indicator dots */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className={`${mobileModalItem.icon} text-white text-lg`}></i>
                </div>
                <div>
                  <div className="text-xs text-gray-700 font-medium uppercase tracking-wider">
                    Week {mobileModalItem.weekNumber} of 10
                  </div>
                  <h3 className="text-lg font-bold text-black leading-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
                    {mobileModalItem.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setMobileModalOpen(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors hover:scale-110 active:scale-95"
                aria-label="Close details"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-blue-600 leading-relaxed mb-6">
                {mobileModalItem.description}
              </p>

              <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-300"></i>
                What You'll Learn
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-book text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-black font-medium text-sm">Core Concepts</div>
                    <div className="text-gray-700 text-sm">Essential frameworks and methodologies</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-hammer text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-black font-medium text-sm">Hands-On Practice</div>
                    <div className="text-gray-700 text-sm">Real-world application exercises</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-comments text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-black font-medium text-sm">Peer Review</div>
                    <div className="text-gray-700 text-sm">Collaborative feedback sessions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-trophy text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-black font-medium text-sm">Milestone Achievement</div>
                    <div className="text-gray-700 text-sm">Track your progress and wins</div>
                  </div>
                </div>
              </div>

              {/* Quick preview badges */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {mobileModalItem?.badge1Text && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-200">
                      {mobileModalItem.badge1Icon && <i className={`${mobileModalItem.badge1Icon} mr-1`}></i>}
                      {mobileModalItem.badge1Text}
                    </span>
                  )}
                  {mobileModalItem?.badge2Text && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-200">
                      {mobileModalItem.badge2Icon && <i className={`${mobileModalItem.badge2Icon} mr-1`}></i>}
                      {mobileModalItem.badge2Text}
                    </span>
                  )}
                  {mobileModalItem?.badge3Text && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-200">
                      {mobileModalItem.badge3Icon && <i className={`${mobileModalItem.badge3Icon} mr-1`}></i>}
                      {mobileModalItem.badge3Text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button Configuration Modal */}
      {showButtonEdit && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowButtonEdit(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Configure 10-Week Program Button</h3>
            
            <div className="space-y-4">
              {/* Toggle between download and navigate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Action</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setButtonConfig(prev => ({ ...prev, type: 'navigate' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      buttonConfig.type === 'navigate'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Navigate
                  </button>
                  <button
                    onClick={() => setButtonConfig(prev => ({ ...prev, type: 'download' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      buttonConfig.type === 'download'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download
                  </button>
                </div>
              </div>

              {/* URL/Path input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {buttonConfig.type === 'download' ? 'File URL' : 'Navigation Path'}
                </label>
                <input
                  type="text"
                  value={buttonConfig.url}
                  onChange={(e) => setButtonConfig(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={buttonConfig.type === 'download' ? 'https://example.com/file.pdf' : '/path or https://...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={saveButtonConfig}
                  disabled={savingButton}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {savingButton ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Configuration
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowButtonEdit(false)}
                  disabled={savingButton}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setButtonConfig({
                      type: 'navigate',
                      url: '/sched.pdf'
                    });
                  }}
                  disabled={savingButton}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for popup animation */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}