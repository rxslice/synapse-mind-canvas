
import { Button } from "@/components/ui/button";
import { Brain, Plus, Zap, Network, Save, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ToolbarProps {
  onToggleAI: () => void;
  isAIActive: boolean;
  nodeCount: number;
  connectionCount: number;
  onQuickCreate?: () => void;
  onSave?: () => void;
}

export const Toolbar = ({ 
  onToggleAI, 
  isAIActive, 
  nodeCount, 
  connectionCount,
  onQuickCreate,
  onSave 
}: ToolbarProps) => {
  return (
    <div className="absolute top-4 left-4 z-50 max-w-[320px]">
      <Card className="bg-[#0B3D3D]/95 backdrop-blur-premium border-[#00FFD1]/40 shadow-[0_0_25px_rgba(0,255,209,0.15)] glass-morphism">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Header with branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#00FFD1]" />
                <h1 className="text-xl font-light text-[#00FFD1] text-shadow-glow">Synapse</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-[#F0F0F0]/50 hover:text-[#00FFD1]"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#083838]/50 rounded-lg p-3 border border-[#00FFD1]/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#00FFD1]" />
                  <span className="text-xs text-[#F0F0F0]/70">Thoughts</span>
                </div>
                <div className="text-lg font-medium text-[#00FFD1]">{nodeCount}</div>
              </div>
              
              <div className="bg-[#083838]/50 rounded-lg p-3 border border-[#E8A135]/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#E8A135]" />
                  <span className="text-xs text-[#F0F0F0]/70">Synapses</span>
                </div>
                <div className="text-lg font-medium text-[#E8A135]">{connectionCount}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={onQuickCreate}
                size="sm"
                className="flex-1 h-8 bg-[#00FFD1]/10 text-[#00FFD1] border border-[#00FFD1]/30 hover:bg-[#00FFD1]/20 hover:border-[#00FFD1]/50 transition-all duration-200"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create
              </Button>
              
              <Button
                onClick={onSave}
                size="sm"
                variant="ghost"
                className="h-8 px-3 text-[#F0F0F0]/60 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10"
              >
                <Save className="w-3 h-3" />
              </Button>
            </div>

            {/* AI Toggle - More Prominent */}
            <Button
              onClick={onToggleAI}
              className={`w-full h-9 text-sm font-medium transition-all duration-300 ${
                isAIActive
                  ? "bg-[#00FFD1] text-[#0B3D3D] hover:bg-[#00FFD1]/90 shadow-[0_0_20px_rgba(0,255,209,0.4)] border-glow"
                  : "bg-[#0B3D3D] text-[#00FFD1] border-2 border-[#00FFD1]/50 hover:bg-[#00FFD1]/10 hover:border-[#00FFD1]/70"
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isAIActive ? "AI Processing..." : "Activate AI Brain"}
            </Button>

            {/* Network Status Indicator */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#00FFD1]/20">
              <Network className="w-3 h-3 text-[#00FFD1]/60" />
              <span className="text-xs text-[#F0F0F0]/40">Neural Network Active</span>
              <div className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Instructions */}
      <div className="mt-3 bg-[#0B3D3D]/80 backdrop-blur-sm border border-[#00FFD1]/15 rounded-lg p-3">
        <div className="text-xs text-[#F0F0F0]/50 space-y-1">
          <div className="flex justify-between">
            <span>Double-click</span>
            <span className="text-[#00FFD1]/70">New thought</span>
          </div>
          <div className="flex justify-between">
            <span>Drag nodes</span>
            <span className="text-[#E8A135]/70">Organize</span>
          </div>
          <div className="flex justify-between">
            <span>Click + drag</span>
            <span className="text-[#00FFD1]/70">Connect ideas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
