
import { useState, useRef, useEffect } from "react";
import { Node } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Link, Circle, Square, MessageSquare, Sparkles } from "lucide-react";

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
  const [content, setContent] = useState(node.content);
  const [position, setPosition] = useState({ x: node.x, y: node.y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsDragging(true);
      const rect = nodeRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      onSelect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onUpdate({ ...node, x: position.x, y: position.y });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdate({ ...node, content: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(node.content);
    }
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case "link": return <Link className="w-4 h-4" />;
      case "image": return <Circle className="w-4 h-4" />;
      case "note": return <Square className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getNodeGradient = () => {
    const baseColor = node.color;
    switch (node.type) {
      case "thought": return `linear-gradient(135deg, ${baseColor}20, ${baseColor}10)`;
      case "image": return `radial-gradient(circle at 30% 30%, ${baseColor}25, ${baseColor}10)`;
      case "link": return `linear-gradient(45deg, ${baseColor}20, transparent 70%)`;
      case "note": return `linear-gradient(180deg, ${baseColor}15, ${baseColor}08)`;
      default: return `linear-gradient(135deg, ${baseColor}20, ${baseColor}10)`;
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none transition-all duration-500 ease-out group ${
        isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: node.width,
        height: node.height,
        transform: isDragging 
          ? 'scale(1.08) rotate(2deg)' 
          : isSelected 
          ? 'scale(1.02)' 
          : isHovering 
          ? 'scale(1.01)' 
          : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Enhanced glow effects */}
      <div
        className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
          isSelected 
            ? 'shadow-[0_0_40px_rgba(0,255,209,0.6),0_0_80px_rgba(0,255,209,0.3)]' 
            : isHovering
            ? 'shadow-[0_0_25px_rgba(0,255,209,0.4),0_0_50px_rgba(0,255,209,0.2)]'
            : 'shadow-[0_0_15px_rgba(0,255,209,0.25)]'
        }`}
        style={{
          background: getNodeGradient(),
        }}
      />

      {/* Animated border particles */}
      {isSelected && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 rounded-3xl border-2 border-[#00FFD1]/30 animate-pulse-glow" />
          <div 
            className="absolute -inset-1 rounded-3xl opacity-50"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${node.color}, transparent, ${node.color}, transparent)`,
              animation: 'spin 8s linear infinite',
            }}
          />
        </div>
      )}
      
      {/* Main node container */}
      <div
        className={`relative w-full h-full rounded-3xl border-2 transition-all duration-500 backdrop-blur-sm ${
          isSelected 
            ? 'border-[#00FFD1] bg-[#0B3D3D]/95' 
            : isConnecting 
            ? 'border-[#E8A135] bg-[#0B3D3D]/85' 
            : isHovering
            ? 'border-[#00FFD1]/70 bg-[#0B3D3D]/85'
            : 'border-[#00FFD1]/40 bg-[#0B3D3D]/75'
        }`}
        style={{
          background: isSelected 
            ? `linear-gradient(135deg, #0B3D3D, #0A3A3A), ${getNodeGradient()}`
            : `#0B3D3D, ${getNodeGradient()}`,
        }}
      >
        {/* Enhanced header with type indicator */}
        <div className="flex items-center justify-between p-4 border-b border-[#00FFD1]/20">
          <div className="flex items-center gap-3">
            <div 
              className={`p-2 rounded-xl transition-all duration-300 ${
                isSelected ? 'bg-[#00FFD1]/20 shadow-[0_0_15px_rgba(0,255,209,0.3)]' : 'bg-[#00FFD1]/10'
              }`}
              style={{ color: node.color }}
            >
              {getNodeIcon()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#00FFD1] opacity-90">
                {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              </span>
              <span className="text-xs text-[#F0F0F0]/50">
                {new Date(node.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {isSelected && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-[#00FFD1] hover:bg-[#00FFD1]/20 hover:scale-110 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onConnect();
                }}
              >
                <Link className="w-4 h-4" />
              </Button>
              {isHovering && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-[#E8A135] hover:bg-[#E8A135]/20 hover:scale-110 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add AI enhancement feature here
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced content area */}
        <div className="p-4 h-[calc(100%-5rem)] overflow-hidden">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
              className="w-full h-full bg-transparent text-[#F0F0F0] resize-none outline-none text-sm leading-relaxed placeholder-[#F0F0F0]/50"
              placeholder="What's flowing through your mind?"
            />
          ) : (
            <div className="text-[#F0F0F0] text-sm leading-relaxed whitespace-pre-wrap font-light">
              {content || (
                <span className="text-[#F0F0F0]/40 italic">
                  Double-click to capture your thought...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Enhanced connection point */}
        <div
          className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-3 transition-all duration-500 ${
            isConnecting 
              ? 'bg-[#E8A135] border-[#E8A135] shadow-[0_0_20px_rgba(232,161,53,0.8)] scale-125' 
              : isSelected
              ? 'bg-[#00FFD1]/30 border-[#00FFD1] shadow-[0_0_15px_rgba(0,255,209,0.5)] scale-110'
              : 'bg-[#00FFD1]/10 border-[#00FFD1]/40 hover:bg-[#00FFD1]/30 hover:scale-110'
          }`}
        >
          <div className={`absolute inset-1 rounded-full transition-all duration-300 ${
            isConnecting ? 'bg-[#E8A135] animate-pulse' : 'bg-[#00FFD1]/50'
          }`} />
        </div>

        {/* Floating type indicator */}
        <div 
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full border-2 border-[#0B3D3D] flex items-center justify-center text-xs transition-all duration-300"
          style={{ 
            backgroundColor: node.color,
            color: '#0B3D3D',
            boxShadow: `0 0 15px ${node.color}40`
          }}
        >
          {node.type.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};
