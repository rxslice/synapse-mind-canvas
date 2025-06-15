
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

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
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX, 
        y: e.clientY,
        panX: canvasState.panX,
        panY: canvasState.panY
      });
      onSelectNode(null);
    }
  }, [canvasState.panX, canvasState.panY, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setCanvasState(prev => ({
        ...prev,
        panX: dragStart.panX + deltaX,
        panY: dragStart.panY + deltaY,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom;
      const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom;
      onCreateNode(x, y);
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
    setIsDragging(false);
  }, []);

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
      if (isDragging) {
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
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-screen relative overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: `
          radial-gradient(circle at 15% 45%, rgba(0, 255, 209, ${isHovering ? '0.12' : '0.08'}) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(232, 161, 53, ${isHovering ? '0.08' : '0.05'}) 0%, transparent 50%),
          radial-gradient(circle at 35% 85%, rgba(255, 0, 255, ${isHovering ? '0.06' : '0.04'}) 0%, transparent 50%),
          linear-gradient(135deg, #0B3D3D 0%, #083838 25%, #0A3A3A 50%, #083838 75%, #0B3D3D 100%)
        `,
        transition: 'background 0.3s ease',
      }}
    >
      {/* Clean, subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isHovering ? 0.15 : 0.08,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 209, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 209, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: `${50 * canvasState.zoom}px ${50 * canvasState.zoom}px`,
          transform: `translate(${canvasState.panX % (50 * canvasState.zoom)}px, ${canvasState.panY % (50 * canvasState.zoom)}px)`,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Canvas content */}
      <div
        className="absolute inset-0"
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

      {/* Clean, elegant welcome state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Main branding - centered and prominent */}
            <div className="text-center mb-12">
              <div className="text-8xl font-extralight mb-4 bg-gradient-to-r from-[#00FFD1] to-[#E8A135] bg-clip-text text-transparent">
                Synapse
              </div>
              <div className="text-xl font-light text-[#F0F0F0]/70 tracking-wider">
                Your AI-Powered Second Brain
              </div>
            </div>

            {/* Elegant brain graphic - seamlessly integrated */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <svg
                width="400"
                height="300"
                viewBox="0 0 400 300"
                className="opacity-20"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(0, 255, 209, 0.3))',
                }}
              >
                <defs>
                  <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00FFD1" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#E8A135" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#00FFD1" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                
                {/* Simplified, elegant brain outline */}
                <path
                  d="M100 80 C80 60, 120 40, 160 50 C180 30, 220 30, 240 50 C280 40, 320 60, 300 80 C310 100, 300 120, 280 140 C300 160, 280 180, 260 190 C240 210, 200 210, 180 190 C160 210, 120 210, 100 190 C80 180, 60 160, 80 140 C60 120, 70 100, 100 80 Z"
                  fill="url(#brainGradient)"
                  stroke="rgba(0, 255, 209, 0.5)"
                  strokeWidth="2"
                />
                
                {/* Neural network connections */}
                <g opacity="0.6">
                  <circle cx="140" cy="100" r="3" fill="#00FFD1" />
                  <circle cx="180" cy="90" r="3" fill="#E8A135" />
                  <circle cx="220" cy="110" r="3" fill="#00FFD1" />
                  <circle cx="160" cy="130" r="3" fill="#E8A135" />
                  <circle cx="200" cy="140" r="3" fill="#00FFD1" />
                  
                  <line x1="140" y1="100" x2="180" y2="90" stroke="rgba(0, 255, 209, 0.4)" strokeWidth="1" />
                  <line x1="180" y1="90" x2="220" y2="110" stroke="rgba(232, 161, 53, 0.4)" strokeWidth="1" />
                  <line x1="160" y1="130" x2="200" y2="140" stroke="rgba(0, 255, 209, 0.4)" strokeWidth="1" />
                  <line x1="140" y1="100" x2="160" y2="130" stroke="rgba(232, 161, 53, 0.4)" strokeWidth="1" />
                </g>
              </svg>
            </div>

            {/* Simple instruction text */}
            <div className="text-center mt-8">
              <div className="text-sm text-[#F0F0F0]/50 max-w-md mx-auto leading-relaxed">
                Double-click anywhere to create your first thought
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection preview line */}
      {connectingFrom && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
          <defs>
            <linearGradient id="connection-preview" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8A135" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00FFD1" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          <line
            x1={(nodes.find(n => n.id === connectingFrom)?.x || 0) + 200}
            y1={(nodes.find(n => n.id === connectingFrom)?.y || 0) + 60}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="url(#connection-preview)"
            strokeWidth="2"
            strokeDasharray="6,4"
            opacity="0.8"
            strokeLinecap="round"
          />
          
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="4"
            fill="#00FFD1"
            opacity="0.8"
          />
        </svg>
      )}
    </div>
  );
};
