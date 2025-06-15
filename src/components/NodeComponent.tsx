
import { useState, useRef, useEffect } from "react";
import { Node } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Link, Circle, Square, MessageSquare, Sparkles, Trash2 } from "lucide-react";

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
  const [showActions, setShowActions] = useState(false);
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
      case "thought": return `
        radial-gradient(circle at 20% 20%, ${baseColor}40, transparent 50%),
        linear-gradient(135deg, ${baseColor}25, ${baseColor}10, transparent)
      `;
      case "image": return `
        radial-gradient(circle at 30% 30%, ${baseColor}35, transparent 60%),
        conic-gradient(from 45deg, ${baseColor}20, transparent, ${baseColor}15)
      `;
      case "link": return `
        linear-gradient(45deg, ${baseColor}30, transparent 40%, ${baseColor}20),
        linear-gradient(-45deg, transparent, ${baseColor}15)
      `;
      case "note": return `
        linear-gradient(180deg, ${baseColor}20, ${baseColor}08, transparent),
        radial-gradient(circle at 80% 80%, ${baseColor}25, transparent 50%)
      `;
      default: return `
        radial-gradient(circle at 20% 20%, ${baseColor}40, transparent 50%),
        linear-gradient(135deg, ${baseColor}25, ${baseColor}10, transparent)
      `;
    }
  };

  const getGlowIntensity = () => {
    if (isDragging) return '60px';
    if (isSelected) return '40px';
    if (isHovering) return '25px';
    return '15px';
  };

  const getGlowOpacity = () => {
    if (isDragging) return '0.8';
    if (isSelected) return '0.6';
    if (isHovering) return '0.4';
    return '0.25';
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none transition-all duration-700 ease-out group ${
        isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: node.width,
        height: node.height,
        transform: isDragging 
          ? 'scale(1.12) rotate(3deg) translateZ(0)' 
          : isSelected 
          ? 'scale(1.05) translateZ(0)' 
          : isHovering 
          ? 'scale(1.02) translateZ(0)' 
          : 'scale(1) translateZ(0)',
        filter: `
          drop-shadow(0 ${isDragging ? '25px' : isSelected ? '15px' : '8px'} ${isDragging ? '50px' : isSelected ? '30px' : '20px'} ${node.color}${isDragging ? '60' : isSelected ? '40' : '20'})
          brightness(${isDragging ? '1.2' : isSelected ? '1.1' : '1'})
        `,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => {
        setIsHovering(true);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        setTimeout(() => setShowActions(false), 200);
      }}
    >
      {/* Enhanced multi-layered glow effects */}
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-700"
        style={{
          background: getNodeGradient(),
          boxShadow: `
            0 0 ${getGlowIntensity()} ${node.color}${Math.round(parseFloat(getGlowOpacity()) * 255).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        }}
      />

      {/* Animated border with energy flow */}
      {(isSelected || isHovering) && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div 
            className="absolute inset-0 rounded-3xl opacity-60 animate-pulse-glow"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${node.color}, transparent, ${node.color}, transparent)`,
              animation: 'spin 12s linear infinite',
            }}
          />
          <div 
            className="absolute inset-1 rounded-3xl"
            style={{
              background: `linear-gradient(45deg, transparent, ${node.color}30, transparent)`,
              animation: 'synapse-flow 3s ease-in-out infinite alternate',
            }}
          />
        </div>
      )}
      
      {/* Main node container with enhanced depth */}
      <div
        className={`relative w-full h-full rounded-3xl border-2 transition-all duration-700 backdrop-blur-md ${
          isSelected 
            ? 'border-[#00FFD1] bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/95 to-[#0B3D3D]/90' 
            : isConnecting 
            ? 'border-[#E8A135] bg-gradient-to-br from-[#0B3D3D]/90 via-[#0A3A3A]/85 to-[#0B3D3D]/80' 
            : isHovering
            ? 'border-[#00FFD1]/80 bg-gradient-to-br from-[#0B3D3D]/90 via-[#0A3A3A]/85 to-[#0B3D3D]/80'
            : 'border-[#00FFD1]/50 bg-gradient-to-br from-[#0B3D3D]/85 via-[#0A3A3A]/80 to-[#0B3D3D]/75'
        }`}
        style={{
          background: isSelected 
            ? `linear-gradient(135deg, #0B3D3D, #0A3A3A), ${getNodeGradient()}`
            : `linear-gradient(135deg, #0B3D3D99, #0A3A3A99), ${getNodeGradient()}`,
        }}
      >
        {/* Enhanced header with depth and typography */}
        <div className="flex items-center justify-between p-5 border-b border-[#00FFD1]/20 bg-gradient-to-r from-transparent via-[#00FFD1]/5 to-transparent">
          <div className="flex items-center gap-4">
            <div 
              className={`p-3 rounded-2xl transition-all duration-500 relative overflow-hidden group ${
                isSelected ? 'bg-[#00FFD1]/25 shadow-[0_0_20px_rgba(0,255,209,0.4)]' : 'bg-[#00FFD1]/15'
              }`}
              style={{ 
                color: node.color,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 15px ${node.color}30`
              }}
            >
              {getNodeIcon()}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle, ${node.color}20, transparent)` }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#00FFD1] opacity-95 tracking-wide">
                {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              </span>
              <span className="text-xs text-[#F0F0F0]/60 font-light">
                {new Date(node.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          {/* Enhanced floating action buttons */}
          <div className={`flex gap-2 transition-all duration-500 ${showActions ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 text-[#00FFD1] hover:bg-[#00FFD1]/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,209,0.5)] transition-all duration-300 rounded-xl backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onConnect();
              }}
            >
              <Link className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 text-[#E8A135] hover:bg-[#E8A135]/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(232,161,53,0.5)] transition-all duration-300 rounded-xl backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                // AI enhancement placeholder
              }}
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            {isSelected && (
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 text-red-400 hover:bg-red-500/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-300 rounded-xl backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced content area with better typography */}
        <div className="p-5 h-[calc(100%-6rem)] overflow-hidden relative">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${node.color} 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
          
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
              className="w-full h-full bg-transparent text-[#F0F0F0] resize-none outline-none text-sm leading-relaxed placeholder-[#F0F0F0]/40 font-light relative z-10"
              placeholder="What brilliant thought flows through your mind?"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            />
          ) : (
            <div className="text-[#F0F0F0] text-sm leading-relaxed whitespace-pre-wrap font-light relative z-10" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {content || (
                <span className="text-[#F0F0F0]/30 italic font-extralight">
                  Double-click to capture your brilliant thought...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Enhanced connection point with pulsing energy */}
        <div
          className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-3 transition-all duration-700 overflow-hidden ${
            isConnecting 
              ? 'bg-gradient-to-r from-[#E8A135] to-[#FFB800] border-[#E8A135] shadow-[0_0_30px_rgba(232,161,53,1)] scale-140' 
              : isSelected
              ? 'bg-gradient-to-r from-[#00FFD1]/40 to-[#00FFD1]/60 border-[#00FFD1] shadow-[0_0_20px_rgba(0,255,209,0.8)] scale-125'
              : 'bg-gradient-to-r from-[#00FFD1]/20 to-[#00FFD1]/40 border-[#00FFD1]/50 hover:bg-[#00FFD1]/40 hover:scale-125'
          }`}
          style={{
            boxShadow: isConnecting 
              ? `0 0 30px ${node.color}cc, inset 0 2px 4px rgba(255,255,255,0.3)` 
              : `0 0 15px ${node.color}66, inset 0 2px 4px rgba(255,255,255,0.2)`
          }}
        >
          <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
            isConnecting ? 'bg-[#E8A135] animate-pulse-glow' : 'bg-[#00FFD1]/60'
          }`} />
          
          {/* Energy ripples */}
          {(isConnecting || isSelected) && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-current opacity-50 animate-ping" />
              <div className="absolute inset-0 rounded-full border border-current opacity-75 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </>
          )}
        </div>

        {/* Enhanced floating type indicator with premium styling */}
        <div 
          className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-3 border-[#0B3D3D] flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-lg"
          style={{ 
            backgroundColor: node.color,
            color: '#0B3D3D',
            boxShadow: `0 4px 20px ${node.color}60, inset 0 2px 4px rgba(255,255,255,0.3)`,
            transform: isHovering ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          }}
        >
          {node.type.charAt(0).toUpperCase()}
          
          {/* Subtle inner glow */}
          <div 
            className="absolute inset-1 rounded-full opacity-30"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        </div>

        {/* Ambient particle effects for premium nodes */}
        {isSelected && (
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full opacity-40"
                style={{
                  backgroundColor: node.color,
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  animation: `float ${3 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  boxShadow: `0 0 8px ${node.color}`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
