"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: React.ReactNode;
}

interface DraggableGridProps {
  items: GridItem[];
  onLayoutChange?: (items: GridItem[]) => void;
  className?: string;
}

export default function DraggableGrid({ 
  items: initialItems, 
  onLayoutChange,
  className 
}: DraggableGridProps) {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Update items when initialItems change
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setDragging(id);
  };
  
  const handleDragMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    // This is a simplified implementation
    // In a real app, you would implement grid snapping and collision detection
    const updatedItems = items.map(item => {
      if (item.id === dragging) {
        // Calculate new position based on mouse position and grid
        const gridSize = 20; // Size of each grid cell in pixels
        const newX = Math.round((e.clientX - dragOffset.x) / gridSize);
        const newY = Math.round((e.clientY - dragOffset.y) / gridSize);
        
        return {
          ...item,
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    onLayoutChange?.(updatedItems);
  };
  
  const handleDragEnd = () => {
    setDragging(null);
  };
  
  // For demo purposes, we'll use a simple CSS grid layout
  // In a production app, you would use a library like react-grid-layout
  return (
    <div 
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}
      onMouseMove={dragging ? handleDragMove : undefined}
      onMouseUp={dragging ? handleDragEnd : undefined}
      onMouseLeave={dragging ? handleDragEnd : undefined}
    >
      {items.map(item => (
        <div
          key={item.id}
          className={cn(
            "relative cursor-grab active:cursor-grabbing",
            dragging === item.id && "z-10"
          )}
          onMouseDown={(e) => handleDragStart(item.id, e)}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}