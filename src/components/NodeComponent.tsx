
import { useState, useRef, useEffect } from "react";
import { Node } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Link, Circle, Square, MessageSquare } from "lucide-react";

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

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: node.width,
        height: node.height,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Node glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isSelected ? 'shadow-[0_0_30px_rgba(0,255,209,0.5)]' : 'shadow-[0_0_15px_rgba(0,255,209,0.2)]'
        }`}
      />
      
      {/* Node content */}
      <div
        className={`relative w-full h-full rounded-2xl border-2 transition-all duration-300 ${
          isSelected 
            ? 'border-[#00FFD1] bg-[#0B3D3D]/90' 
            : isConnecting 
            ? 'border-[#E8A135] bg-[#0B3D3D]/80' 
            : 'border-[#00FFD1]/50 bg-[#0B3D3D]/70'
        } backdrop-blur-sm hover:bg-[#0B3D3D]/90 hover:border-[#00FFD1]`}
      >
        {/* Node header */}
        <div className="flex items-center justify-between p-3 border-b border-[#00FFD1]/20">
          <div className="flex items-center gap-2 text-[#00FFD1]">
            {getNodeIcon()}
            <span className="text-xs font-medium opacity-80">
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
            </span>
          </div>
          
          {isSelected && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-[#00FFD1] hover:bg-[#00FFD1]/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onConnect();
                }}
              >
                <Link className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Node content area */}
        <div className="p-3 h-[calc(100%-3rem)] overflow-hidden">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
              className="w-full h-full bg-transparent text-[#F0F0F0] resize-none outline-none text-sm placeholder-[#F0F0F0]/50"
              placeholder="What's on your mind?"
            />
          ) : (
            <div className="text-[#F0F0F0] text-sm leading-relaxed whitespace-pre-wrap">
              {content || "Double-click to edit..."}
            </div>
          )}
        </div>

        {/* Connection point */}
        <div
          className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            isConnecting 
              ? 'bg-[#E8A135] border-[#E8A135] shadow-[0_0_15px_rgba(232,161,53,0.8)]' 
              : 'bg-[#00FFD1]/20 border-[#00FFD1]/50 hover:bg-[#00FFD1]/40'
          }`}
        />
      </div>
    </div>
  );
};
