
import { useState } from "react";
import { Node } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Trash2, Save, X } from "lucide-react";

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

  const colorOptions = [
    { value: "#00FFD1", label: "Ethereal Cyan", description: "Primary thoughts", color: "#00FFD1" },
    { value: "#E8A135", label: "Golden Insight", description: "Key discoveries", color: "#E8A135" },
    { value: "#FF00FF", label: "Mystic Magenta", description: "Creative sparks", color: "#FF00FF" },
    { value: "#C0C0C0", label: "Lunar Silver", description: "References", color: "#C0C0C0" },
    { value: "#9945FF", label: "Cosmic Purple", description: "Deep thoughts", color: "#9945FF" },
    { value: "#FF6B6B", label: "Aurora Coral", description: "Emotions", color: "#FF6B6B" },
  ];

  return (
    <div className="absolute top-6 right-6 z-50 w-96">
      <div className="bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/95 to-[#0B3D3D]/98 backdrop-blur-lg border border-[#00FFD1]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,209,0.3),0_0_100px_rgba(0,255,209,0.1)]">
        {/* Header with enhanced styling */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00FFD1]/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-[#00FFD1]" />
            </div>
            <div>
              <h3 className="text-xl font-light text-[#00FFD1] mb-1">Node Inspector</h3>
              <p className="text-xs text-[#F0F0F0]/60">Shape your thoughts</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#F0F0F0]/60 hover:text-[#F0F0F0] hover:bg-[#00FFD1]/10 rounded-xl transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Content section with enhanced styling */}
          <div className="space-y-3">
            <Label htmlFor="content" className="text-[#F0F0F0]/90 font-medium">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-[#0B3D3D]/60 border-[#00FFD1]/30 text-[#F0F0F0] focus:border-[#00FFD1] focus:shadow-[0_0_15px_rgba(0,255,209,0.3)] rounded-xl transition-all duration-300"
              rows={4}
              placeholder="Express your thoughts..."
            />
          </div>

          {/* Type selection with enhanced styling */}
          <div className="space-y-3">
            <Label htmlFor="type" className="text-[#F0F0F0]/90 font-medium">Node Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-[#0B3D3D]/60 border-[#00FFD1]/30 text-[#F0F0F0] focus:border-[#00FFD1] focus:shadow-[0_0_15px_rgba(0,255,209,0.3)] rounded-xl transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0B3D3D]/95 border-[#00FFD1]/30 rounded-xl backdrop-blur-lg">
                <SelectItem value="thought" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20">💭 Thought</SelectItem>
                <SelectItem value="image" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20">🖼️ Image</SelectItem>
                <SelectItem value="link" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20">🔗 Link</SelectItem>
                <SelectItem value="note" className="text-[#F0F0F0] focus:bg-[#00FFD1]/20">📝 Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced color theme selection */}
          <div className="space-y-4">
            <Label className="text-[#F0F0F0]/90 font-medium">Color Theme</Label>
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 group relative overflow-hidden ${
                    color === option.value
                      ? "border-current shadow-[0_0_20px_currentColor] scale-105"
                      : "border-transparent hover:border-current/50 hover:scale-102"
                  }`}
                  style={{ 
                    color: option.color,
                    background: color === option.value 
                      ? `linear-gradient(135deg, ${option.color}15, ${option.color}08)`
                      : `linear-gradient(135deg, ${option.color}08, transparent)`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-current shadow-[0_0_10px_currentColor]"
                      style={{ backgroundColor: option.color }}
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium text-[#F0F0F0]">{option.label}</div>
                      <div className="text-xs text-[#F0F0F0]/60">{option.description}</div>
                    </div>
                  </div>
                  {color === option.value && (
                    <div 
                      className="absolute inset-0 opacity-20 animate-pulse-glow"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-3 pt-6 border-t border-[#00FFD1]/20">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:from-[#00FFD1]/90 hover:to-[#00FFD1]/80 font-medium rounded-xl shadow-[0_0_20px_rgba(0,255,209,0.3)] hover:shadow-[0_0_30px_rgba(0,255,209,0.5)] transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              onClick={onDelete}
              className="bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-400/50 rounded-xl transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
