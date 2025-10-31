'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';

interface TeamMember {
  id: string;
  name: string;
  title?: string;
  role: string;
  bio?: string;
  image?: string;
  military?: string;
  linkedinUrl?: string;
  isFounder?: boolean;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamSectionProps {
  members: TeamMember[];
  showAll?: boolean;
  onEdit?: (member?: TeamMember) => void;
  onDelete?: (memberId: string) => void;
  onEditHeader?: () => void;
}

export default function TeamSection({ members, showAll = false, onEdit, onDelete, onEditHeader }: TeamSectionProps) {
  const { isAdminMode } = useAdmin();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  // Default header data
  const defaultHeader = {
    label: "LEADERSHIP TEAM",
    title: "Meet the Team", 
    description: "Battle-tested leaders and mentors who understand your journey and are committed to your success"
  };

  // Default team data from VBV
  const defaultTeamMembers: TeamMember[] = [
    {
      id: 'nuri-golan',
      name: "Nuri Golan",
      title: "Co-Founder",
      role: "Co-Founder",
      bio: "Former Navy SEAL commander with extensive experience in special operations and team leadership. Co-founded Alpha-Bet to bridge military leadership skills with entrepreneurial success.",
      image: "/team/nuri-golan.jpg",
      military: "Captain (Res.) Shayetet-13 (IL Navy SEALs)",
      linkedinUrl: "https://www.linkedin.com/in/nurigolan/",
      isFounder: true,
      order: 1,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'adam-weiner',
      name: "Adam Weiner",
      title: "Co-Founder", 
      role: "Co-Founder",
      bio: "Veteran IDF Paratrooper and accomplished entrepreneur. Passionate about empowering fellow veterans to transition their military expertise into successful business ventures.",
      image: "/team/adam-weiner.jpg",
      military: "IDF Paratrooper",
      linkedinUrl: "https://www.linkedin.com/in/weineradam/",
      isFounder: true,
      order: 2,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tommy-knapp',
      name: "Prof. Tommy Knapp",
      title: "US Academic Lead",
      role: "US Academic Lead",
      bio: "Distinguished academic leader and educator specializing in entrepreneurship and business development. Leads curriculum development for the US program.",
      image: "/team/tommy-knapp.jpg",
      military: "Academic Leader",
      linkedinUrl: "https://www.linkedin.com/in/tommyknapp1/",
      isFounder: false,
      order: 3,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'gali-einav',
      name: "Dr. Gali Einav",
      title: "IL Academic Lead",
      role: "IL Academic Lead",
      bio: "Former IDF Intelligence veteran with a PhD in business strategy. Leads academic initiatives and curriculum design for the Israeli program components.",
      image: "/team/gali-einav.jpg",
      military: "8200 IDF",
      linkedinUrl: "https://www.linkedin.com/in/gali-einav-ph-d-6771aa1/",
      isFounder: false,
      order: 4,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'yotam-dagan',
      name: "Yotam Dagan",
      title: "Director of Growth",
      role: "Director of Growth",
      bio: "Elite naval special forces commander turned growth strategist. Focuses on scaling program impact and building strategic partnerships with veteran communities.",
      image: "/team/yotam-dagan.jpg",
      military: "CDR (Res.) Shayetet-13",
      linkedinUrl: "https://www.linkedin.com/in/yotam-dagan-abaa14b/",
      isFounder: false,
      order: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'jeff-ross',
      name: "Jeff Ross",
      title: "US Veteran Network Lead",
      role: "US Veteran Network Lead",
      bio: "Decorated Navy SEAL with extensive combat experience. Builds and maintains networks within US veteran entrepreneur communities to support program participants.",
      image: "/team/jeff-ross.jpg",
      military: "Special Operations Chief Petty Officer (Res.), US Navy SEALs",
      linkedinUrl: "https://www.linkedin.com/in/jeff-ross-64183143/",
      isFounder: false,
      order: 6,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'eden-golan',
      name: "Eden Golan",
      title: "Program Manager",
      role: "Program Manager",
      bio: "Experienced program coordinator specializing in veteran entrepreneurship initiatives. Manages day-to-day program operations and participant engagement.",
      image: "/team/eden-golan.jpg",
      military: "Program Operations",
      linkedinUrl: "https://www.linkedin.com/in/edenzgolan/",
      isFounder: false,
      order: 7,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tamir-sida',
      name: "Tamir Sida",
      title: "Tech Stack Architect & AI/Web Dev Mentor",
      role: "Tech Stack Architect & AI/Web Dev Mentor",
      bio: "Technology leader and former IDF operations chief. Mentors veteran entrepreneurs in AI, web development, and modern tech stack implementation.",
      image: "/team/tamir-sida.jpg",
      military: "Chief of Operations (Res.), 55th Brigade, IDF",
      linkedinUrl: "https://www.linkedin.com/in/tamir-sida/",
      isFounder: false,
      order: 8,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Merge CMS members with default members
  const mergedMembers = React.useMemo(() => {
    if (members.length === 0) {
      return defaultTeamMembers;
    }
    
    // Create a map of CMS members by ID
    const cmsMap = new Map(members.map(member => [member.id, member]));
    
    // Start with default members and replace with CMS versions if they exist
    const merged = defaultTeamMembers.map(defaultMember => 
      cmsMap.get(defaultMember.id) || defaultMember
    );
    
    // Add any CMS members that don't exist in defaults
    const existingIds = new Set(defaultTeamMembers.map(m => m.id));
    const newCmsMembers = members.filter(member => !existingIds.has(member.id));
    
    return [...merged, ...newCmsMembers];
  }, [members]);

  // Separate founders and non-founders
  const { founders, nonFounders } = React.useMemo(() => {
    const sorted = [...mergedMembers].filter(member => member.isVisible !== false);
    
    const founders = sorted
      .filter(member => member.isFounder)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const nonFounders = sorted
      .filter(member => !member.isFounder)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return { founders, nonFounders };
  }, [mergedMembers]);

  const handleEditClick = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(member);
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-white via-white to-gray-200 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          {isAdminMode && onEditHeader && (
            <button
              onClick={onEditHeader}
              className="absolute top-0 right-0 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-600"
            >
              <i className="fas fa-edit mr-1"></i>
              Edit Header
            </button>
          )}
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-white/80 text-sm font-medium tracking-wide">{defaultHeader.label}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {defaultHeader.title}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {defaultHeader.description}
          </p>
        </div>

        {/* Founders Row */}
        {founders.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {founders.map((member, index) => (
            <div 
              key={member.id} 
              className="relative bg-gradient-to-br from-gray-800/80 via-gray-700/60 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:border-gray-500/50 hover:shadow-2xl group overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => member.linkedinUrl && window.open(member.linkedinUrl, '_blank', 'noopener,noreferrer')}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-white/10"></div>
              </div>

              {/* Profile Image */}
              <div className="relative mb-6 z-10">
                {member.image ? (
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700 shadow-2xl border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300">
                    <span className="text-3xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                
              </div>

              {/* Member Info */}
              <div className="space-y-4 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                    {member.name}
                  </h3>
                  {member.title && (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-gray-100 rounded-full text-sm font-semibold shadow-lg mb-3">
                      <i className="fas fa-chevrons-up mr-2 text-xs"></i>
                      {member.title}
                    </div>
                  )}
                </div>
                
                {/* Military Background */}
                {member.military && member.military !== 'N/A' && member.military !== 'Program Operations' && member.military !== 'Academic Leader' && (
                  <div className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-3">
                    <div className="flex items-center justify-center mb-2">
                      <i className="fas fa-medal text-yellow-400 mr-2"></i>
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Military Service</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                      {member.military}
                    </p>
                  </div>
                )}

                {/* Admin Controls */}
                {isAdminMode && (onEdit || onDelete) && (
                  <div className="pt-2 flex gap-2 justify-center">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(member, e);
                        }}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(member.id);
                        }}
                        className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 border border-red-500"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Tactical Corner Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-gray-500/30"></div>
              <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-gray-500/30"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-gray-500/30"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-gray-500/30"></div>
            </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-Founders Grid */}
        {nonFounders.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonFounders.map((member, index) => (
                <div 
                  key={member.id} 
                  className="relative bg-gradient-to-br from-gray-800/80 via-gray-700/60 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:border-gray-500/50 hover:shadow-2xl group overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                  onClick={() => member.linkedinUrl && window.open(member.linkedinUrl, '_blank', 'noopener,noreferrer')}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-white/10"></div>
                  </div>

                  {/* Profile Image */}
                  <div className="relative mb-6 z-10">
                    {member.image ? (
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700 shadow-2xl border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                          style={{ objectFit: 'cover', objectPosition: 'center top' }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300">
                        <span className="text-3xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    
                  </div>

                  {/* Member Info */}
                  <div className="space-y-4 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                        {member.name}
                      </h3>
                      {member.title && (
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-gray-100 rounded-full text-sm font-semibold shadow-lg mb-3">
                          <i className="fas fa-chevrons-up mr-2 text-xs"></i>
                          {member.title}
                        </div>
                      )}
                    </div>
                    
                    {/* Military Background */}
                    {member.military && member.military !== 'N/A' && member.military !== 'Program Operations' && member.military !== 'Academic Leader' && (
                      <div className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-2">
                          <i className="fas fa-medal text-yellow-400 mr-2"></i>
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Military Service</span>
                        </div>
                        <p className="text-sm text-gray-300 font-medium leading-relaxed">
                          {member.military}
                        </p>
                      </div>
                    )}

                    {/* Admin Controls */}
                    {isAdminMode && (onEdit || onDelete) && (
                      <div className="pt-2 flex gap-2 justify-center">
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(member, e);
                            }}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500"
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(member.id);
                            }}
                            className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 border border-red-500"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tactical Corner Elements */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-gray-500/30"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-gray-500/30"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-gray-500/30"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-gray-500/30"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Team Member Button */}
        {isAdminMode && onEdit && (
          <div className="text-center mt-8">
            <button
              onClick={() => onEdit()}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-500"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Team Member
            </button>
          </div>
        )}

      </div>
    </section>
  );
}