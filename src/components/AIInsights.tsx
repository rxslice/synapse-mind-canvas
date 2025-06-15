
import { useState, useEffect } from "react";
import { Node, Connection, AIInsight } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Lightbulb, TrendingUp, Zap, X, RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import { geminiService } from "@/services/geminiService";
import { toast } from "sonner";

interface AIInsightsProps {
  nodes: Node[];
  connections: Connection[];
  onSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

export const AIInsights = ({ nodes, connections, onSuggestion, onClose }: AIInsightsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [connectionSuggestions, setConnectionSuggestions] = useState<Array<{from: string, to: string, reason: string}>>([]);
  const [error, setError] = useState<string | null>(null);

  const generateRealInsights = async () => {
    if (nodes.length === 0) {
      toast.error("No thoughts to analyze", {
        description: "Create some thoughts first to get AI insights"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🧠 Generating real AI insights for network:', { 
        nodes: nodes.length, 
        connections: connections.length 
      });

      const analysis = await geminiService.analyzeNetwork(nodes, connections);
      setInsights(analysis.insights);
      
      // Generate connection suggestions
      const connSuggestions = await geminiService.suggestConnections(nodes, connections);
      setConnectionSuggestions(connSuggestions);
      
      if (analysis.insights.length > 0) {
        toast.success("🤖 AI insights generated", {
          description: `Found ${analysis.insights.length} meaningful patterns in your neural network`
        });
      }
      
      console.log('✅ AI analysis complete:', analysis);
      
    } catch (error) {
      console.error('❌ AI insight generation failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      toast.error("AI insight generation failed", {
        description: "Check your internet connection and try again"
      });
      
      // Fallback to basic insight
      setInsights([{
        id: `fallback-${Date.now()}`,
        type: 'suggestion',
        title: 'AI Connection Unavailable',
        description: 'Unable to generate AI insights. Please check your internet connection and try again.',
        confidence: 1.0,
        actionable: false,
        priority: 'low',
        createdAt: new Date(),
      }]);
      
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (nodes.length > 0) {
      generateRealInsights();
    }
  }, [nodes.length, connections.length]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'creative': return <Sparkles className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return '#00FFD1';
      case 'suggestion': return '#E8A135';
      case 'optimization': return '#FF6B6B';
      case 'creative': return '#9945FF';
      case 'warning': return '#FF9500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#E8A135';
      case 'low': return '#00FFD1';
      default: return '#00FFD1';
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
                <h3 className="text-xl font-light text-[#00FFD1] tracking-wide">AI Neural Insights</h3>
                <p className="text-sm text-[#F0F0F0]/60">Powered by Gemini AI</p>
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

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-2xl border border-[#FF6B6B]/30 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF6B6B]/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
                <span className="text-sm font-medium text-[#FF6B6B]">AI Connection Error</span>
              </div>
              <p className="text-sm text-[#F0F0F0]/80">{error}</p>
            </div>
          )}

          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#00FFD1]/30 border-t-[#00FFD1] rounded-full animate-spin mx-auto" />
                  <Brain className="w-6 h-6 text-[#00FFD1] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <p className="text-[#F0F0F0]/80 font-medium">Analyzing with Gemini AI...</p>
                  <p className="text-[#F0F0F0]/50 text-sm">Deep pattern recognition in progress</p>
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
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${getPriorityColor(insight.priority)}20`,
                              color: getPriorityColor(insight.priority)
                            }}
                          >
                            {insight.priority}
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

              {/* Connection Suggestions */}
              {connectionSuggestions.length > 0 && (
                <div className="p-4 rounded-2xl border border-[#9945FF]/30 bg-gradient-to-br from-[#9945FF]/15 to-transparent">
                  <h4 className="text-sm font-semibold text-[#9945FF] mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Suggested Connections
                  </h4>
                  <div className="space-y-2">
                    {connectionSuggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm text-[#F0F0F0]/80 p-2 rounded-lg bg-[#9945FF]/10">
                        <div className="font-medium text-[#9945FF] mb-1">
                          "{suggestion.from}" ↔ "{suggestion.to}"
                        </div>
                        <div className="text-xs text-[#F0F0F0]/60">
                          {suggestion.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Action Button */}
          <Button
            onClick={generateRealInsights}
            disabled={isGenerating || nodes.length === 0}
            className="w-full h-12 bg-gradient-to-r from-[#E8A135]/20 to-[#E8A135]/10 text-[#E8A135] border border-[#E8A135]/40 hover:from-[#E8A135]/30 hover:to-[#E8A135]/20 hover:border-[#E8A135]/60 transition-all duration-300 rounded-2xl font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Analyzing with AI...' : 'Generate New AI Insights'}
          </Button>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-[#00FFD1]/20">
            <p className="text-xs text-[#F0F0F0]/50">
              Real AI insights powered by Google Gemini
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
