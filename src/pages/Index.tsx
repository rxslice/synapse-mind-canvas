
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

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem('synapse-nodes');
      const savedConnections = localStorage.getItem('synapse-connections');
      const savedAIState = localStorage.getItem('synapse-ai-active');
      
      if (savedNodes) {
        const parsedNodes = JSON.parse(savedNodes).map((node: any) => ({
          ...node,
          createdAt: new Date(node.createdAt)
        }));
        setNodes(parsedNodes);
      }
      
      if (savedConnections) {
        const parsedConnections = JSON.parse(savedConnections).map((conn: any) => ({
          ...conn,
          createdAt: new Date(conn.createdAt)
        }));
        setConnections(parsedConnections);
      }

      if (savedAIState) {
        setIsAIActive(JSON.parse(savedAIState));
      }

      // Welcome message after loading
      setTimeout(() => {
        toast("Neural network restored", {
          description: savedNodes ? "Your previous session has been loaded" : "Welcome to your AI-powered second brain",
          duration: 3000,
        });
      }, 500);
    } catch (error) {
      console.error('Error loading saved data:', error);
      toast.error("Failed to load previous session", {
        description: "Starting with a fresh neural network"
      });
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveTimer = setTimeout(() => {
      try {
        localStorage.setItem('synapse-nodes', JSON.stringify(nodes));
        localStorage.setItem('synapse-connections', JSON.stringify(connections));
        localStorage.setItem('synapse-ai-active', JSON.stringify(isAIActive));
        
        if (nodes.length > 0 || connections.length > 0) {
          console.log('Auto-saved:', { nodes: nodes.length, connections: connections.length });
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, connections, isAIActive, autoSaveEnabled]);

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
      "Quick Insight",
      "Sudden Inspiration", 
      "Brain Flash",
      "Eureka Moment",
      "Creative Spark"
    ];
    
    const randomPrompt = thoughtPrompts[Math.floor(Math.random() * thoughtPrompts.length)];
    handleCreateNode(centerX, centerY, randomPrompt);
  }, [handleCreateNode]);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('synapse-nodes', JSON.stringify(nodes));
      localStorage.setItem('synapse-connections', JSON.stringify(connections));
      localStorage.setItem('synapse-ai-active', JSON.stringify(isAIActive));
      
      toast.success("Neural network crystallized", { 
        description: `Saved ${nodes.length} thoughts and ${connections.length} synapses`,
        duration: 3000
      });
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Crystallization failed", {
        description: "Unable to save your neural network"
      });
    }
  }, [nodes, connections, isAIActive]);

  const handleUpdateNode = useCallback((updatedNode: Node) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    setSelectedNode(updatedNode);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    ));
    setSelectedNode(null);
    
    toast("Thought dissolved", { 
      description: `"${nodeToDelete?.content || 'Node'}" and its connections have been removed`,
      duration: 2000
    });
  }, [nodes]);

  const handleCreateConnection = useCallback((fromNodeId: string, toNodeId: string) => {
    // Prevent self-connections
    if (fromNodeId === toNodeId) {
      toast.error("Self-reflection detected", {
        description: "Nodes cannot connect to themselves"
      });
      return;
    }

    // Check for existing connection
    const existingConnection = connections.find(conn => 
      (conn.fromNodeId === fromNodeId && conn.toNodeId === toNodeId) ||
      (conn.fromNodeId === toNodeId && conn.toNodeId === fromNodeId)
    );

    if (existingConnection) {
      toast.error("Synapse already exists", {
        description: "These thoughts are already connected"
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
    
    const fromNode = nodes.find(n => n.id === fromNodeId);
    const toNode = nodes.find(n => n.id === toNodeId);
    
    toast.success("Neural pathway formed!", { 
      description: `Connected "${fromNode?.content}" to "${toNode?.content}"`,
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
        description: "Pattern analysis paused"
      });
    }
  }, [isAIActive]);

  const handleAISuggestion = useCallback((suggestion: string) => {
    toast("Neural insight received", { 
      description: suggestion,
      duration: 5000
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B3D3D] relative overflow-hidden">
      {/* Enhanced ambient background effects */}
      <div className="absolute inset-0 opacity-15">
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
