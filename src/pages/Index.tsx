import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { NodeInspector } from "@/components/NodeInspector";
import { AIInsights } from "@/components/AIInsights";
import { Tutorial } from "@/components/Tutorial";
import { SessionManager } from "@/components/SessionManager";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { InsightNotification } from "@/components/InsightNotification";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { Settings, BarChart } from "lucide-react";
import { Node, Connection } from "@/types/canvas";
import { toast } from "sonner";

const Index = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAIActive, setIsAIActive] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showInsightNotification, setShowInsightNotification] = useState(false);
  const [lastInsightCheck, setLastInsightCheck] = useState<Date>(new Date());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [appSettings, setAppSettings] = useState({
    autoSave: true,
    aiEnabled: true,
    darkMode: true,
    animationsEnabled: true,
    soundEnabled: false,
    autoSaveInterval: 30,
    networkHealth: true,
    notifications: true,
    theme: 'neural'
  });

  // Load saved data on mount with better error handling
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        setIsLoading(true);
        
        const savedNodes = localStorage.getItem('synapse-nodes');
        const savedConnections = localStorage.getItem('synapse-connections');
        const savedAIState = localStorage.getItem('synapse-ai-active');
        const hasSeenTutorial = localStorage.getItem('synapse-tutorial-completed');
        const lastInsight = localStorage.getItem('synapse-last-insight-check');
        
        if (savedNodes) {
          const parsedNodes = JSON.parse(savedNodes).map((node: any) => ({
            ...node,
            createdAt: new Date(node.createdAt),
            updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined
          }));
          setNodes(parsedNodes);
        }
        
        if (savedConnections) {
          const parsedConnections = JSON.parse(savedConnections).map((conn: any) => ({
            ...conn,
            createdAt: new Date(conn.createdAt),
            updatedAt: conn.updatedAt ? new Date(conn.updatedAt) : undefined
          }));
          setConnections(parsedConnections);
        }

        if (savedAIState) {
          setIsAIActive(JSON.parse(savedAIState));
        }

        if (lastInsight) {
          setLastInsightCheck(new Date(lastInsight));
        }

        // Show startup screen configuration if no saved data
        if (!hasSeenTutorial && !savedNodes) {
          setIsFirstVisit(true);
          setShowTutorial(true);
        }

        setTimeout(() => {
          if (savedNodes && JSON.parse(savedNodes).length > 0) {
            toast.success("Neural network restored", {
              description: `Loaded ${JSON.parse(savedNodes).length} thoughts and ${savedConnections ? JSON.parse(savedConnections).length : 0} connections`,
              duration: 3000,
            });
          } else if (!hasSeenTutorial) {
            toast("Welcome to Synapse", {
              description: "Your AI-Powered Second Brain - Ready to expand your mind?",
              duration: 6000,
            });
          }
        }, 500);
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast.error("Failed to restore previous session", {
          description: "Starting fresh with a new neural network",
          duration: 4000
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Enhanced auto-save with visual feedback
  useEffect(() => {
    if (!autoSaveEnabled || isLoading) return;

    const autoSaveTimer = setTimeout(() => {
      try {
        setIsAutoSaving(true);
        const nodeData = JSON.stringify(nodes);
        const connectionData = JSON.stringify(connections);
        const aiStateData = JSON.stringify(isAIActive);
        
        localStorage.setItem('synapse-nodes', nodeData);
        localStorage.setItem('synapse-connections', connectionData);
        localStorage.setItem('synapse-ai-active', aiStateData);
        
        if (nodes.length > 0 || connections.length > 0) {
          console.log('✅ Auto-saved neural network:', { 
            nodes: nodes.length, 
            connections: connections.length,
            timestamp: new Date().toISOString()
          });
        }
        
        setTimeout(() => setIsAutoSaving(false), 1000);
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        toast.error("Auto-save failed", {
          description: "Your work might not be saved. Try manually saving.",
          duration: 5000
        });
        setIsAutoSaving(false);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, connections, isAIActive, autoSaveEnabled, isLoading]);

  // Calculate network health based on connections and node activity
  useEffect(() => {
    if (nodes.length === 0) {
      setNetworkHealth(100);
      return;
    }

    const connectionRatio = connections.length / Math.max(nodes.length, 1);
    const recentActivity = nodes.filter(node => {
      const timeSince = new Date().getTime() - node.createdAt.getTime();
      return timeSince < 24 * 60 * 60 * 1000; // 24 hours
    }).length;
    
    const activityScore = (recentActivity / nodes.length) * 100;
    const connectionScore = Math.min(connectionRatio * 50, 100);
    const health = Math.round((activityScore + connectionScore) / 2);
    
    setNetworkHealth(Math.max(health, 20)); // Minimum 20% health
  }, [nodes, connections]);

  // Insight notification system - check twice daily
  useEffect(() => {
    const checkForInsights = () => {
      const now = new Date();
      const timeSinceLastCheck = now.getTime() - lastInsightCheck.getTime();
      const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
      
      // Check if enough time has passed and we have sufficient thoughts for insights
      if (timeSinceLastCheck > twelveHours && nodes.length >= 5 && nodes.length >= 3) {
        // Check if a new thought was added recently (within last hour)
        const oneHourAgo = now.getTime() - (60 * 60 * 1000);
        const hasRecentThought = nodes.some(node => 
          node.createdAt.getTime() > oneHourAgo || 
          (node.updatedAt && node.updatedAt.getTime() > oneHourAgo)
        );
        
        if (hasRecentThought) {
          setShowInsightNotification(true);
          setLastInsightCheck(now);
          localStorage.setItem('synapse-last-insight-check', now.toISOString());
        }
      }
    };

    // Check immediately and then every hour
    checkForInsights();
    const insightTimer = setInterval(checkForInsights, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(insightTimer);
  }, [nodes, lastInsightCheck]);

  // Track user activity
  useEffect(() => {
    setLastActivity(new Date());
  }, [nodes, connections, selectedNode]);

  const handleCreateNode = useCallback((x: number, y: number, content: string = "New Thought") => {
    const thoughtTypes = ["thought", "idea", "insight", "concept", "inspiration"];
    const nodeColors = ["#00FFD1", "#E8A135", "#9945FF", "#FF6B6B", "#4ECDC4"];
    
    const newNode: Node = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width: 200,
      height: 120,
      content,
      type: "thought",
      color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
      createdAt: new Date(),
    };
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    
    // Enhanced success feedback
    toast.success("💡 Thought crystallized", { 
      description: "Your new idea has been captured in the neural network",
      duration: 2000
    });
  }, []);

  const handleQuickCreate = useCallback(() => {
    const centerX = (window.innerWidth / 2 - 100) + (Math.random() - 0.5) * 100;
    const centerY = (window.innerHeight / 2 - 60) + (Math.random() - 0.5) * 100;
    
    const thoughtPrompts = [
      "🧠 Brilliant Insight",
      "⚡ Creative Spark", 
      "💡 Eureka Moment",
      "🎯 Deep Thought",
      "🌱 Innovation Seed",
      "✨ Mind Flash",
      "🚀 Breakthrough Idea",
      "🔮 Vision Quest",
      "🎨 Creative Flow",
      "🧩 Missing Piece"
    ];
    
    const randomPrompt = thoughtPrompts[Math.floor(Math.random() * thoughtPrompts.length)];
    handleCreateNode(centerX, centerY, randomPrompt);
  }, [handleCreateNode]);

  const handleSave = useCallback(() => {
    try {
      setIsAutoSaving(true);
      const nodeData = JSON.stringify(nodes);
      const connectionData = JSON.stringify(connections);
      const aiStateData = JSON.stringify(isAIActive);
      
      localStorage.setItem('synapse-nodes', nodeData);
      localStorage.setItem('synapse-connections', connectionData);
      localStorage.setItem('synapse-ai-active', aiStateData);
      
      toast.success("🧠 Neural network crystallized", { 
        description: `Saved ${nodes.length} thoughts and ${connections.length} synapses`,
        duration: 3000
      });
      
      setTimeout(() => setIsAutoSaving(false), 1000);
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("❌ Crystallization failed", {
        description: "Unable to save your neural network. Check your storage space.",
        duration: 5000
      });
      setIsAutoSaving(false);
    }
  }, [nodes, connections, isAIActive]);

  const handleUpdateNode = useCallback((updatedNode: Node) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id 
        ? { ...updatedNode, updatedAt: new Date() }
        : node
    ));
    setSelectedNode(updatedNode);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    const affectedConnections = connections.filter(conn => 
      conn.fromNodeId === nodeId || conn.toNodeId === nodeId
    );
    
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    ));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    
    toast("🗑️ Thought dissolved", { 
      description: `"${nodeToDelete?.content || 'Node'}" and ${affectedConnections.length} connection(s) removed`,
      duration: 3000
    });
  }, [nodes, connections, selectedNode]);

  const handleCreateConnection = useCallback((fromNodeId: string, toNodeId: string) => {
    if (fromNodeId === toNodeId) {
      toast.error("🔄 Self-reflection detected", {
        description: "Nodes cannot connect to themselves - try connecting different thoughts",
        duration: 3000
      });
      return;
    }

    const existingConnection = connections.find(conn => 
      (conn.fromNodeId === fromNodeId && conn.toNodeId === toNodeId) ||
      (conn.fromNodeId === toNodeId && conn.toNodeId === fromNodeId)
    );

    if (existingConnection) {
      toast.error("🔗 Synapse already exists", {
        description: "These thoughts are already connected through the neural pathway",
        duration: 3000
      });
      return;
    }

    const fromNode = nodes.find(n => n.id === fromNodeId);
    const toNode = nodes.find(n => n.id === toNodeId);
    
    if (!fromNode || !toNode) {
      toast.error("❌ Connection failed", {
        description: "One or both nodes no longer exist",
        duration: 3000
      });
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromNodeId,
      toNodeId,
      type: "synapse",
      strength: 0.7 + Math.random() * 0.3,
      createdAt: new Date(),
    };
    
    setConnections(prev => [...prev, newConnection]);
    
    toast.success("⚡ Neural pathway formed!", { 
      description: `Connected "${fromNode.content}" ↔ "${toNode.content}"`,
      duration: 3000
    });
  }, [connections, nodes]);

  const handleAISuggestion = useCallback((suggestion: string) => {
    console.log('🤖 AI Suggestion received:', suggestion);
    toast("🧠 AI Neural Insight", { 
      description: suggestion,
      duration: 8000
    });
  }, []);

  const handleToggleAI = useCallback(() => {
    const newState = !isAIActive;
    setIsAIActive(newState);
    
    if (newState) {
      if (nodes.length === 0) {
        toast("🤖 AI consciousness activated", { 
          description: "Create some thoughts first, then AI will analyze your neural network",
          duration: 4000
        });
      } else {
        toast("🤖 AI consciousness activated", { 
          description: "Your second brain is now analyzing patterns with real AI intelligence",
          duration: 4000
        });
      }
    } else {
      toast("😴 AI consciousness dormant", { 
        description: "Real AI analysis paused - reactivate when ready for insights",
        duration: 2000
      });
    }
  }, [isAIActive, nodes.length]);

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('synapse-tutorial-completed', 'true');
    
    if (isFirstVisit) {
      toast.success("🎉 Welcome to your neural network!", {
        description: "You're ready to start capturing and connecting your thoughts",
        duration: 4000
      });
    }
  }, [isFirstVisit]);

  const handleTutorialSkip = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('synapse-tutorial-completed', 'true');
  }, []);

  const handleNewSession = useCallback(() => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
    setIsAIActive(false);
    
    localStorage.removeItem('synapse-nodes');
    localStorage.removeItem('synapse-connections');
    localStorage.removeItem('synapse-ai-active');
  }, []);

  const handleLoadSession = useCallback((loadedNodes: Node[], loadedConnections: Connection[]) => {
    setNodes(loadedNodes);
    setConnections(loadedConnections);
    setSelectedNode(null);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      handleDeleteNode(selectedNode.id);
    }
  }, [selectedNode, handleDeleteNode]);

  const handleViewInsights = useCallback(() => {
    setIsAIActive(true);
    setShowInsightNotification(false);
  }, []);

  const handleSettingChange = useCallback((key: string, value: any) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply specific setting changes
    if (key === 'autoSave') {
      setAutoSaveEnabled(value);
    }
    if (key === 'aiEnabled' && !value) {
      setIsAIActive(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B3D3D] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-extralight mb-4 bg-gradient-to-r from-[#00FFD1] to-[#E8A135] bg-clip-text text-transparent animate-pulse-glow">
            Synapse
          </div>
          <div className="text-lg text-[#F0F0F0]/70 mb-4">Initializing neural network...</div>
          <div className="w-16 h-16 border-4 border-[#00FFD1]/30 border-t-[#00FFD1] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Enhanced startup configuration screen
  if (isFirstVisit && !showTutorial && nodes.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B3D3D] relative overflow-hidden flex items-center justify-center">
        {/* Enhanced ambient background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFD1] rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8A135] rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-[#9945FF] rounded-full blur-[100px] animate-pulse delay-2000"></div>
        </div>

        <div className="text-center relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-8xl font-extralight mb-6 bg-gradient-to-r from-[#00FFD1] via-[#E8A135] to-[#00FFD1] bg-clip-text text-transparent animate-pulse-glow">
            Synapse
          </div>
          <div className="text-2xl text-[#F0F0F0]/80 mb-4 font-light">Your AI-Powered Second Brain</div>
          <div className="text-lg text-[#F0F0F0]/60 mb-12 leading-relaxed">
            Capture thoughts, connect ideas, and discover<br />
            insights through neural networks
          </div>
          
          <div className="text-lg text-[#F0F0F0]/70 mb-8">Ready to expand your mind?</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-[#00FFD1]/20 to-[#00FFD1]/5 rounded-2xl p-6 border border-[#00FFD1]/30 hover:scale-105 transition-all duration-300">
              <h3 className="text-[#00FFD1] font-semibold mb-2">💡 Create</h3>
              <p className="text-[#F0F0F0]/70 text-sm mb-3">Double-click anywhere or press Space</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#E8A135]/20 to-[#E8A135]/5 rounded-2xl p-6 border border-[#E8A135]/30 hover:scale-105 transition-all duration-300">
              <h3 className="text-[#E8A135] font-semibold mb-2">🧭 Navigate</h3>
              <p className="text-[#F0F0F0]/70 text-sm mb-3">Drag to pan, scroll to zoom</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/5 rounded-2xl p-6 border border-[#9945FF]/30 hover:scale-105 transition-all duration-300">
              <h3 className="text-[#9945FF] font-semibold mb-2">🔗 Connect</h3>
              <p className="text-[#F0F0F0]/70 text-sm mb-3">Click link icon to connect thoughts</p>
            </div>
          </div>

          <Button
            onClick={handleQuickCreate}
            className="bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_32px_rgba(0,255,209,0.5)] text-lg px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300"
          >
            🚀 Start Your Neural Journey
          </Button>
        </div>

        {/* Floating Action Icons - Upper Right Corner */}
        <div className="fixed top-4 right-4 z-40 flex flex-col gap-3">
          <Button
            onClick={() => setShowSettingsPanel(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B3D3D]/90 to-[#083838]/80 backdrop-blur-xl border border-[#00FFD1]/40 text-[#00FFD1] hover:shadow-[0_0_20px_rgba(0,255,209,0.3)] hover:scale-110 transition-all duration-300 p-0"
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={() => setShowAnalyticsDashboard(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B3D3D]/90 to-[#083838]/80 backdrop-blur-xl border border-[#E8A135]/40 text-[#E8A135] hover:shadow-[0_0_20px_rgba(232,161,53,0.3)] hover:scale-110 transition-all duration-300 p-0"
          >
            <BarChart className="w-5 h-5" />
          </Button>
        </div>

        <Toolbar
          onToggleAI={handleToggleAI}
          isAIActive={isAIActive}
          nodeCount={nodes.length}
          connectionCount={connections.length}
          onQuickCreate={handleQuickCreate}
          onSave={handleSave}
          onShowTutorial={() => setShowTutorial(true)}
          onShowSessionManager={() => setShowSessionManager(true)}
          networkHealth={networkHealth}
          isAutoSaving={isAutoSaving}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D3D] relative overflow-hidden">
      {/* Enhanced ambient background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFD1] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8A135] rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-[#9945FF] rounded-full blur-[100px] animate-pulse delay-2000"></div>
      </div>

      {/* Auto-save indicator */}
      {isAutoSaving && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#00FFD1]/20 to-[#00FFD1]/10 border border-[#00FFD1]/40 rounded-lg px-3 py-2 text-[#00FFD1] text-sm font-medium">
          💾 Auto-saving...
        </div>
      )}

      {/* Floating Action Icons - Upper Right Corner */}
      <div className="fixed top-4 right-4 z-40 flex flex-col gap-3">
        <Button
          onClick={() => setShowSettingsPanel(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B3D3D]/90 to-[#083838]/80 backdrop-blur-xl border border-[#00FFD1]/40 text-[#00FFD1] hover:shadow-[0_0_20px_rgba(0,255,209,0.3)] hover:scale-110 transition-all duration-300 p-0"
        >
          <Settings className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => setShowAnalyticsDashboard(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B3D3D]/90 to-[#083838]/80 backdrop-blur-xl border border-[#E8A135]/40 text-[#E8A135] hover:shadow-[0_0_20px_rgba(232,161,53,0.3)] hover:scale-110 transition-all duration-300 p-0"
        >
          <BarChart className="w-5 h-5" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts
        onQuickCreate={handleQuickCreate}
        onSave={handleSave}
        onToggleAI={handleToggleAI}
        onShowTutorial={() => setShowTutorial(true)}
        onShowSessionManager={() => setShowSessionManager(true)}
        selectedNode={selectedNode}
        onDeleteSelected={handleDeleteSelected}
      />

      <Canvas
        nodes={nodes}
        connections={connections}
        onCreateNode={handleCreateNode}
        onSelectNode={setSelectedNode}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
        onCreateConnection={handleCreateConnection}
        selectedNode={selectedNode}
      />

      <Toolbar
        onToggleAI={handleToggleAI}
        isAIActive={isAIActive}
        nodeCount={nodes.length}
        connectionCount={connections.length}
        onQuickCreate={handleQuickCreate}
        onSave={handleSave}
        onShowTutorial={() => setShowTutorial(true)}
        onShowSessionManager={() => setShowSessionManager(true)}
        networkHealth={networkHealth}
        isAutoSaving={isAutoSaving}
      />

      {selectedNode && (
        <NodeInspector
          node={selectedNode}
          onUpdate={handleUpdateNode}
          onDelete={() => handleDeleteNode(selectedNode.id)}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {isAIActive && (
        <AIInsights
          nodes={nodes}
          connections={connections}
          onSuggestion={handleAISuggestion}
          onClose={() => setIsAIActive(false)}
        />
      )}

      <InsightNotification
        isVisible={showInsightNotification}
        onDismiss={() => setShowInsightNotification(false)}
        onViewInsights={handleViewInsights}
        thoughtCount={nodes.length}
      />

      <Tutorial
        isVisible={showTutorial}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />

      <SessionManager
        nodes={nodes}
        connections={connections}
        onNewSession={handleNewSession}
        onLoadSession={handleLoadSession}
        isOpen={showSessionManager}
        onClose={() => setShowSessionManager(false)}
      />

      <SettingsPanel
        isOpen={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
        onSettingChange={handleSettingChange}
      />

      <AnalyticsDashboard
        nodes={nodes}
        connections={connections}
        isOpen={showAnalyticsDashboard}
        onClose={() => setShowAnalyticsDashboard(false)}
        networkHealth={networkHealth}
      />
    </div>
  );
};

export default Index;
