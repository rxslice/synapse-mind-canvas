
import { useRef, useEffect, useState, useCallback } from "react";
import { Node, Connection, CanvasState } from "@/types/canvas";
import { NodeComponent } from "./NodeComponent";
import { ConnectionComponent } from "./ConnectionComponent";

interface CanvasProps {
  nodes: Node[];
  connections: Connection[];
  onCreateNode: (x: number, y: number) => void;
  onSelectNode: (node: Node | null) => void;
  onUpdateNode: (node: Node) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateConnection: (fromNodeId: string, toNodeId: string) => void;
  selectedNode: Node | null;
}

export const Canvas = ({
  nodes,
  connections,
  onCreateNode,
  onSelectNode,
  onUpdateNode,
  onDeleteNode,
  onCreateConnection,
  selectedNode,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
  });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showCreateHint, setShowCreateHint] = useState(false);
  const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingFrom(null);
        onSelectNode(null);
      }
      if (e.key === 'Delete' && selectedNode) {
        onDeleteNode(selectedNode.id);
      }
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        const centerX = (window.innerWidth / 2 - canvasState.panX) / canvasState.zoom;
        const centerY = (window.innerHeight / 2 - canvasState.panY) / canvasState.zoom;
        onCreateNode(centerX, centerY);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedNode, onDeleteNode, onSelectNode, onCreateNode, canvasState]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setCanvasState(prev => {
      const newZoom = Math.max(0.1, Math.min(3, prev.zoom - e.deltaY * 0.001));
      const zoomRatio = newZoom / prev.zoom;
      
      return {
        zoom: newZoom,
        panX: mouseX - (mouseX - prev.panX) * zoomRatio,
        panY: mouseY - (mouseY - prev.panY) * zoomRatio,
      };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if we're clicking on a node or its content
    const nodeElement = target.closest('.synapse-node');
    const isNodeInteraction = nodeElement || target.closest('.node-content') || target.closest('button') || target.closest('textarea');
    
    if (!isNodeInteraction && e.target === canvasRef.current) {
      // Start canvas dragging with a small delay to differentiate from clicks
      const timeout = setTimeout(() => {
        setIsDraggingCanvas(true);
        setDragStart({ 
          x: e.clientX, 
          y: e.clientY,
          panX: canvasState.panX,
          panY: canvasState.panY
        });
      }, 100);
      
      setDragTimeout(timeout);
      onSelectNode(null);
      setConnectingFrom(null);
    }
  }, [canvasState.panX, canvasState.panY, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDraggingCanvas) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setCanvasState(prev => ({
        ...prev,
        panX: dragStart.panX + deltaX,
        panY: dragStart.panY + deltaY,
      }));
    }
  }, [isDraggingCanvas, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      setDragTimeout(null);
    }
    setIsDraggingCanvas(false);
  }, [dragTimeout]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom;
      const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom;
      onCreateNode(x, y);
      setShowCreateHint(true);
      setTimeout(() => setShowCreateHint(false), 2000);
    }
  }, [canvasState.panX, canvasState.panY, canvasState.zoom, onCreateNode]);

  const handleNodeConnect = useCallback((nodeId: string) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      onCreateConnection(connectingFrom, nodeId);
      setConnectingFrom(null);
    } else {
      setConnectingFrom(nodeId);
    }
  }, [connectingFrom, onCreateConnection]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDraggingCanvas(false);
    setConnectingFrom(null);
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      setDragTimeout(null);
    }
  }, [dragTimeout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Global mouse events for smooth dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingCanvas) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        setCanvasState(prev => ({
          ...prev,
          panX: dragStart.panX + deltaX,
          panY: dragStart.panY + deltaY,
        }));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingCanvas(false);
      if (dragTimeout) {
        clearTimeout(dragTimeout);
        setDragTimeout(null);
      }
    };

    if (isDraggingCanvas) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDraggingCanvas, dragStart, dragTimeout]);

  const networkDensity = nodes.length > 0 ? (connections.length / Math.max(nodes.length - 1, 1)) * 100 : 0;

  return (
    <div
      ref={canvasRef}
      className={`w-full h-screen relative overflow-hidden select-none ${
        isDraggingCanvas ? 'cursor-grabbing' : connectingFrom ? 'cursor-crosshair' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: `
          radial-gradient(circle at 15% 45%, rgba(0, 255, 209, ${isHovering ? '0.15' : '0.10'}) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(232, 161, 53, ${isHovering ? '0.10' : '0.06'}) 0%, transparent 50%),
          radial-gradient(circle at 35% 85%, rgba(255, 0, 255, ${isHovering ? '0.08' : '0.05'}) 0%, transparent 50%),
          linear-gradient(135deg, #0B3D3D 0%, #083838 25%, #0A3A3A 50%, #083838 75%, #0B3D3D 100%)
        `,
        transition: 'background 0.3s ease',
      }}
    >
      {/* Enhanced grid with better visibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: isHovering ? 0.2 : 0.12,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 209, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 209, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: `${50 * canvasState.zoom}px ${50 * canvasState.zoom}px`,
          transform: `translate(${canvasState.panX % (50 * canvasState.zoom)}px, ${canvasState.panY % (50 * canvasState.zoom)}px)`,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Canvas content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Render connections first (behind nodes) */}
        {connections.map(connection => (
          <ConnectionComponent
            key={connection.id}
            connection={connection}
            fromNode={nodes.find(n => n.id === connection.fromNodeId)}
            toNode={nodes.find(n => n.id === connection.toNodeId)}
          />
        ))}

        {/* Render nodes */}
        {nodes.map(node => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            isConnecting={connectingFrom === node.id}
            onSelect={() => onSelectNode(node)}
            onUpdate={onUpdateNode}
            onDelete={() => onDeleteNode(node.id)}
            onConnect={() => handleNodeConnect(node.id)}
          />
        ))}
      </div>

      {/* Enhanced welcome state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative text-center max-w-2xl mx-auto px-8">
            {/* Main branding */}
            <div className="mb-16">
              <div className="text-9xl font-extralight mb-6 bg-gradient-to-r from-[#00FFD1] via-[#E8A135] to-[#00FFD1] bg-clip-text text-transparent animate-pulse">
                Synapse
              </div>
              <div className="text-2xl font-light text-[#F0F0F0]/80 tracking-wider mb-4">
                Your AI-Powered Second Brain
              </div>
              <div className="text-lg text-[#F0F0F0]/60 max-w-md mx-auto leading-relaxed">
                Capture thoughts, connect ideas, and discover insights through neural networks
              </div>
            </div>

            {/* Instructions with better hierarchy */}
            <div className="mt-12 space-y-6">
              <div className="text-base text-[#F0F0F0]/70 font-medium">
                Ready to expand your mind?
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#F0F0F0]/60">
                <div className="bg-[#00FFD1]/10 rounded-xl p-4 border border-[#00FFD1]/20">
                  <div className="text-[#00FFD1] font-medium mb-2">Create</div>
                  <div>Double-click anywhere or press Space</div>
                </div>
                <div className="bg-[#E8A135]/10 rounded-xl p-4 border border-[#E8A135]/20">
                  <div className="text-[#E8A135] font-medium mb-2">Navigate</div>
                  <div>Drag to pan, scroll to zoom</div>
                </div>
                <div className="bg-[#9945FF]/10 rounded-xl p-4 border border-[#9945FF]/20">
                  <div className="text-[#9945FF] font-medium mb-2">Connect</div>
                  <div>Click link icon to connect thoughts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection preview line with better styling */}
      {connectingFrom && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
          <defs>
            <linearGradient id="connection-preview" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8A135" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00FFD1" stopOpacity="0.9" />
            </linearGradient>
            <filter id="connectionGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <line
            x1={(nodes.find(n => n.id === connectingFrom)?.x || 0) + 100}
            y1={(nodes.find(n => n.id === connectingFrom)?.y || 0) + 60}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="url(#connection-preview)"
            strokeWidth="3"
            strokeDasharray="8,6"
            opacity="0.9"
            strokeLinecap="round"
            filter="url(#connectionGlow)"
            className="animate-pulse"
          />
          
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="6"
            fill="#00FFD1"
            opacity="0.9"
            filter="url(#connectionGlow)"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Create hint notification */}
      {showCreateHint && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <div className="bg-[#00FFD1]/20 backdrop-blur-sm border border-[#00FFD1]/40 rounded-xl px-6 py-3 text-[#00FFD1] font-medium animate-fade-in">
            ✨ Thought captured! Click to edit or connect ideas
          </div>
        </div>
      )}

      {/* Network stats overlay */}
      {nodes.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-[#0B3D3D]/80 backdrop-blur-sm border border-[#00FFD1]/20 rounded-xl px-4 py-2 text-sm text-[#F0F0F0]/70 pointer-events-none">
          <div className="flex items-center gap-4">
            <span>{nodes.length} thoughts</span>
            <span>{connections.length} synapses</span>
            <span>{Math.round(networkDensity)}% density</span>
          </div>
        </div>
      )}
    </div>
  );
};
