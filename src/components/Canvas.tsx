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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
      setDragStart({ x: e.clientX - canvasState.panX, y: e.clientY - canvasState.panY });
      onSelectNode(null);
    }
  }, [canvasState.panX, canvasState.panY, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDragging) {
      setCanvasState(prev => ({
        ...prev,
        panX: e.clientX - dragStart.x,
        panY: e.clientY - dragStart.y,
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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-screen cursor-grab active:cursor-grabbing relative overflow-hidden transition-all duration-700 ease-out"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: `
          radial-gradient(circle at 15% 45%, rgba(0, 255, 209, ${isHovering ? '0.18' : '0.12'}) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(232, 161, 53, ${isHovering ? '0.12' : '0.08'}) 0%, transparent 50%),
          radial-gradient(circle at 35% 85%, rgba(255, 0, 255, ${isHovering ? '0.09' : '0.06'}) 0%, transparent 50%),
          radial-gradient(circle at 65% 25%, rgba(192, 192, 192, ${isHovering ? '0.07' : '0.04'}) 0%, transparent 50%),
          radial-gradient(circle at 25% 65%, rgba(148, 69, 255, ${isHovering ? '0.08' : '0.05'}) 0%, transparent 50%),
          linear-gradient(135deg, #0B3D3D 0%, #083838 25%, #0A3A3A 50%, #083838 75%, #0B3D3D 100%)
        `,
        transition: 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Enhanced multi-layered grid with depth and perspective */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isHovering ? 0.25 : 0.15,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 209, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 209, 0.6) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 209, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 209, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(232, 161, 53, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 161, 53, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `
            ${100 * canvasState.zoom}px ${100 * canvasState.zoom}px,
            ${100 * canvasState.zoom}px ${100 * canvasState.zoom}px,
            ${25 * canvasState.zoom}px ${25 * canvasState.zoom}px,
            ${25 * canvasState.zoom}px ${25 * canvasState.zoom}px,
            ${200 * canvasState.zoom}px ${200 * canvasState.zoom}px,
            ${200 * canvasState.zoom}px ${200 * canvasState.zoom}px
          `,
          transform: `translate(${canvasState.panX % (100 * canvasState.zoom)}px, ${canvasState.panY % (100 * canvasState.zoom)}px)`,
        }}
      />

      {/* Enhanced ambient particle system with varied behaviors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full transition-all duration-1000 ${
              i % 4 === 0 ? 'bg-[#00FFD1]' : 
              i % 4 === 1 ? 'bg-[#E8A135]' : 
              i % 4 === 2 ? 'bg-[#FF00FF]' : 'bg-[#C0C0C0]'
            }`}
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: isHovering ? 0.6 : 0.3,
              animation: `float ${8 + Math.random() * 24}s infinite linear`,
              animationDelay: `${Math.random() * 15}s`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Subtle energy field overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: isHovering ? 0.1 : 0.05,
          background: `
            conic-gradient(from 0deg at 20% 30%, transparent, rgba(0, 255, 209, 0.3), transparent 120deg),
            conic-gradient(from 180deg at 80% 70%, transparent, rgba(232, 161, 53, 0.2), transparent 120deg)
          `,
          animation: 'aurora 30s ease-in-out infinite',
        }}
      />

      {/* Canvas content with enhanced transform smoothing */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
          transformOrigin: "0 0",
          willChange: 'transform',
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

      {/* Enhanced welcome overlay with better visual hierarchy */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-[#F0F0F0] max-w-2xl px-8 animate-fade-in">
            {/* Main title with enhanced typography */}
            <div className="relative mb-8">
              <div className="text-6xl md:text-7xl font-extralight mb-4 bg-gradient-to-r from-[#00FFD1] via-[#E8A135] to-[#00FFD1] bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
                Welcome to Synapse
              </div>
              <div className="absolute inset-0 text-6xl md:text-7xl font-extralight mb-4 text-[#00FFD1]/20 blur-sm -z-10">
                Welcome to Synapse
              </div>
            </div>
            
            {/* Subtitle with refined spacing */}
            <div className="text-2xl md:text-3xl font-light mb-8 text-[#F0F0F0]/90 tracking-wide">
              Your AI-Powered Second Brain
            </div>
            
            {/* Enhanced instruction cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
              <div className="backdrop-blur-sm bg-[#0B3D3D]/30 border border-[#00FFD1]/20 rounded-2xl p-6 transition-all duration-500 hover:bg-[#0B3D3D]/40 hover:border-[#00FFD1]/40 hover:scale-105">
                <div className="text-3xl mb-3">✨</div>
                <div className="text-sm font-medium mb-2 text-[#00FFD1]">Create Thoughts</div>
                <div className="text-xs opacity-75">Double-click anywhere to birth your first thought</div>
              </div>
              
              <div className="backdrop-blur-sm bg-[#0B3D3D]/30 border border-[#E8A135]/20 rounded-2xl p-6 transition-all duration-500 hover:bg-[#0B3D3D]/40 hover:border-[#E8A135]/40 hover:scale-105">
                <div className="text-3xl mb-3">🔗</div>
                <div className="text-sm font-medium mb-2 text-[#E8A135]">Connect Ideas</div>
                <div className="text-xs opacity-75">Link thoughts to form neural pathways</div>
              </div>
              
              <div className="backdrop-blur-sm bg-[#0B3D3D]/30 border border-[#FF00FF]/20 rounded-2xl p-6 transition-all duration-500 hover:bg-[#0B3D3D]/40 hover:border-[#FF00FF]/40 hover:scale-105">
                <div className="text-3xl mb-3">🔍</div>
                <div className="text-sm font-medium mb-2 text-[#FF00FF]">Navigate</div>
                <div className="text-xs opacity-75">Scroll to zoom through dimensions</div>
              </div>
              
              <div className="backdrop-blur-sm bg-[#0B3D3D]/30 border border-[#C0C0C0]/20 rounded-2xl p-6 transition-all duration-500 hover:bg-[#0B3D3D]/40 hover:border-[#C0C0C0]/40 hover:scale-105">
                <div className="text-3xl mb-3">🌊</div>
                <div className="text-sm font-medium mb-2 text-[#C0C0C0]">Explore</div>
                <div className="text-xs opacity-75">Drag to navigate the infinite canvas</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced connection preview line with sophisticated styling */}
      {connectingFrom && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
          <defs>
            <linearGradient id="connection-preview" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8A135" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00FFD1" stopOpacity="1" />
              <stop offset="100%" stopColor="#E8A135" stopOpacity="0.8" />
            </linearGradient>
            <filter id="connection-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Preview line with enhanced visual effects */}
          <line
            x1={(nodes.find(n => n.id === connectingFrom)?.x || 0) + 200}
            y1={(nodes.find(n => n.id === connectingFrom)?.y || 0) + 60}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="url(#connection-preview)"
            strokeWidth="3"
            strokeDasharray="8,6"
            opacity="0.9"
            filter="url(#connection-glow)"
            strokeLinecap="round"
            className="animate-pulse"
          />
          
          {/* Endpoint indicator */}
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="8"
            fill="#00FFD1"
            opacity="0.6"
            className="animate-pulse"
          />
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="4"
            fill="#00FFD1"
            opacity="0.9"
          />
        </svg>
      )}

      {/* Subtle vignette effect for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(11, 61, 61, 0.1) 100%)`,
        }}
      />
    </div>
  );
};
