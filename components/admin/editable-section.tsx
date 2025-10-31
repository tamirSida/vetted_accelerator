'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { Edit, ChevronUp, ChevronDown, Plus } from 'lucide-react';

interface EditableSectionProps {
  children: React.ReactNode;
  sectionName: string;
  onEdit?: () => void;
  className?: string;
  isAddButton?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onClick?: () => void;
}

export default function EditableSection({ 
  children, 
  sectionName, 
  onEdit, 
  className = "",
  isAddButton = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  onClick
}: EditableSectionProps) {
  const { isAdminMode } = useAdmin();
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Don't show add buttons if not in admin mode
  if (!isAdminMode && isAddButton) {
    return null;
  }

  if (!isAdminMode) {
    return (
      <div 
        className={className} 
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 500); // Delay hiding for 500ms
    setHoverTimeout(timeout);
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ paddingTop: '20px', paddingRight: '20px' }}
    >
      {children}
      
      {isHovered && (
        <div className="absolute top-2 right-2 z-50 flex gap-2">
          {/* Move Up Button */}
          {canMoveUp && onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow-lg transition-colors"
              title="Move Up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
          
          {/* Move Down Button */}
          {canMoveDown && onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow-lg transition-colors"
              title="Move Down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
          
          {/* Edit Button */}
          {onEdit && !isAddButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded shadow-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit {sectionName}
            </button>
          )}

          {/* Add Button */}
          {isAddButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add {sectionName}
            </button>
          )}
        </div>
      )}
      
      {isAdminMode && (
        <div className="absolute inset-0 border-2 border-blue-300 border-dashed rounded-lg pointer-events-none opacity-50" />
      )}
    </div>
  );
}