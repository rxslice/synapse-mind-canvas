
import { useState, useRef, useEffect } from "react";
import { Node } from "@/types/canvas";
import { Edit3, Trash2, Link, Move } from "lucide-react";

interface NodeComponentProps {
  node: Node;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onUpdate: (node: Node) => void;
  onDelete: () => void;
  onConnect: () => void;
}

export const NodeComponent = ({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onUpdate,
  onDelete,
  onConnect,
}: NodeComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(node.content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setEditContent(node.content);
  }, [node.content]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't start dragging if clicking on buttons or editing
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'TEXTAREA' || target.closest('button') || isEditing) {
      return;
    }

    setIsDragging(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    setDragStart({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onUpdate({ ...node, x: newX, y: newY });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleSaveEdit = () => {
    onUpdate({ ...node, content: editContent });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setEditContent(node.content);
      setIsEditing(false);
    }
  };

  const getNodeTypeEmoji = () => {
    switch (node.type) {
      case "image": return "🖼️";
      case "link": return "🔗";
      case "note": return "📝";
      case "thought": 
      default: return "💭";
    }
  };

  const getNodeGlow = () => {
    if (isConnecting) return `0 0 30px ${node.color}, 0 0 60px ${node.color}80`;
    if (isSelected) return `0 0 20px ${node.color}80`;
    if (isHovered) return `0 0 15px ${node.color}40`;
    return `0 0 10px ${node.color}20`;
  };

  return (
    <div
      ref={nodeRef}
      className={`synapse-node absolute pointer-events-auto select-none transition-all duration-300 ${
        isDragging ? 'z-50 scale-105 cursor-grabbing' : 'z-10 cursor-grab'
      } ${isConnecting ? 'animate-pulse' : ''}`}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main node container */}
      <div
        className="w-full h-full rounded-2xl border-2 backdrop-blur-md relative overflow-hidden group"
        style={{
          backgroundColor: `${node.color}15`,
          borderColor: `${node.color}60`,
          boxShadow: getNodeGlow(),
        }}
      >
        {/* Animated border gradient */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${node.color}, transparent)`,
            animation: isSelected ? 'spin 8s linear infinite' : 'none',
          }}
        />
        <div 
          className="absolute inset-[2px] rounded-2xl pointer-events-none"
          style={{ backgroundColor: `${node.color}10` }}
        />

        {/* Content container */}
        <div className="node-content relative z-10 p-4 h-full flex flex-col pointer-events-auto">
          {/* Header with type and actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 pointer-events-none">
              <span className="text-lg">{getNodeTypeEmoji()}</span>
              <span 
                className="text-xs font-medium opacity-70"
                style={{ color: node.color }}
              >
                {node.type.toUpperCase()}
              </span>
            </div>
            
            {/* Action buttons - show on hover or selection */}
            <div className={`flex gap-1 transition-opacity duration-200 pointer-events-auto ${
              isHovered || isSelected ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnect();
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                style={{ color: node.color }}
                title="Create connection"
              >
                <Link className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                style={{ color: node.color }}
                title="Edit content"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/30 transition-colors text-red-400"
                title="Delete node"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex items-center justify-center">
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                className="w-full h-full resize-none bg-transparent border-none outline-none text-center text-sm leading-relaxed pointer-events-auto"
                style={{ color: '#F0F0F0' }}
                placeholder="Enter your thought..."
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="text-center text-sm leading-relaxed font-medium cursor-text pointer-events-auto"
                style={{ color: '#F0F0F0' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {node.content || "Empty thought"}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-xs opacity-50 text-center mt-2 pointer-events-none" style={{ color: node.color }}>
            {new Date(node.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div 
            className="absolute inset-0 rounded-2xl border-2 pointer-events-none animate-pulse"
            style={{ borderColor: node.color }}
          />
        )}

        {/* Connection indicator */}
        {isConnecting && (
          <div className="absolute inset-0 rounded-2xl border-4 border-dashed pointer-events-none animate-pulse"
               style={{ borderColor: `${node.color}80` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Move className="w-6 h-6 animate-bounce" style={{ color: node.color }} />
            </div>
          </div>
        )}

        {/* Hover glow effect */}
        {isHovered && !isSelected && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
            style={{ backgroundColor: node.color }}
          />
        )}

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-white/10 pointer-events-none" />
        )}
      </div>
    </div>
  );
};
