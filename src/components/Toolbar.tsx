
import { Button } from "@/components/ui/button";
import { Circle, Square, MessageSquare, Link } from "lucide-react";

interface ToolbarProps {
  onToggleAI: () => void;
  isAIActive: boolean;
  nodeCount: number;
  connectionCount: number;
}

export const Toolbar = ({ onToggleAI, isAIActive, nodeCount, connectionCount }: ToolbarProps) => {
  return (
    <div className="absolute top-4 left-4 z-50 max-w-[280px]">
      <div className="bg-[#0B3D3D]/95 backdrop-blur-premium border border-[#00FFD1]/40 rounded-xl p-3 shadow-[0_0_25px_rgba(0,255,209,0.15)] glass-morphism">
        <div className="flex flex-col gap-3">
          {/* Compact Logo/Title */}
          <div className="text-left">
            <h1 className="text-lg font-light text-[#00FFD1] mb-0.5 text-shadow-glow">Synapse</h1>
            <p className="text-[10px] text-[#F0F0F0]/50 leading-tight">AI Second Brain</p>
          </div>

          {/* Compact Stats in horizontal layout */}
          <div className="flex justify-between text-xs text-[#F0F0F0]/70">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-[#00FFD1]" />
              <span>{nodeCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link className="w-3 h-3 text-[#E8A135]" />
              <span>{connectionCount}</span>
            </div>
          </div>

          {/* Compact AI Toggle */}
          <Button
            onClick={onToggleAI}
            size="sm"
            className={`w-full h-8 text-xs transition-all duration-300 ${
              isAIActive
                ? "bg-[#00FFD1] text-[#0B3D3D] hover:bg-[#00FFD1]/90 shadow-[0_0_15px_rgba(0,255,209,0.4)] border-glow"
                : "bg-[#0B3D3D] text-[#00FFD1] border border-[#00FFD1]/50 hover:bg-[#00FFD1]/10 hover:border-[#00FFD1]/70"
            }`}
          >
            {isAIActive ? "AI Active" : "Activate AI"}
          </Button>
        </div>
      </div>

      {/* Floating instructions panel - positioned below main toolbar */}
      <div className="mt-3 bg-[#0B3D3D]/85 backdrop-blur-sm border border-[#00FFD1]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(0,255,209,0.1)]">
        <div className="text-[10px] text-[#F0F0F0]/40 space-y-0.5 leading-relaxed">
          <div>• Double-click: Create node</div>
          <div>• Drag: Move node</div>
          <div>• Link: Connect nodes</div>
          <div>• Scroll: Zoom canvas</div>
        </div>
      </div>
    </div>
  );
};
