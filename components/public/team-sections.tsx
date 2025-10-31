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

interface TeamSectionsProps {
  founders: TeamMember[];
  staff: TeamMember[];
  team: TeamMember[];
  onEdit?: (member?: TeamMember, section?: 'founders' | 'staff' | 'team') => void;
  onDelete?: (memberId: string, section?: 'founders' | 'staff' | 'team') => void;
  onEditHeader?: () => void;
}

export default function TeamSections({ founders, staff, team, onEdit, onDelete, onEditHeader }: TeamSectionsProps) {
  const { isAdminMode } = useAdmin();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  // Default founders data
  const defaultFounders: TeamMember[] = [
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
    }
  ];

  // Default Version Bravo Team (all non-founder team members)
  const defaultVersionBravoStaff: TeamMember[] = [
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


  // Merge CMS data with Version Bravo Team defaults (including founders)
  const mergedVersionBravoTeam = React.useMemo(() => {
    // Combine founders and team defaults
    const allDefaults = [...defaultFounders, ...defaultVersionBravoStaff];
    
    // Get both founders and team from CMS
    const allCmsMembers = [...(founders || []), ...(team || [])];
    
    if (!allCmsMembers || allCmsMembers.length === 0) {
      return allDefaults.sort((a, b) => a.order - b.order);
    }
    
    const cmsMap = new Map(allCmsMembers.map(member => [member.id, member]));
    const merged = allDefaults.map(defaultMember => 
      cmsMap.get(defaultMember.id) || defaultMember
    );
    
    const existingIds = new Set(allDefaults.map(m => m.id));
    const newCmsMembers = allCmsMembers.filter(member => !existingIds.has(member.id));
    
    return [...merged, ...newCmsMembers].sort((a, b) => a.order - b.order);
  }, [founders?.length, team?.length]);

  const handleEditClick = (member: TeamMember, section: 'founders' | 'staff' | 'team', e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(member, section);
    }
  };

  const TeamCard = ({ member, section }: { member: TeamMember; section: 'founders' | 'staff' | 'team' }) => {
    // Founders get large cards, others get small cards
    const isSmallCard = !member.isFounder;
    
    return (
      <div 
        key={member.id} 
        className={`relative bg-gradient-to-br from-gray-800/80 via-gray-700/60 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl ${
          isSmallCard ? 'p-6' : 'p-8'
        } text-center transform transition-all duration-300 hover:scale-105 hover:border-gray-500/50 hover:shadow-2xl group overflow-hidden cursor-pointer`}
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
        <div className={`relative ${isSmallCard ? 'mb-4' : 'mb-6'} z-10`}>
          {member.image ? (
            <div className={`${
              isSmallCard ? 'w-24 h-24' : 'w-32 h-32'
            } mx-auto rounded-full overflow-hidden bg-gray-700 shadow-2xl border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300`}>
              <Image
                src={member.image}
                alt={member.name}
                width={isSmallCard ? 96 : 128}
                height={isSmallCard ? 96 : 128}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          ) : (
            <div className={`${
              isSmallCard ? 'w-24 h-24' : 'w-32 h-32'
            } mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-2xl border-4 border-gray-600 group-hover:border-gray-500 transition-all duration-300`}>
              <span className={`${isSmallCard ? 'text-2xl' : 'text-3xl'} font-bold text-white`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Member Info */}
        <div className="space-y-3 relative z-10">
          <div>
            <h3 className={`${isSmallCard ? 'text-lg' : 'text-2xl'} font-bold text-white mb-2 group-hover:text-gray-200 transition-colors`}>
              {member.name}
            </h3>
            {member.title && (
              <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-gray-100 rounded-full ${
                isSmallCard ? 'text-xs' : 'text-sm'
              } font-semibold shadow-lg mb-2 mx-auto`}>
                <i className="fas fa-chevrons-up mr-2 text-xs"></i>
                {member.title}
              </div>
            )}
          </div>
          
          {/* Military Background */}
          {member.military && member.military !== 'N/A' && member.military !== 'Program Operations' && member.military !== 'Academic Leader' && (
            <div className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <i className="fas fa-medal text-yellow-400 mr-2"></i>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Military Service</span>
              </div>
              <p className={`${isSmallCard ? 'text-xs' : 'text-sm'} text-gray-300 font-medium leading-relaxed`}>
                {member.military}
              </p>
            </div>
          )}

          {/* Admin Controls */}
          {isAdminMode && (onEdit || onDelete) && (
            <div className="pt-2 flex gap-2 justify-center">
              {onEdit && (
                <button
                  onClick={(e) => handleEditClick(member, section, e)}
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
                    onDelete(member.id, section);
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
    );
  };

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-white via-white to-gray-400">
      <div className="max-w-7xl mx-auto">
        {/* Main Section Header */}
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
            <span className="text-gray-800 text-sm font-medium tracking-wide">LEADERSHIP TEAM</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: "'Black Ops One', cursive" }}>
            Meet the Team
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Battle-tested leaders and mentors who understand your journey and are committed to your success
          </p>
        </div>


        {/* Section 1: Alpha-Bet Staff */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>Alpha-Bet Staff</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.filter(member => member.isVisible !== false).map((member) => (
              <TeamCard key={member.id} member={member} section="staff" />
            ))}
          </div>

          {isAdminMode && onEdit && (
            <div className="text-center mt-6">
              <button
                onClick={() => onEdit(undefined, 'staff')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-500"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Staff Member
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Version Bravo Team (including founders) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>Version Bravo Team</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Founders Row (Large Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {mergedVersionBravoTeam.filter(member => member.isVisible !== false && member.isFounder).map((member) => (
              <TeamCard key={member.id} member={member} section="founders" />
            ))}
          </div>
          
          {/* Other Team Members (Small Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedVersionBravoTeam.filter(member => member.isVisible !== false && !member.isFounder).map((member) => (
              <TeamCard key={member.id} member={member} section="team" />
            ))}
          </div>

          {isAdminMode && onEdit && (
            <div className="text-center mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onEdit(undefined, 'founders')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-500"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Founder
              </button>
              <button
                onClick={() => onEdit(undefined, 'team')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-500"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Team Member
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}