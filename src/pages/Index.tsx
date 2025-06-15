
import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Welcome message
    toast("Welcome to Synapse", {
      description: "Your AI-powered second brain is ready to capture your thoughts",
      duration: 3000,
    });
  }, []);

  const handleCreateNode = (x: number, y: number, content: string = "New Thought") => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
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
    toast.success("Thought created", { description: "Your new idea has been captured" });
  };

  const handleQuickCreate = () => {
    // Create a node at center of viewport
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 60;
    handleCreateNode(centerX, centerY, "Quick Thought");
  };

  const handleSave = () => {
    // Simulate save functionality
    localStorage.setItem('synapse-nodes', JSON.stringify(nodes));
    localStorage.setItem('synapse-connections', JSON.stringify(connections));
    toast.success("Progress saved", { description: "Your neural network has been preserved" });
  };

  const handleUpdateNode = (updatedNode: Node) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    setSelectedNode(updatedNode);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    ));
    setSelectedNode(null);
    toast("Thought deleted", { description: "Node and its connections removed" });
  };

  const handleCreateConnection = (fromNodeId: string, toNodeId: string) => {
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      fromNodeId,
      toNodeId,
      type: "synapse",
      strength: 0.8,
      createdAt: new Date(),
    };
    setConnections(prev => [...prev, newConnection]);
    toast.success("Synapse formed!", { description: "Neural pathway established between thoughts" });
  };

  const handleToggleAI = () => {
    setIsAIActive(!isAIActive);
    if (!isAIActive) {
      toast("AI Brain activated", { 
        description: "Your second brain is now analyzing patterns and generating insights" 
      });
    } else {
      toast("AI Brain deactivated", { 
        description: "AI processing paused" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B3D3D] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFD1] rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8A135] rounded-full blur-[100px] animate-pulse delay-1000"></div>
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
          onSuggestion={(suggestion) => {
            toast("AI Insight", { description: suggestion });
          }}
          onClose={() => setIsAIActive(false)}
        />
      )}
    </div>
  );
};

export default Index;
