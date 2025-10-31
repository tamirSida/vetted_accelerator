'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/lib/cms/admin-context';
import { TeamMember } from '@/lib/types/cms';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface UnifiedTeamSectionProps {
  teamMembers: TeamMember[];
  onEdit?: (member?: TeamMember) => void;
  onDelete?: (memberId: string) => void;
  onEditHeader?: () => void;
  onReorder?: (members: TeamMember[]) => void;
}

// Sortable Team Member Component
function SortableTeamMember({ member, index, onEdit, onDelete, hoveredMember, setHoveredMember }: {
  member: TeamMember;
  index: number;
  onEdit?: (member?: TeamMember) => void;
  onDelete?: (memberId: string) => void;
  hoveredMember: string | null;
  setHoveredMember: (id: string | null) => void;
}) {
  const { isAdminMode } = useAdmin();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onMouseEnter={() => setHoveredMember(member.id)}
      onMouseLeave={() => setHoveredMember(null)}
    >
      {/* Admin Controls */}
      {isAdminMode && (
        <div className="absolute -top-2 -right-2 flex gap-2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="w-8 h-8 bg-gray-500 hover:bg-gray-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <i className="fas fa-grip-vertical"></i>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onEdit) onEdit(member);
            }}
            className="w-8 h-8 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110"
            title="Edit team member"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDelete) onDelete(member.id);
            }}
            className="w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110"
            title="Delete team member"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}

      <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl h-full transition-all duration-300 ${
        hoveredMember === member.id ? 'bg-white/15 scale-105' : 'hover:bg-white/12'
      } ${isDragging ? 'shadow-2xl ring-2 ring-blue-500' : ''}`}>
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/team/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-user text-white text-2xl"></i>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">
            {member.name}
          </h3>

          {/* Multiple Titles */}
          <div className="flex flex-col items-center gap-2 mb-4">
            {Array.isArray(member.titles) && member.titles.length > 0 ? (
              member.titles.flatMap((titleObj, titleIndex) => {
                const badges = [];
                
                // Add title as a badge
                if (titleObj.title) {
                  badges.push(
                    <span 
                      key={`${titleObj.id || titleIndex}-title`} 
                      className="bg-gray-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-colors"
                    >
                      {titleObj.title}
                    </span>
                  );
                }
                
                // Add organization as a separate badge if it exists
                if (titleObj.organization) {
                  badges.push(
                    <span 
                      key={`${titleObj.id || titleIndex}-org`} 
                      className="bg-gray-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-colors"
                    >
                      {titleObj.organization}
                    </span>
                  );
                }
                
                return badges;
              })
            ) : member.role ? (
              <span 
                className="bg-gray-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700"
              >
                {member.role}
              </span>
            ) : null}
          </div>

          {/* Military Background */}
          {member.military && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <i className="fas fa-medal text-yellow-400 text-sm"></i>
              <span className="text-sm text-gray-700">{member.military}</span>
            </div>
          )}

          {/* LinkedIn Link */}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              <i className="fab fa-linkedin text-lg"></i>
              <span>Connect on LinkedIn</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnifiedTeamSection({ teamMembers, onEdit, onDelete, onEditHeader, onReorder }: UnifiedTeamSectionProps) {
  const { isAdminMode } = useAdmin();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [localMembers, setLocalMembers] = useState(teamMembers);

  // Update local members when props change
  useEffect(() => {
    setLocalMembers(teamMembers);
  }, [teamMembers]);

  // Use local members for display (allows immediate UI updates during drag)
  const displayMembers = localMembers;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = displayMembers.findIndex(member => member.id === active.id);
      const newIndex = displayMembers.findIndex(member => member.id === over.id);

      const reorderedMembers = arrayMove(displayMembers, oldIndex, newIndex);
      
      // Update local state immediately for smooth UX
      setLocalMembers(reorderedMembers);
      
      // Update order values
      const updatedMembers = reorderedMembers.map((member, index) => ({
        ...member,
        order: index + 1
      }));

      // Call parent handler to save to Firebase
      if (onReorder) {
        onReorder(updatedMembers);
      }
    }
  };

  const formatTitles = (titles: any[]) => {
    if (!titles || titles.length === 0) return '';
    return titles.map(titleObj => {
      if (typeof titleObj === 'string') return titleObj;
      return titleObj.organization 
        ? `${titleObj.title}, ${titleObj.organization}`
        : titleObj.title;
    }).join(' • ');
  };

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-white via-white to-gray-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 relative group">
          {/* Header Edit Button */}
          {isAdminMode && onEditHeader && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditHeader();
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[100] opacity-0 group-hover:opacity-100"
              title="Edit header section"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-white/80 text-sm font-medium tracking-wide">LEADERSHIP TEAM</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
            Alpha-Bet Team
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
            Battle-tested leaders and mentors who understand your journey and are committed to your success
          </p>
        </div>

        {/* Alpha-Bet Academic Team */}
        {displayMembers.slice(0, 3).length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8 text-center" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
              Alpha-Bet Academic Team
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayMembers.slice(0, 3).map(member => member.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                  {displayMembers.slice(0, 3).map((member, index) => (
                    <SortableTeamMember
                      key={member.id}
                      member={member}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      hoveredMember={hoveredMember}
                      setHoveredMember={setHoveredMember}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Program Staff */}
        {displayMembers.slice(3).length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8 text-center" style={{ fontFamily: "Gunplay, 'Black Ops One', cursive" }}>
              Program Staff
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayMembers.slice(3).map(member => member.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                  {displayMembers.slice(3).map((member, index) => (
                    <SortableTeamMember
                      key={member.id}
                      member={member}
                      index={index + 3}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      hoveredMember={hoveredMember}
                      setHoveredMember={setHoveredMember}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Add New Member Button */}
        {isAdminMode && (
          <div className="flex justify-center">
            <button
              onClick={() => onEdit && onEdit()}
              className="w-80 h-80 bg-gray-100/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-gray-400 hover:border-gray-600 hover:bg-gray-200/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-gray-600 hover:text-gray-800"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <i className="fas fa-plus text-2xl"></i>
              </div>
              <span className="text-lg font-medium">Add Team Member</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}