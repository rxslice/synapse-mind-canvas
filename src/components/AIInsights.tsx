
import { useState, useEffect } from "react";
import { Node, Connection } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Lightbulb, TrendingUp, Zap, X, RefreshCw, Sparkles } from "lucide-react";

interface AIInsightsProps {
  nodes: Node[];
  connections: Connection[];
  onSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

interface Insight {
  id: string;
  type: 'pattern' | 'suggestion' | 'optimization' | 'creative';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

export const AIInsights = ({ nodes, connections, onSuggestion, onClose }: AIInsightsProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const generateAdvancedInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights: Insight[] = [];

    // Analyze network structure
    if (nodes.length >= 3 && connections.length >= 2) {
      newInsights.push({
        id: '1',
        type: 'pattern',
        title: 'Emerging Knowledge Clusters',
        description: `Your neural network shows ${Math.ceil(connections.length / 2)} distinct thought clusters. Consider creating bridge connections between isolated groups to enhance creative potential.`,
        confidence: 0.85,
        actionable: true
      });
    }

    // Content analysis
    const contentWords = nodes.map(n => n.content.toLowerCase()).join(' ').split(' ');
    const uniqueWords = [...new Set(contentWords)].filter(w => w.length > 3);
    
    if (uniqueWords.length > 5) {
      newInsights.push({
        id: '2',
        type: 'creative',
        title: 'Conceptual Synthesis Opportunity',
        description: `I've identified recurring themes around "${uniqueWords.slice(0, 3).join(', ')}". Consider creating a synthesis node that explores the intersection of these concepts.`,
        confidence: 0.78,
        actionable: true
      });
    }

    // Network density analysis
    const networkDensity = connections.length / (nodes.length * (nodes.length - 1) / 2);
    if (networkDensity < 0.3 && nodes.length > 4) {
      newInsights.push({
        id: '3',
        type: 'optimization',
        title: 'Sparse Network Detected',
        description: `Your thought network has low connectivity (${Math.round(networkDensity * 100)}% density). Adding strategic connections could unlock hidden relationships and boost creative insights.`,
        confidence: 0.92,
        actionable: true
      });
    }

    // Creative suggestions
    if (nodes.length > 0) {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      newInsights.push({
        id: '4',
        type: 'suggestion',
        title: 'Perspective Flip Challenge',
        description: `What if you approached "${randomNode.content}" from the completely opposite angle? Sometimes breakthrough insights come from inverting our assumptions.`,
        confidence: 0.65,
        actionable: true
      });
    }

    // Time-based patterns
    const now = new Date();
    const recentNodes = nodes.filter(n => now.getTime() - new Date(n.createdAt).getTime() < 5 * 60 * 1000);
    
    if (recentNodes.length >= 3) {
      newInsights.push({
        id: '5',
        type: 'pattern',
        title: 'Creative Flow State Detected',
        description: `You've created ${recentNodes.length} thoughts in the last 5 minutes. You're in a flow state! Consider setting a timer to capture this momentum before taking a break.`,
        confidence: 0.88,
        actionable: false
      });
    }

    setInsights(newInsights);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      generateAdvancedInsights();
    }
  }, [nodes.length, connections.length]);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'creative': return <Sparkles className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'pattern': return '#00FFD1';
      case 'suggestion': return '#E8A135';
      case 'optimization': return '#FF6B6B';
      case 'creative': return '#9945FF';
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-50 w-[440px]">
      <Card className="bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/96 to-[#0B3D3D]/94 backdrop-blur-xl border border-[#00FFD1]/40 shadow-[0_0_50px_rgba(0,255,209,0.3)] rounded-3xl overflow-hidden">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl">
          <div 
            className="absolute inset-0 rounded-3xl opacity-30"
            style={{
              background: `conic-gradient(from 0deg, transparent, #00FFD1, transparent, #E8A135, transparent)`,
              animation: 'spin 15s linear infinite',
            }}
          />
          <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-[#0B3D3D]/98 via-[#0A3A3A]/96 to-[#0B3D3D]/94" />
        </div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-3 bg-gradient-to-br from-[#00FFD1]/30 to-[#00FFD1]/10 rounded-2xl shadow-[0_0_20px_rgba(0,255,209,0.3)]">
                <Brain className="w-6 h-6 text-[#00FFD1]" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-[#00FFD1]/10" />
              </div>
              <div>
                <h3 className="text-xl font-light text-[#00FFD1] tracking-wide">Neural Insights</h3>
                <p className="text-sm text-[#F0F0F0]/60">AI Pattern Recognition</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#F0F0F0]/60 hover:text-[#F0F0F0] hover:bg-[#00FFD1]/10 rounded-xl p-2 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#00FFD1]/30 border-t-[#00FFD1] rounded-full animate-spin mx-auto" />
                  <Brain className="w-6 h-6 text-[#00FFD1] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <p className="text-[#F0F0F0]/80 font-medium">Analyzing neural patterns...</p>
                  <p className="text-[#F0F0F0]/50 text-sm">Deep learning in progress</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    selectedInsight === insight.id
                      ? 'border-current shadow-[0_0_20px_currentColor] scale-105'
                      : 'border-current/30 hover:border-current/60 hover:scale-102'
                  }`}
                  style={{ 
                    color: getInsightColor(insight.type),
                    background: selectedInsight === insight.id 
                      ? `radial-gradient(circle at 30% 30%, ${getInsightColor(insight.type)}20, transparent)`
                      : `linear-gradient(135deg, ${getInsightColor(insight.type)}15, transparent 60%)`
                  }}
                  onClick={() => {
                    setSelectedInsight(insight.id === selectedInsight ? null : insight.id);
                    onSuggestion(insight.description);
                  }}
                >
                  {/* Animated background for selected */}
                  {selectedInsight === insight.id && (
                    <div 
                      className="absolute inset-0 opacity-20 animate-pulse"
                      style={{ 
                        background: `radial-gradient(circle, ${getInsightColor(insight.type)}40, transparent 70%)`
                      }}
                    />
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-2 rounded-xl mt-1 shadow-lg"
                        style={{ backgroundColor: `${getInsightColor(insight.type)}20` }}
                      >
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-[#F0F0F0]">{insight.title}</h4>
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${getInsightColor(insight.type)}20`,
                              color: getInsightColor(insight.type)
                            }}
                          >
                            {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-[#F0F0F0]/80 leading-relaxed mb-3">
                          {insight.description}
                        </p>
                        {insight.actionable && (
                          <div className="flex items-center gap-1 text-xs">
                            <Zap className="w-3 h-3" />
                            <span style={{ color: getInsightColor(insight.type) }}>
                              Actionable insight
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Action Button */}
          <Button
            onClick={generateAdvancedInsights}
            disabled={isGenerating}
            className="w-full h-12 bg-gradient-to-r from-[#E8A135]/20 to-[#E8A135]/10 text-[#E8A135] border border-[#E8A135]/40 hover:from-[#E8A135]/30 hover:to-[#E8A135]/20 hover:border-[#E8A135]/60 transition-all duration-300 rounded-2xl font-medium"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Analyzing...' : 'Generate New Insights'}
          </Button>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-[#00FFD1]/20">
            <p className="text-xs text-[#F0F0F0]/50">
              AI insights are suggestions to enhance creative thinking
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
