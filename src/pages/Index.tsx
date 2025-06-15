
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'react-router-dom';
import { Node, Connection, AIInsight } from '@/types/canvas';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { geminiService } from "@/services/geminiService";
import { AnalyticsDashboard, useAnalytics } from '@/components/AnalyticsDashboard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { MobileCanvas, useMobileOptimization } from '@/components/MobileOptimization';
import { cloudStorage } from '@/services/cloudStorage';
import { BarChart, Settings } from 'lucide-react';

const Index = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [newConnection, setNewConnection] = useState<{ fromNodeId: string; toNodeId: string; strength: number } | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedConnections, setSuggestedConnections] = useState<Array<{from: string, to: string, reason: string}>>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { analyticsData, trackNodeCreation, trackConnectionCreation, trackAIInsight } = useAnalytics();
  const { isMobile, showMobileOptimizationTip } = useMobileOptimization();
  const { toast } = useToast();

  useEffect(() => {
    const restoreState = () => {
      const nodesParam = searchParams.get('nodes');
      const connectionsParam = searchParams.get('connections');

      if (nodesParam) {
        try {
          setNodes(JSON.parse(decodeURIComponent(nodesParam)));
        } catch (error) {
          console.error('Failed to parse nodes from URL:', error);
        }
      }

      if (connectionsParam) {
        try {
          setConnections(JSON.parse(decodeURIComponent(connectionsParam)));
        } catch (error) {
          console.error('Failed to parse connections from URL:', error);
        }
      }
    };

    restoreState();
  }, [searchParams]);

  useEffect(() => {
    const saveState = () => {
      const nodesParam = encodeURIComponent(JSON.stringify(nodes));
      const connectionsParam = encodeURIComponent(JSON.stringify(connections));

      setSearchParams({ nodes: nodesParam, connections: connectionsParam });
    };

    saveState();
  }, [nodes, connections, setSearchParams]);

  // Auto-save integration
  useEffect(() => {
    const handleAutoSave = async () => {
      if (nodes.length > 0 || connections.length > 0) {
        const success = await cloudStorage.saveToCloud({
          nodes,
          connections,
          insights: aiInsights,
          lastModified: new Date().toISOString(),
          version: '1.0.0'
        });
        
        if (success) {
          console.log('Auto-save completed');
        }
      }
    };

    window.addEventListener('triggerAutoSave', handleAutoSave);
    return () => window.removeEventListener('triggerAutoSave', handleAutoSave);
  }, [nodes, connections, aiInsights]);

  // Load data on startup
  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await cloudStorage.loadFromCloud();
      if (savedData) {
        setNodes(savedData.nodes || []);
        setConnections(savedData.connections || []);
        setAiInsights(savedData.insights || []);
        toast({
          title: "Data Restored",
          description: "Your previous session has been restored from cloud storage.",
        });
      }
    };

    loadSavedData();
  }, []);

  const handleCreateNode = (x: number, y: number) => {
    const newNode: Node = {
      id: uuidv4(),
      x,
      y,
      width: 200,
      height: 100,
      content: 'New Thought',
      type: 'thought',
      color: '#ffffff',
      createdAt: new Date(),
    };
    setNodes([...nodes, newNode]);
    trackNodeCreation();
    
    if (isMobile) {
      showMobileOptimizationTip();
    }
  };

  const handleNodeUpdate = (nodeId: string, newContent: string) => {
    setNodes(nodes.map(node =>
      node.id === nodeId ? { ...node, content: newContent } : node
    ));
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setConnections(connections.filter(conn => conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId));
    setAiInsights(aiInsights.filter(insight => 
      !insight.nodeIds?.includes(nodeId)
    ));
    setSelectedNode(null);
  };

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
  };

  const handleStartConnection = (fromNodeId: string) => {
    setNewConnection({ fromNodeId, toNodeId: '', strength: 50 });
  };

  const handleUpdateConnectionStrength = (strength: number) => {
    if (newConnection) {
      setNewConnection({ ...newConnection, strength });
    }
  };

  const handleCompleteConnection = (toNodeId: string) => {
    if (newConnection) {
      const newConn: Connection = {
        id: uuidv4(),
        fromNodeId: newConnection.fromNodeId,
        toNodeId,
        type: 'synapse',
        strength: newConnection.strength,
        createdAt: new Date(),
      };
      setConnections([...connections, newConn]);
      setNewConnection(null);
      trackConnectionCreation();
    }
  };

  const handleCancelConnection = () => {
    setNewConnection(null);
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  const handleGenerateInsights = useCallback(async () => {
    if (nodes.length === 0) {
      toast({
        title: "No Thoughts",
        description: "Create some thoughts to generate insights.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const analysis = await geminiService.analyzeNetwork(nodes, connections);
      setAiInsights(analysis.insights);
      analysis.insights.forEach(insight => trackAIInsight(insight.type));
      
      toast({
        title: "AI Insights Generated",
        description: `Added ${analysis.insights.length} new insights to your network.`,
      });
    } catch (error: any) {
      toast({
        title: "AI Analysis Failed",
        description: error.message || "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [nodes, connections, toast, trackAIInsight]);

  const handleGenerateSuggestions = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setIsSuggesting(true);
    try {
      const suggestions = await geminiService.generateContentSuggestions(node.content, nodes);
      // Store suggestions temporarily for display
      console.log('Generated suggestions:', suggestions);
      toast({
        title: "Suggestions Generated",
        description: `Generated ${suggestions.length} suggestions for this thought.`,
      });
    } catch (error: any) {
      toast({
        title: "Suggestion Failed",
        description: error.message || "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  }, [nodes, toast]);

  const handleSuggestConnections = useCallback(async () => {
    setIsSuggesting(true);
    try {
      const suggestions = await geminiService.suggestConnections(nodes, connections);
      setSuggestedConnections(suggestions);
    } catch (error: any) {
      toast({
        title: "Connection Suggestion Failed",
        description: error.message || "Failed to generate connection suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  }, [nodes, connections, toast]);

  return (
    <MobileCanvas>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Restore original header */}
        <header className="py-6 px-4 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-500 animate-pulse-glow">
            Synapse
          </h1>
          <div className="flex gap-4 items-center">
            <Button onClick={handleGenerateInsights} disabled={isGenerating} className="bg-teal-500 hover:bg-teal-600 text-white">
              {isGenerating ? 'Analyzing...' : 'Generate Insights'}
            </Button>
            <Button onClick={handleSuggestConnections} disabled={isSuggesting} className="bg-orange-500 hover:bg-orange-600 text-white">
              {isSuggesting ? 'Suggesting...' : 'Suggest Connections'}
            </Button>
          </div>
        </header>

        {/* Glass-style floating settings and analytics buttons */}
        <div className="fixed top-20 right-4 flex flex-col gap-2 z-40">
          <Button
            onClick={() => setShowAnalytics(!showAnalytics)}
            variant="ghost"
            size="sm"
            className="glass-morphism hover-glow w-12 h-12 p-0"
          >
            <BarChart className="w-5 h-5 text-teal-400" />
          </Button>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="glass-morphism hover-glow w-12 h-12 p-0"
          >
            <Settings className="w-5 h-5 text-orange-400" />
          </Button>
        </div>

        {/* Restore original main layout */}
        <main className="flex flex-col md:flex-row h-[calc(100vh-100px)]">
          <div className="p-4 w-full md:w-3/4 h-full">
            <div
              className="relative w-full h-full bg-slate-900/80 rounded-lg overflow-hidden cursor-crosshair"
              onClick={(e) => handleCreateNode(e.clientX, e.clientY)}
            >
              {/* Nodes */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  className="absolute rounded-full bg-white text-slate-900 shadow-md cursor-pointer hover:scale-110 transition-transform duration-200 ease-out flex items-center justify-center font-medium text-sm"
                  style={{
                    left: node.x - 50,
                    top: node.y - 20,
                    width: 100,
                    height: 40,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeSelect(node);
                  }}
                >
                  {node.content}
                </div>
              ))}

              {/* Connections */}
              {connections.map(conn => {
                const fromNode = nodes.find(node => node.id === conn.fromNodeId);
                const toNode = nodes.find(node => node.id === conn.toNodeId);

                if (!fromNode || !toNode) {
                  return null;
                }

                const strengthColor = `rgba(0, 255, 209, ${conn.strength / 100})`;

                const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
                const startX = fromNode.x + 50 * Math.cos(angle);
                const startY = fromNode.y + 20 * Math.sin(angle);
                const endX = toNode.x - 50 * Math.cos(angle);
                const endY = toNode.y - 20 * Math.sin(angle);

                return (
                  <svg key={conn.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill={strengthColor} />
                      </marker>
                    </defs>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={strengthColor}
                      strokeWidth={3}
                      markerEnd="url(#arrowhead)"
                      className="animate-synapse-flow"
                    />
                  </svg>
                );
              })}

              {/* New Connection In Progress */}
              {newConnection && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <line
                    x1={nodes.find(node => node.id === newConnection.fromNodeId)?.x || 0}
                    y1={nodes.find(node => node.id === newConnection.fromNodeId)?.y || 0}
                    x2={0}
                    y2={0}
                    stroke="rgba(0,255,209,0.5)"
                    strokeWidth={2}
                    strokeDasharray="4"
                  />
                </svg>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Click anywhere to create a new thought.
            </p>
          </div>

          {/* Restore original sidebar */}
          <div className="p-4 w-full md:w-1/4 h-full border-l border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            {selectedNode ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Edit Thought</h2>
                <Textarea
                  value={selectedNode.content}
                  onChange={(e) => handleNodeUpdate(selectedNode.id, e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-md p-2"
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleGenerateSuggestions(selectedNode.id)} disabled={isSuggesting} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    {isSuggesting ? 'Suggesting...' : 'Get Suggestions'}
                  </Button>
                  <Button onClick={() => handleNodeDelete(selectedNode.id)} className="bg-red-500 hover:bg-red-600 text-white">
                    Delete Thought
                  </Button>
                </div>

                <h3 className="text-lg font-medium">Connect to...</h3>
                <div className="space-y-2">
                  {nodes.filter(node => node.id !== selectedNode.id).map(node => (
                    <Button
                      key={node.id}
                      variant="outline"
                      className="w-full justify-start hover:bg-slate-700"
                      onClick={() => handleStartConnection(selectedNode.id)}
                    >
                      {node.content}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-400">
                Select a thought to edit, or click on the canvas to create a new one.
              </div>
            )}
          </div>
        </main>

        {/* Updated Components with glass-morphism */}
        <AnalyticsDashboard 
          data={analyticsData}
          isVisible={showAnalytics}
        />

        <SettingsPanel
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
          onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
          analyticsEnabled={showAnalytics}
        />

        {/* Connection Modal */}
        {newConnection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-lg p-4 w-96 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Connect Thoughts</h2>
              <p className="text-slate-400 mb-2">Adjust connection strength:</p>
              <Slider
                defaultValue={[newConnection.strength]}
                max={100}
                step={10}
                onValueChange={(value) => handleUpdateConnectionStrength(value[0])}
                className="mb-4"
              />
              <div className="flex justify-between">
                <Button onClick={handleCancelConnection} variant="outline">Cancel</Button>
                <Button onClick={() => handleCompleteConnection(selectedNode?.id || '')} disabled={!selectedNode}>
                  Connect to Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Connections Modal */}
        {suggestedConnections.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-lg p-4 w-96 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Suggested Connections</h2>
              <ul className="space-y-2">
                {suggestedConnections.map((suggestion, index) => (
                  <li key={index} className="p-2 rounded-md bg-slate-800 border border-slate-700">
                    <p className="text-sm">
                      Connect <span className="font-medium text-teal-300">"{suggestion.from}"</span> to <span className="font-medium text-orange-300">"{suggestion.to}"</span>
                    </p>
                    <p className="text-xs text-slate-400">Reason: {suggestion.reason}</p>
                    <Button size="sm" className="mt-2 w-full">Connect</Button>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setSuggestedConnections([])} className="mt-4 w-full">Close Suggestions</Button>
            </div>
          </div>
        )}
      </div>
    </MobileCanvas>
  );
};

export default Index;
