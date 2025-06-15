
import { useState } from "react";
import { Node } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Trash2, Save, X, Palette, Zap, Move, Minimize2 } from "lucide-react";

interface NodeInspectorProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const NodeInspector = ({ node, onUpdate, onDelete, onClose }: NodeInspectorProps) => {
  const [content, setContent] = useState(node.content);
  const [type, setType] = useState<Node["type"]>(node.type);
  const [color, setColor] = useState(node.color);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleSave = () => {
    onUpdate({
      ...node,
      content,
      type,
      color,
    });
    onClose();
  };

  const handleTypeChange = (value: string) => {
    setType(value as Node["type"]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const colorOptions = [
    { value: "#00FFD1", label: "Ethereal Cyan", description: "Primary thoughts", color: "#00FFD1", category: "essence" },
    { value: "#E8A135", label: "Golden Insight", description: "Key discoveries", color: "#E8A135", category: "insight" },
    { value: "#FF00FF", label: "Mystic Magenta", description: "Creative sparks", color: "#FF00FF", category: "creative" },
    { value: "#C0C0C0", label: "Lunar Silver", description: "References", color: "#C0C0C0", category: "reference" },
    { value: "#9945FF", label: "Cosmic Purple", description: "Deep thoughts", color: "#9945FF", category: "deep" },
    { value: "#FF6B6B", label: "Aurora Coral", description: "Emotions", color: "#FF6B6B", category: "emotion" },
    { value: "#4ECDC4", label: "Ocean Mint", description: "Fresh ideas", color: "#4ECDC4", category: "fresh" },
    { value: "#FFE66D", label: "Solar Amber", description: "Inspiration", color: "#FFE66D", category: "inspiration" },
    { value: "#A8E6CF", label: "Forest Sage", description: "Growth", color: "#A8E6CF", category: "growth" },
    { value: "#FF8B94", label: "Sunset Rose", description: "Passion", color: "#FF8B94", category: "passion" },
  ];

  return (
    <div 
      className="absolute z-50 w-[420px] max-h-[80vh]"
      style={{
        top: `${6 + position.y}px`,
        right: `${6 - position.x}px`,
        transform: position.x !== 0 || position.y !== 0 ? `translate(${position.x}px, ${position.y}px)` : 'none'
      }}
    >
      <div className="bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/96 to-[#0B3D3D]/94 backdrop-blur-xl border border-[#00FFD1]/40 rounded-3xl shadow-[0_0_60px_rgba(0,255,209,0.4),0_0_120px_rgba(0,255,209,0.15)] overflow-hidden">
        {/* Enhanced animated border */}
        <div className="absolute inset-0 rounded-3xl">
          <div 
            className="absolute inset-0 rounded-3xl opacity-30"
            style={{
              background: `conic-gradient(from 0deg, transparent, #00FFD1, transparent, #E8A135, transparent)`,
              animation: 'spin 20s linear infinite',
            }}
          />
          <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/96 to-[#0B3D3D]/94" />
        </div>

        {/* Draggable header */}
        <div 
          className="relative z-10 p-6 pb-4 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative p-3 bg-gradient-to-br from-[#00FFD1]/30 to-[#00FFD1]/10 rounded-2xl shadow-[0_0_20px_rgba(0,255,209,0.3)]">
                <Sparkles className="w-6 h-6 text-[#00FFD1]" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-[#00FFD1]/10" />
              </div>
              <div>
                <h3 className="text-2xl font-light text-[#00FFD1] mb-1 tracking-wide">Node Inspector</h3>
                <p className="text-sm text-[#F0F0F0]/60 font-light">Shape your creative universe</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-[#F0F0F0]/60 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10 hover:scale-110 rounded-2xl transition-all duration-300 p-3"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-[#F0F0F0]/60 hover:text-[#F0F0F0] hover:bg-[#00FFD1]/10 hover:scale-110 rounded-2xl transition-all duration-300 p-3"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        {!isMinimized && (
          <ScrollArea className="relative z-10 max-h-[60vh] px-6 pb-6">
            <div className="space-y-8">
              {/* Enhanced content section */}
              <div className="space-y-4">
                <Label htmlFor="content" className="text-[#F0F0F0]/95 font-medium text-lg flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#E8A135]" />
                  Content
                </Label>
                <div className="relative">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-[#0B3D3D]/80 border-[#00FFD1]/40 text-[#F0F0F0] focus:border-[#00FFD1] focus:shadow-[0_0_20px_rgba(0,255,209,0.4)] rounded-2xl transition-all duration-500 min-h-[120px] text-base leading-relaxed backdrop-blur-sm"
                    rows={5}
                    placeholder="Express the essence of your thoughts..."
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#00FFD1]/5 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Enhanced type selection */}
              <div className="space-y-4">
                <Label htmlFor="type" className="text-[#F0F0F0]/95 font-medium text-lg">Node Archetype</Label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-[#0B3D3D]/80 border-[#00FFD1]/40 text-[#F0F0F0] focus:border-[#00FFD1] focus:shadow-[0_0_20px_rgba(0,255,209,0.4)] rounded-2xl transition-all duration-500 h-14 text-base backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B3D3D]/95 border-[#00FFD1]/40 rounded-2xl backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,209,0.3)]">
                    <SelectItem value="thought" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20 rounded-xl text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💭</span>
                        <div>
                          <div className="font-medium">Thought</div>
                          <div className="text-xs opacity-60">Pure consciousness</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="image" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20 rounded-xl text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🖼️</span>
                        <div>
                          <div className="font-medium">Image</div>
                          <div className="text-xs opacity-60">Visual inspiration</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="link" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20 rounded-xl text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🔗</span>
                        <div>
                          <div className="font-medium">Link</div>
                          <div className="text-xs opacity-60">Connected knowledge</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="note" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20 rounded-xl text-base py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📝</span>
                        <div>
                          <div className="font-medium">Note</div>
                          <div className="text-xs opacity-60">Structured insight</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Premium color theme selection */}
              <div className="space-y-5">
                <Label className="text-[#F0F0F0]/95 font-medium text-lg flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#E8A135]" />
                  Essence Palette
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setColor(option.value)}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-500 group overflow-hidden ${
                        color === option.value
                          ? "border-current shadow-[0_0_30px_currentColor] scale-105"
                          : "border-transparent hover:border-current/60 hover:scale-102"
                      }`}
                      style={{ 
                        color: option.color,
                        background: color === option.value 
                          ? `radial-gradient(circle at 30% 30%, ${option.color}20, ${option.color}08)`
                          : `linear-gradient(135deg, ${option.color}10, transparent 60%)`
                      }}
                    >
                      {/* Animated background for selected */}
                      {color === option.value && (
                        <div 
                          className="absolute inset-0 opacity-20 animate-pulse-glow"
                          style={{ 
                            background: `radial-gradient(circle, ${option.color}40, transparent 70%)`
                          }}
                        />
                      )}
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className="w-8 h-8 rounded-full border-3 border-current shadow-[0_0_15px_currentColor] relative overflow-hidden"
                          style={{ backgroundColor: option.color }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-semibold text-[#F0F0F0] mb-1">{option.label}</div>
                          <div className="text-xs text-[#F0F0F0]/70 leading-tight">{option.description}</div>
                        </div>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: option.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced action buttons */}
              <div className="flex gap-4 pt-8 border-t border-[#00FFD1]/30">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:from-[#00FFD1]/90 hover:to-[#00FFD1]/80 font-semibold rounded-2xl shadow-[0_0_30px_rgba(0,255,209,0.4)] hover:shadow-[0_0_40px_rgba(0,255,209,0.6)] transition-all duration-500 h-14 text-base"
                >
                  <Save className="w-5 h-5 mr-3" />
                  Crystallize Changes
                </Button>
                <Button
                  onClick={onDelete}
                  className="bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-300 hover:from-red-500/40 hover:to-red-600/40 border border-red-500/40 hover:border-red-400/60 rounded-2xl transition-all duration-500 h-14 px-6"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
