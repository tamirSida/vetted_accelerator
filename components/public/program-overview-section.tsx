'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { ProgramIntro, ParticipantType, CandidateProfile, ProgramExclusions } from '@/lib/types/cms';

interface ProgramOverviewSectionProps {
  programIntro?: ProgramIntro | null;
  participantTypes: ParticipantType[];
  candidateProfile?: CandidateProfile | null;
  programExclusions?: ProgramExclusions | null;
  onEditIntro?: () => void;
  onEditParticipantType?: (type?: ParticipantType) => void;
  onEditCandidateProfile?: () => void;
  onEditExclusions?: () => void;
}

export default function ProgramOverviewSection({ 
  programIntro,
  participantTypes,
  candidateProfile,
  programExclusions,
  onEditIntro,
  onEditParticipantType,
  onEditCandidateProfile,
  onEditExclusions
}: ProgramOverviewSectionProps) {
  const { isAdminMode } = useAdmin();
  const [showSection, setShowSection] = useState(false);
  const [dividerWidth, setDividerWidth] = useState(300);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSection(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Default program intro
  const defaultIntro: ProgramIntro = {
    id: 'intro-1',
    title: '',
    description: 'Alpha-Bet is the launchpad for Veterans and Reservists ready to take their first steps into entrepreneurship. Whether you already have an idea or are simply curious about the path, this program gives you the tools, experience, and network to start building.',
    isVisible: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Default participant types
  const defaultParticipantTypes: ParticipantType[] = [
    {
      id: 'explorer-1',
      title: 'Explorers',
      description: 'For those exploring entrepreneurship without a specific idea yet.',
      highlights: [
        "Don't yet have a startup idea, but want to learn what it takes to be an entrepreneur",
        "Looking for hands-on experience turning concepts into early ventures", 
        "Ready to test themselves in a team setting and build confidence before committing fully"
      ],
      isVisible: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'builder-1',
      title: 'Builders',
      description: 'For those with early ideas ready to take the next step.',
      highlights: [
        "Have an early-stage idea or concept and want to refine it",
        "Looking for partners or co-founders within the Alpha-Bet community",
        "Ready to validate, pitch, and start building toward a company"
      ],
      isVisible: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Default candidate profile
  const defaultCandidateProfile: CandidateProfile = {
    id: 'candidate-1',
    title: 'The Alpha-Bet Candidate',
    description: '',
    highlights: [
      "Combat Veteran: Served in a combat role in the US or Israel.",
      "Serious about exploring entrepreneurship, not just \"filling time\"",
      "Collaborative, supportive, and eager to grow with others",
      "Curious, adaptable, and driven to turn military leadership into entrepreneurial impact",
      "Open to feedback and willing to put in the work to succeed"
    ],
    isVisible: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Default program exclusions
  const defaultExclusions: ProgramExclusions = {
    id: 'exclusions-1',
    title: 'Who This Program Is Not For',
    description: '',
    highlights: [
      "Those who aren't ready to commit to a process of learning and practicing a new craft",
      "Experienced startup founders (the Version Bravo Accelerator is a better fit)",
      "Founders who are not Veterans or who did not serve in a combat unit",
      "Those who are using this as a way to figure out what to do next after the military - This program is open to transitioning or recently retired service members, however, you should be honest with yourself about whether you are genuinely interested in entrepreneurship or just looking for something to do after your service."
    ],
    note: "If you have entrepreneurial experience in other areas but want to understand the unique path of startups, Alpha-Bet is still a great fit.",
    isVisible: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Merge with defaults - preserve defaults even if we have CMS data
  const displayIntro = programIntro || defaultIntro;
  
  // For participant types, merge CMS data with defaults intelligently
  const mergeParticipantTypes = () => {
    if (participantTypes.length === 0) {
      return defaultParticipantTypes;
    }
    
    const merged = [...defaultParticipantTypes];
    participantTypes.forEach(cmsType => {
      // Check if we have a CMS override for this default type
      const defaultIndex = merged.findIndex(defaultType => 
        defaultType.order === cmsType.order || defaultType.title.toLowerCase() === cmsType.title.toLowerCase()
      );
      
      if (defaultIndex !== -1) {
        // Replace the default with CMS data
        merged[defaultIndex] = cmsType;
      } else {
        // Add new CMS type
        merged.push(cmsType);
      }
    });
    
    return merged.filter(type => type.isVisible !== false).sort((a, b) => a.order - b.order);
  };
  
  const displayParticipantTypes = mergeParticipantTypes();
  const displayCandidateProfile = candidateProfile || defaultCandidateProfile;
  const displayExclusions = programExclusions || defaultExclusions;

  // Update divider width to match title width
  useEffect(() => {
    const updateDividerWidth = () => {
      if (titleRef.current) {
        const textWidth = titleRef.current.scrollWidth;
        const maxWidth = window.innerWidth * 0.9;
        setDividerWidth(Math.min(textWidth, maxWidth));
      }
    };

    // Update width on mount and resize
    updateDividerWidth();
    window.addEventListener('resize', updateDividerWidth);
    
    return () => window.removeEventListener('resize', updateDividerWidth);
  }, [displayIntro.description, showSection]);

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-white via-white to-gray-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 space-y-16 sm:space-y-24">
        
        {/* Program Introduction Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          showSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="relative group max-w-5xl mx-auto">
            {/* Intro Edit Button */}
            {isAdminMode && onEditIntro && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditIntro();
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 hover:bg-purple-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
                title="Edit program introduction"
              >
                <i className="fas fa-edit"></i>
              </button>
            )}

            <h1 
              ref={titleRef}
              className="text-xl sm:text-2xl md:text-3xl font-medium text-black mb-8 leading-tight tracking-tight"
              style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}
            >
              {displayIntro.description}
            </h1>
            
            {/* Gradient divider line that spans title width */}
            <div className="flex justify-center">
              <div 
                className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${dividerWidth}px` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Two Types of Participants */}
        <div className={`transition-all duration-1000 delay-300 ${
          showSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Two Types of Participants
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {displayParticipantTypes.map((type, index) => (
              <div key={type.id} className="relative group">
                {/* Participant Type Edit Button */}
                {isAdminMode && onEditParticipantType && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEditParticipantType(type);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
                    title="Edit participant type"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl h-full hover:bg-white/15 transition-all duration-300">
                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      index === 0 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <i className={`fas ${index === 0 ? 'fa-compass' : 'fa-hammer'} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
                      {type.title}
                    </h3>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-4">
                    {type.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          'bg-blue-400'
                        }`}></div>
                        <p className="text-black leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Alpha-Bet Candidate */}
        <div className={`transition-all duration-1000 delay-500 ${
          showSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="relative group">
            {/* Candidate Profile Edit Button */}
            {isAdminMode && onEditCandidateProfile && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditCandidateProfile();
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
                title="Edit candidate profile"
              >
                <i className="fas fa-edit"></i>
              </button>
            )}

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-medal text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  {displayCandidateProfile.title}
                </h3>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                {displayCandidateProfile.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-black leading-relaxed">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Who This Program Is Not For */}
        <div className={`transition-all duration-1000 delay-700 ${
          showSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <div className="relative group">
            {/* Exclusions Edit Button */}
            {isAdminMode && onEditExclusions && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditExclusions();
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
                title="Edit program exclusions"
              >
                <i className="fas fa-edit"></i>
              </button>
            )}

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-times-circle text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  {displayExclusions.title}
                </h3>
              </div>

              {/* Highlights */}
              <div className="space-y-4 mb-8">
                {displayExclusions.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-black leading-relaxed">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Note */}
              {displayExclusions.note && (
                <div className="bg-white/5 border border-white/20 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fas fa-info text-white text-xs"></i>
                    </div>
                    <p className="text-blue-600 leading-relaxed font-medium">
                      <strong>Note:</strong> {displayExclusions.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}