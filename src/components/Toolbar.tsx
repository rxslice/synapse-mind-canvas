
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
    <div className="absolute top-6 left-6 z-50">
      <div className="bg-[#0B3D3D]/90 backdrop-blur-sm border border-[#00FFD1]/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,255,209,0.2)]">
        <div className="flex flex-col gap-4">
          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-2xl font-light text-[#00FFD1] mb-1">Synapse</h1>
            <p className="text-xs text-[#F0F0F0]/60">AI-Powered Second Brain</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-[#F0F0F0]/80">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00FFD1]" />
              <span>{nodeCount} thoughts</span>
            </div>
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-[#E8A135]" />
              <span>{connectionCount} synapses</span>
            </div>
          </div>

          {/* AI Toggle */}
          <Button
            onClick={onToggleAI}
            className={`w-full transition-all duration-300 ${
              isAIActive
                ? "bg-[#00FFD1] text-[#0B3D3D] hover:bg-[#00FFD1]/90 shadow-[0_0_20px_rgba(0,255,209,0.5)]"
                : "bg-[#0B3D3D] text-[#00FFD1] border border-[#00FFD1]/50 hover:bg-[#00FFD1]/10"
            }`}
          >
            {isAIActive ? "AI Active" : "Activate AI"}
          </Button>

          {/* Instructions */}
          <div className="text-xs text-[#F0F0F0]/50 space-y-1">
            <div>• Double-click: Create node</div>
            <div>• Drag: Move node</div>
            <div>• Link icon: Connect nodes</div>
            <div>• Scroll: Zoom canvas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
