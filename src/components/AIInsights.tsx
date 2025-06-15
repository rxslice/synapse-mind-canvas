
import { useState, useEffect } from "react";
import { Node, Connection } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AIInsightsProps {
  nodes: Node[];
  connections: Connection[];
  onSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

export const AIInsights = ({ nodes, connections, onSuggestion, onClose }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const nodeContents = nodes.map(n => n.content).join(", ");
    const newInsights = [
      `I notice you have ${nodes.length} thoughts with ${connections.length} connections. Consider exploring the relationship between your "${nodes[0]?.content || 'first'}" idea and "${nodes[nodes.length - 1]?.content || 'latest'}" concept.`,
      "Based on your thought patterns, you might benefit from creating a 'reflection' node to synthesize your current ideas.",
      "Your creative network shows potential for a breakthrough connection. Try linking seemingly unrelated concepts.",
      `The themes in your canvas suggest an emerging pattern around ${nodeContents.length > 50 ? 'complex interconnected systems' : 'foundational concepts'}. What if you explored the opposite perspective?`,
    ];
    
    setInsights(newInsights.slice(0, 3));
    setIsGenerating(false);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      generateInsights();
    }
  }, [nodes.length]);

  return (
    <div className="absolute bottom-6 right-6 z-50 w-96">
      <Card className="bg-[#0B3D3D]/95 backdrop-blur-sm border border-[#00FFD1]/30 p-6 shadow-[0_0_30px_rgba(0,255,209,0.2)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-[#00FFD1]">AI Insights</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]"
            >
              ×
            </Button>
          </div>

          {isGenerating ? (
            <div className="flex items-center gap-3 text-[#F0F0F0]/60">
              <div className="w-4 h-4 border-2 border-[#00FFD1] border-t-transparent rounded-full animate-spin" />
              <span>Analyzing your creative network...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#00FFD1]/10 border border-[#00FFD1]/20 rounded-lg hover:bg-[#00FFD1]/15 transition-colors cursor-pointer"
                  onClick={() => onSuggestion(insight)}
                >
                  <p className="text-sm text-[#F0F0F0]/90 leading-relaxed">{insight}</p>
                </div>
              ))}
              
              <Button
                onClick={generateInsights}
                className="w-full bg-[#E8A135]/20 text-[#E8A135] border border-[#E8A135]/30 hover:bg-[#E8A135]/30"
              >
                Generate New Insights
              </Button>
            </div>
          )}

          <div className="text-xs text-[#F0F0F0]/50 text-center">
            AI insights are suggestions to spark creativity
          </div>
        </div>
      </Card>
    </div>
  );
};
