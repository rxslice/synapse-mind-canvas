
import React, { useState, useEffect } from "react";
import { Node } from "@/types/canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Trash2, Palette, Tag, Calendar, Type, Move } from "lucide-react";
import { Label } from "@/components/ui/label";

interface NodeInspectorProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const NodeInspector = ({ node, onUpdate, onDelete, onClose }: NodeInspectorProps) => {
  const [content, setContent] = useState(node.content);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);

  const colors = [
    { name: "Aqua", value: "#00FFD1" },
    { name: "Gold", value: "#E8A135" },
    { name: "Purple", value: "#9945FF" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Pink", value: "#EC4899" },
    { name: "Indigo", value: "#6366F1" },
  ];

  useEffect(() => {
    setContent(node.content);
  }, [node.content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate({ ...node, content: newContent });
  };

  const handleColorChange = (color: string) => {
    onUpdate({ ...node, color });
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

  return (
    <div 
      className="fixed z-50 w-80"
      style={{
        top: `${80 + position.y}px`,
        right: `${16 + Math.abs(position.x)}px`,
      }}
    >
      <Card className="bg-gradient-to-br from-[#0B3D3D]/95 via-[#0A3A3A]/93 to-[#0B3D3D]/91 backdrop-blur-xl border border-[#00FFD1]/30 shadow-[0_0_40px_rgba(0,255,209,0.2)] rounded-2xl overflow-hidden">
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-2xl">
          <div 
            className="absolute inset-0 rounded-2xl opacity-20"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${node.color}, transparent)`,
              animation: 'spin 15s linear infinite',
            }}
          />
          <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-[#0B3D3D]/95 via-[#0A3A3A]/93 to-[#0B3D3D]/91" />
        </div>

        <CardHeader 
          className="pb-3 relative z-10 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-light text-[#F0F0F0] flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full shadow-lg"
                style={{ backgroundColor: node.color }}
              />
              Thought Inspector
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-[#F0F0F0]/50 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10 rounded-lg"
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-[#F0F0F0]/50 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-5 pt-0 relative z-10 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Content Editor */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#F0F0F0]/80 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Content
              </Label>
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter your thought..."
                className="min-h-[120px] bg-[#083838]/40 border-[#00FFD1]/30 text-[#F0F0F0] placeholder:text-[#F0F0F0]/40 focus:border-[#00FFD1]/60 focus:ring-[#00FFD1]/20 rounded-xl resize-none"
              />
            </div>

            <Separator className="bg-[#00FFD1]/20" />

            {/* Color Palette */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#F0F0F0]/80 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Essence Palette
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`w-full h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      node.color === color.value 
                        ? 'border-white shadow-lg ring-2 ring-white/30' 
                        : 'border-transparent hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <Separator className="bg-[#00FFD1]/20" />

            {/* Node Metadata */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#F0F0F0]/80 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Metadata
              </Label>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-[#F0F0F0]/60">Type</span>
                  <Badge variant="outline" className="text-[#00FFD1] border-[#00FFD1]/40">
                    {node.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[#F0F0F0]/60">Position</span>
                  <div className="text-[#F0F0F0]/80">
                    {Math.round(node.x)}, {Math.round(node.y)}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[#F0F0F0]/60">Size</span>
                  <div className="text-[#F0F0F0]/80">
                    {node.width} × {node.height}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[#F0F0F0]/60 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created
                  </span>
                  <div className="text-[#F0F0F0]/80 text-xs">
                    {node.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-[#00FFD1]/20" />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="flex-1 h-10 bg-gradient-to-r from-[#EF4444]/20 to-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40 hover:from-[#EF4444]/30 hover:to-[#EF4444]/20 hover:border-[#EF4444]/60 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Dissolve
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
