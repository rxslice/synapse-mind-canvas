
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Plus, Zap, Network, Save, MoreHorizontal, Activity, Clock, Target, Move, Minimize2, X } from "lucide-react";
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
  const [sessionTime, setSessionTime] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setLastSaved(new Date());
    }
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

  const connectionStrength = nodeCount > 0 ? (connectionCount / Math.max(nodeCount - 1, 1)) * 100 : 0;

  return (
    <div 
      className="absolute z-50 w-[304px]"
      style={{
        top: `${16 + position.y}px`,
        left: `${16 + position.x}px`,
      }}
    >
      <Card className="bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/96 to-[#0B3D3D]/94 backdrop-blur-xl border border-[#00FFD1]/40 shadow-[0_0_32px_rgba(0,255,209,0.2)] rounded-2xl overflow-hidden">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl">
          <div 
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: `conic-gradient(from 0deg, transparent, #00FFD1, transparent, #E8A135, transparent)`,
              animation: 'spin 20s linear infinite',
            }}
          />
          <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/96 to-[#0B3D3D]/94" />
        </div>

        <CardContent className="p-5 relative z-10">
          <div className="flex flex-col gap-5">
            {/* Enhanced Header with drag functionality */}
            <div 
              className="flex items-center justify-between cursor-move select-none"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative p-2.5 bg-gradient-to-br from-[#00FFD1]/30 to-[#00FFD1]/10 rounded-xl shadow-[0_0_16px_rgba(0,255,209,0.3)]">
                  <Brain className="w-5 h-5 text-[#00FFD1]" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-[#00FFD1]/10" />
                </div>
                <div>
                  <h1 className="text-lg font-light text-[#00FFD1] tracking-wide">Neural Hub</h1>
                  <p className="text-xs text-[#F0F0F0]/60 font-light">Command Center</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-7 w-7 p-0 text-[#F0F0F0]/50 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10 rounded-lg transition-all duration-300"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-[#00FFD1]/20 to-[#00FFD1]/5 rounded-xl p-3 border border-[#00FFD1]/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FFD1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Target className="w-3.5 h-3.5 text-[#00FFD1]" />
                        <span className="text-xs text-[#F0F0F0]/70 font-medium">Thoughts</span>
                      </div>
                      <div className="text-lg font-bold text-[#00FFD1] mb-0.5">{nodeCount}</div>
                      <div className="text-xs text-[#00FFD1]/70">Active nodes</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#E8A135]/20 to-[#E8A135]/5 rounded-xl p-3 border border-[#E8A135]/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E8A135]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Network className="w-3.5 h-3.5 text-[#E8A135]" />
                        <span className="text-xs text-[#F0F0F0]/70 font-medium">Synapses</span>
                      </div>
                      <div className="text-lg font-bold text-[#E8A135] mb-0.5">{connectionCount}</div>
                      <div className="text-xs text-[#E8A135]/70">Connections</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/5 rounded-xl p-3 border border-[#9945FF]/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#9945FF]" />
                        <span className="text-xs text-[#F0F0F0]/70 font-medium">Density</span>
                      </div>
                      <div className="text-lg font-bold text-[#9945FF] mb-0.5">{Math.round(connectionStrength)}%</div>
                      <div className="text-xs text-[#9945FF]/70">Network strength</div>
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="flex items-center justify-between p-2.5 bg-[#083838]/40 rounded-xl border border-[#00FFD1]/20">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-[#00FFD1]/70" />
                    <span className="text-sm text-[#F0F0F0]/80">Session: {formatTime(sessionTime)}</span>
                  </div>
                  {lastSaved && (
                    <span className="text-xs text-[#F0F0F0]/50">
                      Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                {/* Enhanced Quick Actions */}
                <div className="flex gap-2.5">
                  <Button
                    onClick={onQuickCreate}
                    size="sm"
                    className="flex-1 h-10 bg-gradient-to-r from-[#00FFD1]/20 to-[#00FFD1]/10 text-[#00FFD1] border border-[#00FFD1]/40 hover:from-[#00FFD1]/30 hover:to-[#00FFD1]/20 hover:border-[#00FFD1]/60 transition-all duration-300 rounded-xl font-medium"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    New Thought
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="h-10 px-3 bg-gradient-to-r from-[#083838]/60 to-[#083838]/40 text-[#F0F0F0]/70 border border-[#00FFD1]/20 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10 hover:border-[#00FFD1]/40 transition-all duration-300 rounded-xl"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Enhanced AI Toggle */}
                <Button
                  onClick={onToggleAI}
                  className={`w-full h-12 text-sm font-semibold transition-all duration-500 rounded-xl relative overflow-hidden ${
                    isAIActive
                      ? "bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] shadow-[0_0_24px_rgba(0,255,209,0.5)] hover:shadow-[0_0_32px_rgba(0,255,209,0.7)]"
                      : "bg-gradient-to-r from-[#0B3D3D] to-[#083838] text-[#00FFD1] border-2 border-[#00FFD1]/50 hover:bg-gradient-to-r hover:from-[#00FFD1]/10 hover:to-[#00FFD1]/5 hover:border-[#00FFD1]/70"
                  }`}
                >
                  {isAIActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  )}
                  <div className="relative z-10 flex items-center justify-center gap-2.5">
                    <Zap className="w-4 h-4" />
                    {isAIActive ? "AI Brain Active" : "Activate AI Brain"}
                  </div>
                </Button>

                {/* Enhanced Network Status */}
                <div className="flex items-center justify-center gap-2.5 pt-2.5 border-t border-[#00FFD1]/20">
                  <Network className="w-3.5 h-3.5 text-[#00FFD1]/60" />
                  <span className="text-sm text-[#F0F0F0]/60 font-medium">Neural Network</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFD1] animate-pulse" />
                    <span className="text-xs text-[#00FFD1]/80">Online</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Instructions - only show when not minimized */}
      {!isMinimized && (
        <div className="mt-3 bg-gradient-to-br from-[#0B3D3D]/90 to-[#083838]/80 backdrop-blur-sm border border-[#00FFD1]/20 rounded-xl p-3">
          <div className="text-sm text-[#F0F0F0]/70 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#F0F0F0]/50">Double-click canvas</span>
              <span className="text-[#00FFD1]/80 font-medium">Create thought</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#F0F0F0]/50">Click + hold drag</span>
              <span className="text-[#E8A135]/80 font-medium">Pan canvas</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#F0F0F0]/50">Wheel scroll</span>
              <span className="text-[#9945FF]/80 font-medium">Zoom view</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
