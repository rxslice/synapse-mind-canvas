
import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { NodeInspector } from "@/components/NodeInspector";
import { AIInsights } from "@/components/AIInsights";
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

  // Load saved data on mount with better error handling
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        setIsLoading(true);
        
        const savedNodes = localStorage.getItem('synapse-nodes');
        const savedConnections = localStorage.getItem('synapse-connections');
        const savedAIState = localStorage.getItem('synapse-ai-active');
        
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

        // Welcome message after loading
        setTimeout(() => {
          if (savedNodes && JSON.parse(savedNodes).length > 0) {
            toast.success("Neural network restored", {
              description: `Loaded ${JSON.parse(savedNodes).length} thoughts and ${savedConnections ? JSON.parse(savedConnections).length : 0} connections`,
              duration: 3000,
            });
          } else {
            toast("Welcome to Synapse", {
              description: "Your AI-powered second brain is ready to capture your thoughts",
              duration: 4000,
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

  // Enhanced auto-save with error recovery
  useEffect(() => {
    if (!autoSaveEnabled || isLoading) return;

    const autoSaveTimer = setTimeout(() => {
      try {
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
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        toast.error("Auto-save failed", {
          description: "Your work might not be saved. Try manually saving.",
          duration: 5000
        });
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, connections, isAIActive, autoSaveEnabled, isLoading]);

  // Track user activity
  useEffect(() => {
    setLastActivity(new Date());
  }, [nodes, connections, selectedNode]);

  const handleCreateNode = useCallback((x: number, y: number, content: string = "New Thought") => {
    const newNode: Node = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width: 200,
      height: 120,
      content,
      type: "thought",
      color: "#00FFD1",
      createdAt: new Date(),
    };
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    
    toast.success("Thought crystallized", { 
      description: "Your new idea has been captured in the neural network",
      duration: 2000
    });
  }, []);

  const handleQuickCreate = useCallback(() => {
    // Create node at center with slight randomization to avoid overlap
    const centerX = (window.innerWidth / 2 - 100) + (Math.random() - 0.5) * 100;
    const centerY = (window.innerHeight / 2 - 60) + (Math.random() - 0.5) * 100;
    
    const thoughtPrompts = [
      "Brilliant Insight",
      "Creative Spark", 
      "Eureka Moment",
      "Deep Thought",
      "Innovation Seed",
      "Mind Flash",
      "Breakthrough Idea"
    ];
    
    const randomPrompt = thoughtPrompts[Math.floor(Math.random() * thoughtPrompts.length)];
    handleCreateNode(centerX, centerY, randomPrompt);
  }, [handleCreateNode]);

  const handleSave = useCallback(() => {
    try {
      const nodeData = JSON.stringify(nodes);
      const connectionData = JSON.stringify(connections);
      const aiStateData = JSON.stringify(isAIActive);
      
      localStorage.setItem('synapse-nodes', nodeData);
      localStorage.setItem('synapse-connections', connectionData);
      localStorage.setItem('synapse-ai-active', aiStateData);
      
      toast.success("Neural network crystallized", { 
        description: `Saved ${nodes.length} thoughts and ${connections.length} synapses`,
        duration: 3000
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Crystallization failed", {
        description: "Unable to save your neural network. Check your storage space.",
        duration: 5000
      });
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
    
    toast("Thought dissolved", { 
      description: `"${nodeToDelete?.content || 'Node'}" and ${affectedConnections.length} connection(s) removed`,
      duration: 3000
    });
  }, [nodes, connections, selectedNode]);

  const handleCreateConnection = useCallback((fromNodeId: string, toNodeId: string) => {
    // Prevent self-connections
    if (fromNodeId === toNodeId) {
      toast.error("Self-reflection detected", {
        description: "Nodes cannot connect to themselves - try connecting different thoughts",
        duration: 3000
      });
      return;
    }

    // Check for existing connection (bidirectional)
    const existingConnection = connections.find(conn => 
      (conn.fromNodeId === fromNodeId && conn.toNodeId === toNodeId) ||
      (conn.fromNodeId === toNodeId && conn.toNodeId === fromNodeId)
    );

    if (existingConnection) {
      toast.error("Synapse already exists", {
        description: "These thoughts are already connected through the neural pathway",
        duration: 3000
      });
      return;
    }

    const fromNode = nodes.find(n => n.id === fromNodeId);
    const toNode = nodes.find(n => n.id === toNodeId);
    
    if (!fromNode || !toNode) {
      toast.error("Connection failed", {
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
      strength: 0.7 + Math.random() * 0.3, // Random strength between 0.7-1.0
      createdAt: new Date(),
    };
    
    setConnections(prev => [...prev, newConnection]);
    
    toast.success("Neural pathway formed!", { 
      description: `Connected "${fromNode.content}" ↔ "${toNode.content}"`,
      duration: 3000
    });
  }, [connections, nodes]);

  const handleToggleAI = useCallback(() => {
    const newState = !isAIActive;
    setIsAIActive(newState);
    
    if (newState) {
      toast("AI consciousness activated", { 
        description: "Your second brain is now analyzing patterns and generating insights",
        duration: 3000
      });
    } else {
      toast("AI consciousness dormant", { 
        description: "Pattern analysis paused - reactivate when ready for insights",
        duration: 2000
      });
    }
  }, [isAIActive]);

  const handleAISuggestion = useCallback((suggestion: string) => {
    toast("🧠 Neural insight received", { 
      description: suggestion,
      duration: 6000
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B3D3D] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-extralight mb-4 bg-gradient-to-r from-[#00FFD1] to-[#E8A135] bg-clip-text text-transparent animate-pulse">
            Synapse
          </div>
          <div className="text-lg text-[#F0F0F0]/70">Initializing neural network...</div>
        </div>
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
    </div>
  );
};

export default Index;
