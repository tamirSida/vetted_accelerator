'use client';

import { useState, useCallback } from 'react';
import { CurriculumItem } from '@/lib/types/cms';

interface CurriculumOrderingProps {
  items: CurriculumItem[];
  onReorder: (reorderedItems: CurriculumItem[]) => void;
}

export default function CurriculumOrdering({ items, onReorder }: CurriculumOrderingProps) {
  const [draggedItem, setDraggedItem] = useState<CurriculumItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Sort items by current order for display
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const handleDragStart = (e: React.DragEvent, item: CurriculumItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const currentIndex = sortedItems.findIndex(item => item.id === draggedItem.id);
    if (currentIndex === targetIndex) return;
    
    // Create new order
    const newItems = [...sortedItems];
    const [removed] = newItems.splice(currentIndex, 1);
    
    // Insert at the correct position
    let insertIndex = targetIndex;
    if (currentIndex < targetIndex) {
      insertIndex = targetIndex - 1;
    }
    
    newItems.splice(insertIndex, 0, removed);
    
    // Update order field for each item based on new position
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    onReorder(reorderedItems);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Handle drop between circles
  const handleDropBetween = (e: React.DragEvent, beforeIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const currentIndex = sortedItems.findIndex(item => item.id === draggedItem.id);
    
    // Create new order
    const newItems = [...sortedItems];
    const [removed] = newItems.splice(currentIndex, 1);
    
    // Calculate insert position
    let insertIndex = beforeIndex;
    if (currentIndex < beforeIndex) {
      insertIndex = beforeIndex - 1;
    }
    
    newItems.splice(insertIndex, 0, removed);
    
    // Update order field for each item based on new position
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    onReorder(reorderedItems);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-screen bg-gray-50 border-y border-gray-200 p-6 mb-6" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <i className="fas fa-sort text-blue-500"></i>
        Drag to Reorder Weeks
      </h3>
      
      <div className="flex gap-2 justify-evenly items-center w-full">
        {sortedItems.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {/* Drop zone before first item or between items */}
            <div
              className={`w-4 h-12 flex items-center justify-center transition-all duration-200 ${
                draggedItem && dragOverIndex === index
                  ? 'bg-blue-400 rounded-md mx-1'
                  : draggedItem
                  ? 'hover:bg-blue-200 rounded-md mx-1'
                  : 'mx-1'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => {
                e.preventDefault();
                if (draggedItem) setDragOverIndex(index);
              }}
              onDrop={(e) => handleDropBetween(e, index)}
            >
              {draggedItem && dragOverIndex === index && (
                <div className="w-1 h-8 bg-blue-600 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Circle item */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center font-semibold text-xs cursor-move transition-all duration-200 ${
                draggedItem?.id === item.id
                  ? 'opacity-50 scale-95 bg-gray-300 text-gray-500'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md'
              }`}
              title={`Week ${item.weekNumber}: ${item.title}`}
            >
              <span className="text-center leading-tight px-2 break-words">
                {item.title.length > 12 
                  ? item.title.split(' ').slice(0, 2).join(' ')
                  : item.title
                }
              </span>
              
              {/* Drag indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center opacity-75">
                <i className="fas fa-grip-vertical text-white text-xs"></i>
              </div>
            </div>
          </div>
        ))}
        
        {/* Final drop zone after last item */}
        <div
          className={`w-4 h-12 flex items-center justify-center transition-all duration-200 ${
            draggedItem && dragOverIndex === sortedItems.length
              ? 'bg-blue-400 rounded-md mx-1'
              : draggedItem
              ? 'hover:bg-blue-200 rounded-md mx-1'
              : 'mx-1'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={(e) => {
            e.preventDefault();
            if (draggedItem) setDragOverIndex(sortedItems.length);
          }}
          onDrop={(e) => handleDropBetween(e, sortedItems.length)}
        >
          {draggedItem && dragOverIndex === sortedItems.length && (
            <div className="w-1 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Drag the circles to reorder curriculum weeks. Changes will be saved automatically.
      </p>
    </div>
  );
}