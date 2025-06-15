
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface InsightNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onViewInsights: () => void;
  thoughtCount: number;
}

export const InsightNotification = ({
  isVisible,
  onDismiss,
  onViewInsights,
  thoughtCount
}: InsightNotificationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-dismiss after 10 seconds if not interacted with
      const timer = setTimeout(() => {
        onDismiss();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  const handleViewInsights = () => {
    onViewInsights();
    onDismiss();
    toast.success("AI Insights activated", {
      description: "Analyzing your neural network for patterns and connections",
      duration: 3000
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[80]">
      <Card className={`
        w-80 bg-gradient-to-br from-[#E8A135]/95 to-[#E8A135]/85 backdrop-blur-xl 
        border border-[#E8A135]/70 shadow-[0_0_32px_rgba(232,161,53,0.4)]
        transform transition-all duration-500 ease-out
        ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
      `}>
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-lg">
          <div 
            className="absolute inset-0 rounded-lg opacity-50"
            style={{
              background: `conic-gradient(from 0deg, transparent, #E8A135, transparent)`,
              animation: 'spin 8s linear infinite',
            }}
          />
          <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-[#E8A135]/95 to-[#E8A135]/85" />
        </div>

        <CardContent className="p-4 relative z-10">
          <div className="flex items-start gap-3">
            {/* Animated lightbulb icon */}
            <div className="relative">
              <div className="p-2 bg-white/20 rounded-full">
                <Lightbulb className="w-6 h-6 text-[#0B3D3D] animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[#0B3D3D] text-sm">
                  Neural Insight Ready
                </h3>
                <Sparkles className="w-4 h-4 text-[#0B3D3D]/70 animate-pulse" />
              </div>
              <p className="text-[#0B3D3D]/80 text-sm leading-relaxed mb-3">
                Your {thoughtCount} thoughts have reached critical mass! AI analysis can now reveal valuable patterns and connections.
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleViewInsights}
                  size="sm"
                  className="bg-[#0B3D3D] text-[#E8A135] hover:bg-[#0B3D3D]/90 shadow-lg text-xs font-medium"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  View Insights
                </Button>
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-[#0B3D3D]/60 hover:text-[#0B3D3D] hover:bg-white/10 text-xs"
                >
                  Later
                </Button>
              </div>
            </div>

            <Button
              onClick={onDismiss}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-[#0B3D3D]/50 hover:text-[#0B3D3D] hover:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

