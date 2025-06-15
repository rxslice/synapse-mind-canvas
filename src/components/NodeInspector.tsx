
import { useState } from "react";
import { Node } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    { value: "#00FFD1", label: "Cyan Glow", color: "#00FFD1" },
    { value: "#E8A135", label: "Warm Ochre", color: "#E8A135" },
    { value: "#FF00FF", label: "Ethereal Magenta", color: "#FF00FF" },
    { value: "#C0C0C0", label: "Starlight Silver", color: "#C0C0C0" },
  ];

  return (
    <div className="absolute top-6 right-6 z-50 w-80">
      <div className="bg-[#0B3D3D]/95 backdrop-blur-sm border border-[#00FFD1]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,209,0.2)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-[#00FFD1]">Node Inspector</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]"
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="content" className="text-[#F0F0F0]/80">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 bg-[#0B3D3D]/50 border-[#00FFD1]/30 text-[#F0F0F0] focus:border-[#00FFD1]"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-[#F0F0F0]/80">Type</Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger className="mt-1 bg-[#0B3D3D]/50 border-[#00FFD1]/30 text-[#F0F0F0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0B3D3D] border-[#00FFD1]/30">
                  <SelectItem value="thought">Thought</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#F0F0F0]/80">Color Theme</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setColor(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      color === option.value
                        ? "border-current shadow-[0_0_15px_currentColor]"
                        : "border-transparent hover:border-current/50"
                    }`}
                    style={{ color: option.color }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="text-xs text-[#F0F0F0]">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#00FFD1] text-[#0B3D3D] hover:bg-[#00FFD1]/90"
              >
                Save Changes
              </Button>
              <Button
                onClick={onDelete}
                variant="destructive"
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
